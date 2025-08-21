'use client';

import AvailableCard from '@/components/AvailableCard';
import { CardPreview } from '@/components/CardPreview';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import exChangeXToken from '@/utils/exchangeXToken';
import getAuthUrl from '@/utils/getAuthUrl';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import html2canvas from 'html2canvas';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import CardContext from '../store/card-providers';

const PreviewPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = useContext(CardContext);
  const { state } = context;

  // Process session image URL to remove _large suffix

  const template = (searchParams?.get('template') as 'navy' | 'purple' | 'brown') || 'navy';

  const captureRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    const code = searchParams?.get('code');
    if (!code) return;
    (async () => {
      try {
        await exChangeXToken({ code });
      } catch (e) {
        console.error('Failed to exchange code for token', e);
      }
    })();
  }, [searchParams, router]);

  const ensureAuthenticated = async (): Promise<boolean> => {
    const statusRes = await fetch('/api/auth/status', { cache: 'no-store' });
    const status = statusRes.ok ? await statusRes.json() : null;
    if (status?.authenticated) return true;
    router.push(getAuthUrl());
    return false;
  };

  const handleCapture = async () => {
    const ok = await ensureAuthenticated();
    if (!ok) return;
    console.log(captureRef.current, 'captureRef');
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current);
      console.log(canvas, 'canvas');
      const dataUrl = canvas.toDataURL('image/png');
      setImage(dataUrl);
    }
  };

  const tweetScreenshot = async () => {
    const ok = await ensureAuthenticated();
    if (!ok || !image) return;
    const res = await fetch('/api/twitter/post-tweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image: image, text }),
    });
    const data = await res.json();
  };

  return (
    <div>
      <div>
        <div className='flex w-full justify-center bg-black p-8 text-white'>
          <div className='flex' ref={captureRef}>
            <CardPreview
              name={state.name}
              username={state.username.startsWith('@') ? state.username.slice(1) : state.username}
              avatarUrl={state.image}
              template={template}
            />
            <AvailableCard />
          </div>
        </div>
        <div className='flex items-center justify-center'>
          <h2>Share your newly generated SuiFest Card</h2>
        </div>
      </div>
      <div className='flex items-center justify-center py-8'>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              className='flex transform items-center gap-2 rounded-full bg-twitter px-6 py-6 font-medium text-lg text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-twitter/90 hover:shadow-twitter/30'
              onClick={handleCapture}
            >
              <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
              </svg>
              Share on X
            </Button>
          </DialogTrigger>

          <DialogContent className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl'>
              <DialogHeader className='mb-6'>
                <DialogTitle className='font-bold text-2xl text-white'>Share Your Card</DialogTitle>
                <DialogDescription className='mt-1 text-gray-400'>
                  Preview and share your SuiFest card on X
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-6'>
                {image && (
                  <div className='relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800'>
                    <img src={image} alt='Your SuiFest card' className='h-auto max-h-[400px] w-full object-contain' />
                  </div>
                )}

                <div className='space-y-2'>
                  <Label htmlFor='tweet-text' className='font-medium text-gray-300 text-sm'>
                    Add a message (optional)
                  </Label>
                  <textarea
                    id='tweet-text'
                    className='flex min-h-[100px] w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 shadow-sm focus:border-twitter focus:ring-twitter/50'
                    placeholder='Share your thoughts...'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter className='mt-8 flex justify-end space-x-3'>
                <DialogClose asChild>
                  <Button
                    type='button'
                    variant='outline'
                    className='border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button onClick={tweetScreenshot} className='bg-twitter font-medium text-white hover:bg-twitter/90'>
                  Post to X
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default PreviewPage;
