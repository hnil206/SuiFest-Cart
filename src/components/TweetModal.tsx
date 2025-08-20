import React from 'react';

type TweetModalProps = {
  imgSrc: string;
  isOpen: boolean;
  text: string;
  onChangeText: (v: string) => void;
  onTweet: () => void;
  onClose: () => void;
};

export default function TweetModal({ imgSrc, isOpen, text, onChangeText, onTweet, onClose }: TweetModalProps) {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative w-full max-w-lg rounded-lg bg-white p-4 shadow-lg'>
        <h2 className='mb-4 font-semibold text-xl'>Tweet Screenshot</h2>
        <img src={imgSrc} alt='Screenshot' className='w-full rounded' />
        <input
          type='text'
          placeholder='Enter tweet text'
          className='w-full rounded border p-2'
          onChange={(e) => onChangeText(e.target.value)}
          value={text}
        />
        <div className='mt-4 flex gap-3'>
          <button onClick={onTweet} className='rounded bg-blue-500 px-4 py-2 text-white'>
            Tweet
          </button>
          <button onClick={onClose} className='rounded bg-gray-200 px-4 py-2 text-gray-800'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
