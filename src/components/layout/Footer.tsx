export default function Footer() {
  const getCurrent = new Date();
  const year = getCurrent.getFullYear();

  return (
    <footer className='mt-auto w-full border-white/10 border-t bg-black text-white'>
      <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-12 items-center justify-between text-sm'>
          <div className='truncate'>
            <div className='text-xl'>SuiFest Card Generator App</div>
          </div>
          <div className='shrink-0 text-xl'>{year}</div>
        </div>
      </div>
    </footer>
  );
}
