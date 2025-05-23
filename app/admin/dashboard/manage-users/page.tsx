import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { prisma } from '@/lib/prisma';
import { Trash } from 'lucide-react';
import React from 'react';
import CustomPagination from '@/components/custom-pagination';
import { getPaginationParams } from '@/lib/pagination-params';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const _searchParams = await searchParams;
  const rawPage = Array.isArray(_searchParams['page'])
    ? _searchParams['page'][0]
    : _searchParams['page'];
  const rawPerPage = Array.isArray(_searchParams['per_page'])
    ? _searchParams['per_page'][0]
    : _searchParams['per_page'];
  const { currentPage, perPage } = getPaginationParams(rawPage, rawPerPage);

  const users = await prisma.user.findMany({
    skip: (currentPage - 1) * perPage,
    take: perPage,
    orderBy: [{ role: 'desc' }, { name: 'asc' }],
  });
  const totalUsers = await prisma.user.count();

  return (
    <>
      <div className="mb-8 text-2xl sm:text-4xl md:text-5xl lg:text-6xl">Manage Users</div>
      <Table className="table-fixed">
        <TableBody>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
          {users &&
            users.map(user => (
              <TableRow key={user.id}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableCell className="truncate max-w-[200px] overflow-hidden whitespace-nowrap cursor-help">
                        {user.id}
                      </TableCell>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.id}</p>
                    </TooltipContent>
                  </Tooltip>
                  <TableCell className="truncate max-w-[200px] overflow-hidden whitespace-nowrap">
                    {user.name}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px] overflow-hidden whitespace-nowrap">
                    {user.email}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px] overflow-hidden whitespace-nowrap">
                    {user.role}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px] overflow-hidden whitespace-nowrap">
                    <Button>
                      <Trash />
                    </Button>
                  </TableCell>
                </TooltipProvider>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <CustomPagination totalItems={totalUsers} />
    </>
  );
}
