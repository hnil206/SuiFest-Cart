import Image from 'next/image';
import Link from 'next/link';
import LoginButton from '../auth/LoginButton';

export default function Header() {
  return (
    <header className='w-full bg-black text-white'>
      <nav className='flex items-center justify-between px-5 py-4 lg:px-28 lg:py-7' aria-label='Main'>
        <div className='flex items-center gap-3'>
          <Link href='/' className='flex items-center gap-3' aria-label='Sui Home'>
            <Image src='/logo-sui.png' alt='Sui' width={96} height={40} className='h-6 w-auto lg:h-10' priority />
          </Link>

          <div className='mx-1 h-6 w-px bg-white/40 sm:mx-2' aria-hidden='true' />

          <Image src='/logo-walrus.png' alt='Walrus' width={140} height={40} className='h-6 w-auto lg:h-10' priority />
        </div>

        <LoginButton />
      </nav>
    </header>
  );
}
