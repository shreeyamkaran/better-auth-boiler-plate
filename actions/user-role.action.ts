'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/prisma/generated/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function makeUserAdminAction(userId: string) {
  const _headers = await headers();
  const session = await auth.api.getSession({
    headers: _headers,
  });

  if (!session) {
    return { error: 'Unauthenticated' };
  }
  if (session.user.id === userId) {
    return { error: 'Method not allowed. Cannot update your own role by yourself' };
  }

  const hasPermissionResponse = await auth.api.userHasPermission({
    headers: _headers,
    body: {
      permissions: {
        user: ['set-role'],
      },
    },
  });

  const hasPermission =
    hasPermissionResponse.error === null && hasPermissionResponse.success === true;

  if (!hasPermission) {
    return { error: 'Unauthorised' };
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
        NOT: {
          role: UserRole.ADMIN,
        },
      },
      data: {
        role: UserRole.ADMIN,
      },
    });
    revalidatePath(`/admin/dashboard/manage-users/${userId}`);
    return { error: null };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: 'Internal server error' };
  }
}
