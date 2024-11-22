import { Product } from './product.model';
import { IProduct } from './product.interface';

export class ProductService {
  async getAllProducts(): Promise<IProduct[]> {
    const products = await Product.find({});
    return products;
  }

  async createProduct(product: IProduct): Promise<IProduct> {
    const newProduct = await Product.create(product);
    return newProduct;
  }

  async updateProduct(productId: string, updateData: Partial<IProduct>) {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    return updatedProduct;
  }
}
