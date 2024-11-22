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
exports.OrderService = void 0;
const product_service_1 = __importDefault(require("../product/product.service"));
const order_model_1 = require("./order.model");
class OrderService {
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a new order
            const { email, quantity, product: productId, totalPrice } = data;
            // Fetch product details
            const productData = yield product_service_1.default.getProductById(productId.toString());
            if (!productData) {
                throw new Error('Product not found.');
            }
            // Check inventory stock
            if (productData.quantity < quantity) {
                throw new Error('Insufficient stock for this product.');
            }
            // Update product inventory
            const updatedQuantity = productData.quantity - quantity;
            const isInStock = updatedQuantity > 0;
            yield product_service_1.default.updateProduct(productId.toString(), {
                quantity: updatedQuantity,
                inStock: isInStock,
            });
            // Create order
            const orderData = {
                email,
                product: productId,
                quantity,
                totalPrice,
            };
            const order = yield order_model_1.Order.create(Object.assign({}, orderData));
            return order;
        });
    }
    // Calculate total revenue using aggregation
    calculateRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield order_model_1.Order.aggregate([
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'productDetails',
                    },
                },
                {
                    $unwind: '$productDetails',
                },
                {
                    $project: {
                        revenue: {
                            $multiply: ['$productDetails.price', '$quantity'],
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$revenue' },
                    },
                },
            ]);
            // Return the total revenue or 0 if no orders exist
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0;
        });
    }
}
exports.OrderService = OrderService;
const orderService = new OrderService();
exports.default = orderService;
