'use client';

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "../shared/ThemeToggle";
import { useUser } from "@/firebase";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc, getFirestore } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { useMemoFirebase } from "@/firebase/provider";

export default function WelcomeHeader() {
  const { user } = useUser();
  const firestore = getFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "userProfiles", user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  const getFirstName = () => {
    if (userProfile) {
      return userProfile.firstName;
    }
    if (user && user.displayName) {
      return user.displayName.split(' ')[0];
    }
    return "User";
  };
  
  const getInitials = () => {
    if (userProfile) {
        return `${userProfile.firstName?.[0] || ''}${userProfile.lastName?.[0] || ''}`;
    }
    if (user && user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('');
    }
    return "U";
  }


  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-foreground">
          Good Morning, {getFirstName()}
        </h1>
        <p className="text-muted-foreground mt-1">
          Ready to start your day with mindfulness?
        </p>
      </div>
      <div className="flex items-center gap-4 md:hidden">
        <ThemeToggle />
        <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
          {user?.photoURL ? (
              <AvatarImage src={user.photoURL} alt="User Avatar" />
          ) : userAvatar && (
            <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />
          )}
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
