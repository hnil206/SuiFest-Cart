'use client';
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
  const bg = TEMPLATE_BG[template];
  return (
    <div
      className={`!w-[335px] sm:!w-[420px] md:!w-[520px] lg:!w-[668px] relative flex aspect-square flex-col overflow-hidden text-white ${className || ''}`}
      style={{ backgroundColor: bg }}
    >
      <div className='p-6 sm:p-7 md:p-8'>
        <h1 className='font-semibold text-[28px] leading-tight sm:text-[34px] md:text-[40px]'>{name}</h1>
        <p className='mt-2 text-base text-white/60 sm:text-lg'>@{username}</p>
      </div>
      <div className='flex flex-1 items-center justify-center'>
        <div>
          <div className='relative flex h-32 w-32 items-center justify-center overflow-hidden bg-neutral-300 text-black sm:h-72 sm:w-72 md:h-[300px] md:w-[300px] lg:h-[345px] lg:w-[345px]'>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt='Profile'
                crossOrigin='anonymous'
                className='absolute inset-0 h-full w-full object-cover'
              />
            ) : (
              <span className='font-medium text-sm'>Profile Picture</span>
            )}
          </div>
          <div className='bg-[#7a394d] px-2 py-1 text-xs sm:text-sm'>@{username}</div>
        </div>
      </div>
      <div className='flex justify-end pr-4 pb-4 text-2xl sm:text-[28px] md:text-3xl'>sui.io/suifest</div>
    </div>
  );
};

export const Card = CardPreview;
