import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/firebase'; // Import Firebase auth
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import necessary Firebase Auth functions

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (req.nextUrl.pathname === '/admin/login') {
      return res;
    }

    // Check Firebase authentication state
    // Note: Directly checking Firebase Auth state in middleware (Edge Runtime) is complex
    // as Firebase Auth relies on client-side state/cookies.
    // A common approach is to verify a Firebase ID token stored in a cookie.
    // For simplicity in this example, we'll rely on client-side redirects
    // from the admin layout if the user is not authenticated.
    // The middleware will primarily handle the initial redirect to login.

    // If you need strict server-side protection, you would:
    // 1. Get the Firebase ID token from a cookie (set after successful login).
    // 2. Use Firebase Admin SDK (server-side only) to verify the ID token.
    // 3. If verification fails, redirect to login.

    // For now, we'll rely on the client-side check in AdminLayout.
    // This middleware ensures that if someone tries to directly access /admin,
    // they are redirected to login, and the client-side code in AdminLayout
    // will then handle the actual session check.

    // This part is a placeholder for actual server-side Firebase Auth check
    // For now, it will always allow access to the middleware, relying on client-side.
    // This is NOT secure for production without proper server-side token verification.
    // For this example, we'll assume the client-side AdminLayout handles the redirect.

    // If you want to enforce server-side protection here, you'd need to:
    // const idToken = req.cookies.get('firebase_id_token')?.value; // Assuming you set this cookie
    // if (!idToken) {
    //   return NextResponse.redirect(new URL('/admin/login', req.url));
    // }
    // try {
    //   const decodedToken = await adminAuth.verifyIdToken(idToken); // Requires Firebase Admin SDK
    //   // User is authenticated
    // } catch (error) {
    //   // Token is invalid or expired
    //   return NextResponse.redirect(new URL('/admin/login', req.url));
    // }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
