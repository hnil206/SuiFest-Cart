import { cn } from '@/lib/utils';
import { useState } from 'react';

interface InputProps {
  label: string;
  placeholder: string;
  required?: boolean;
  id?: string;
  name?: string;
  type?: string;
  className?: string;
}

export function Input({ label, placeholder, required, id, name, type, className }: InputProps) {
  const [hasValue, setHasValue] = useState(false);
  const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className='group relative w-full'>
      <input
        type={type || 'text'}
        id={inputId}
        name={name}
        placeholder={placeholder}
        required={required}
        onChange={(e) => setHasValue(e.target.value !== '')}
        className={cn(
          'h-12 w-full rounded-full border bg-white/5 px-5 text-white outline-none transition-all placeholder:text-white/40 disabled:opacity-50',
          hasValue ? 'border-transparent' : 'border-white/15 focus:border-white/40',
          className
        )}
      />
      <label
        htmlFor={inputId}
        className='-top-3 pointer-events-none absolute left-2 z-10 rounded px-2 py-0.5 text-white text-xs'
      >
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
    </div>
  );
}
