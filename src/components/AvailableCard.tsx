'use client';

interface AvailableCardProps {
  date?: string;
  destination?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export const AvailableCard = ({
  date = 'October 2nd, 2025',
  destination = 'Singapore',
  variant = 'light',
  className = '',
}: AvailableCardProps) => {
  const isLight = variant === 'light';

  return (
    <div
      className={`relative aspect-[668/600] w-[320px] overflow-hidden rounded-[24px] sm:w-[420px] md:w-[520px] md:rounded-r-[32px] md:rounded-l-none lg:w-[600px] ${
        isLight ? 'bg-gray-100' : 'bg-gray-900'
      } ${className}`}
    >
      {/* Header section */}
      <div className='px-5 pt-5 pb-4 sm:px-6 md:px-8 md:pt-6'>
        <div className='flex items-start justify-between pt-5'>
          <div>
            <p className={`mb-1 font-medium text-sm sm:text-md ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>Date</p>
          </div>

          <div className='text-right'>
            <p className={`mb-1 font-medium text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>Destination</p>
          </div>
        </div>
        {/* Divider line */}
        <div className={`mt-4 h-px w-full ${isLight ? 'bg-gray-300' : 'bg-gray-600'}`}></div>
        <div className='flex justify-between pt-4'>
          <div className={`font-bold text-xl leading-tight sm:text-2xl ${isLight ? 'text-black' : 'text-white'}`}>
            {date}
          </div>

          <div className={`font-bold text-xl sm:text-2xl ${isLight ? 'text-black' : 'text-white'}`}>{destination}</div>
        </div>
      </div>

      {/* SuiFest logo */}
      <div className='absolute right-6 bottom-6 left-6 sm:right-8 sm:bottom-8 sm:left-8'>
        <div className={isLight ? 'text-black' : 'text-white'}>
          <span className='font-black text-6xl tracking-tight sm:text-8xl lg:text-9xl'>SuiFest</span>
        </div>
      </div>
    </div>
  );
};

export default AvailableCard;
