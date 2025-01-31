import mongoose from 'mongoose';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { Product } from '../product/product.model';
import AppError from '../../errors/handleAppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.model';

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

  const orders = await orderQuery.modelQuery
    .populate('product', 'title price')
    .populate('user', 'name email');

  return orders;
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

const getMyOrder = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  const orders = await Order.find({ user: user._id })
    .populate({
      path: 'user',
      select: 'name email',
    })
    .populate({
      path: 'product',
      select: 'title price productImg',
    })
    .exec();

  if (!orders || orders.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Orders Found');
  }

  return orders;
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

export const orderService = {
  getAllOrders,
  createOrder,
  updateOrder,
  calculateRevenue,
  getMyOrder,
};
export default orderService;
