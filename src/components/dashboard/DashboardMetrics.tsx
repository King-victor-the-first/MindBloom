import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, Bed, BrainCircuit } from "lucide-react";

const metrics = [
  {
    title: "Mood",
    value: "Positive",
    icon: Smile,
    color: "text-green-500",
  },
  {
    title: "Sleep",
    value: "7h 30m",
    icon: Bed,
    color: "text-blue-500",
  },
  {
    title: "Stress",
    value: "Low",
    icon: BrainCircuit,
    color: "text-yellow-500",
  },
];

export default function DashboardMetrics() {
  return (
    <div>
      <h2 className="text-xl font-headline font-semibold mb-4">Your Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 text-muted-foreground ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
