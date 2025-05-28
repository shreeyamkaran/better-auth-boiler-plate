import { z } from 'zod';

export function getSetNewPasswordSchema() {
  return z.object({
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(50, 'Password cannot exceed more than 50 characters'),
  });
}

export type TSetNewPasswordSchema = z.infer<ReturnType<typeof getSetNewPasswordSchema>>;
