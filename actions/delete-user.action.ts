'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/prisma/generated/prisma';
import { headers } from 'next/headers';

export async function deleteUserAction(userId: string) {
  const _headers = await headers();
  const session = await auth.api.getSession({
    headers: _headers,
  });

  if (!session) {
    return { error: 'Unauthenticated' };
  }
  if (session.user.role !== 'ADMIN') {
    return { error: 'Unauthorised' };
  }
  if (session.user.id === userId) {
    return { error: 'Method not allowed. Cannot delete yourself' };
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
        role: UserRole.USER,
      },
    });
    return { error: null };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: 'Internal server error' };
  }
}
