import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const filename = `${uuidv4()}.png`;
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    // Ensure uploads directory exists
    await mkdir(uploadsDir, { recursive: true });
    const publicPath = join(uploadsDir, filename);

    // Save file to public/uploads directory
    await writeFile(publicPath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
    });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
