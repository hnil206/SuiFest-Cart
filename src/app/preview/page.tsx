'use client';

import AvailableCard from '@/components/AvailableCard';
import { CardPreview } from '@/components/CardPreview';
import LoginButton from '@/components/auth/LoginButton';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useRef } from 'react';
import { toast } from 'sonner';
import CardContext from '../store/card-providers';

const PreviewPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = useContext(CardContext);
  const { state } = context;
  const template = (searchParams?.get('template') as 'navy' | 'purple' | 'brown') || 'navy';
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
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
          const imageId = result.filename.replace(/\.(png|jpg|jpeg|webp)$/i, '');
          const newShareLink = `${baseUrl}/sui-card/${imageId}`;
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
      <div className='mx-auto w-full min-w-[320px] max-w-[916px] bg-black px-5 text-white lg:px-0'>
        <div className='flex w-full justify-center'>
          <div className='flex w-full rounded-r-[32px]' ref={captureRef}>
            <CardPreview
              className='w-full'
              name={state.name}
              username={state.username.startsWith('@') ? state.username.slice(1) : state.username}
              avatarUrl={state.image}
              template={template}
            />
            <AvailableCard />
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center px-5 pt-5 text-center font-bold text-white text-xl md:px-8 md:pt-8 lg:px-0 lg:pt-16 lg:text-4xl'>
        <h2>Share your newly generated SuiFest Card</h2>
      </div>
      <div className='flex w-full items-center justify-center px-5 py-6 lg:px-0 lg:py-12'>
        {isLoggedIn ? (
          <Button
            className='flex h-12 w-full flex-1 transform items-center justify-center gap-3 rounded-full bg-white px-5 py-4 font-semibold text-black text-lg shadow-lg hover:scale-105 hover:bg-gray-100 hover:shadow-xl md:w-auto md:flex-none'
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
      </div>
    </div>
  );
};
export default PreviewPage;
