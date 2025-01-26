import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, { message: 'Title is required' }),
    author: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: 'Author must be a valid ObjectId',
    }),
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
  }),
});

export const ProductValidation = {
  createProductValidationSchema,
};
