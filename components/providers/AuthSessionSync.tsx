'use client';

import { loginWithGoogle } from '@/lib/userAccount';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Syncs NextAuth Google session into local app user storage. */
export function AuthSessionSync() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const synced = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.email || synced.current) return;

    synced.current = true;
    const user = session.user as { id?: string; name?: string | null; email?: string | null };
    void loginWithGoogle({
      email: user.email!,
      name: user.name || user.email!.split('@')[0],
      id: user.id,
    }).then(() => {
      const selectedLanguage = localStorage.getItem('selectedLanguage');
      router.replace(selectedLanguage ? `/map/${selectedLanguage}` : '/language-selection');
    });
  }, [session, status, router]);

  return null;
}
