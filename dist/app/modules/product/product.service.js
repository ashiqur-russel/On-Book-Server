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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_model_1 = require("./product.model");
class ProductService {
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
            return yield product_model_1.Product.findById({ _id: productId });
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
            // set stock amount fale if quantity is 0
            if (updateData.quantity === 0) {
                updateData.inStock = false;
            }
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
            const result = yield product_model_1.Product.deleteOne({ _id: productId });
            return result.deletedCount > 0;
        });
    }
}
exports.ProductService = ProductService;
const productService = new ProductService();
exports.default = productService;
