'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

type SigninData = {
  email: string;
  password: string;
};

export async function signinEmailAction(formData: SigninData) {
  const _headers = await headers();
  try {
    const response = await auth.api.signInEmail({
      body: {
        email: formData.email,
        password: formData.password,
      },
      headers: _headers,
      asResponse: true,
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

    if (response.ok) {
      return { error: null };
    } else {
      console.log(response);
      return { error: response.statusText };
    }
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: 'Something went wrong.' };
    }
  }
}
