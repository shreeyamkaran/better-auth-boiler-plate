import ManageUserControls from '@/components/admin/manage-user.admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ManageUserWithId({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const userId = (await params).userId;
  if (!userId || typeof userId !== 'string') {
    notFound();
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    notFound();
  }
  return (
    <>
      <div className="mb-8 text-2xl sm:text-4xl md:text-5xl lg:text-6xl">{user.name}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1/3 column */}
        <div className="lg:col-span-1">
          <Card className="w-full rounded-none">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Their profile picture</span>
              </CardTitle>
              <CardDescription>
                Displayed on their&apos;s account and visible to other users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img className="w-full h-full" src={user.image || '/images/user.png'} />
            </CardContent>
          </Card>
        </div>

        {/* 2/3 column */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-8">
            <Card className="w-full rounded-none">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Their account&apos;s information</span>
                </CardTitle>
                <CardDescription>Information associated with this user</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-1/3">Name</TableCell>
                      <TableCell>{user.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-1/3">E-mail</TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-1/3">Role</TableCell>
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <ManageUserControls userRole={user.role} />
          </div>
        </div>
      </div>
    </>
  );
}
