
"use client";

import { useState, useRef, useEffect } from "react";
import { moodBoosters } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StopCircle, Play, Gift } from "lucide-react";

// Select a subset of tasks for the wheel for better display
const wheelTasks = moodBoosters.slice(0, 12);
const segmentAngle = 360 / wheelTasks.length;

const segmentColors = [
  "bg-blue-300", "bg-green-300", "bg-yellow-300", "bg-red-300", 
  "bg-indigo-300", "bg-purple-300", "bg-pink-300", "bg-teal-300",
  "bg-cyan-300", "bg-lime-300", "bg-orange-300", "bg-amber-300"
];

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleToggleSpin = () => {
    if (isSpinning) {
      if (wheelRef.current) {
        // Get the current computed rotation from the CSS animation
        const computedStyle = window.getComputedStyle(wheelRef.current);
        const transform = computedStyle.getPropertyValue('transform');
        const matrix = new DOMMatrix(transform);
        const currentRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
        
        // This makes the rotation "stick"
        setRotation(currentRotation < 0 ? currentRotation + 360 : currentRotation);
        
        // Calculate the result
        const normalizedRotation = (360 - (currentRotation % 360)) % 360;
        const resultIndex = Math.floor(normalizedRotation / segmentAngle);
        setResult(wheelTasks[resultIndex].text);
      }
      setIsSpinning(false);
    } else {
      // Reset for another spin
      setResult(null);
      setIsSpinning(true);
    }
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
          ref={wheelRef}
          className={cn(
            "relative w-full h-full rounded-full border-4 border-muted shadow-lg overflow-hidden",
            isSpinning ? "animate-spin-continuous" : ""
          )}
          style={{ transform: !isSpinning ? `rotate(${rotation}deg)` : undefined }}
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
                  className="flex flex-col items-center justify-center text-center"
                  style={{ transform: `rotate(${-segmentAngle / 2}deg) translate(0, -25%)`}}
                >
                   <Icon className="w-5 h-5 text-foreground/70" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button onClick={handleToggleSpin} size="lg" className="rounded-full shadow-lg w-48">
        {isSpinning ? (
          <>
            <StopCircle className="mr-2 h-4 w-4" />
            Stop
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4 fill-current" />
            Spin Again
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
