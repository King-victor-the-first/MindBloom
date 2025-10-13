
'use client';

import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Loader2, ShieldOff } from "lucide-react";
import { useEffect, useState } from "react";

// Designated super admin email for failsafe access
const SUPER_ADMIN_EMAIL = 'victorehebhoria@gmail.com';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isUserLoading) {
      const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;
      if (isSuperAdmin) {
        setIsAuthorized(true);
      } else {
        router.push('/dashboard');
      }
      setIsChecking(false);
    }
  }, [isUserLoading, user, router]);


  if (isChecking || isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
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
