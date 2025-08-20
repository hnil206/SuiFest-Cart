'use client';

import { CardControlPanel, type TemplateKey } from '@/components/CardControlPanel';
import { CardPreview } from '@/components/CardPreview';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { data: session } = useSession();

  // State for card data
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateKey>('navy');

  // Initialize with session data when available
  useEffect(() => {
    if (session?.user?.name && fullName === '') {
      setFullName(session.user.name);
    }
    if (session?.username && handle === '') {
      setHandle(session.username);
    }
  }, [session, fullName, handle]);

  // Determine what to display in the card preview
  const displayName = fullName || session?.user?.name || 'Your Name';
  const displayUsername = handle || session?.username || 'username';

  const handleGenerate = () => {
    // Your generate logic here
    console.log('Generating card with:', { displayName, displayUsername, avatar, template });
  };

  return (
    <div className='min-h-screen w-full bg-black px-6 py-10 text-white'>
      <div className='mx-auto max-w-[1200px]'>
        <div className='grid gap-8 md:grid-cols-[1fr_420px]'>
          {/* Preview */}
          <div className='flex items-start justify-center md:justify-start'>
            <CardPreview
              name={displayName}
              username={displayUsername.startsWith('@') ? displayUsername.slice(1) : displayUsername}
              avatarUrl={avatar}
              template={template}
            />
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
            onGenerate={handleGenerate}
          />
        </div>
      </div>
    </div>
  );
}
