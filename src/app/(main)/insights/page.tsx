import InsightCards from "@/components/insights/InsightCards";

export default function InsightsPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-headline font-bold">Your Wellness Insights</h1>
        <p className="text-muted-foreground mt-1">Connecting the dots between your activities and your mood.</p>
      </div>
      <InsightCards />
    </div>
  );
}
