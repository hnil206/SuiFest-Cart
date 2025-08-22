'use client';

import AvailableCard from '@/components/AvailableCard';
import { CardPreview } from '@/components/CardPreview';
import LoginButton from '@/components/auth/LoginButton';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useRef, useState } from 'react';
import { toast } from 'sonner';
import CardContext from '../store/card-providers';

const PreviewPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = useContext(CardContext);
  const { state } = context;
  const displayName = searchParams?.get('name') || session?.user?.name || 'Your Name';
  const displayUsername = searchParams?.get('username') || session?.username || 'username';
  const processedSessionImage = session?.user?.image ? session.user.image.replace('_normal', '') : null;

  const displayAvatar = searchParams?.get('avatar') || processedSessionImage || 'https://pbs.twimg.com/150';
  const template = (searchParams?.get('template') as 'navy' | 'purple' | 'brown') || 'navy';
  const [shareLink, setShareLink] = useState('');
  const captureRef = useRef<HTMLDivElement>(null);

  const handleCapture = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const formData = new FormData();
      const file = new File([blob], 'suifest-card.png', { type: 'image/png' });
      formData.append('file', file);

      try {
        const uploadResponse = await fetch('/api/save-image', {
          method: 'POST',
          body: formData,
        });

        const result = await uploadResponse.json();

        if (result.success) {
          const baseUrl = process.env.VERCEL_BLOB_URL;
          const imageId = result.filename.replace(/\.(png|jpg|jpeg|webp)$/i, '');
          const newShareLink = `${baseUrl}/sui-card/${imageId}`;

          setShareLink(newShareLink);

          const twitterShareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(newShareLink)}`;
          router.push(twitterShareLink);
          return newShareLink;
        }
      } catch (error) {
        toast.error('Failed to save image');
      }
    }

    return null;
  };

  // Check if user is logged in
  const isLoggedIn = status === 'authenticated' && session;

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
        {isLoggedIn ? (
          <Button
            className='flex transform items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-black text-lg shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:shadow-xl'
            onClick={handleCapture}
          >
            Share on
            <img src='/x-logo.svg' alt='' className='h-5 w-5 text-black' />
          </Button>
        ) : (
          <div className='flex flex-col items-center gap-4'>
            <p className='text-center text-red-400'>Please sign in to share your SuiFest card</p>
            <LoginButton />
          </div>
        )}
        {/* {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                className='flex transform items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-black text-lg shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:shadow-xl'
                onClick={async (e) => {
                e.preventDefault();
                const isAuthenticated = await ensureAuthenticated();
                if (isAuthenticated) {
                  const success = await handleCapture();
                  if (success) {
                    setIsModalOpen(true);
                  }
                }
              }}
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
                <div className='relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800'>
                  {isImageLoading ? (
                    <div className='flex h-[400px] w-full flex-col items-center justify-center space-y-4 p-4'>
                      <Skeleton className='h-full w-full' />
                      <p className='text-gray-400 text-sm'>Generating your card preview...</p>
                    </div>
                  ) : image ? (
                    <img src={image} alt='Your SuiFest card' className='h-auto max-h-[400px] w-full object-contain' />
                  ) : null}
                </div>

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
                    className='group relative overflow-hidden bg-gradient-to-r from-twitter to-blue-500 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-twitter/90 hover:to-blue-500/90 hover:shadow-xl focus:ring-2 focus:ring-twitter/30 disabled:cursor-not-allowed disabled:opacity-50'
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
        ) : (
          <div className='flex flex-col items-center gap-4'>
            <p className='text-center text-red-400'>Please sign in to share your SuiFest card</p>
            <LoginButton />
          </div>
        )} */}
      </div>
    </div>
  );
};
export default PreviewPage;
