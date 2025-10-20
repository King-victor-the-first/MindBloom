
"use client";

import { useState } from "react";
import { moodBoosters } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, Gift } from "lucide-react";

// Select a subset of tasks for the wheel for better display
const wheelTasks = moodBoosters.slice(0, 8);
const segmentAngle = 360 / wheelTasks.length;

const segmentColors = [
  "bg-blue-300",
  "bg-green-300",
  "bg-yellow-300",
  "bg-red-300",
  "bg-indigo-300",
  "bg-purple-300",
  "bg-pink-300",
  "bg-teal-300",
];

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const spinCycles = Math.floor(Math.random() * 3) + 5; // 5 to 7 full spins
    const randomIndex = Math.floor(Math.random() * wheelTasks.length);
    const stopAngle = randomIndex * segmentAngle;
    
    // Calculate total rotation
    const totalRotation = (spinCycles * 360) + stopAngle;

    // We want the pointer to point to the middle of the segment
    const finalRotation = totalRotation - (segmentAngle / 2);
    
    setRotation(finalRotation);

    // Wait for the animation to finish
    setTimeout(() => {
      setResult(wheelTasks[randomIndex].text);
      setIsSpinning(false);
    }, 6000); // This duration should match the CSS transition duration
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center mb-8">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" style={{ transform: 'translateX(-50%) translateY(-50%) rotate(180deg)' }}>
          <div className="w-0 h-0 
            border-l-[15px] border-l-transparent
            border-r-[15px] border-r-transparent
            border-t-[30px] border-t-primary"
          />
        </div>

        {/* Wheel */}
        <div
          className="relative w-full h-full rounded-full border-4 border-muted shadow-lg overflow-hidden transition-transform duration-[6000ms] ease-out"
          style={{ transform: `rotate(-${rotation}deg)` }}
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
                  clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 0)`
                }}
              >
                <div 
                  className="flex flex-col items-center justify-center text-center -rotate-45 -translate-y-4"
                  style={{ transform: `rotate(${-segmentAngle / 2}deg) translate(0, -25%)`}}
                >
                   <Icon className="w-6 h-6 text-foreground/70" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button onClick={handleSpin} disabled={isSpinning} size="lg" className="rounded-full shadow-lg w-48">
        {isSpinning ? (
          "Spinning..."
        ) : (
          <>
            <Play className="mr-2 h-4 w-4 fill-current" />
            Spin the Wheel
          </>
        )}
      </Button>

      {result && !isSpinning && (
        <div className="mt-6 text-center bg-muted/50 p-4 rounded-lg shadow-md max-w-sm animate-in fade-in zoom-in-95">
          <Gift className="w-8 h-8 mx-auto text-primary mb-2" />
          <h3 className="font-headline text-lg font-semibold">Your happy task is:</h3>
          <p className="text-foreground mt-1">{result}</p>
        </div>
      )}
    </div>
  );
}
