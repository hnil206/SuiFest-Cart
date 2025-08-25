'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

interface CardProps {
  name: string;
  username: string;
  avatarUrl?: string | null;
  template?: 'navy' | 'purple' | 'brown';
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
}

const TEMPLATE_BG: Record<NonNullable<CardProps['template']>, string> = {
  navy: '#020b16',
  purple: '#120718',
  brown: '#1a130a',
};

export const CardPreview = ({ name, username, avatarUrl, className, template = 'navy' }: CardProps) => {
  const { data: session, status } = useSession();
  const bg = TEMPLATE_BG[template];

  // Check if user is logged in and has avatar
  const isLoggedIn = status === 'authenticated' && session?.user;
  const displayAvatar = isLoggedIn && avatarUrl;

  return (
    <div
      className={`relative flex h-[783px] w-full flex-col justify-between overflow-hidden text-white ${className || ''}`}
      style={{ backgroundColor: bg }}
    >
      <div className='p-3 sm:p-6 lg:p-8'>
        <h1 className='font-semibold text-2xl leading-tight sm:text-2xl lg:text-4xl'>{name}</h1>
        <p className='mt-1 text-white/60 text-xs sm:mt-2 sm:text-base lg:text-lg'>@{username}</p>
      </div>
      <div className='flex items-center justify-center px-3 py-2 sm:px-6 sm:py-4 lg:px-8 lg:py-6'>
        <div>
          <div
            className={`relative flex h-[140px] w-[140px] items-center justify-center overflow-hidden rounded-lg bg-neutral-300 text-black sm:h-[300px] sm:w-[300px] lg:h-[345px] lg:w-[345px]`}
          >
            {displayAvatar ? (
              <Image
                src={avatarUrl}
                alt='Profile'
                fill
                className='object-cover'
                sizes='(max-width: 640px) 280px, (max-width: 1024px) 400px, 500px'
                priority
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-orange-400'>
                <Image
                  src='/logo-sui.png'
                  alt='Sui Logo'
                  width={96}
                  height={28}
                  className=' h-auto max-w-[60%] object-contain'
                  priority
                />
              </div>
            )}
          </div>
          <div className='bg-[#7a394d] px-2 py-1 text-center text-xs sm:text-sm lg:text-base'>@{username}</div>
        </div>
      </div>
      <div className='flex justify-end p-2 text-xs sm:p-3 sm:text-lg lg:p-4 lg:text-3xl'>sui.io/suifest</div>
    </div>
  );
};

export const Card = CardPreview;
