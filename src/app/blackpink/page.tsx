'use client';

import { useSession } from 'next-auth/react';

interface Token {
  accessToken: string;
  refreshToken: string;
  sub: string;
}

export default function Blackpink() {
  const { data: session } = useSession();
  console.log(session?.twitterId, 'session');
  return (
    <div className='mx-auto max-w-2xl p-6'>
      <h1 className='mb-6 font-bold text-3xl'>Blackpink</h1>
    </div>
  );
}
