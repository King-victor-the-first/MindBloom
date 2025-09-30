'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Smile, ClipboardList, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import SiriWave from './SiriWave';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/mood', label: 'Mood', icon: Smile },
  { href: '/therapy', label: 'Therapy', icon: 'siri' },
  { href: '/activities', label: 'Activities', icon: ClipboardList },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/80 shadow-[0_-1px_4px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          if (item.icon === 'siri') {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center w-16 h-16 -translate-y-4 bg-card rounded-full shadow-lg border-2 border-primary"
              >
                <SiriWave isActive={isActive} />
              </Link>
            );
          }

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-16 transition-colors duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
