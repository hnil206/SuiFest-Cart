import axios from 'axios';
import type { TwitterTokenResponse } from '@/types/twitter';

const TWITTER_OAUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || 'TzdVNWh0dWJvaUI2WUJIT1JvWnM6MTpjaQ';
const REDIRECT_URI = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/twitter';

export const getTwitterAuthUrl = (): string => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'tweet.read tweet.write users.read media.write',
    state: 'state',
    code_challenge: 'challenge',
    code_challenge_method: 'plain',
  });

  return `${TWITTER_OAUTH_URL}?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string): Promise<TwitterTokenResponse> => {
  try {
    const response = await axios.post<TwitterTokenResponse>(
      '/api/token',
      { code },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    console.log(response.data, 'Token exchange successful');
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to exchange code for token';
    throw new Error(message);
  }
};
