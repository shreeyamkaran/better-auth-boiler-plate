import React from 'react';
import CustomPagination from '@/components/custom-pagination';
import { getPaginationParams } from '@/lib/pagination-params';
import UserDataTable from '@/components/admin/user-data-table.admin';
import { listUsersAction, totalNumberOfUsersAction } from '@/actions/list-users.action';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const _searchParams = await searchParams;
  const rawCurrentPage = _searchParams['page'];
  const rawPerPage = _searchParams['per_page'];
  const { currentPage, perPage } = getPaginationParams(rawCurrentPage, rawPerPage);

  // we can directly call prisma.user.findMany() here
  // instead of creating server actions
  // because it's a server component
  // had it been a client component, we couldn't do it
  // in that case we had to compulsarily create server actions
  const users = await listUsersAction({ currentPage, perPage });
  if (users.error !== null || users.data === null) {
    return null;
  }
  const totalUsers = await totalNumberOfUsersAction();
  if (totalUsers.error !== null || totalUsers.data === null) {
    return null;
  }

  return (
    <>
      <div className="mb-8 text-2xl sm:text-4xl md:text-5xl lg:text-6xl">Manage Users</div>
      <div className="min-h-96">
        <UserDataTable users={users.data} />
      </div>
      <CustomPagination totalItems={totalUsers.data} />
    </>
  );
}
