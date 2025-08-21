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
      className={`relative h-[668px] w-[600px] overflow-hidden rounded-r-[32px] ${
        isLight ? 'bg-gray-100' : 'bg-gray-900'
      } ${className}`}
    >
      {/* Header section */}
      <div className='px-8 pt-6 pb-4'>
        <div className='flex items-start justify-between pt-5'>
          <div>
            <p className={`mb-1 font-medium text-md ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>Date</p>
          </div>

          <div className='text-right'>
            <p className={`mb-1 font-medium text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>Destination</p>
          </div>
        </div>
        {/* Divider line */}
        <div className={`mt-4 h-px w-full ${isLight ? 'bg-gray-300' : 'bg-gray-600'}`}></div>
        <div className='flex justify-between pt-4'>
          <div className={`font-bold text-2xl leading-tight ${isLight ? 'text-black' : 'text-white'}`}>{date}</div>

          <div className={`font-bold text-2xl ${isLight ? 'text-black' : 'text-white'}`}>{destination}</div>
        </div>
      </div>

      {/* SuiFest logo */}
      <div className='absolute right-8 bottom-8 left-8'>
        <div className={isLight ? 'text-black' : 'text-white'}>
          <span className='font-black text-9xl tracking-tight'>SuiFest</span>
        </div>
      </div>
    </div>
  );
};

export default AvailableCard;
