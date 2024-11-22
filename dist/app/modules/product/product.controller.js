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
exports.ProductController = void 0;
const product_service_1 = __importDefault(require("./product.service"));
const mongoose_1 = __importDefault(require("mongoose"));
class ProductController {
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchTerm = req.query.searchTerm;
            try {
                const products = yield product_service_1.default.getAllProducts(searchTerm);
                res.status(200).json({
                    message: 'Books retrieved successfully',
                    status: true,
                    data: products,
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: 'Validation failed', success: false, error });
            }
        });
    }
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                res.status(400).json({
                    message: 'Invalid product ID format',
                    success: false,
                });
            }
            try {
                const product = yield product_service_1.default.getProductById(productId);
                if (!product) {
                    // If no product is found
                    res.status(404).json({
                        message: 'Book not found!',
                        success: false,
                    });
                }
                res.status(200).json({
                    message: 'Book retrieved successfully',
                    success: true,
                    data: product,
                });
            }
            catch (error) {
                // Handle typed error
                res.status(500).json({
                    message: 'An error occurred while retrieving the book',
                    success: false,
                    error,
                });
            }
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield product_service_1.default.createProduct(req.body);
                res.status(201).json({
                    message: 'Book created successfully',
                    success: true,
                    data: product,
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: 'Validation failed', success: false, error });
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            const updateData = req.body;
            // Validate ObjectId format
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                res.status(400).json({
                    message: 'Invalid product ID format',
                    success: false,
                });
            }
            try {
                const updatedProduct = yield product_service_1.default.updateProduct(productId, updateData);
                if (!updatedProduct) {
                    // If no product is found
                    res.status(404).json({
                        message: 'Book not found!',
                        success: false,
                    });
                }
                res.status(201).json({
                    message: 'Book updated successfully',
                    success: true,
                    data: updatedProduct,
                });
            }
            catch (error) {
                res.status(500).json({
                    message: 'An error occurred while updating the book',
                    success: false,
                    error,
                });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            // Validate ObjectId format
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                res.status(400).json({
                    message: 'Invalid product ID format',
                    success: false,
                });
            }
            try {
                const deletedProduct = yield product_service_1.default.deleteProduct(productId);
                if (!deletedProduct) {
                    // If no product is found
                    res.status(404).json({
                        message: 'Book not found!',
                        success: false,
                    });
                }
                res.status(201).json({
                    message: 'Book deleted successfully',
                    success: true,
                    data: [],
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: 'Validation failed', success: false, error });
            }
        });
    }
}
exports.ProductController = ProductController;
const productController = new ProductController();
exports.default = productController;
