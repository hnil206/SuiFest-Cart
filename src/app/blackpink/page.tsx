'use client';

import LoginButton from '@/components/auth/LoginButton';
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';

export default function Blackpink() {
  const captureRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleCapture = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current);
      const dataUrl = canvas.toDataURL('image/png'); // already includes data:image/png;base64,...
      setImage(dataUrl); // keep full data URL
      console.log(dataUrl, 'dataUrl');
    }
  };

  const tweetScreenshot = async () => {
    if (!image) return;
    const res = await fetch('/api/tweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image: image }),
    });
    const data = await res.json();
    alert('Tweeted! ' + JSON.stringify(data));
  };

  return (
    <div className='mx-auto max-w-2xl p-6'>
      <LoginButton />
      <div ref={captureRef}>
        <h1 className='mb-6 font-bold text-3xl'>Blackpink</h1>
        <p>This section will be captured.</p>
      </div>

      <button onClick={handleCapture} className='mt-4 rounded bg-pink-500 px-4 py-2 text-white'>
        Capture Screenshot
      </button>

      {image && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='relative w-full max-w-lg rounded-lg bg-white p-4 shadow-lg'>
            <h2 className='mb-4 font-semibold text-xl'>Captured Screenshot</h2>
            <img src={image} alt='Screenshot' className='w-full rounded' />

            <button onClick={tweetScreenshot} className='mt-4 rounded bg-blue-500 px-4 py-2 text-white'>
              Tweet Screenshot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
