import { UserRole } from '@/prisma/generated/prisma';
import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc } from 'better-auth/plugins/admin/access';

// we are defining the set of things a user can do on each table
// some default things are already defined as defaultStatement
const statements = {
  // some of these are default statements
  // we can also spread the defaultStatement coming from better-auth/plugins/admin/access
  user: [
    'create',
    'list',
    'set-role',
    'ban',
    'impersonate',
    'delete',
    'set-password',
    'get-deleted',
    'get-role-changed',
  ],
  session: ['list', 'revoke', 'delete'],
  post: ['create', 'read', 'update', 'delete', 'update:own', 'delete:own'],
} as const;

export const accessControl = createAccessControl(statements);

// now we are assigning the necessary statements to each role
export const roles = {
  [UserRole.USER]: accessControl.newRole({
    user: ['get-deleted', 'get-role-changed'],
    post: ['create', 'read', 'update:own', 'delete:own'],
  }),
  [UserRole.ADMIN]: accessControl.newRole({
    ...adminAc.statements,
    post: ['create', 'read', 'delete', 'update:own', 'delete:own'],
  }),
};
