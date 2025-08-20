'use client';
import Image from 'next/image';
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
      className='relative flex h-[668px] w-[668px] flex-col overflow-hidden rounded-[28px] text-white'
      style={{ backgroundColor: bg }}
    >
      <div className='p-8'>
        <h1 className='font-semibold text-[40px] leading-tight'>{name}</h1>
        <p className='mt-2 text-lg text-white/60'>@{username}</p>
      </div>
      <div className='flex flex-1 items-center justify-center'>
        <div className='relative flex h-[345px] w-[345px] items-center justify-center rounded-md bg-neutral-300 text-black '>
          {avatarUrl ? (
            <Image src={avatarUrl} alt='Profile' fill className='h-full w-full object-fill' />
          ) : (
            <span className='font-medium text-sm'>Profile Picture</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const Card = CardPreview;
