import { prisma } from '@/lib/prisma';
import React from 'react';

export default async function AdminDashboard() {
  const users = await prisma.user.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  return (
    <div>
      {users && users.map(user => <pre key={user.id}>{JSON.stringify(user, null, 2)}</pre>)}
    </div>
  );
}
