export default function Footer() {
  const getCurrent = new Date();
  const year = getCurrent.getFullYear();

  return (
    <footer
      className='mx-auto mt-auto w-full border-white/10 border-t text-white'
      style={{
        background: 'linear-gradient(to right, #220132, #001413, #230e01, #191700)',
      }}
    >
      <div className='flex h-full items-center justify-between px-4 py-9 text-xl sm:px-6 lg:px-28'>
        <div>SuiFest Card Generator App</div>
        <div>{year}</div>
      </div>
    </footer>
  );
}
