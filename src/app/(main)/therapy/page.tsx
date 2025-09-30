import TherapyScheduler from "@/components/therapy/TherapyScheduler";

export default function TherapyPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-headline font-bold">AI Therapy Sessions</h1>
        <p className="text-muted-foreground mt-1">Schedule a time to talk with your AI companion.</p>
      </div>
      <TherapyScheduler />
    </div>
  );
}
