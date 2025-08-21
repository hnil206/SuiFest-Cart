'use client';

import { CardControlPanel, type TemplateKey } from '@/components/CardControlPanel';
import { CardPreview } from '@/components/CardPreview';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import CardContext from './store/card-providers';

export default function HomePage() {
  const { data: session } = useSession();
  const context = useContext(CardContext);
  const { state, setState } = context;
  const router = useRouter();
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

  // Process session image URL to remove _large suffix
  const processedSessionImage = session?.user?.image ? session.user.image.replace('_normal', '') : null;

  const displayAvatar = avatar || processedSessionImage || 'https://pbs.twimg.com/150';

  const handleGenerate = () => {
    console.log(displayAvatar, '=============================');
    setState({ image: displayAvatar, name: displayName, username: displayUsername });
    router.push('/preview');
    console.log('Generating card with:', { displayName, displayUsername, displayAvatar, template });
  };

  return (
    <div className='min-h-screen w-full bg-black px-4 py-10 text-white md:px-6'>
      <div className='mx-auto w-full max-w-[335px] md:max-w-[1200px]'>
        <div className='grid gap-6 md:grid-cols-[1fr_420px] md:gap-8'>
          {/* Preview */}
          <div className='flex items-start justify-center md:justify-start'>
            <CardPreview
              name={displayName}
              username={displayUsername.startsWith('@') ? displayUsername.slice(1) : displayUsername}
              avatarUrl={displayAvatar}
              template={template}
              className='w-full max-w-[668px] rounded-[28px]'
            />
          </div>

          {/* Control Panel */}
          <CardControlPanel
            fullName={fullName}
            handle={handle}
            avatar={displayAvatar}
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
