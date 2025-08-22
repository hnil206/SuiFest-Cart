'use server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
export async function POST() {
  const response = NextResponse.json({ success: true });
  (await cookies()).delete('twitter_token');
  return response;
}
