import mongoose from 'mongoose';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { Product } from '../product/product.model';
import AppError from '../../errors/handleAppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.model';
import {
  DELIVERY_STATUSES,
  ORDER_STATUSES,
  REFUND_STATUSES,
} from './order.constant';
import { Payment } from '../payment/payment.model';

const getAllOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(Order.find(), query)
    .search(['email', 'status'])
    .filter()
    .sort()
    .paginate()
    .fields();

  if (query.status && typeof query.status === 'string') {
    orderQuery.modelQuery = orderQuery.modelQuery.find({
      status: query.status,
    });
  }
  if (query.minPrice || query.maxPrice) {
    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || Infinity;

    orderQuery.modelQuery = orderQuery.modelQuery
      .where('totalPrice')
      .gte(minPrice)
      .lte(maxPrice);
  }

  const meta = await orderQuery.countTotal();

  const orders = await orderQuery.modelQuery
    .populate('product', 'title price')
    .populate('user', 'name email')
    .populate('payment', '_id status');

  return { orders, meta };
};

const createOrder = async (data: IOrder): Promise<IOrder> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      email,
      quantity,
      product: productId,
      totalPrice,
      user,
      deliveryStatus,
    } = data;

    if (!mongoose.Types.ObjectId.isValid(user.toString())) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID.');
    }

    if (!mongoose.Types.ObjectId.isValid(productId.toString())) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID.');
    }

    // Find the product (Fix: Correcting findById method)
    const product = await Product.findById(productId).session(session);

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found.');
    }

    if (!product.inStock || product.quantity < quantity) {
      throw new AppError(httpStatus.CONFLICT, 'Insufficient stock.');
    }

    const order = await Order.create(
      [
        {
          email,
          product: productId,
          user,
          quantity,
          totalPrice,
          deliveryStatus,
        },
      ],
      { session },
    );

    product.quantity -= quantity;
    product.inStock = product.quantity > 0;
    product.soldCount = (product.soldCount || 0) + quantity;

    await product.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateOrder = async (
  orderId: string,
  data: Partial<IOrder>,
): Promise<IOrder | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid order ID.');
    }

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order not found.');
    }

    if (data.quantity) {
      const product = await Product.findById(order.product).session(session);

      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found.');
      }

      const stockDifference = data.quantity - order.quantity;
      if (product.quantity - stockDifference < 0) {
        throw new AppError(
          httpStatus.CONFLICT,
          'Insufficient stock to update order.',
        );
      }

      product.quantity -= stockDifference;
      product.inStock = product.quantity > 0;

      await product.save({ session });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, data, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return updatedOrder;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getMyOrder = async (email: string, query: Record<string, unknown>) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  const orderQuery = new QueryBuilder(Order.find({ user: user._id }), query)
    .search(['email', 'status'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await orderQuery.countTotal();

  const orders = await orderQuery.modelQuery
    .populate({
      path: 'user',
      select: 'name email',
    })
    .populate({
      path: 'product',
      select: 'title price productImg',
    })
    .populate({
      path: 'payment',
      select: 'status',
    })
    .exec();

  return { orders, meta };
};

// Calculate total revenue using aggregation
const calculateRevenue = async (): Promise<number> => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  return result[0]?.totalRevenue || 0;
};

const cancelOrder = async (
  orderId: string,
  userRole: 'user' | 'admin',
): Promise<IOrder | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid order ID.');
    }

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order not found.');
    }

    if (order.deliveryStatus === DELIVERY_STATUSES.DELIVERED) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Delivered orders cannot be cancelled.',
      );
    }

    const payment = await Payment.findById(order.payment).session(session);
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found.');
    }

    if (userRole === 'user') {
      if (order.deliveryStatus !== DELIVERY_STATUSES.PENDING) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'You can only cancel pending orders.',
        );
      }

      order.status = ORDER_STATUSES.CANCELLED;
      order.deliveryStatus = DELIVERY_STATUSES.CANCELLED;
      order.refundStatus = REFUND_STATUSES.REQUESTED;

      // Restore stock
      const product = await Product.findById(order.product).session(session);
      if (product) {
        product.quantity += order.quantity;
        product.inStock = true;
        await product.save({ session });
      }
    }

    if (userRole === 'admin') {
      if (
        order.deliveryStatus === DELIVERY_STATUSES.PENDING ||
        order.deliveryStatus === DELIVERY_STATUSES.SHIPPED
      ) {
        order.status = ORDER_STATUSES.REVOKED;
        order.deliveryStatus = DELIVERY_STATUSES.REVOKED;
        order.refundStatus = REFUND_STATUSES.REQUESTED;
      }
    }

    //  Update the refund status inside the payment collection
    payment.orders = payment.orders.map((orderObj) =>
      orderObj.orderId.equals(order._id)
        ? { ...orderObj, refundStatus: REFUND_STATUSES.REQUESTED }
        : orderObj,
    );

    payment.refundStatus = REFUND_STATUSES.REQUESTED;

    await payment.save({ session });
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();
    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const orderService = {
  getAllOrders,
  createOrder,
  updateOrder,
  calculateRevenue,
  getMyOrder,
  cancelOrder,
};
export default orderService;
