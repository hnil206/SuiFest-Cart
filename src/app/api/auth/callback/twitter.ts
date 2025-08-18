import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  const verifier = req.cookies.pkce_verifier;

  if (!code || !verifier) {
    return res.status(400).json({ error: 'Missing code or PKCE verifier' });
  }

  try {
    const response = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        client_id: process.env.TWITTER_CLIENT_ID!,
        redirect_uri: process.env.TWITTER_REDIRECT_URI!,
        grant_type: 'authorization_code',
        code: code as string,
        code_verifier: verifier,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const tokens = response.data;
    console.log('Access token:', tokens);

    // Store in cookie for demo (better: DB or session)
    res.setHeader('Set-Cookie', `twitter_token=${tokens.access_token}; Path=/; HttpOnly`);
    res.redirect('/'); // back to app
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Token exchange failed' });
  }
}
