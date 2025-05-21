'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function signoutAction() {
  const _headers = await headers();
  try {
    await auth.api.signOut({
      headers: _headers,
    });
    return { error: null };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: 'Something went wrong.' };
    }
  }
}
