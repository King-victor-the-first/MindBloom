"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const moods = [
  { label: "Awful", emoji: "😩" },
  { label: "Bad", emoji: "😕" },
  { label: "Okay", emoji: "😐" },
  { label: "Good", emoji: "😊" },
  { label: "Great", emoji: "😄" },
];

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string | null>("Good");

  return (
    <div className="flex justify-around items-end bg-card p-4 rounded-xl shadow-sm">
      {moods.map((mood) => (
        <button
          key={mood.label}
          onClick={() => setSelectedMood(mood.label)}
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
