'use client';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

interface ShadcnProviderProps {
  children: React.ReactNode;
}

export default function ShadcnProvider({ children }: ShadcnProviderProps) {
  return (
    <>
      {children}
      <Toaster />
      <Sonner />
    </>
  );
}
