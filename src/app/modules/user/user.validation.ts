import { z } from 'zod';

const userValidationSchema = z.object({
  body: z.object({
    user: z.object({
      name: z.string().min(3),
      email: z.string().email({ message: 'Invalid email address' }),
      password: z.string().min(5),
      role: z.string().optional(),
    }),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
