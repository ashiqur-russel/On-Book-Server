import { z } from 'zod';

const paymentValidationSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  product: z.string().min(1, { message: 'Product ID is required' }),
  user: z.string().min(1, { message: 'User ID is required' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
  totalPrice: z
    .number()
    .min(0, { message: 'Total price must be a non-negative number' }),
  successUrl: z.string().url({ message: 'Invalid success URL' }),
  cancelUrl: z.string().url({ message: 'Invalid cancel URL' }),
});

export const PaymentValidation = { paymentValidationSchema };
