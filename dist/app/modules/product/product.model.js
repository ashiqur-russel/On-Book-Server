"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.ProductSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.ProductSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, 'Title is required'] },
    author: { type: String, required: [true, 'Author is required'] },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: [
                'Fiction',
                'Science',
                'SelfDevelopment',
                'Poetry',
                'Religious',
            ],
            message: '{VALUE} is not a valid category',
        },
    },
    description: { type: String, required: [true, 'Description is required'] },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity must be a non-negative number'],
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true,
    },
}, {
    timestamps: true,
});
exports.Product = mongoose_1.default.model('Product', exports.ProductSchema);
