import { z } from 'zod';

export function getResetPasswordSchema() {
  return z.object({
    email: z.string().email(),
  });
}

export type TResetPasswordSchema = z.infer<ReturnType<typeof getResetPasswordSchema>>;
