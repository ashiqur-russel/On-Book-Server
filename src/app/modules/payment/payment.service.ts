import Stripe from 'stripe';
import config from '../../config';
import mongoose from 'mongoose';
import { Payment } from './payment.model';
import { Order } from '../order/order.model';
import { User } from '../user/user.model';
import AppError from '../../errors/handleAppError';
import httpStatus from 'http-status';
import { Product } from '../product/product.model';

const stripe = new Stripe(config.stripe_secret_key as string, {});

export const createStripeCheckoutSession = async ({
  items,
  successUrl,
  cancelUrl,
  email,
  product,
}: {
  items: { name: string; price: number; quantity: number }[];
  successUrl: string;
  cancelUrl: string;
  email: string;
  product: string;
}) => {
  try {
    if (!items || items.length === 0 || !email || !product) {
      throw new Error(' Missing required parameters: items, email, product');
    }

    const userData = await User.findOne({ email });
    if (!userData) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
    }

    const userId = userData._id.toString();
    const productQuantity = items[0].quantity;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: productQuantity,
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
        email: email,
        productId: product,
        quantity: productQuantity.toString(),
      },
    });

    return session.id;
  } catch {
    throw new Error('Failed to create checkout session');
  }
};

export const handleStripeWebhook = async (event: Stripe.Event) => {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata || {};
    const userId = metadata.userId;
    const email = metadata.email;
    const productId = metadata.productId;
    const quantity = parseInt(metadata.quantity, 10) || 1;

    if (!userId || !email || !productId) {
      return;
    }

    try {
      const sessionDetails = await stripe.checkout.sessions.retrieve(
        session.id,
      );

      if (sessionDetails.payment_status !== 'paid') {
        throw new AppError(
          httpStatus.PRECONDITION_FAILED,
          'Payment not completed. Skipping order creation.',
        );
        return;
      }

      const sessionTransaction = await mongoose.startSession();
      sessionTransaction.startTransaction();

      try {
        const order = new Order({
          email,
          product: productId,
          user: new mongoose.Types.ObjectId(userId),
          quantity: quantity,
          totalPrice: session.amount_total ? session.amount_total / 100 : 0,
          deliveryStatus: 'pending',
        });

        await order.save({ session: sessionTransaction });

        let payment = await Payment.findOne({
          email,
          product: productId,
        }).session(sessionTransaction);

        if (!payment) {
          payment = new Payment({
            email,
            product: productId,
            user: new mongoose.Types.ObjectId(userId),
            status: 'completed',
            stripePaymentId: session.payment_intent || '',
            order: order._id,
          });
          await payment.save({ session: sessionTransaction });
        } else {
          payment.status = 'completed';
          payment.order = order._id;
          await payment.save({ session: sessionTransaction });
        }

        const product =
          await Product.findById(productId).session(sessionTransaction);
        if (!product) {
          throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
        }

        product.quantity -= quantity;
        if (product.soldCount !== undefined) {
          product.soldCount += quantity;
        } else {
          product.soldCount = quantity;
        }

        if (product.quantity <= 0) {
          product.quantity = 0;
          product.inStock = false;
        }

        if (product.soldCount >= 10) {
          product.isBestSold = true;
        }

        await product.save({ session: sessionTransaction });

        // Update the Order with Payment ID
        order.payment = payment._id;
        await order.save({ session: sessionTransaction });

        await sessionTransaction.commitTransaction();
        sessionTransaction.endSession();
      } catch (error) {
        await sessionTransaction.abortTransaction();
        sessionTransaction.endSession();
        console.error(' Order Creation Failed:', error);
      }
    } catch (error) {
      console.error(' Stripe Session Retrieval Error:', error);
    }
  } else {
    console.log(` Unhandled event type: ${event.type}`);
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

    if (payment.status === 'refunded') {
      throw new AppError(httpStatus.CONFLICT, 'Payment already refunded');
    }

    const order = await Order.findOne({ payment: payment._id }).session(
      sessionTransaction,
    );
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, 'Associated order not found');
    }

    if (order.status !== 'cancelled') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Order must be cancelled before refunding',
      );
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentId,
    });

    payment.status = 'refunded';
    await payment.save({ session: sessionTransaction });

    // TODO:: delivery status should be cancelled
    // TODO:: (change revoked to revoked if pending status)
    if (
      order.deliveryStatus === 'shipped' ||
      order.deliveryStatus === 'pending'
    ) {
      order.deliveryStatus = 'revoked';
    }
    await order.save({ session: sessionTransaction });

    await sessionTransaction.commitTransaction();
    sessionTransaction.endSession();

    return { success: true, refundId: refund.id };
  } catch (error) {
    await sessionTransaction.abortTransaction();
    sessionTransaction.endSession();
    throw error;
  }
};

export const PaymentServices = {
  createStripeCheckoutSession,
  handleStripeWebhook,
  issueRefund,
};
