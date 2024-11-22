import { Product } from './product.model';
import { IProduct } from './product.interface';

export class ProductService {
  async getAllProducts(searchTerm?: string): Promise<IProduct[]> {
    let products = [];
    if (searchTerm) {
      products = await this.searchProduct(searchTerm);
    } else {
      products = await Product.find({});
    }

    return products;
  }

  async getProductById(productId: string): Promise<IProduct | null> {
    return await Product.findById({ _id: productId });
  }

  async createProduct(product: IProduct): Promise<IProduct> {
    const newProduct = await Product.create(product);
    return newProduct;
  }

  async updateProduct(productId: string, updateData: Partial<IProduct>) {
    if (updateData.quantity === 0) {
      updateData.inStock = false;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true },
    );

    return updatedProduct;
  }

  private async searchProduct(searchName: string): Promise<IProduct[]> {
    return Product.find({
      $or: [
        { title: { $regex: searchName, $options: 'i' } },
        { author: { $regex: searchName, $options: 'i' } },
        { category: { $regex: searchName, $options: 'i' } },
      ],
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    await Product.updateOne({ _id: productId }, { isDeleted: true });
  }
}
