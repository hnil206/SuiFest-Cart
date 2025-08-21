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
  // Get data from URL params or fall back to session
  const displayName = searchParams?.get('name') || session?.user?.name || 'Your Name';
  const displayUsername = searchParams?.get('username') || session?.username || 'username';

  // Process session image URL to remove _large suffix
  const processedSessionImage = session?.user?.image ? session.user.image.replace('_normal', '') : null;

  const displayAvatar = searchParams?.get('avatar') || processedSessionImage || 'https://pbs.twimg.com/150';
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
    if (data.error) {
      console.error('Error posting tweet:', data.error);
      return;
    } else {
      setIsModalOpen(true);
      router.push('/');
    }
  };

  return (
    <div className='flex min-h-[calc(100vh-120px)] flex-col items-center justify-center'>
      <div className='flex w-full bg-black px-2 text-white lg:px-0'>
        <div className='container mx-auto flex w-full justify-center'>
          <div className='flex w-full rounded-r-[32px]' ref={captureRef}>
            <CardPreview
              name={state.name}
              username={state.username.startsWith('@') ? state.username.slice(1) : state.username}
              avatarUrl={state.image}
              template={template}
            />
            <AvailableCard />
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center px-2 pt-6 text-center font-bold text-white text-xl lg:px-0 lg:text-4xl'>
        <h2>Share your newly generated SuiFest Card</h2>
      </div>
      <div className='flex items-center justify-center py-8'>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              className='flex transform items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-black text-lg shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:shadow-xl'
              onClick={handleCapture}
            >
              Share on
              <img src='/x-logo.svg' alt='' className='h-5 w-5 text-black' />
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

              <DialogFooter className='mt-8 flex justify-between space-x-3 sm:justify-end'>
                <DialogClose asChild>
                  <Button
                    type='button'
                    variant='outline'
                    className='group relative overflow-hidden border-gray-600 bg-transparent px-6 py-2.5 text-gray-300 transition-all duration-300 hover:border-gray-500 hover:bg-gray-800/50 hover:text-white focus:ring-2 focus:ring-gray-500/20'
                  >
                    <span className='relative z-10 font-medium'>Cancel</span>
                  </Button>
                </DialogClose>
                <Button
                  onClick={tweetScreenshot}
                  className='group relative overflow-hidden bg-gradient-to-r from-twitter to-blue-500 px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-twitter/90 hover:to-blue-500/90 hover:shadow-xl focus:ring-2 focus:ring-twitter/30 disabled:cursor-not-allowed disabled:opacity-50'
                  disabled={!image}
                >
                  <span className='relative z-10 flex items-center gap-2'>
                    Post to
                    <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                    </svg>
                  </span>
                  <div className='-translate-x-full absolute inset-0 bg-white/10 transition-transform duration-500 group-hover:translate-x-full'></div>
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
