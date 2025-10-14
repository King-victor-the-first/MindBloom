
"use client";

import { useState, useEffect, useRef } from "react";
import { moodBoosters } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Gift, Play, Square } from "lucide-react";

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [visibleTaskIndex, setVisibleTaskIndex] = useState(0);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSpinning) {
      spinIntervalRef.current = setInterval(() => {
        setVisibleTaskIndex((prevIndex) => (prevIndex + 1) % moodBoosters.length);
      }, 100);
    } else {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    }

    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    };
  }, [isSpinning]);

  const handleToggleSpin = () => {
    if (isSpinning) {
      // Logic to stop the wheel
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
      setIsStopping(true);
      setIsSpinning(false);
      
      // Create a "slowing down" effect
      let slowDownSpeed = 150;
      let iterations = Math.floor(Math.random() * 5) + 5; // 5 to 9 more ticks

      const slowDown = () => {
        if (iterations > 0) {
          setVisibleTaskIndex((prevIndex) => (prevIndex + 1) % moodBoosters.length);
          iterations--;
          setTimeout(slowDown, slowDownSpeed);
          slowDownSpeed *= 1.4; // Gradually increase delay
        } else {
          // Final result
          const finalIndex = (visibleTaskIndex + 1) % moodBoosters.length;
          setVisibleTaskIndex(finalIndex);
          setResult(moodBoosters[finalIndex].text);
          setIsStopping(false);
        }
      };
      slowDown();

    } else {
      // Logic to start the wheel
      setResult(null);
      setIsSpinning(true);
    }
  };
  
  const selectedTask = moodBoosters[visibleTaskIndex];
  const Icon = selectedTask.icon;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm h-48 bg-card border rounded-lg flex flex-col items-center justify-center overflow-hidden shadow-inner">
        <div 
          className={cn(
            "flex flex-col items-center justify-center gap-4 transition-transform duration-100",
            (isSpinning || isStopping) && "animate-none"
          )}
          style={{ transform: `translateY(0)` }}
        >
            <Icon className="w-12 h-12 text-primary" />
            <p className="text-lg font-semibold text-center px-4 h-12">
                {(isSpinning || isStopping) ? moodBoosters[visibleTaskIndex].text : (result || "Click Spin to start!")}
            </p>
        </div>
      </div>
      <Button onClick={handleToggleSpin} disabled={isStopping} size="lg" className="mt-8 rounded-full shadow-lg w-48">
        {isSpinning ? (
            <>
                <Square className="mr-2 h-4 w-4 fill-current" />
                Stop
            </>
        ) : isStopping ? (
            "Stopping..."
        ) : (
            <>
                <Play className="mr-2 h-4 w-4 fill-current" />
                Spin the Wheel
            </>
        )}
      </Button>
      {result && !isSpinning && !isStopping && (
        <div className="mt-6 text-center bg-muted/50 p-4 rounded-lg shadow-md max-w-sm animate-in fade-in zoom-in-95">
          <Gift className="w-8 h-8 mx-auto text-primary mb-2" />
          <h3 className="font-headline text-lg font-semibold">Your happy task is:</h3>
          <p className="text-foreground mt-1">{result}</p>
        </div>
      )}
    </div>
  );
}
