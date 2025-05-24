'use client';

import { UserRole } from '@/prisma/generated/prisma';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldUser, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function ManageUserControls({ userRole }: { userRole: UserRole }) {
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState(false);
  const [openMakeAdminDialog, setOpenMakeAdminDialog] = useState(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [makeAdminLoading, setMakeAdminLoading] = useState(false);

  const handleCancel = async () => {
    setOpenDeleteUserDialog(false);
  };

  const handleDeleteUser = async () => {
    setDeleteUserLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      toast.success('User deleted');
      setOpenDeleteUserDialog(false); // close only after success
    } catch (error) {
      console.error('Failed to delete user:', error);
      // optionally show an error toast here
    } finally {
      setDeleteUserLoading(false);
    }
  };

  const handleMakeAdmin = async () => {
    setMakeAdminLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      toast.success('User is now an Admin');
      setOpenMakeAdminDialog(false); // close only after success
    } catch (error) {
      console.error('Failed to make the user an Admin:', error);
      // optionally show an error toast here
    } finally {
      setMakeAdminLoading(false);
    }
  };

  if (userRole === UserRole.ADMIN) {
    return null;
  }
  return (
    <div className="flex justify-end gap-2">
      <Dialog
        open={openDeleteUserDialog}
        onOpenChange={value => !deleteUserLoading && setOpenDeleteUserDialog(value)}
      >
        <DialogTrigger asChild>
          <Button variant="destructive">
            <Trash />
            Delete User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure to delete this user?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete their account and remove
              their data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center sm:justify-center md:justify-end items-center space-x-2">
            <Button variant="ghost" disabled={deleteUserLoading} onClick={handleCancel}>
              <span>Cancel</span>
            </Button>
            <Button variant="destructive" disabled={deleteUserLoading} onClick={handleDeleteUser}>
              <div className="flex items-center justify-center max-w-[150px]">
                <span className={deleteUserLoading ? 'invisible' : 'block'}>Yes. I am sure</span>
                {deleteUserLoading && <Loader2 className="absolute animate-spin" />}
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openMakeAdminDialog}
        onOpenChange={value => !makeAdminLoading && setOpenMakeAdminDialog(value)}
      >
        <DialogTrigger asChild>
          <Button>
            <ShieldUser />
            Make Admin
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure to make this user an admin?</DialogTitle>
            <DialogDescription>
              This action will grant the user administrative privileges, allowing them to manage
              other users and access sensitive parts of the system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center sm:justify-center md:justify-end items-center space-x-2">
            <Button variant="ghost" disabled={makeAdminLoading} onClick={handleCancel}>
              <span>Cancel</span>
            </Button>
            <Button disabled={makeAdminLoading} onClick={handleMakeAdmin}>
              <div className="flex items-center justify-center max-w-[150px]">
                <span className={makeAdminLoading ? 'invisible' : 'block'}>Yes. I am sure</span>
                {makeAdminLoading && <Loader2 className="absolute animate-spin" />}
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
