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

  // Fetch product by ID
  async getProductById(productId: string): Promise<IProduct | null> {
    return await Product.findById({ _id: productId });
  }

  // Create a new product
  async createProduct(product: IProduct): Promise<IProduct> {
    return await Product.create(product);
  }

  // Update an existing product
  async updateProduct(productId: string, updateData: Partial<IProduct>) {
    // set stock amount fale if quantity is 0
    if (updateData.quantity === 0) {
      updateData.inStock = false;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    return updatedProduct;
  }

  // query search service basen on title, author and category
  private async searchProduct(searchName: string): Promise<IProduct[]> {
    return Product.find({
      $or: [
        { title: { $regex: searchName, $options: 'i' } },
        { author: { $regex: searchName, $options: 'i' } },
        { category: { $regex: searchName, $options: 'i' } },
      ],
    });
  }

  // Delete a product by ID (soft delete)
  async deleteProduct(productId: string): Promise<void> {
    await Product.deleteOne({ _id: productId });
  }
}

const productService = new ProductService();
export default productService;
