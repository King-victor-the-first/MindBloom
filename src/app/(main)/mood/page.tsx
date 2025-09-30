import MoodSelector from "@/components/mood/MoodSelector";
import SpinWheel from "@/components/mood/SpinWheel";
import StepsMoodAnalyzer from "@/components/mood/StepsMoodAnalyzer";

export default function MoodPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-headline font-bold text-center mb-2">How are you feeling?</h1>
          <p className="text-muted-foreground text-center mb-6">Log your mood to track your emotional wellness.</p>
          <MoodSelector />
        </div>
        <div>
          <h2 className="text-2xl font-headline font-semibold text-center mb-2">Spin for a happy task!</h2>
          <p className="text-muted-foreground text-center mb-6">Brighten your day by brightening someone else's.</p>
          <SpinWheel />
        </div>
        <div>
          <h2 className="text-2xl font-headline font-semibold text-center mb-6">Wellness Insights</h2>
          <StepsMoodAnalyzer />
        </div>
      </div>
    </div>
  );
}
