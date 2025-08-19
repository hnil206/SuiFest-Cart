import { authOptions } from '@/api/auth/nextAuth';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export const config = { api: { bodyParser: true } }; // ✅ use JSON body parser

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  // if (!session) return res.status(401).json({ error: 'Not authenticated' });
  try {
    console.log('DSADSADASDASD');
    const { base64Image } = req.body;
    const realUrl = base64Image.replace('data:image/png;base64,', '');
    const mediaRes = await axios.post(
      `${process.env.TWITTER_API_V2}media/upload`,
      {
        media: realUrl,
        media_category: 'tweet_image',
      },
      {
        headers: {
          Authorization: `Bearer OEhRaXV1ekxFOV9KRDRtQUM0Vl8xZkNReG5pNXNwcU1NbElRcXhDTUxxYkNzOjE3NTU1ODg5MTMxMDY6MTowOmF0OjE`,
          'Content-Type': 'application/json',
        },
      }
    );

    const mediaId = mediaRes?.data?.data?.id;

    console.log(mediaId, 'mediaId');
    // 2. Create tweet
    const tweetRes = await axios.post(
      `${process.env.TWITTER_API_V2}tweets`,
      {
        media: { media_ids: [mediaId] },
      },
      {
        headers: {
          Authorization: `Bearer OEhRaXV1ekxFOV9KRDRtQUM0Vl8xZkNReG5pNXNwcU1NbElRcXhDTUxxYkNzOjE3NTU1ODg5MTMxMDY6MTowOmF0OjE`,
        },
      }
    );

    return res.json(tweetRes.data);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to post tweet' });
  }
}
