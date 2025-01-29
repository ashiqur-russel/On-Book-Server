import mongoose from 'mongoose';
import productService from '../product/product.service';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { NotFoundError } from '../../utils/errors';

const createOrder = async (data: IOrder): Promise<IOrder> => {
  const { email, quantity, product: productId, totalPrice, user } = data;

  // Validate user ID format
  if (!mongoose.Types.ObjectId.isValid(user.toString())) {
    throw new NotFoundError('Invalid user ID.');
  }

  // Validate product ID format
  if (!mongoose.Types.ObjectId.isValid(productId.toString())) {
    throw new NotFoundError('Invalid product ID.');
  }

  // Fetch product data
  const productData = await productService.getProductById(productId.toString());

  if (!productData) {
    throw new NotFoundError('Product is not found.');
  }

  // Check if the product is in stock
  if (!productData.inStock) {
    throw new NotFoundError('This product is out of stock.');
  }

  // Check inventory availability
  if (productData.quantity < quantity) {
    throw new NotFoundError('Insufficient stock for this product.');
  }

  // Create order
  const orderData: Partial<IOrder> = {
    email,
    product: productId,
    user,
    quantity,
    totalPrice,
  };

  const order = await Order.create(orderData);

  // Update stock
  const updatedQuantity = productData.quantity - quantity;
  const isInStock = updatedQuantity > 0;

  await productService.updateProduct(productId.toString(), {
    quantity: updatedQuantity,
    inStock: isInStock,
    soldCount: (productData.soldCount || 0) + quantity,
  });

  return order;
};

const updateOrder = async (
  orderId: string,
  data: Partial<IOrder>,
): Promise<IOrder | null> => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new NotFoundError('Invalid order ID.');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError('Order not found.');
  }

  if (data.quantity) {
    const productData = await productService.getProductById(
      order.product.toString(),
    );
    if (!productData) {
      throw new NotFoundError('Product not found.');
    }

    const stockDifference = data.quantity - order.quantity;
    const updatedQuantity = productData.quantity - stockDifference;

    if (updatedQuantity < 0) {
      throw new NotFoundError('Insufficient stock to update order.');
    }

    await productService.updateProduct(order.product.toString(), {
      quantity: updatedQuantity,
      inStock: updatedQuantity > 0,
    });
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, data, {
    new: true,
    runValidators: true,
  });

  return updatedOrder;
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

  // Return the total revenue or 0 if no orders exist
  return result[0]?.totalRevenue || 0;
};

export const orderService = { createOrder, updateOrder, calculateRevenue };
