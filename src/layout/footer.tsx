'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

const Footer = () => {
  const pathname = usePathname();
  return <footer className='container pt-18 pb-12'></footer>;
};

export default Footer;
