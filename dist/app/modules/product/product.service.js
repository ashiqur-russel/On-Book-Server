"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_model_1 = require("./product.model");
const errors_1 = require("../../utils/errors");
const mongoose_1 = __importDefault(require("mongoose"));
class ProductService {
    // Retrieve all the products
    getAllProducts(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            if (searchTerm) {
                products = yield this.searchProduct(searchTerm);
            }
            else {
                products = yield product_model_1.Product.find({});
            }
            return products;
        });
    }
    // Fetch product by ID
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate productId format
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                throw new errors_1.NotFoundError('Invalid product ID.');
            }
            const product = yield product_model_1.Product.findOne({ _id: productId });
            if (!product) {
                throw new errors_1.NotFoundError('Product is Not Found');
            }
            return product;
        });
    }
    // Create a new product
    createProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.Product.create(product);
        });
    }
    // Update an existing product
    updateProduct(productId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.getProductById(productId);
            if (!product) {
                throw new Error('Product not found.');
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
            const updatedProduct = yield product_model_1.Product.findByIdAndUpdate(productId, { $set: updateData }, { new: true, runValidators: true });
            return updatedProduct;
        });
    }
    // query search service basen on title, author and category
    searchProduct(searchName) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.Product.find({
                $or: [
                    { title: { $regex: searchName, $options: 'i' } },
                    { author: { $regex: searchName, $options: 'i' } },
                    { category: { $regex: searchName, $options: 'i' } },
                ],
            });
        });
    }
    // Delete a product by ID
    deleteProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate productId format
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                throw new errors_1.NotFoundError('Invalid product ID.');
            }
            const product = yield product_model_1.Product.findOne({ _id: productId });
            if (!product) {
                throw new errors_1.NotFoundError('Product is Not Found');
            }
            yield product_model_1.Product.deleteOne({ _id: productId });
        });
    }
}
exports.ProductService = ProductService;
const productService = new ProductService();
exports.default = productService;
