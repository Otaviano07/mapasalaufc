import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createServerSupabaseClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(`${requestUrl.origin}/admin/login`, { status: 302 });
}