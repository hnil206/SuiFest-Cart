import { NextResponse } from 'next/server';
import axios from 'axios';

const CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || 'TzdVNWh0dWJvaUI2WUJIT1JvWnM6MTpjaQ';
// Use the same redirect URI as the client page handling the code (Blackpink page)
const REDIRECT_URI = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI || 'http://localhost:3000/';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('client_id', CLIENT_ID);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('code_verifier', 'challenge');

    const response = await axios.post('https://api.twitter.com/2/oauth2/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    const details = error.response?.data || error.message;
    console.error('Token exchange error:', details);
    return NextResponse.json(
      {
        error: 'Failed to exchange token',
        details,
      },
      { status: error.response?.status || 500 }
    );
  }
}
