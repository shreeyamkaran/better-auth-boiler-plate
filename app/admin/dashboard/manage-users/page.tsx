import { prisma } from '@/lib/prisma';
import React from 'react';
import CustomPagination from '@/components/custom-pagination';
import { getPaginationParams } from '@/lib/pagination-params';
import UserDataTable from '@/components/admin/user-data-table.admin';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const _searchParams = await searchParams;
  const rawCurrentPage = _searchParams['page'];
  const rawPerPage = _searchParams['per_page'];
  const { currentPage, perPage } = getPaginationParams(rawCurrentPage, rawPerPage);

  const users = await prisma.user.findMany({
    skip: (currentPage - 1) * perPage,
    take: perPage,
    orderBy: [{ role: 'desc' }, { name: 'asc' }],
  });
  const totalUsers = await prisma.user.count();

  return (
    <>
      <div className="mb-8 text-2xl sm:text-4xl md:text-5xl lg:text-6xl">Manage Users</div>
      <div className="min-h-96">
        <UserDataTable users={users} />
      </div>
      <CustomPagination totalItems={totalUsers} />
    </>
  );
}
