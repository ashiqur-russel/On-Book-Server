import productService from './product.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';

// Retirve all the products from database created
const getAllProducts = catchAsync(async (req, res) => {
  const result = await productService.getAllProducts(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// Fetch product by id
const getProductById = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const product = await productService.getProductById(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully',
    data: product,
  });
});

// Create product
const createProduct = catchAsync(async (req, res) => {
  const { product: productData } = req.body;

  const product = await productService.createProduct(req.file, productData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book created successfully',
    data: product,
  });
});

// update product data; partial data also could be updated
const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const updateData = req.body;

  const updatedProduct = await productService.updateProduct(
    productId,
    updateData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully',
    data: updatedProduct,
  });
});

// Delete product using product id
const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  await productService.deleteProduct(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book deleted successfully',
    data: {},
  });
});

const getBestSellingProduct = catchAsync(async (req, res) => {
  const products = await productService.getBestSellingProduct();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Top 10 Best-Selling Products Retrieved Successfully',
    data: products,
  });
});

const offerProducts = catchAsync(async (req, res) => {
  const { productIds, discount } = req.body;
  const result = await productService.applyOffer(productIds, discount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offers applied successfully',
    data: result,
  });
});

const productController = {
  updateProduct,
  deleteProduct,
  createProduct,
  getProductById,
  getAllProducts,
  getBestSellingProduct,
  offerProducts,
};
export default productController;
