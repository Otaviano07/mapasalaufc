import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // These console.logs confirm the values are present
  console.log('Middleware - NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Middleware - NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const supabase = createServerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        req.cookies.set(name, value, options);
      },
      remove(name: string, options: any) {
        req.cookies.set(name, '', options);
      },
    },
  });

  const { data: { session } } = await supabase.auth.getSession();

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (req.nextUrl.pathname === '/admin/login') {
      return res;
    }

    // Redirect unauthenticated users to login page
    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};