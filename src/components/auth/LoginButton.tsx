'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function LoginButton() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const username = session?.username;
  console.log(session?.twitterId, 'sssss');
  console.log(username, 'username');
  if (status === 'loading') {
    return <div className='px-4 py-2 text-gray-600'>Loading...</div>;
  }
  console.log(session?.user?.image, 'session');
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
        <button
          onClick={() => signOut()}
          className='rounded-md bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700'
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('twitter')}
      className='rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700'
    >
      Sign in with X
    </button>
  );
}
