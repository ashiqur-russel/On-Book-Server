import { Product } from './product.model';
import { IProduct } from './product.interface';
import { NotFoundError, ValidationError } from '../../utils/errors';
import mongoose from 'mongoose';

class ProductService {
  // Retrieve all the products
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
    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ValidationError('Invalid product ID.');
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      throw new NotFoundError('Product is Not Found');
    }

    return product;
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
    const product = await this.getProductById(productId);

    if (!product) {
      throw new NotFoundError('Product not found.');
    }

    // Check if quantity is being updated
    if (updateData.quantity !== undefined) {
      if (updateData.quantity < 0) {
        throw new Error('Quantity cannot be negative.');
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
  async deleteProduct(productId: string): Promise<void> {
    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new NotFoundError('Invalid product ID.');
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      throw new NotFoundError('Product is Not Found');
    }
    await Product.deleteOne({ _id: productId });
  }
}

const productService = new ProductService();
export default productService;
