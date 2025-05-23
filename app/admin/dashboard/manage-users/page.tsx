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

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
