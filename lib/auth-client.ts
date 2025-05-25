import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields, adminClient } from 'better-auth/client/plugins';
import type { auth } from '@/lib/auth';
import { accessControl as ac, roles } from '@/lib/permissions';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // we added a new field 'role' in the User schema
  // to make it available using useSession() hook
  // we need to add this inferAdditionalFields plugin

  // when we defined admin plugin in the auth.ts file
  // more fields were added inside the user and session tables
  // to make those fields available using useSession() hook
  // we need to add this adminClient plugin
  plugins: [inferAdditionalFields<typeof auth>(), adminClient({ ac, roles })],
});

export const { signIn, signUp, signOut, useSession } = authClient;
