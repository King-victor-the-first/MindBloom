import ActivitySurvey from "@/components/activities/ActivitySurvey";

export default function ActivitiesPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-headline font-bold">Daily Check-in</h1>
        <p className="text-muted-foreground mt-1">Answer a few questions to see how your activities impact your mood.</p>
      </div>
      <ActivitySurvey />
    </div>
  );
}
