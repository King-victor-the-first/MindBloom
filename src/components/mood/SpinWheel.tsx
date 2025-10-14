"use client";

import { useState, useEffect } from "react";
import { moodBoosters } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Gift } from "lucide-react";

export default function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [visibleTaskIndex, setVisibleTaskIndex] = useState(0);

  useEffect(() => {
    let spinInterval: NodeJS.Timeout;
    if (spinning) {
      spinInterval = setInterval(() => {
        setVisibleTaskIndex((prevIndex) => (prevIndex + 1) % moodBoosters.length);
      }, 100);

      setTimeout(() => {
        clearInterval(spinInterval);
        const finalIndex = Math.floor(Math.random() * moodBoosters.length);
        setVisibleTaskIndex(finalIndex);
        setResult(moodBoosters[finalIndex].text);
        setSpinning(false);
      }, 2000); // Spin for 2 seconds
    }

    return () => clearInterval(spinInterval);
  }, [spinning]);

  const startSpin = () => {
    setResult(null);
    setSpinning(true);
  };
  
  const selectedTask = moodBoosters[visibleTaskIndex];
  const Icon = selectedTask.icon;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm h-48 bg-card border rounded-lg flex flex-col items-center justify-center overflow-hidden shadow-inner">
        <div 
          className={cn(
            "flex flex-col items-center justify-center gap-4 transition-transform duration-100",
            spinning && "animate-none"
          )}
          style={{ transform: `translateY(0)` }} // This could be used for more complex animations
        >
            <Icon className="w-12 h-12 text-primary" />
            <p className="text-lg font-semibold text-center px-4 h-12">
                {spinning ? moodBoosters[visibleTaskIndex].text : (result || "Spin for a happy task!")}
            </p>
        </div>
      </div>
      <Button onClick={startSpin} disabled={spinning} size="lg" className="mt-8 rounded-full shadow-lg">
        {spinning ? "Spinning..." : "Spin the Wheel"}
      </Button>
      {result && !spinning && (
        <div className="mt-6 text-center bg-muted/50 p-4 rounded-lg shadow-md max-w-sm animate-in fade-in zoom-in-95">
          <Gift className="w-8 h-8 mx-auto text-primary mb-2" />
          <h3 className="font-headline text-lg font-semibold">Your happy task is:</h3>
          <p className="text-foreground mt-1">{result}</p>
        </div>
      )}
    </div>
  );
}