import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${uuidv4()}.png`;
    if (process.env.token_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const { url } = await put(`uploads/${filename}`, buffer, {
        access: 'public',
        contentType: 'image/png',
        token: process.env.token_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ success: true, url, filename });
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const publicPath = join(uploadsDir, filename);
    await writeFile(publicPath, buffer);
    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url, filename });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
