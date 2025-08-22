'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
export default function LoginButton() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/clear-session', {
        method: 'POST',
        credentials: 'include',
      });
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error during sign out:', error);
      await signOut({ callbackUrl: '/' });
    }
  };
  const handleSignIn = async () => {
    try {
      await signIn('twitter', {
        callbackUrl: '/',
      });
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

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
        <button
          onClick={handleSignOut}
          className='rounded-md bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700'
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className='rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700'
    >
      Sign in with X
    </button>
  );
}
