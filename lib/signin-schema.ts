import { z } from 'zod';

export function getSignInSchema() {
  return z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, 'Password must be atleast 6 characters long')
      .max(50, 'Password cannot exceed more than 50 characters'),
  });
}

const signInSchema = getSignInSchema();

export type TSignInSchema = z.infer<typeof signInSchema>;
