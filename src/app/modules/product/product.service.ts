import { Product } from './product.model';
import { IProduct } from './product.interface';
import { NotFoundError } from '../../utils/errors';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { ProductSearchableFields } from './prodcut.constant';
import { User } from '../user/user.model';

const getAllProducts = async (
  query: Record<string, unknown>,
): Promise<IProduct[]> => {
  if (query.author && typeof query.author === 'string') {
    const user = await User.findOne({ name: query.author });
    if (user) {
      query.author = user._id;
    } else {
      throw new Error(`User with name "${query.author}" not found.`);
    }
  }

  const productQuery = new QueryBuilder(Product.find(), query)
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;

  return result;
};

const getProductById = async (productId: string): Promise<IProduct | null> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new NotFoundError('Invalid product ID.');
  }

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new NotFoundError('Product is Not Found');
  }

  return product;
};

const createProduct = async (product: IProduct): Promise<IProduct> => {
  return await Product.create(product);
};

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

/**
 * @deprecated This function is deprecated as of 2025-01-27.
 * Use the new `getAllProducts` method with advanced filtering and search instead.
 *
 * @param searchName - The name or term to search for in the products.
 * @returns A promise that resolves to an array of products matching the search term.
 */
const searchProduct = async (searchName: string): Promise<IProduct[]> => {
  return Product.find({
    $or: [
      { title: { $regex: searchName, $options: 'i' } },
      { category: { $regex: searchName, $options: 'i' } },
    ],
  }).populate({
    path: 'author',
    match: { name: { $regex: searchName, $options: 'i' } },
  });
};

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
