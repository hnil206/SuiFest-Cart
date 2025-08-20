// pages/api/auth/twitter.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { generatePKCE } from '../../../utils/twitterAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { verifier, challenge } = generatePKCE();

  // Save verifier in session or cookie
  res.setHeader('Set-Cookie', `pkce_verifier=${verifier}; Path=/; HttpOnly`);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TWITTER_CLIENT_ID!,
    redirect_uri: process.env.TWITTER_REDIRECT_URI!,
    scope: 'tweet.read tweet.write users.read user.write media.write',
    state: 'state',
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });

  res.redirect(`https://twitter.com/i/oauth2/authorize?${params.toString()}`);
}
