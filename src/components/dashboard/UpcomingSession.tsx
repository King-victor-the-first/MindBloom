import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import type { ScheduledSession } from "@/lib/types";
import { format } from "date-fns";

export default function UpcomingSession({ session }: { session: ScheduledSession }) {
  const sessionDate = new Date(session.date);
  return (
    <div>
      <h2 className="text-xl font-headline font-semibold mb-4">Upcoming Session</h2>
      <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>AI Therapy Session</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            {format(sessionDate, "EEEE, MMMM do")} at {session.time}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Your weekly check-in with your AI therapist is scheduled soon.
          </p>
          <Link href={`/therapy-session/${session.id}`} passHref>
            <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Video className="mr-2 h-4 w-4" />
              Join Session
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
