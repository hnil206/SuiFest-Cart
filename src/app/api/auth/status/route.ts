import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('twitter_token')?.value;
  return NextResponse.json({ authenticated: !!token }, { status: 200 });
}
