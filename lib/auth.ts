import { betterAuth } from 'better-auth';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/argon2';
import { getValidDomains } from '@/lib/valid-domains';
import { normaliseName } from '@/lib/normalise-input';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true, // required
    minPasswordLength: 6, // optional. default 8
    autoSignIn: false, // default true. if true, generates session cookies after sign up
    password: {
      // overriding the default logic by defining our own password hashing logic.
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  hooks: {
    before: createAuthMiddleware(async ctx => {
      if (ctx.path == '/sign-up/email') {
        const email = String(ctx.body.email);
        const domain = email.split('@')[1];
        const validDomains = getValidDomains();
        if (!validDomains.includes(domain)) {
          throw new APIError('BAD_REQUEST', {
            message: 'Invalid domain. Please use a valid email.',
          });
        }

        const name = normaliseName(String(ctx.body.name));
        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name,
            },
          },
        };
      }
    }),
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // counted in seconds
  },
  plugins: [nextCookies()],
  advanced: {
    database: {
      generateId: false, // default true. if false, we need to add @default in the schema
    },
  },
});

// for better error handling
export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN';
