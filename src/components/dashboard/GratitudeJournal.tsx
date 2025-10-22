
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { GratitudeEntry } from "@/lib/types";
import { Loader2, PenSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function GratitudeJournal() {
  const [showModal, setShowModal] = useState(false);
  const [entryText, setEntryText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser(); // <-- Destructure isUserLoading
  const firestore = useFirestore();
  
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const entryRef = useMemoFirebase(() => {
    // Crucially, wait for user loading to be false AND user to exist
    if (isUserLoading || !user) return null;
    return doc(firestore, `userProfiles/${user.uid}/gratitudeJournal`, todayStr);
  }, [user, isUserLoading, firestore, todayStr]);

  const { data: todayEntry, isLoading: isEntryLoading } = useDoc<GratitudeEntry>(entryRef);

  const handleSaveEntry = async () => {
    if (!entryText.trim() || !user || !entryRef) return; // Add check for entryRef
    setIsSaving(true);
    try {
      const newEntry = {
        date: todayStr,
        entry: entryText,
        createdAt: serverTimestamp(),
      };
      await setDoc(entryRef, newEntry);
      toast({
        title: "Gratitude Logged",
        description: "Your entry has been saved for today.",
      });
      setShowModal(false);
      setEntryText("");
    } catch (error) {
      console.error("Error saving gratitude entry:", error);
      toast({
        title: "Error",
        description: "Could not save your entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Combine auth loading and doc loading states
  if (isUserLoading || isEntryLoading) {
    return (
        <Card>
            <CardContent className="pt-6 flex items-center justify-center h-24">
                <Loader2 className="w-6 h-6 animate-spin text-primary"/>
            </CardContent>
        </Card>
    )
  }

  return (
    <div>
        <h2 className="text-xl font-headline font-semibold mb-4">Today's Gratitude</h2>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <PenSquare className="w-5 h-5" />
                    {!todayEntry ? "What are you grateful for?" : "Your Gratitude Today"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {todayEntry ? (
                    <p className="text-muted-foreground italic">"{todayEntry.entry}"</p>
                ) : (
                    <>
                        <p className="text-muted-foreground mb-4">
                            What's one good thing that happened today, no matter how small?
                        </p>
                        <Button onClick={() => setShowModal(true)}>Add Today's Entry</Button>
                    </>
                )}
            </CardContent>
        </Card>

        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Today's Gratitude</DialogTitle>
                    <DialogDescription>
                       Focusing on the positive can make a big difference. What's one good thing from your day?
                    </DialogDescription>
                </DialogHeader>
                <Textarea 
                    placeholder="e.g., I had a nice conversation with a friend..."
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    rows={4}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSaveEntry} disabled={isSaving || !entryText.trim()}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Entry
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
