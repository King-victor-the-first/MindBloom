
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footprints, Smile, Bed, Edit, Loader2 } from "lucide-react";
import { useWellnessStore } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useUser } from "@/firebase";
import { getFitnessData } from "@/ai/flows/get-fitness-data";
import { format } from "date-fns";

export default function DashboardMetrics() {
    const { steps, setSteps, sleepHours, setSleepHours, currentMood } = useWellnessStore();
    const { user } = useUser();
    const [isLoadingSteps, setIsLoadingSteps] = useState(true);
    
    useEffect(() => {
      const fetchSteps = async () => {
        if (!user) return;
        setIsLoadingSteps(true);
        try {
          const today = format(new Date(), 'yyyy-MM-dd');
          const fitnessData = await getFitnessData({ userId: user.uid, date: today });
          setSteps(fitnessData.steps);
        } catch (error) {
          console.error("Failed to fetch fitness data:", error);
          // Keep existing or default steps if API fails
        } finally {
          setIsLoadingSteps(false);
        }
      };

      fetchSteps();
    }, [user, setSteps]);

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
                {isLoadingSteps ? (
                    <div className="flex items-center justify-center h-9">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="text-2xl font-bold">{steps.toLocaleString()}</div>
                )}
              <p className="text-xs text-muted-foreground">From Google Fit</p>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
