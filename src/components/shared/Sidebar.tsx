'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Smile, ClipboardList, MessageCircle, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/mood', label: 'Mood Tracking', icon: Smile },
  { href: '/therapy', label: 'AI Therapy', icon: Bot },
  { href: '/activities', label: 'Journal', icon: ClipboardList },
  { href: '/chat', label: 'Support Circle', icon: MessageCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen p-4 bg-card border-r">
        <div className="flex items-center justify-between">
            <Logo />
        </div>

        <nav className="flex flex-col mt-8 space-y-2 flex-1">
            {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
                <Link
                key={item.href}
                href={item.href}
                className={cn(
                    'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200',
                    isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-medium">{item.label}</span>
                </Link>
            );
            })}
        </nav>

        <div className="mt-auto space-y-4">
            <ThemeToggle />
             <div className="flex items-center gap-3 border-t pt-4">
                <Avatar className="h-10 w-10">
                {userAvatar && (
                    <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />
                )}
                <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-sm">Victor</p>
                    <p className="text-xs text-muted-foreground">Student</p>
                </div>
            </div>
        </div>
    </aside>
  );
}
