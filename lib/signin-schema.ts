import { z } from 'zod';

export function getSignInSchema() {
  return z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
  });
}

const signInSchema = getSignInSchema();

export type TSignInSchema = z.infer<typeof signInSchema>;
