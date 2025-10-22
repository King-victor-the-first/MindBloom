import SafetyPlanForm from "@/components/settings/SafetyPlanForm";

export default function SafetyPlanPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-headline font-bold">My Safety Plan</h1>
        <p className="text-muted-foreground mt-1">
            Configure your trusted contacts and coping strategies for crisis situations.
        </p>
      </div>
      <SafetyPlanForm />
    </div>
  );
}
