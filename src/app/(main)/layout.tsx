'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import BottomNavBar from '@/components/shared/BottomNavBar';
import Sidebar from '@/components/shared/Sidebar';
import { Loader2 } from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 md:pb-0 pb-28">{children}</main>
      <BottomNavBar />
    </div>
  );
}
