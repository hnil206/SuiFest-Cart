'use client';

import { useXUser } from '@/hooks/useXUser';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function LoginButton() {
  const { data: session, status } = useSession();
  console.log(session?.twitterId, 'sssss');
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const userId = session?.twitterId;
  const { user, loading, error: userError, username } = useXUser(userId || null);
  console.log(username, 'username');
  if (status === 'loading') {
    return <div className='px-4 py-2 text-gray-600'>Loading...</div>;
  }

  if (error) {
    return (
      <div className='rounded-md bg-red-50 px-4 py-2 text-red-600'>
        <p className='font-medium text-sm'>Authentication Error:</p>
        <p className='text-xs'>{error}</p>
        <button onClick={() => signIn('twitter')} className='mt-2 text-xs underline hover:no-underline'>
          Try again
        </button>
      </div>
    );
  }

  if (session) {
    return (
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          {session.user?.image && (
            <img src={session.user.image} alt={session.user.name || 'User'} className='h-8 w-8 rounded-full' />
          )}
          <div>ID: {session?.twitterId}</div>
          <span className='font-medium text-sm'>Welcome, {session.user?.name || 'User'}!</span>
        </div>
        <button
          onClick={() => signOut()}
          className='rounded-md bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('twitter')}
      className='flex items-center gap-2 rounded-md bg-black px-4 py-2 font-medium text-sm text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
    >
      <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
      </svg>
      Sign in with X
    </button>
  );
}
