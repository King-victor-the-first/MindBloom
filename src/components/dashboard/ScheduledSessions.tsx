"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format, isPast, isToday, compareAsc } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Video } from "lucide-react";
import type { ScheduledSession } from "@/lib/types";
import UpcomingSession from "./UpcomingSession";

export default function ScheduledSessions() {
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);

  useEffect(() => {
    // Function to run on client-side only
    const loadSessions = () => {
      try {
        const storedSessions: ScheduledSession[] = JSON.parse(
          localStorage.getItem("scheduledSessions") || "[]"
        );
        const upcomingSessions = storedSessions
          .filter(session => !isPast(new Date(session.date)) || isToday(new Date(session.date)))
          .sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)));
        setSessions(upcomingSessions);
      } catch (error) {
        console.error("Failed to load sessions from localStorage", error);
        setSessions([]);
      }
    };
    
    loadSessions();

    // Optional: listen for storage changes to sync across tabs
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'scheduledSessions') {
            loadSessions();
        }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  if (sessions.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-headline font-semibold mb-4">Your Sessions</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarCheck className="w-5 h-5" />
                No Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You don't have any AI therapy sessions scheduled.
            </p>
            <Link href="/therapy" passHref>
              <Button>Schedule a Session</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextSession = sessions[0];
  const otherSessions = sessions.slice(1);

  return (
    <>
      <UpcomingSession session={nextSession} />
      {otherSessions.length > 0 && (
        <div className="mt-8">
            <h2 className="text-xl font-headline font-semibold mb-4">Other Upcoming Sessions</h2>
            <Card>
                <CardContent className="pt-6">
                    <ul className="space-y-4">
                        {otherSessions.map((session) => (
                             <li key={session.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-muted rounded-full">
                                        <CalendarCheck className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{format(new Date(session.date), "EEEE, MMMM do")}</p>
                                        <p className="text-sm text-muted-foreground">{session.time}</p>
                                    </div>
                                </div>
                                <Link href={`/therapy-session/${session.id}`} passHref>
                                    <Button variant="ghost" size="sm">
                                        <Video className="mr-2 h-4 w-4" />
                                        Join
                                    </Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      )}
    </>
  );
}
