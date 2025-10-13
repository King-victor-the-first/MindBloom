
"use client";

import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, doc, query, where } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Loader2, Trash2, CheckCircle, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const SUPER_ADMIN_EMAIL = 'victorehebhoria@gmail.com';

export default function AdminDashboard() {
  const firestore = useFirestore();
  const { user: authUser } = useUser();
  const { toast } = useToast();

  const isSuperAdmin = authUser?.email === SUPER_ADMIN_EMAIL;

  const usersQuery = useMemoFirebase(() => {
    if (!authUser) return null;
    // Super admin can see all users, others cannot.
    // This query is now just for initial load, but rules secure it.
    // The rules will enforce that only a moderator can read this collection.
    return query(collection(firestore, "userProfiles"));
  }, [firestore, authUser]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const toggleModerator = (user: UserProfile) => {
    // Prevent super admin from being demoted by anyone
    if (user.email === SUPER_ADMIN_EMAIL && authUser?.email !== SUPER_ADMIN_EMAIL) {
        toast({
            title: "Action Forbidden",
            description: "Cannot change the status of the super admin.",
            variant: "destructive",
        });
        return;
    }
    const userDocRef = doc(firestore, "userProfiles", user.id);
    const newStatus = !user.isModerator;
    updateDocumentNonBlocking(userDocRef, { isModerator: newStatus });
    toast({
      title: "User Updated",
      description: `${user.firstName} is ${newStatus ? 'now' : 'no longer'} a moderator.`,
    });
  };

  const deleteUser = (user: UserProfile) => {
    if (user.email === SUPER_ADMIN_EMAIL) {
        toast({
            title: "Action Forbidden",
            description: "The super admin cannot be deleted.",
            variant: "destructive",
        });
        return;
    }
    const userDocRef = doc(firestore, "userProfiles", user.id);
    deleteDocumentNonBlocking(userDocRef);
    toast({
      title: "User Deleted",
      description: `${user.firstName}'s profile has been deleted.`,
      variant: 'destructive'
    });
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.isModerator ? (
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Moderator
                    </Badge>
                  ) : (
                    <Badge variant="outline">Student</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleModerator(user)}
                        className="mr-2"
                        disabled={user.email === SUPER_ADMIN_EMAIL && !isSuperAdmin}
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        {user.isModerator ? "Remove Mod" : "Make Mod"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="sm" disabled={user.email === SUPER_ADMIN_EMAIL}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user's
                            profile and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteUser(user)}>
                            Delete User
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
