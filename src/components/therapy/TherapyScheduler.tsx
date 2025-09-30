"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const timeSlots = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "07:00 PM"];

export default function TherapyScheduler() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSchedule = () => {
    if (!date || !selectedTime) {
      toast({
        title: "Incomplete Selection",
        description: "Please select a date and time for your session.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Session Scheduled!",
      description: `Your therapy session is booked for ${date.toLocaleDateString()} at ${selectedTime}.`,
    });
    setSelectedTime(null);
  };

  return (
    <Card>
      <CardContent className="p-2 sm:p-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-shrink-0 mx-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(date) => date < new Date(new Date().toDateString())}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-headline text-xl mb-4">
            Available Times for{" "}
            <span className="text-primary">{date ? date.toLocaleDateString() : "..."}</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant="outline"
                className={cn(
                  "w-full",
                  selectedTime === time && "bg-primary text-primary-foreground"
                )}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
          <Button onClick={handleSchedule} className="w-full mt-6" size="lg">
            Schedule Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
