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
  const session = await auth.api.getSession({
    headers: _headers,
  });

  if (!session) {
    return { error: 'Unauthenticated', data: null };
  }
  if (session.user.role !== 'ADMIN') {
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
  const session = await auth.api.getSession({
    headers: _headers,
  });

  if (!session) {
    return { error: 'Unauthenticated', data: null };
  }
  if (session.user.role !== 'ADMIN') {
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
