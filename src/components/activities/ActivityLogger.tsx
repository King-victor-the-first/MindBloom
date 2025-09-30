"use client";

import { useState } from "react";
import { summarizeActivityLogs, SummarizeActivityLogsOutput } from "@/ai/flows/summarize-activity-logs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function ActivityLogger() {
  const [activityLog, setActivityLog] = useState("");
  const [mood, setMood] = useState("");
  const [summary, setSummary] = useState<SummarizeActivityLogsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!activityLog || !mood) {
      toast({
        title: "Missing Information",
        description: "Please fill out your activities and select your mood.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSummary(null);

    try {
      const result = await summarizeActivityLogs({ activityLogs: activityLog, mood });
      setSummary(result);
    } catch (error) {
      console.error("Error summarizing activity log:", error);
      toast({
        title: "Summary Failed",
        description: "Could not generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Your Day</CardTitle>
        <CardDescription>
          Write about what you did today. Then, select your overall mood and let our AI provide some insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="e.g., Woke up early, went for a run, had a healthy breakfast, worked on a project..."
          value={activityLog}
          onChange={(e) => setActivityLog(e.target.value)}
          rows={6}
          disabled={loading}
        />
        <div>
          <Label htmlFor="mood-select">Today's overall mood</Label>
          <Select onValueChange={setMood} value={mood} disabled={loading}>
            <SelectTrigger id="mood-select" className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Great">Great</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Okay">Okay</SelectItem>
              <SelectItem value="Bad">Bad</SelectItem>
              <SelectItem value="Awful">Awful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSummarize} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Insights
        </Button>
      </CardFooter>

      {summary && (
        <CardContent>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
            <div>
              <h4 className="font-semibold mb-2 font-headline">AI Summary</h4>
              <p className="text-sm text-foreground">{summary.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 font-headline">Insights</h4>
              <p className="text-sm text-foreground">{summary.insights}</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
