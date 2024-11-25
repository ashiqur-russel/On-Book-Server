import mongoose from 'mongoose';
import productService from '../product/product.service';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { NotFoundError } from '../../utils/errors';

export class OrderService {
  async createOrder(data: IOrder): Promise<IOrder> {
    const { email, quantity, product: productId, totalPrice } = data;

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId.toString())) {
      throw new NotFoundError('Invalid product ID.');
    }

    // Fetch product data
    const productData = await productService.getProductById(
      productId.toString(),
    );

    if (!productData) {
      throw new NotFoundError('Product is Not Found');
    }

    // Check if the product is in stock
    if (!productData.inStock) {
      throw new NotFoundError('This product is out of stock.');
    }

    // Check inventory availability
    if (productData.quantity < quantity) {
      throw new NotFoundError('Insufficient stock for this product.');
    }

    // Update stock
    const updatedQuantity = productData.quantity - quantity;
    const isInStock = updatedQuantity > 0;

    await productService.updateProduct(productId.toString(), {
      quantity: updatedQuantity,
      inStock: isInStock,
    });

    // Create order
    const orderData: Partial<IOrder> = {
      email,
      product: productId,
      quantity,
      totalPrice,
    };

    const order = await Order.create(orderData);

    return order;
  }

  // Calculate total revenue using aggregation
  async calculateRevenue(): Promise<number> {
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
  }
}

const orderService = new OrderService();
export default orderService;
