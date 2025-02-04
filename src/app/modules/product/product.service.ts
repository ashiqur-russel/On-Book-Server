import { Product } from './product.model';
import { IProduct } from './product.interface';
import { NotFoundError } from '../../utils/errors';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { ProductSearchableFields } from './prodcut.constant';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const getAllProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await productQuery.countTotal();

  const result = await productQuery.modelQuery;

  return {
    meta,
    result,
  };
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

const createProduct = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any,
  payload: IProduct,
): Promise<IProduct> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Upload Image If File Exists
    if (file) {
      const imageName = `${payload.title}_${payload.category}`;
      const path = file.path;

      // Upload image to Cloudinary
      const uploadResponse = await sendImageToCloudinary(imageName, path);

      if (!uploadResponse || !uploadResponse.secure_url) {
        throw new Error('Image upload failed.');
      }

      // Update payload with secure URL
      payload.productImg = uploadResponse.secure_url;
    }

    // Creating Product with updated payload
    const product = new Product(payload);
    const savedProduct = await product.save({ session });

    await session.commitTransaction();
    session.endSession();

    return savedProduct;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
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
