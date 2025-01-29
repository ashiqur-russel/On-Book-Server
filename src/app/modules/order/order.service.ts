import mongoose from 'mongoose';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { Product } from '../product/product.model';
import AppError from '../../errors/handleAppError';
import httpStatus from 'http-status';

const createOrder = async (data: IOrder): Promise<IOrder> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, quantity, product: productId, totalPrice, user } = data;

    if (!mongoose.Types.ObjectId.isValid(user.toString())) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID.');
    }

    if (!mongoose.Types.ObjectId.isValid(productId.toString())) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID.');
    }

    const product = await Product.findById({ _id: productId }, session).session(
      session,
    );

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found.');
    }

    if (!product.inStock || product.quantity < quantity) {
      throw new AppError(httpStatus.CONFLICT, 'Insufficient stock.');
    }

    const order = await Order.create(
      [{ email, product: productId, user, quantity, totalPrice }],
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

export const orderService = { createOrder, updateOrder, calculateRevenue };
export default orderService;
