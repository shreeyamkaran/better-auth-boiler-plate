'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function listUsersAction({
  currentPage,
  perPage,
}: {
  currentPage: number;
  perPage: number;
}) {
  const _headers = await headers();
  // checking session manually
  /**
  const session = await auth.api.getSession({
    headers: _headers,
  });
  if (!session) {
    return { error: 'Unauthenticated', data: null };
  }
  */

  // checking permissions manually
  /**
  if (session.user.role !== 'ADMIN') {
    return { error: 'Unauthorised', data: null };
  }
  */

  // checking permissions using admin plugin
  // this will also, indirectly, check the current session
  // so no need to manually check that
  const hasPermission = await auth.api.userHasPermission({
    headers: _headers, // pass headers to check permissions of the current logged-in user
    body: {
      // we can also pass userId here to check permissions of that particular user
      permissions: {
        // checking if the current logged in user has the permission
        // to list down the users in the db
        // we can pass multiple statements inside the array
        // the statements are defined at @/lib/permissions.ts
        user: ['list'], // user is the name of the table in the db
      },
    },
  });

  if (!hasPermission) {
    return { error: 'Unauthorised', data: null };
  }

  try {
    const users = await prisma.user.findMany({
      skip: (currentPage - 1) * perPage,
      take: perPage,
      orderBy: [{ role: 'desc' }, { name: 'asc' }],
    });
    return { error: null, data: users };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message, data: null };
    }
    return { error: 'Internal server error', data: null };
  }
}

export async function totalNumberOfUsersAction() {
  const _headers = await headers();

  const hasPermission = await auth.api.userHasPermission({
    headers: _headers,
    body: {
      permissions: {
        user: ['list'],
      },
    },
  });

  if (!hasPermission) {
    return { error: 'Unauthorised', data: null };
  }

  try {
    const totalNumberOfUsers = await prisma.user.count();
    return { error: null, data: totalNumberOfUsers };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message, data: null };
    }
    return { error: 'Internal server error', data: null };
  }
}
