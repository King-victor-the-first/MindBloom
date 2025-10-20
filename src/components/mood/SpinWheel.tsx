
"use client";

import { useState, useRef } from "react";
import { moodBoosters } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, Gift, Square } from "lucide-react";

const wheelTasks = moodBoosters.slice(0, 20);
const segmentAngle = 360 / wheelTasks.length;

const segmentColors = [
  "bg-green-200", "bg-teal-200", "bg-cyan-200", "bg-sky-200",
  "bg-blue-200", "bg-green-300", "bg-teal-300", "bg-cyan-300",
  "bg-sky-300", "bg-blue-300", "bg-green-400", "bg-teal-400",
  "bg-cyan-400", "bg-sky-400", "bg-blue-400", "bg-green-500",
  "bg-teal-500", "bg-cyan-500", "bg-sky-500", "bg-blue-500"
];

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleToggleSpin = () => {
    setResult(null);

    if (isSpinning) {
      // --- Stopping the wheel ---
      if (!wheelRef.current) return;
      
      setIsSpinning(false);
      setIsStopping(true);

      const computedStyle = window.getComputedStyle(wheelRef.current);
      const transform = computedStyle.transform;
      
      let currentAngle = 0;
      if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        currentAngle = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
      }

      const randomExtraSpins = Math.floor(Math.random() * 2) + 3; // Spin 3-4 more times for momentum
      const randomStopIndex = Math.floor(Math.random() * wheelTasks.length);
      const finalAngle = currentAngle + (randomExtraSpins * 360) - (currentAngle % 360) - (randomStopIndex * segmentAngle) - (segmentAngle / 2);
      
      // Remove the animation class
      wheelRef.current.classList.remove("animate-spin-continuous");

      // CRITICAL: Force browser reflow to apply the class removal before adding the transition.
      void wheelRef.current.offsetWidth;

      // Apply the transition for the slow-down effect.
      wheelRef.current.style.transition = 'transform 2.5s ease-out';
      wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;

      setCurrentRotation(finalAngle);
      
      setTimeout(() => {
        setResult(wheelTasks[randomStopIndex].text);
        setIsStopping(false);
      }, 2500); // Corresponds to the transition duration

    } else {
      // --- Starting the wheel ---
      setResult(null);
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'none'; // Remove transition before starting animation
        wheelRef.current.style.transform = `rotate(${currentRotation}deg)`; // Start from last position
        
        // CRITICAL: Force reflow before adding animation class
        void wheelRef.current.offsetWidth;

        wheelRef.current.classList.add("animate-spin-continuous");
      }
      setIsSpinning(true);
      setIsStopping(false);
    }
  };

  const getButtonContent = () => {
    if (isSpinning) {
      return (
        <>
          <Square className="mr-2 h-4 w-4 fill-current" />
          Stop
        </>
      );
    }
    if (isStopping) {
      return "Stopping...";
    }
    if (result) {
      return "Spin Again";
    }
    return (
      <>
        <Play className="mr-2 h-4 w-4 fill-current" />
        Spin the Wheel!
      </>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center mb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[30px] border-b-primary" />
        </div>

        <div
          ref={wheelRef}
          className={cn(
            "relative w-full h-full rounded-full border-4 border-muted shadow-lg overflow-hidden shadow-primary/40 [box-shadow:0_0_20px_hsl(var(--primary))]"
          )}
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
                  style={{ transform: `rotate(${segmentAngle / 2}deg) translate(-50%, -98%) rotate(-90deg)` }}
                >
                  <Icon className="w-2.5 h-2.5 text-foreground/70" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button onClick={handleToggleSpin} size="lg" className="rounded-full shadow-lg w-48" disabled={isStopping}>
        {getButtonContent()}
      </Button>

      {!isSpinning && !isStopping && result && (
        <div className="mt-6 text-center bg-muted/50 p-4 rounded-lg shadow-md max-w-sm animate-in fade-in zoom-in-95">
          <Gift className="w-8 h-8 mx-auto text-primary mb-2" />
          <h3 className="font-headline text-lg font-semibold">Your happy task is:</h3>
          <p className="text-foreground mt-1">{result}</p>
        </div>
      )}
    </div>
  );
}
