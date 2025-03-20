import mongoose, { Schema } from 'mongoose';
import { IProduct } from './product.interface';

export const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: { type: String, trim: true, required: [true, 'Title is required'] },

    author: {
      type: String,
      required: [true, 'Author is required'],
    },
    productImg: { type: String, required: false },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    discountAmount: {
      type: Number,
      required: false,
      min: [0, 'Discount must be a positive number'],
    },
    rating: {
      type: Number,
      required: false,
      min: [0, 'Rating must be a positive number'],
      max: [5, 'Rating must be a number between 0 and 5'],
    },
    offerRate: {
      type: Number,
      required: false,
      min: [0, 'Offer Rate must be a positive number'],
      max: [100, 'Offer Rate must be a number between 0 and 100'],
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
          'Thriller',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required'],
    },
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
    isFeatured: {
      type: Boolean,
      required: false,
      default: false,
    },
    soldCount: {
      type: Number,
      default: 0,
    },

    isBestSold: {
      type: Boolean,
      default: false,
    },
    hasOffer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ProductSchema.pre('save', function (next) {
  if (this.quantity === 0) {
    this.inStock = false;
  } else {
    this.inStock = true;
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
