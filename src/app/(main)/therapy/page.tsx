
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import TherapyScheduler from "@/components/therapy/TherapyScheduler";

export default function TherapyPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-headline font-bold">AI Therapy Sessions</h1>
        <p className="text-muted-foreground mt-1">Talk with your AI companion now or schedule for later.</p>
      </div>
      
      <div className="mb-8 text-center">
        <Link href={`/therapy-session/immediate-${crypto.randomUUID()}`} passHref>
            <Button size="lg" className="w-full max-w-xs mx-auto">
                <Zap className="mr-2 h-5 w-5" />
                Start Immediate Session
            </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-2">Need to talk right away? Start a session now.</p>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
            Or
            </span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-headline font-semibold text-center mb-2">Schedule for Later</h2>
        <p className="text-muted-foreground text-center mb-6">Choose a date and time that works for you.</p>
        <TherapyScheduler />
      </div>

    </div>
  );
}
