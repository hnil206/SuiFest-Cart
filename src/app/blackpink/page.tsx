'use client';

import AvailableCard from '@/components/AvailableCard';
import type { TemplateKey } from '@/components/CardControlPanel';
import { getServerSession } from 'next-auth';
import React from 'react';

export default function Blackpink() {
  const [fullName, setFullName] = React.useState('Hagen Bui');
  const [handle, setHandle] = React.useState('hagen.web3');
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [template, setTemplate] = React.useState<TemplateKey>('navy');
  const onGenerate = () => {
    // TODO: integrate screenshot/export and share
    console.log('Generate card', { fullName, handle, template, hasAvatar: !!avatar });
  };
  const session = getServerSession();
  return (
    <div className='min-h-screen w-full bg-black px-6 py-10 text-white'>
      <AvailableCard date='October 2nd, 2025' destination='Singapore' variant='light' />
    </div>
  );
}
