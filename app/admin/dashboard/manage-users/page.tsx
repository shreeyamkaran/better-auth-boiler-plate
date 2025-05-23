import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { prisma } from '@/lib/prisma';
import { Trash } from 'lucide-react';
import React from 'react';

const rolePriority = {
  ADMIN: 0,
  USER: 1,
  GUEST: 2,
};

export default async function AdminDashboard() {
  const users = (await prisma.user.findMany()).sort((a, b) => {
    const roleDiff = rolePriority[a.role] - rolePriority[b.role];
    if (roleDiff !== 0) return roleDiff;
    return a.name.localeCompare(b.name);
  });
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
    </>
  );
}
