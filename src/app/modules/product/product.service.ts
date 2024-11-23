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
  async updateProduct(
    productId: string,
    updateData: Partial<IProduct>,
  ): Promise<IProduct | null> {
    // Fetch the current product details
    const product = await this.getProductById(productId);

    if (!product) {
      throw new Error('Product not found.');
    }

    // Check if quantity is being updated
    if (updateData.quantity !== undefined) {
      if (updateData.quantity < 0) {
        throw new Error('Quantity cannot be negative.');
      }

      // Validate stock availability for reduction
      if (updateData.quantity < product.quantity) {
        throw new Error(
          `Insufficient stock. Only ${product.quantity} items are available for this product.`,
        );
      }

      // Automatically set inStock to false if quantity is 0
      updateData.inStock = updateData.quantity > 0;
    }

    // Update the product
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

  // Delete a product by ID
  async deleteProduct(productId: string): Promise<boolean> {
    const result = await Product.deleteOne({ _id: productId });
    return result.deletedCount > 0;
  }
}

const productService = new ProductService();
export default productService;
