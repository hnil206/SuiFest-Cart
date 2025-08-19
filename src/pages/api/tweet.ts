import { authOptions } from '@/api/auth/nextAuth';
import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });
    const fileInput = files.file;
    const file = Array.isArray(fileInput) ? fileInput[0] : fileInput;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    const fileData = fs.readFileSync(file.filepath);
    console.log('File data size:', fileData.length);

    try {
      const token = session?.accessToken;
      console.log('Token:', token);
      const params = new URLSearchParams();
      params.append('media', fileData.toString('base64'));
      console.log('Params:', params.toString());
      if (!token) return res.status(401).json({ error: 'Not authenticated' });
      // 1. Upload media
      const mediaRes = await axios.post('https://upload.twitter.com/1.1/media/upload.json', params, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
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
