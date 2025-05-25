import { UserRole } from '@/prisma/generated/prisma';
import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

// we are defining the set of things a user can do on each table
// some default things are already defined as defaultStatement
const statements = {
  ...defaultStatements,
  post: ['create', 'read', 'update', 'delete', 'update:own', 'delete:own'],
} as const;

export const accessControl = createAccessControl(statements);

// now we are assigning the necessary statements to each role
export const roles = {
  [UserRole.USER]: accessControl.newRole({
    post: ['create', 'read', 'update:own', 'delete:own'],
  }),
  [UserRole.ADMIN]: accessControl.newRole({
    ...adminAc.statements,
    post: ['create', 'read', 'delete', 'update:own', 'delete:own'],
  }),
};
