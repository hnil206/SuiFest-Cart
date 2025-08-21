export default function getAuthUrl() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI!,
    scope: 'tweet.write tweet.read users.read media.write',
    state: 'state',
    code_challenge: 'challenge',
    code_challenge_method: 'plain',
  });
  return `https://x.com/i/oauth2/authorize?${params.toString()}`;
}
