'use server';

import { auth, ErrorCode } from '@/lib/auth';
import { APIError } from 'better-auth/api';

type SignupData = {
  name: string;
  email: string;
  password: string;
};

export async function signupEmailAction(formData: SignupData) {
  try {
    await auth.api.signUpEmail({
      body: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
    });
    return { error: null };
  } catch (e) {
    if (e instanceof APIError) {
      const errorCode = (e.body?.code as ErrorCode) || 'UNKNOWN';
      switch (errorCode) {
        case 'USER_ALREADY_EXISTS':
          return { error: 'User already exists.' };
        default:
          return { error: e.message };
      }
    } else {
      return { error: 'Something went wrong.' };
    }
  }
}
