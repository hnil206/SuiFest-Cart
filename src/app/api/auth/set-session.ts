// src/app/api/auth/set-session.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { token } = await req.json();
  const response = NextResponse.json({ success: true });

  // Set the token in a secure, httpOnly cookie
  response.cookies.set('twitter_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 2,
    path: '/',
  });

  return response;
}
