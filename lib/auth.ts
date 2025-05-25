import { betterAuth } from 'better-auth';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/argon2';
import { getValidDomains } from '@/lib/valid-domains';
import { normaliseName } from '@/lib/normalise-input';
import { getUserRoles } from '@/lib/user-roles';
import { UserRole } from '@/prisma/generated/prisma';
import { accessControl as ac, roles } from '@/lib/permissions';

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
      // we are checking for valid domains
      if (ctx.path == '/sign-up/email') {
        const email = String(ctx.body.email);
        const domain = email.split('@')[1];
        const validDomains = getValidDomains();
        if (!validDomains.includes(domain)) {
          throw new APIError('BAD_REQUEST', {
            message: 'Invalid domain. Please use a valid email.',
          });
        }
        // we are normalising the name input
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
  databaseHooks: {
    user: {
      create: {
        before: async user => {
          const adminEmails = process.env.ADMIN_EMAILS?.split(';') ?? [];
          if (adminEmails.includes(user.email)) {
            return { data: { ...user, role: UserRole.ADMIN } };
          }
          return { data: user };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        // this will automatically add role field in the server session (not client)
        type: getUserRoles(),
        // this will allow not to pass this field during sign up.
        // if we make this true(default value), then we are gonna need to pass role
        // at @/actions/signup-email.action.ts to register.
        // and we are also taking care by passing USER as default in the prisma schema
        input: false,
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // counted in seconds
  },
  advanced: {
    database: {
      generateId: false, // default true. if false, we need to add @default in the schema
    },
  },
  plugins: [
    nextCookies(),
    // update the database after defining this admin plugin
    // create a permissions file to define permissions for each role
    // import accessContol and roles from the file
    // you can also add these 2 to the auth-client for client side admin operations
    admin({
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
      ac,
      roles,
    }),
  ],
});

// for better error handling
export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN';
