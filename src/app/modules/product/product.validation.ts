import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    product: z.object({
      title: z.string().trim().min(1, { message: 'Title is required' }),
      author: z.string(),
      price: z.number().min(0, { message: 'Price must be a positive number' }),
      category: z.enum(
        ['Fiction', 'Science', 'SelfDevelopment', 'Poetry', 'Religious'],
        {
          message:
            'Category must be one of Fiction, Science, SelfDevelopment, Poetry, Religious',
        },
      ),
      description: z
        .string()
        .trim()
        .min(1, { message: 'Description is required' }),
      quantity: z
        .number()
        .int()
        .min(0, { message: 'Quantity must be a non-negative integer' }),
      inStock: z.boolean().optional().default(true),
      soldCount: z.number().optional(),
      isBestSold: z.boolean().optional(),
      hasOffer: z.boolean().optional(),
      productImg: z.string().optional(),
    }),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).optional(),
    author: z.string().optional(),
    price: z.number().min(0).optional(),
    category: z
      .enum(['Fiction', 'Science', 'SelfDevelopment', 'Poetry', 'Religious'])
      .optional(),
    description: z.string().trim().min(1).optional(),
    quantity: z.number().int().min(0).optional(),
    inStock: z.boolean().optional(),
    hasOffer: z.boolean().optional(),
    productImg: z.string().optional(),
  }),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
