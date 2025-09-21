import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);

  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }

  return NextResponse.redirect(`${requestUrl.origin}/admin/login`, { status: 302 });
}
