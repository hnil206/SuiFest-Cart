'use client';

import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className='sticky top-0 z-50 w-full p-6 backdrop-blur-md '>
      <div className='container mx-auto flex items-center px-6 py-6 md:py-6'>
        <Image src='/Sui-logo.png' alt='Sui Walrus Logo' width={76} height={40} className='h-10 w-auto' />
        <div className='h-5 w-px bg-white/50' />
        <span className='font-semibold text-5xl text-white'>Walrus</span>
      </div>
    </nav>
  );
};

export default Navbar;
