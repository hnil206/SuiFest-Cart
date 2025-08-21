'use client';
import React, { createContext, type PropsWithChildren, useEffect, useState } from 'react';

const defaultCardData = {
  name: '',
  username: '',
  image: '',
};

type CardContextType = {
  state: typeof defaultCardData;
  setState: React.Dispatch<React.SetStateAction<typeof defaultCardData>>;
};

export const CardContext = createContext<CardContextType>({
  state: defaultCardData,
  setState: () => {},
});
// Provide Context
export const CardProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState(() => {
    // Try to restore from sessionStorage on initialization
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('cardState');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return { name: '', username: '', image: '' };
        }
      }
    }
    return { name: '', username: '', image: '' };
  });

  // Auto-save to sessionStorage whenever state changes
  useEffect(() => {
    if (state.name || state.username || state.image) {
      sessionStorage.setItem('cardState', JSON.stringify(state));
    }
  }, [state]);

  return <CardContext.Provider value={{ state, setState }}>{children}</CardContext.Provider>;
};

export default CardContext;
