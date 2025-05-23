import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { auth } from '@/lib/auth';
import { SquarePen } from 'lucide-react';
import { headers } from 'next/headers';

export default async function ProfilePage() {
  const _headers = await headers();
  const session = await auth.api.getSession({
    headers: _headers,
  });

  if (!session) {
    return <div className="bg-red-500">NOT AUTHENTICATED</div>;
  }

  return (
    <>
      <div className="mb-8 text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
        Hello, {session.user.name}.
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1/3 column */}
        <div className="lg:col-span-1">
          <Card className="w-full rounded-none">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Your profile picture</span>
                <SquarePen className="w-5" />
              </CardTitle>
              <CardDescription>
                Displayed on your account and visible to other users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img className="w-full h-full" src={session.user.image || '/images/user.png'} />
            </CardContent>
          </Card>
        </div>

        {/* 2/3 column */}
        <div className="lg:col-span-2">
          <Card className="w-full rounded-none">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Your account&apos;s information</span>
                <SquarePen className="w-5" />
              </CardTitle>
              <CardDescription>Manage the personal details linked to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-1/3">Name</TableCell>
                    <TableCell>{session.user.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-1/3">E-mail</TableCell>
                    <TableCell>{session.user.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-1/3">Role</TableCell>
                    <TableCell>{session.user.role}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/*       
      <div>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div> */}
    </>
  );
}
