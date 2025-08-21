import { NextResponse } from 'next/server';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function POST(request: Request) {
  const token = request.headers.get('cookie')?.match(/twitter_token=([^;]+)/)?.[1];

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { base64Image, text } = await request.json();
    const realUrl = base64Image.replace('data:image/png;base64,', '');

    // 1. Upload media
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
    if (!mediaId) {
      throw new Error('Failed to upload media');
    }

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

    return NextResponse.json(tweetRes.data);
  } catch (error: any) {
    console.error('Error posting tweet:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to post tweet' }, { status: error.response?.status || 500 });
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: 'POST, OPTIONS',
    },
  });
}
