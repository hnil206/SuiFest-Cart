import axios from 'axios';

interface ExChangeXTokenProps {
  code: string;
  code_verifier: string;
}

interface ExChangeXTokenResponse {
  accessToken: string;
  scope: string;
}

export default async function exChangeXToken({
  code,
  code_verifier,
}: ExChangeXTokenProps): Promise<ExChangeXTokenResponse> {
  const token = await axios.post(
    `${process.env.TWITTER_API_V2}/oauth2/token`,
    {
      code: code,
      client_id: process.env.TWITTER_CLIENT_ID!,
      client_secret: process.env.TWITTER_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TWITTER_REDIRECT_URI!,
      code_verifier: code_verifier,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  sessionStorage.setItem('twitter_token', token.data.access_token);
  return token.data;
}
