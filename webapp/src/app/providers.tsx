'use client';

import { SessionProvider } from 'next-auth/react';
import '../app/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
} 