"use client";

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, query, orderBy } from "firebase/firestore";
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Pill, PlusCircle, Trash2, Loader2 } from "lucide-react";
import type { Medication } from "@/lib/types";
import AddMedicationSheet from './AddMedicationSheet';
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

// These variables are expected to be globally available in the Firebase Hosting environment.
declare var __app_id: string | undefined;

export default function MedicationReminders() {
  const { user } = useUser();
  const firestore = useFirestore();

  const medicationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    return query(
        collection(firestore, `artifacts/${appId}/users/${user.uid}/medications`),
        orderBy("time", "asc")
    );
  }, [user, firestore]);

  const { data: medications, isLoading } = useCollection<Medication>(medicationsQuery);

  const handleDelete = (medicationId: string) => {
    if (!user) return;
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const docRef = doc(firestore, `artifacts/${appId}/users/${user.uid}/medications`, medicationId);
    deleteDocumentNonBlocking(docRef);
  };
  
  return (
    <div>
       <h2 className="text-xl font-headline font-semibold mb-4">Medication Reminders</h2>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="w-5 h-5" />
                    Today's Reminders
                </CardTitle>
                <AddMedicationSheet />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : !medications || medications.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        <p className="mb-4">You haven't added any medication reminders yet.</p>
                        <AddMedicationSheet triggerButton />
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {medications.map((med) => (
                            <li key={med.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-muted rounded-full">
                                        <Pill className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{med.name} ({med.dosage})</p>
                                        <p className="text-sm text-muted-foreground">{med.time}</p>
                                    </div>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Reminder?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete the reminder for {med.name}? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(med.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    </div>
  )
}
