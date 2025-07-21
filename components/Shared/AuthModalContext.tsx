'use client';

import React, { createContext, useContext, useRef } from 'react';
import { SignInButton } from '@clerk/nextjs';

interface AuthModalContextType {
  open: () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  open: () => {},
});

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const open = () => {
    buttonRef.current?.click();
  };

  return (
    <AuthModalContext.Provider value={{ open }}>
      {/* Hidden SignInButton to trigger modal */}
      <div style={{ display: 'none' }}>
        <SignInButton mode="modal">
          <button ref={buttonRef} type="button" />
        </SignInButton>
      </div>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext); 