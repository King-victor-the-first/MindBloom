
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore } from "@/firebase";
import { addDoc, collection, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import MoodTriggerModal from "./MoodTriggerModal";
import CrisisModeDialog from "./CrisisModeDialog";

const moods = [
  { label: "Awful", emoji: "😩", value: 1 },
  { label: "Bad", emoji: "😕", value: 2 },
  { label: "Okay", emoji: "😐", value: 3 },
  { label: "Good", emoji: "😊", value: 4 },
  { label: "Great", emoji: "😄", value: 5 },
];

// These variables are expected to be globally available in the Firebase Hosting environment.
declare var __app_id: string | undefined;

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string | null>("Good");
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [isCrisisModeOpen, setIsCrisisModeOpen] = useState(false);
  const [currentMoodEntryId, setCurrentMoodEntryId] = useState<string | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleMoodSelect = async (mood: (typeof moods)[0]) => {
    setSelectedMood(mood.label);
    if (!user) return;

    try {
      const moodEntry = {
        mood: mood.label,
        value: mood.value,
        createdAt: serverTimestamp(),
      };
      
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const moodEntriesRef = collection(firestore, `artifacts/${appId}/users/${user.uid}`, "moodEntries");
      const docRef = await addDoc(moodEntriesRef, moodEntry);
      
      setCurrentMoodEntryId(docRef.id);

      if (mood.value === 1) { // Lowest mood score
        setIsCrisisModeOpen(true);
      } else {
        setIsTriggerModalOpen(true);
      }

    } catch (error) {
      console.error("Error logging mood:", error);
      toast({
        title: "Error",
        description: "Could not log your mood. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTriggerSave = async (trigger: string, note?: string) => {
    if (!user || !currentMoodEntryId) return;

    try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const moodEntryRef = doc(firestore, `artifacts/${appId}/users/${user.uid}/moodEntries`, currentMoodEntryId);
        const updateData: { trigger: string; triggerNote?: string } = { trigger };
        if (note) {
            updateData.triggerNote = note;
        }
        await updateDoc(moodEntryRef, updateData);

        toast({
            title: "Mood Logged",
            description: `You've logged your mood as "${selectedMood}".`,
        });
    } catch (error) {
        console.error("Error saving mood trigger:", error);
         toast({
            title: "Error",
            description: "Could not save the mood reason. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsTriggerModalOpen(false);
        setCurrentMoodEntryId(null);
    }
  }

  const handleCrisisDialogClose = (openTriggerModal: boolean) => {
    setIsCrisisModeOpen(false);
    if (openTriggerModal) {
      setIsTriggerModalOpen(true);
    } else {
      setCurrentMoodEntryId(null);
    }
  }

  return (
    <>
      <div className="flex justify-around items-end bg-card p-4 rounded-xl shadow-sm">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => handleMoodSelect(mood)}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-all"
          >
            <span
              className={cn(
                "text-4xl sm:text-5xl grayscale transition-all duration-300 transform hover:scale-110",
                selectedMood === mood.label && "grayscale-0 scale-125"
              )}
            >
              {mood.emoji}
            </span>
            <span
              className={cn(
                "text-xs sm:text-sm font-semibold",
                selectedMood === mood.label && "text-primary"
              )}
            >
              {mood.label}
            </span>
          </button>
        ))}
      </div>
      
      <MoodTriggerModal 
        isOpen={isTriggerModalOpen}
        onClose={() => setIsTriggerModalOpen(false)}
        onSave={handleTriggerSave}
      />

      <CrisisModeDialog
        isOpen={isCrisisModeOpen}
        onClose={handleCrisisDialogClose}
      />
    </>
  );
}
