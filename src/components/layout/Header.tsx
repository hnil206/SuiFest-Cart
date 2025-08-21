import Image from 'next/image';
import Link from 'next/link';
import LoginButton from '../auth/LoginButton';

export default function Header() {
  return (
    <header className='w-full bg-black text-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <nav className='flex h-14 items-center justify-between' aria-label='Main'>
          <div className='flex items-center gap-3'>
            <Link href='/' className='flex items-center gap-3' aria-label='Sui Home'>
              <Image src='/logo-sui.png' alt='Sui' width={96} height={28} className='h-7 w-auto' priority />
            </Link>

            <div className='mx-1 h-6 w-px bg-white/40 sm:mx-2' aria-hidden='true' />

            <Image src='/logo-walrus.png' alt='Walrus' width={140} height={28} className='h-7 w-auto' priority />
          </div>

          <LoginButton />
        </nav>
      </div>
    </header>
  );
}
