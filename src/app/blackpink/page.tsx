'use client';

import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';

export default function Blackpink() {
  const captureRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleCapture = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current);
      setImage(canvas.toDataURL('image/png'));
    }
  };

  const tweetScreenshot = async () => {
    if (!image) return;
    const res = await fetch('/api/twitter/tweet', {
      method: 'POST',
      body: (() => {
        const fd = new FormData();
        fd.append('file', dataURItoBlob(image), 'screenshot.png');
        return fd;
      })(),
    });
    const data = await res.json();
    alert('Tweeted! ' + JSON.stringify(data));
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className='mx-auto max-w-2xl p-6'>
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
