
"use client";

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, query } from "firebase/firestore";
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


export default function AdminDashboard() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const usersQuery = useMemoFirebase(() => 
    query(collection(firestore, "userProfiles"))
  , [firestore]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const toggleModerator = (user: UserProfile) => {
    const userDocRef = doc(firestore, "userProfiles", user.id);
    const newStatus = !user.isModerator;
    updateDocumentNonBlocking(userDocRef, { isModerator: newStatus });
    toast({
      title: "User Updated",
      description: `${user.firstName} is ${newStatus ? 'now' : 'no longer'} a moderator.`,
    });
  };

  const deleteUser = (user: UserProfile) => {
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
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        {user.isModerator ? "Remove Mod" : "Make Mod"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="sm">
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
