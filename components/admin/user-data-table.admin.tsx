import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { User as UserIcon } from 'lucide-react';
import type { User } from '@/prisma/generated/prisma';
import Link from 'next/link';

export default function UserDataTable({ users }: { users: User[] }) {
  return (
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
                  <Button asChild>
                    <Link href={`/admin/dashboard/manage-users/${user.id}`}>
                      <UserIcon />
                    </Link>
                  </Button>
                </TableCell>
              </TooltipProvider>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
