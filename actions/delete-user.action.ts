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
  if (session.user.id === userId) {
    return { error: 'Method not allowed. Cannot delete yourself' };
  }

  const hasPermissionResponse = await auth.api.userHasPermission({
    headers: _headers,
    body: {
      permissions: {
        user: ['delete'],
      },
    },
  });

  const hasPermission =
    hasPermissionResponse.error === null && hasPermissionResponse.success === true;

  if (!hasPermission) {
    return { error: 'Unauthorised' };
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
