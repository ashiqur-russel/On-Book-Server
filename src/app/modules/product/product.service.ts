import { Product } from './product.model';
import { IProduct } from './product.interface';
import { NotFoundError } from '../../utils/errors';
import mongoose from 'mongoose';

// Retrieve all the products
const getAllProducts = async (searchTerm?: string): Promise<IProduct[]> => {
  let products = [];
  if (searchTerm) {
    products = await searchProduct(searchTerm);
  } else {
    products = await Product.find({});
  }

  return products;
};

// Fetch product by ID
const getProductById = async (productId: string): Promise<IProduct | null> => {
  // Validate productId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new NotFoundError('Invalid product ID.');
  }

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new NotFoundError('Product is Not Found');
  }

  return product;
};

// Create a new product
const createProduct = async (product: IProduct): Promise<IProduct> => {
  return await Product.create(product);
};

// Update an existing product
const updateProduct = async (
  productId: string,
  updateData: Partial<IProduct>,
): Promise<IProduct | null> => {
  const product = await getProductById(productId);

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
};

// query search service basen on title, author and category
const searchProduct = async (searchName: string): Promise<IProduct[]> => {
  return Product.find({
    $or: [
      { title: { $regex: searchName, $options: 'i' } },
      { author: { $regex: searchName, $options: 'i' } },
      { category: { $regex: searchName, $options: 'i' } },
    ],
  });
};

// Delete a product by ID
const deleteProduct = async (productId: string): Promise<void> => {
  // Validate productId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new NotFoundError('Invalid product ID.');
  }

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new NotFoundError('Product is Not Found');
  }
  await Product.deleteOne({ _id: productId });
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  searchProduct,
  deleteProduct,
};
export default productService;
