import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });

    const file = files.file as formidable.File;
    const fileData = fs.readFileSync(file.filepath);

    try {
      const token = req.cookies.twitter_token;
      if (!token) return res.status(401).json({ error: 'Not authenticated' });

      // 1. Upload media
      const mediaRes = await axios.post(
        'https://upload.twitter.com/1.1/media/upload.json',
        new URLSearchParams({ media: fileData.toString('base64') }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const mediaId = mediaRes.data.media_id_string;

      // 2. Post tweet
      const tweetRes = await axios.post(
        'https://api.twitter.com/2/tweets',
        { text: 'Blackpink Screenshot ✨', media: { media_ids: [mediaId] } },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.json(tweetRes.data);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      return res.status(500).json({ error: 'Failed to post tweet' });
    }
  });
}
