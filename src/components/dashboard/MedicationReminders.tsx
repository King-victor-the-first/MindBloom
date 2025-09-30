import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Pill } from "lucide-react";
import { medications } from "@/lib/data";

export default function MedicationReminders() {
  return (
    <div>
       <h2 className="text-xl font-headline font-semibold mb-4">Medication Reminders</h2>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="w-5 h-5" />
                    Today's Reminders
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {medications.map((med) => (
                        <li key={med.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-full">
                                    <Pill className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">{med.name} ({med.dosage})</p>
                                    <p className="text-sm text-muted-foreground">{med.time}</p>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Upcoming</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    </div>
  )
}
