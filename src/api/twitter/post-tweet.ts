import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.cookies['twitter_token'];
  console.log(token, 'token');
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const { base64Image, text } = req.body;
    const realUrl = base64Image.replace('data:image/png;base64,', '');
    const mediaRes = await axios.post(
      'https://api.twitter.com/2/media/upload',
      {
        media: realUrl,
        media_category: 'tweet_image',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const mediaId = mediaRes?.data?.data?.id;

    console.log(mediaId, 'mediaId');
    // 2. Create tweet
    const tweetRes = await axios.post(
      'https://api.twitter.com/2/tweets',
      {
        text: text || 'Check out this screenshot! #Blackpink',
        media: { media_ids: [mediaId] },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.json(tweetRes.data);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to post tweet' });
  }
}
