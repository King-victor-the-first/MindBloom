import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import ScheduledSessions from "@/components/dashboard/ScheduledSessions";
import MedicationReminders from "@/components/dashboard/MedicationReminders";
import GratitudeJournal from "@/components/dashboard/GratitudeJournal";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        <WelcomeHeader />
        <DashboardMetrics />
        <Separator />
        <GratitudeJournal />
        <ScheduledSessions />
        <MedicationReminders />
      </div>
    </div>
  );
}
