'use client';

import getAuthUrl from '@/pages/api/getAuthCode';
import exChangeXToken from '@/utils/exChangeXToken';
import html2canvas from 'html2canvas';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Blackpink() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const captureRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState('');

  // Build X OAuth URL

  // On load, if code exists, exchange, sign-in (credentials), then clean URL
  useEffect(() => {
    const code = searchParams?.get('code');
    if (!code) return;
    (async () => {
      try {
        const resp = await exChangeXToken({ code });
        if (resp?.accessToken) {
          await signIn('credentials', { redirect: false, token: resp.accessToken });
        }
        console.log(resp, 'resp');
      } catch (e) {
        console.error('Failed to exchange code for token', e);
      } finally {
        router.replace('/blackpink');
      }
    })();
  }, [searchParams, router]);

  const ensureAuthenticated = async (): Promise<boolean> => {
    // Check cookie-based auth status
    const statusRes = await fetch('/api/auth/status', { cache: 'no-store' });
    const status = statusRes.ok ? await statusRes.json() : null;
    if (status?.authenticated) return true;
    // No token: redirect to X OAuth
    window.location.href = getAuthUrl();
    return false;
  };

  const handleCapture = async () => {
    // Ensure the user is authenticated before allowing capture (and subsequent tweet)
    const ok = await ensureAuthenticated();
    if (!ok) return;

    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      setImage(dataUrl);
    }
  };

  const tweetScreenshot = async () => {
    // Double-check auth before tweeting in case session changed
    const ok = await ensureAuthenticated();
    if (!ok || !image) return;
    const res = await fetch('/api/tweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image: image, text }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert('Failed: ' + JSON.stringify(data));
    } else {
      alert('Tweeted! ' + JSON.stringify(data));
    }
  };

  const handleModal = (value: boolean) => {
    setIsModalOpen(value);
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

            <button onClick={() => handleModal(true)} className='mt-4 rounded bg-blue-500 px-4 py-2 text-white'>
              Tweet Screenshot
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='relative w-full max-w-lg rounded-lg bg-white p-4 shadow-lg'>
            <h2 className='mb-4 font-semibold text-xl'>Tweet Screenshot</h2>
            <input
              type='text'
              placeholder='Enter tweet text'
              className='w-full rounded border p-2'
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <button onClick={tweetScreenshot} className='mt-4 rounded bg-blue-500 px-4 py-2 text-white'>
              Tweet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
