'use client';

import { Input } from '@/components/Input';
import { Button } from '@/components/ui/button';
import React from 'react';

export type TemplateKey = 'navy' | 'purple' | 'brown';

const templates: { key: TemplateKey; color: string }[] = [
  { key: 'navy', color: '#020b16' },
  { key: 'purple', color: '#120718' },
  { key: 'brown', color: '#1a130a' },
];

interface CardControlPanelProps {
  fullName: string;
  handle: string;
  avatar: string | null;
  template: TemplateKey;
  onFullNameChange: (value: string) => void;
  onHandleChange: (value: string) => void;
  onAvatarChange: (dataUrl: string | null) => void;
  onTemplateChange: (tpl: TemplateKey) => void;
  onGenerate: () => void;
}

export function CardControlPanel(props: CardControlPanelProps) {
  const {
    fullName,
    handle,
    avatar,
    template,
    onFullNameChange,
    onHandleChange,
    onAvatarChange,
    onTemplateChange,
    onGenerate,
  } = props;

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const onPickFile = () => fileInputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onAvatarChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className='h-full w-full max-w-[484px] rounded-3xl border border-white/10 bg-[#4B4B4B33] p-8'>
      <h2 className='font-semibold text-2xl leading-tight lg:text-4xl'>Create your own #SuiFest2025 Card</h2>

      <div className='mt-12'>
        <div>
          <p className='mb-8 font-medium text-white text-xl'>Display information</p>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Input
                id='full-name'
                label='Full Name'
                placeholder='eg: Jerome Krel'
                required
                value={fullName}
                onChange={(e) => onFullNameChange(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Input
                id='handle'
                label='X handle'
                placeholder='eg: hagen.web3'
                required
                value={handle}
                onChange={(e) => onHandleChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className='pt-8'>
          <div className='flex items-center gap-3'>
            <Input
              id='profile-picture'
              label='Profile Picture'
              placeholder='No file chosen'
              type='file'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => onAvatarChange(String(reader.result));
                reader.readAsDataURL(file);
              }}
            />
          </div>
        </div>

        <div className='pt-12'>
          <p className='font-medium text-white text-xl'>Card templates</p>
          <div className='flex gap-4 pt-8'>
            {templates.map((t) => (
              <button
                key={t.key}
                type='button'
                onClick={() => onTemplateChange(t.key)}
                className={
                  'h-20 w-20 rounded-2xl border shadow-inner transition lg:h-32 lg:w-32 ' +
                  (template === t.key ? 'ring-2 ring-white' : 'border-white/10 hover:border-white/30')
                }
                style={{ backgroundColor: t.color }}
                aria-label={`Template ${t.key}`}
              />
            ))}
          </div>
        </div>

        <div className='flex justify-end pt-13'>
          <Button onClick={onGenerate} className='h-12 w-full rounded-2xl bg-white px-6 text-black md:w-auto'>
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}
