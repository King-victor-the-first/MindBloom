
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footprints, Smile, Bed, Edit } from "lucide-react";
import { useWellnessStore } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DashboardMetrics() {
    const { steps, setSteps, sleepHours, setSleepHours, currentMood } = useWellnessStore();
    const [isEditingSteps, setIsEditingSteps] = useState(false);
    const [stepInput, setStepInput] = useState(steps.toString());

    const handleStepSave = () => {
        const newSteps = parseInt(stepInput, 10);
        if (!isNaN(newSteps) && newSteps >= 0) {
            setSteps(newSteps);
            setIsEditingSteps(false);
        }
    };
    
    const moodMap: {[key: string]: {color: string, emoji: string}} = {
        "Great": { color: "text-green-500", emoji: "😄" },
        "Good": { color: "text-green-400", emoji: "😊" },
        "Okay": { color: "text-yellow-500", emoji: "😐" },
        "Bad": { color: "text-orange-500", emoji: "😕" },
        "Awful": { color: "text-red-500", emoji: "😩" }
    }
    const { color: moodColor, emoji: moodEmoji } = moodMap[currentMood] || { color: "text-gray-500", emoji: "🤔"};

  return (
    <div>
      <h2 className="text-xl font-headline font-semibold mb-4">Your Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mood</CardTitle>
              <Smile className={`h-4 w-4 text-muted-foreground ${moodColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMood}</div>
              <p className="text-xs text-muted-foreground">{moodEmoji}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sleep</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sleepHours.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground">Last night</p>
            </CardContent>
        </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Steps Today</CardTitle>
              <Footprints className="h-4 w-4 text-muted-foreground text-yellow-500" />
            </CardHeader>
            <CardContent>
                {isEditingSteps ? (
                    <div className="flex items-center gap-2">
                        <Input 
                            type="number"
                            value={stepInput}
                            onChange={(e) => setStepInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleStepSave()}
                            className="h-9"
                            autoFocus
                        />
                        <Button size="sm" onClick={handleStepSave}>Save</Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                         <div className="text-2xl font-bold">{steps.toLocaleString()}</div>
                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingSteps(true)}>
                            <Edit className="h-4 w-4" />
                         </Button>
                    </div>
                )}
              <p className="text-xs text-muted-foreground">Click the pencil to edit</p>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
