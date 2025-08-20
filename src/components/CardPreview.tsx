'use client';
import React from 'react';

interface CardProps {
  name: string;
  username: string;
  avatarUrl?: string | null;
  template?: 'navy' | 'purple' | 'brown';
}

const TEMPLATE_BG: Record<NonNullable<CardProps['template']>, string> = {
  navy: '#020b16',
  purple: '#120718',
  brown: '#1a130a',
};

export const CardPreview = ({ name, username, avatarUrl, template = 'navy' }: CardProps) => {
  const bg = TEMPLATE_BG[template];
  return (
    <div
      className='relative h-[636px] w-[636px] overflow-hidden rounded-[28px] text-white'
      style={{ backgroundColor: bg }}
    >
      <div className='p-8'>
        <h1 className='font-semibold text-[40px] leading-tight'>{name}</h1>
        <p className='mt-2 text-lg text-white/60'>@{username}</p>
      </div>

      <div className='-translate-x-1/2 absolute top-[240px] left-1/2 flex h-[345px] w-[345px] items-center justify-center rounded-md bg-neutral-300 text-black'>
        {avatarUrl ? (
          <img src={avatarUrl} alt='Profile' className='h-full w-full object-cover' />
        ) : (
          <span className='font-medium text-sm'>Profile Picture</span>
        )}
      </div>
    </div>
  );
};

export const Card = CardPreview;
