import { z } from 'zod';

export function getGenerateNewVerificationLinkSchema() {
  return z.object({
    email: z.string().email(),
  });
}

export type TGenerateNewVerificationLinkSchema = z.infer<
  ReturnType<typeof getGenerateNewVerificationLinkSchema>
>;
