'use server';

import { auth, ErrorCode } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

type SigninData = {
  email: string;
  password: string;
};

export async function signinEmailAction(formData: SigninData) {
  const _headers = await headers();
  try {
    await auth.api.signInEmail({
      headers: _headers,
      body: {
        email: formData.email,
        password: formData.password,
      },
    });

    // the above server action will not set up the cookie
    // since its a server action we need to do some extra work for setting up session cookie
    // we can use a plugin that better-auth provides
    // or we can define our own cookie setting logic here
    // we have used the pre-made plugin method. See at: @/lib/auth.ts
    /**
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const cookie = parseSetCookieHeader(setCookieHeader);
      const cookieStore = await cookies();
      const [cookieKey, cookieAttribute] = [...cookie.entries()][0];
      const value = cookieAttribute['value'];
      const maxAge = cookieAttribute['max-age'];
      const path = cookieAttribute['path'];
      const httpOnly = cookieAttribute['httponly'];
      const sameSite = cookieAttribute['samesite'];
      const domain = cookieAttribute['domain'];
      const expires = cookieAttribute['expires'];
      const secure = cookieAttribute['secure'];
      cookieStore.set(cookieKey, decodeURIComponent(value), {
        maxAge,
        path,
        httpOnly,
        sameSite,
        domain,
        expires,
        secure,
      });
    }
    */

    return { error: null };
  } catch (e) {
    if (e instanceof APIError) {
      const errCode = (e.body?.code as ErrorCode) || 'UNKNOWN';
      switch (errCode) {
        case 'EMAIL_NOT_VERIFIED':
          redirect('/auth/verify?error=email_not_verified');
        default:
          return { error: e.message };
      }
    } else {
      return { error: 'Something went wrong.' };
    }
  }
}
