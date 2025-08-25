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
      <div className='flex h-full items-center justify-between px-5 py-6 text-base lg:px-28 lg:py-9 lg:text-xl'>
        <div>SuiFest Card Generator App</div>
        <div>{year}</div>
      </div>
    </footer>
  );
}
