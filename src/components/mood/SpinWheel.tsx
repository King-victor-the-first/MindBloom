
"use client";

import { useState, useRef, useEffect } from "react";
import { moodBoosters } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, Gift } from "lucide-react";

// Increase the number of tasks for a tighter wheel
const wheelTasks = moodBoosters.slice(0, 20);
const segmentAngle = 360 / wheelTasks.length;

const segmentColors = [
  "bg-red-200", "bg-orange-200", "bg-amber-200", "bg-yellow-200", 
  "bg-lime-200", "bg-green-200", "bg-emerald-200", "bg-teal-200", 
  "bg-cyan-200", "bg-sky-200", "bg-blue-200", "bg-indigo-200", 
  "bg-violet-200", "bg-purple-200", "bg-fuchsia-200", "bg-pink-200", 
  "bg-rose-200", "bg-red-300", "bg-orange-300", "bg-amber-300"
];

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Calculate a new random final rotation
    const randomIndex = Math.floor(Math.random() * wheelTasks.length);
    // Add extra rotations for a better spinning effect (e.g., 5-10 full spins)
    const randomSpins = Math.floor(Math.random() * 6) + 5;
    const finalAngle = (randomSpins * 360) + (randomIndex * segmentAngle) - (segmentAngle / 2);
    
    // The final rotation should be the opposite direction to land correctly
    const targetRotation = -finalAngle;
    
    setRotation(targetRotation);

    // Set a timeout to determine the result after the animation ends
    setTimeout(() => {
      setResult(wheelTasks[randomIndex].text);
      setIsSpinning(false);
    }, 6000); // Must match the duration in the className
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center mb-8">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
           <div className="w-0 h-0 
            border-l-[15px] border-l-transparent
            border-r-[15px] border-r-transparent
            border-b-[30px] border-b-primary"
          />
        </div>

        {/* Wheel */}
        <div
          className={cn(
            "relative w-full h-full rounded-full border-4 border-muted shadow-lg overflow-hidden transition-transform duration-[6000ms] ease-out"
          )}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {wheelTasks.map((task, index) => {
            const Icon = task.icon;
            return (
              <div
                key={index}
                className={cn(
                  "absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center",
                  segmentColors[index % segmentColors.length]
                )}
                style={{
                  transform: `rotate(${index * segmentAngle}deg)`,
                  clipPath: `polygon(0 0, 100% 0, 100% 100%)`
                }}
              >
                <div 
                  className="flex flex-col items-center justify-center text-center"
                  style={{ transform: `rotate(${segmentAngle / 2}deg) translate(-50%, -25%) rotate(-90deg)`}}
                >
                   <Icon className="w-5 h-5 text-foreground/70" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button onClick={handleSpin} size="lg" className="rounded-full shadow-lg w-48" disabled={isSpinning}>
        <Play className="mr-2 h-4 w-4 fill-current" />
        {isSpinning ? "Spinning..." : result ? "Spin Again" : "Spin the Wheel!"}
      </Button>

      {!isSpinning && result && (
        <div className="mt-6 text-center bg-muted/50 p-4 rounded-lg shadow-md max-w-sm animate-in fade-in zoom-in-95">
          <Gift className="w-8 h-8 mx-auto text-primary mb-2" />
          <h3 className="font-headline text-lg font-semibold">Your happy task is:</h3>
          <p className="text-foreground mt-1">{result}</p>
        </div>
      )}
    </div>
  );
}
