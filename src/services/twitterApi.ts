import type { TweetResponse } from '@/types/twitter';

const TWEET_API = '/api/tweet';

export const postTweetWithImage = async (base64Image: string): Promise<TweetResponse> => {
  const response = await fetch(TWEET_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ base64Image }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to post tweet');
  }

  return response.json();
};
