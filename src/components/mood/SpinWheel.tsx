"use client";

import { useState } from "react";
import { moodBoosters } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Gift } from "lucide-react";

const colors = [
  "#a2d2ff", "#bde0fe", "#ffafcc", "#ffc8dd", "#cdb4db", 
  "#a2d2ff", "#bde0fe", "#ffafcc",
];

export default function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setSelectedTask(null);
    
    const newRotation = rotation + 360 * 5 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const degrees = newRotation % 360;
      const arc = 360 / moodBoosters.length;
      const index = Math.floor((360 - degrees + arc / 2) % 360 / arc);
      setSelectedTask(moodBoosters[index].text);
    }, 4000); // Corresponds to the transition duration
  };

  const segmentAngle = 360 / moodBoosters.length;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative w-80 h-80 sm:w-96 sm:h-96">
        <div 
          className="absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 rounded-full bg-white border-4 border-primary z-20"
        />
        <div
          className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20"
          style={{
            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
            width: '20px',
            height: '30px',
            backgroundColor: 'hsl(var(--primary))'
          }}
        />
        <div
          className="relative w-full h-full rounded-full border-8 border-card shadow-lg overflow-hidden transition-transform duration-[4000ms]"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transitionTimingFunction: 'cubic-bezier(.17,.88,.24,1)'
          }}
        >
          {moodBoosters.map((booster, index) => (
            <div
              key={index}
              className="absolute w-1/2 h-1/2 origin-bottom-right"
              style={{
                transform: `rotate(${index * segmentAngle}deg)`,
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 0)`,
                backgroundColor: colors[index % colors.length],
              }}
            >
              <div
                className="absolute w-full h-full flex items-center justify-center"
                style={{ transform: `rotate(${segmentAngle / 2}deg) translate(0, -25%)`}}
              >
                <p className="text-xs text-center text-black/60 font-semibold px-4 transform -rotate-90">
                  {booster.text.split(" ").slice(0, 3).join(" ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={spin} disabled={spinning} size="lg" className="mt-8 rounded-full shadow-lg">
        {spinning ? "Spinning..." : "Spin the Wheel"}
      </Button>
      {selectedTask && !spinning && (
        <div className="mt-6 text-center bg-card p-4 rounded-lg shadow-md max-w-sm animate-in fade-in zoom-in-95">
          <Gift className="w-8 h-8 mx-auto text-primary mb-2" />
          <h3 className="font-headline text-lg font-semibold">Your happy task is:</h3>
          <p className="text-foreground mt-1">{selectedTask}</p>
        </div>
      )}
    </div>
  );
}
