// Utility to build the X (Twitter) OAuth URL
export default function getAuthUrl() {
  const clientId = process.env.TWITTER_CLIENT_ID || process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || '';
  const redirectUri =
    process.env.TWITTER_REDIRECT_URI ||
    process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI ||
    (typeof window !== 'undefined' ? `${window.location.origin}/` : '');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'tweet.write tweet.read users.read media.write',
    state: 'state',
    code_challenge: 'challenge',
    code_challenge_method: 'plain',
  });
  return `https://x.com/i/oauth2/authorize?${params.toString()}`;
}
