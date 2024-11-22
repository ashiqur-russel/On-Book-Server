"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = __importDefault(require("./product.controller"));
const router = (0, express_1.Router)();
router.get('/', product_controller_1.default.getAllProducts);
router.post('/', product_controller_1.default.createProduct);
router.get('/:productId', product_controller_1.default.getProductById);
router.put('/:productId', product_controller_1.default.updateProduct);
router.delete('/:productId', product_controller_1.default.deleteProduct);
exports.default = router;
