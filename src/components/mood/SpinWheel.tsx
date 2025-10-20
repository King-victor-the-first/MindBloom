
"use client";

import { useState, useRef } from "react";
import { moodBoosters } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, Gift, Square } from "lucide-react";

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
  const [isStopping, setIsStopping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleToggleSpin = () => {
    setResult(null);

    if (isSpinning) {
      // --- Stopping the wheel ---
      if (!wheelRef.current) return;
      
      const computedStyle = window.getComputedStyle(wheelRef.current);
      const transform = computedStyle.transform;
      
      let angle = currentRotation;
      if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        angle = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
      }

      const randomExtraSpins = Math.floor(Math.random() * 2) + 3; // Spin 3-4 more times for momentum
      const randomStopIndex = Math.floor(Math.random() * wheelTasks.length);
      // Calculate the final angle to align the pointer with the middle of the chosen segment
      const finalAngle = angle + (randomExtraSpins * 360) - (randomStopIndex * segmentAngle) - (segmentAngle / 2);
      
      wheelRef.current.classList.remove("animate-spin-continuous");
      wheelRef.current.style.transition = 'transform 4s ease-out';
      wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;

      setCurrentRotation(finalAngle);
      setIsSpinning(false);
      setIsStopping(true);

      setTimeout(() => {
        setResult(wheelTasks[randomStopIndex].text);
        setIsStopping(false);
      }, 4000); // Corresponds to the transition duration

    } else {
      // --- Starting the wheel ---
      setResult(null);
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'none'; // Remove transition before starting animation
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
            "relative w-full h-full rounded-full border-4 border-muted shadow-lg overflow-hidden"
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
                  style={{ transform: `rotate(${segmentAngle / 2}deg) translate(-50%, -25%) rotate(-90deg)` }}
                >
                  <Icon className="w-5 h-5 text-foreground/70" />
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
