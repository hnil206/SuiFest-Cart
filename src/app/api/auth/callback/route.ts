import { NextResponse } from 'next/server';
import qs from 'querystring';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.redirect('/blackpink?error=no_code');
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: qs.stringify({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: `${process.env.NEXTAUTH_URL}/blackpink`,
        code_verifier: 'challenge', // This should match the code_challenge from the auth URL
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || 'Failed to get access token');
    }

    // Store the access token in an HTTP-only cookie
    const response = NextResponse.redirect('/blackpink');
    response.cookies.set('twitter_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Twitter OAuth error:', error);
    const errorMessage = error?.message || 'Unknown error occurred';
    return NextResponse.redirect(`/blackpink?error=${encodeURIComponent(errorMessage)}`);
  }
}
