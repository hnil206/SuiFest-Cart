'use client';

import { CardControlPanel, type TemplateKey } from '@/components/CardControlPanel';
import { CardPreview } from '@/components/CardPreview';
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

  return (
    <div className='min-h-screen w-full bg-black px-6 py-10 text-white'>
      <div className='mx-auto max-w-[1200px]'>
        <div className='grid gap-8 md:grid-cols-[1fr_420px]'>
          {/* Preview */}
          <div className='flex items-start justify-center md:justify-start'>
            <CardPreview name={fullName} username={handle} avatarUrl={avatar} template={template} />
          </div>

          {/* Control Panel */}
          <CardControlPanel
            fullName={fullName}
            handle={handle}
            avatar={avatar}
            template={template}
            onFullNameChange={setFullName}
            onHandleChange={setHandle}
            onAvatarChange={setAvatar}
            onTemplateChange={setTemplate}
            onGenerate={onGenerate}
          />
        </div>
      </div>
    </div>
  );
}
