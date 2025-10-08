"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { label: "Awful", emoji: "😩", value: 1 },
  { label: "Bad", emoji: "😕", value: 2 },
  { label: "Okay", emoji: "😐", value: 3 },
  { label: "Good", emoji: "😊", value: 4 },
  { label: "Great", emoji: "😄", value: 5 },
];

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string | null>("Good");
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleMoodSelect = (mood: (typeof moods)[0]) => {
    setSelectedMood(mood.label);
    if (!user) return;

    const moodEntry = {
      mood: mood.label,
      value: mood.value,
      createdAt: serverTimestamp(),
    };

    const moodEntriesRef = collection(firestore, "userProfiles", user.uid, "moodEntries");
    addDocumentNonBlocking(moodEntriesRef, moodEntry);
    
    toast({
      title: "Mood Logged",
      description: `You've logged your mood as "${mood.label}".`,
    });
  };

  return (
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
  );
}
