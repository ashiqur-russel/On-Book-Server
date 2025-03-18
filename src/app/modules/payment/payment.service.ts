import Stripe from 'stripe';
import config from '../../config';
import mongoose from 'mongoose';
import { Payment } from './payment.model';
import { Order } from '../order/order.model';
import { User } from '../user/user.model';
import AppError from '../../errors/handleAppError';
import httpStatus from 'http-status';
import { DELIVERY_STATUSES, ORDER_STATUSES } from '../order/order.constant';
import { PAYMENT_STATUSES, REFUND_STATUSES } from './payment.constant';
import { Product } from '../product/product.model';
import { getIO } from '../../../socket';

const stripe = new Stripe(config.stripe_secret_key as string, {});

export const createStripeCheckoutSession = async ({
  items,
  successUrl,
  cancelUrl,
  email,
}: {
  items: { name: string; price: number; quantity: number; productId: string }[];
  successUrl: string;
  cancelUrl: string;
  email: string;
}) => {
  try {
    if (!items || items.length === 0 || !email) {
      throw new Error('Missing required parameters: items, email');
    }

    const userData = await User.findOne({ email });
    if (!userData) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
    }

    const userId = userData._id.toString();

    const metadataProducts = JSON.stringify(
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        email,
        products: metadataProducts,
      },
    });

    return session.id;
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    throw new Error('Failed to create checkout session');
  }
};

export const handleStripeWebhook = async (event: Stripe.Event) => {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata || {};
    const userId = metadata.userId;
    const email = metadata.email;
    let products = [];

    try {
      products = JSON.parse(metadata.products || '[]');

      if (!Array.isArray(products) || products.length === 0) {
        throw new Error('Invalid products metadata format.');
      }
    } catch (error) {
      console.error('Error parsing products from metadata:', error);
      return;
    }

    if (!userId || !email || products.length === 0) {
      console.error('Missing required metadata fields:', {
        userId,
        email,
        products,
      });
      return;
    }

    try {
      const sessionDetails = await stripe.checkout.sessions.retrieve(
        session.id,
      );

      if (sessionDetails.payment_status !== 'paid') {
        throw new AppError(
          httpStatus.PRECONDITION_FAILED,
          'Payment not completed.',
        );
      }

      const sessionTransaction = await mongoose.startSession();
      sessionTransaction.startTransaction();

      try {
        const productIds = products.map((p) => p.productId).filter(Boolean);

        if (productIds.length === 0) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'No valid product IDs found.',
          );
        }

        let totalAmount = 0;

        for (const item of products) {
          if (
            !item.price ||
            !item.quantity ||
            isNaN(item.price) ||
            isNaN(item.quantity)
          ) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              `Invalid price or quantity for product: ${JSON.stringify(item)}`,
            );
          }
          totalAmount += Number(item.price) * Number(item.quantity);
        }

        if (isNaN(totalAmount) || totalAmount <= 0) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Invalid totalAmount calculation.',
          );
        }

        // Create Payment Record
        const payment = new Payment({
          email,
          products: productIds.map((id) => new mongoose.Types.ObjectId(id)),
          user: new mongoose.Types.ObjectId(userId),
          totalAmount,
          status: PAYMENT_STATUSES.COMPLETED,
          stripePaymentId: session.payment_intent || '',
        });

        await payment.save({ session: sessionTransaction });

        const orders = [];
        for (const item of products) {
          const { productId, quantity } = item;

          if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              `Invalid Product ID: ${productId}`,
            );
          }

          const product =
            await Product.findById(productId).session(sessionTransaction);
          if (!product) {
            throw new AppError(
              httpStatus.NOT_FOUND,
              `Product ${productId} not found.`,
            );
          }

          if (product.quantity < quantity) {
            throw new AppError(
              httpStatus.CONFLICT,
              `Insufficient stock for product ${productId}.`,
            );
          }

          //  Reduce stock
          product.quantity -= quantity;
          if (product.quantity === 0) {
            product.inStock = false;
          }
          await product.save({ session: sessionTransaction });

          const order = new Order({
            email,
            product: new mongoose.Types.ObjectId(productId),
            user: new mongoose.Types.ObjectId(userId),
            quantity: quantity,
            totalPrice: Number(item.price) * Number(quantity),
            deliveryStatus: DELIVERY_STATUSES.PENDING,
            payment: payment._id,
          });

          await order.save({ session: sessionTransaction });
          orders.push(order);
        }

        //  Update Payment Document with Order IDs
        payment.orders = orders.map((order) => ({
          orderId: order._id,
          refundStatus: REFUND_STATUSES.NOT_REQUESTED,
        }));
        await payment.save({ session: sessionTransaction });

        await sessionTransaction.commitTransaction();
        sessionTransaction.endSession();
      } catch (error) {
        await sessionTransaction.abortTransaction();
        sessionTransaction.endSession();
        console.error('Order Creation Failed:', error);
      }
    } catch (error) {
      console.error('Stripe Session Retrieval Error:', error);
    }
  }
};

/**
 *  Issue Refund for a Payment
 */
export const issueRefund = async (paymentId: string) => {
  const sessionTransaction = await mongoose.startSession();
  sessionTransaction.startTransaction();

  try {
    const payment =
      await Payment.findById(paymentId).session(sessionTransaction);
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found');
    }

    if (payment.status === PAYMENT_STATUSES.REFUNDED) {
      throw new AppError(httpStatus.CONFLICT, 'Payment already fully refunded');
    }

    const orders = await Order.find({ payment: payment._id }).session(
      sessionTransaction,
    );
    if (!orders.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'No associated orders found');
    }

    const cancelableOrders = orders.filter(
      (order) =>
        order.status === ORDER_STATUSES.CANCELLED &&
        order.refundStatus === REFUND_STATUSES.REQUESTED,
    );

    if (cancelableOrders.length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'No canceled orders found for refunding',
      );
    }

    const refundAmount = cancelableOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );

    if (refundAmount <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid refund amount');
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentId,
      amount: refundAmount * 100,
    });

    payment.refundedAmount = (payment.refundedAmount || 0) + refundAmount;

    // Update the refund status for each order inside Payment
    payment.orders.forEach((order) => {
      if (
        cancelableOrders.some((canceledOrder) =>
          canceledOrder._id.equals(order.orderId),
        )
      ) {
        order.refundStatus = REFUND_STATUSES.COMPLETED;
      }
    });

    if (payment.refundedAmount >= payment.totalAmount) {
      payment.status = PAYMENT_STATUSES.REFUNDED;
    } else {
      payment.status = PAYMENT_STATUSES.PARTIALLY_REFUNDED;
    }

    await payment.save({ session: sessionTransaction });

    for (const order of cancelableOrders) {
      order.refundStatus = REFUND_STATUSES.COMPLETED;
      await order.save({ session: sessionTransaction });
    }

    await sessionTransaction.commitTransaction();
    sessionTransaction.endSession();

    // Use the user's identifier (e.g., email or user ID) to send a targeted notification
    const userIdentifier = payment.email; // Or payment.user if you store the user ID

    // Retrieve the Socket.IO instance and emit the notification
    getIO().to(userIdentifier).emit('refundNotification', {
      message: 'Your refund has been processed successfully!',
      refundAmount,
    });
    console.log(`Refund notification sent to ${userIdentifier}`);

    return { success: true, refundId: refund.id, refundedAmount: refundAmount };
  } catch (error) {
    await sessionTransaction.abortTransaction();
    sessionTransaction.endSession();
    console.error('Refund failed, rolling back transaction:', error);
    throw error;
  }
};

export const PaymentServices = {
  createStripeCheckoutSession,
  handleStripeWebhook,
  issueRefund,
};
