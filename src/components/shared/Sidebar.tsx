'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Smile, ClipboardList, MessageCircle, Bot, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { type UserProfile } from '@/lib/types';
import { Button } from '../ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/mood', label: 'Mood Tracking', icon: Smile },
  { href: '/therapy', label: 'AI Therapy', icon: Bot },
  { href: '/activities', label: 'Journal', icon: ClipboardList },
  { href: '/chat', label: 'Support Circle', icon: MessageCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "userProfiles", user.uid);
  }, [firestore, user]);
  
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const getFirstName = () => {
    if (userProfile) return userProfile.firstName;
    if (user && user.displayName) return user.displayName.split(' ')[0];
    return "User";
  };
  
  const getInitials = () => {
    if (userProfile) return `${userProfile.firstName?.[0] || ''}${userProfile.lastName?.[0] || ''}`;
    if (user && user.displayName) return user.displayName.split(' ').map(n => n[0]).join('');
    return "U";
  }

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen p-4 bg-card border-r fixed top-0 left-0">
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
             <div className="flex items-center justify-between border-t pt-4">
                <div className='flex items-center gap-3'>
                  <Avatar className="h-10 w-10">
                    {user?.photoURL ? (
                        <AvatarImage src={user.photoURL} alt="User Avatar" />
                    ) : (
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                      <p className="font-semibold text-sm">{getFirstName()}</p>
                      <p className="text-xs text-muted-foreground">Student</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="w-5 h-5 text-muted-foreground" />
                </Button>
            </div>
        </div>
    </aside>
  );
}
