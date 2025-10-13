
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Loader2, ShieldOff } from "lucide-react";
import { useEffect } from "react";

// Designated super admin email for failsafe access
const SUPER_ADMIN_EMAIL = 'victorehebhoria@gmail.com';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "userProfiles", user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const isLoading = isUserLoading || isProfileLoading;
  
  // Combine checks for moderator status
  const isModerator = userProfile?.isModerator === true || user?.email === SUPER_ADMIN_EMAIL;

  useEffect(() => {
    // If loading is finished and the user is definitively not a moderator, redirect.
    if (!isLoading && !isModerator) {
      router.push('/dashboard');
    }
  }, [isLoading, isModerator, router]);


  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // This part will only be reached if loading is complete.
  // We double-check the moderator status to prevent flicker.
  if (!isModerator) {
     return (
      <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 text-center">
        <ShieldOff className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">
          You do not have permission to view this page. Redirecting...
        </p>
      </div>
    );
  }

  // Render the admin dashboard for authorized users.
  return (
    <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage users and application settings.</p>
      </div>
      <AdminDashboard />
    </div>
  );
}
