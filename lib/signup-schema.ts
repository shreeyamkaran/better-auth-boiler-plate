import { z } from 'zod';

export function getSignUpSchema() {
  return z.object({
    name: z
      .string()
      .min(1, 'Name must have at least 1 character')
      .max(50, 'Name cannot exceed more than 50 characters')
      .regex(/^[\p{L}\s]+$/u, 'Name can only contain letters and spaces'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(50, 'Password cannot exceed more than 50 characters'),
  });
}

export type TSignUpSchema = z.infer<ReturnType<typeof getSignUpSchema>>;
