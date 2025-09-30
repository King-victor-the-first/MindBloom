import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

export default function UpcomingSession() {
  return (
    <div>
      <h2 className="text-xl font-headline font-semibold mb-4">Upcoming Session</h2>
      <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>AI Therapy Session</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Today at 3:00 PM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Your weekly check-in with your AI therapist is scheduled soon.
          </p>
          <Link href="/therapy-session/1" passHref>
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
