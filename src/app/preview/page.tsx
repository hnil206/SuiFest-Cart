'use client';

import { CardPreview } from '@/components/CardPreview';
import { Input } from '@/components/Input';
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
import { useEffect, useRef, useState } from 'react';

const PreviewPage = () => {
  const { data: session } = useSession();
  const displayName = session?.user?.name || 'Your Name';
  const displayUsername = session?.username || 'username';
  const displayAvatar = session?.user?.image || 'https://pbs.twimg.com/150';

  const router = useRouter();
  const searchParams = useSearchParams();
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
    window.location.href = getAuthUrl();
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
        <div className='flex min-h-screen w-full bg-black px-6 py-10 text-white' ref={captureRef}>
          <CardPreview
            name={displayName}
            username={displayUsername.startsWith('@') ? displayUsername.slice(1) : displayUsername}
            avatarUrl={displayAvatar}
            template='navy'
          />
        </div>
        <div className='flex items-center justify-center'>
          <h2>Share your newly generated SuiFest Card</h2>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2' onClick={handleCapture}>
              Share on X
            </Button>
          </DialogTrigger>

          <DialogContent className='fixed inset-0 z-50 flex items-center justify-center sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
            </DialogHeader>
            <div className='flex items-center gap-2'>
              <div className='grid flex-1 gap-2'>
                <Label htmlFor='link' className='sr-only'>
                  Link
                </Label>
                {image && (
                  <img src={image} alt='screenshot' className='h-auto max-h-[300px] w-full rounded-md object-contain' />
                )}
                <Input
                  label='Link'
                  id='link'
                  placeholder='https://ui.shadcn.com/docs/installation'
                  value={text || ''}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className='sm:justify-start'>
              <div className='flex gap-2'>
                <DialogClose asChild>
                  <Button type='button' variant='secondary'>
                    Close
                  </Button>
                </DialogClose>
                <Button onClick={tweetScreenshot}>Tweet</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default PreviewPage;
