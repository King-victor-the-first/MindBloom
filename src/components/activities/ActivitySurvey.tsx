"use client";

import { useState } from "react";
import { summarizeActivityLogs, SummarizeActivityLogsOutput } from "@/ai/flows/summarize-activity-logs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const surveyQuestions = [
  {
    id: "stress",
    label: "How would you rate your stress level today?",
    options: ["Low", "Moderate", "High"],
  },
  {
    id: "freshAir",
    label: "Did you get some fresh air today?",
    options: ["Yes, for a while", "Just a little", "Not at all"],
  },
  {
    id: "connected",
    label: "Did you connect with someone?",
    options: ["Yes", "Briefly", "No"],
  },
  {
    id: "enjoyment",
    label: "Did you do something just for enjoyment?",
    options: ["Yes", "A little", "No"],
  },
    {
    id: "sleep",
    label: "How was your sleep last night?",
    options: ["Good", "Okay", "Poor"],
  },
  {
    id: "medication",
    label: "Did you take your medication today?",
    options: ["Yes", "No", "N/A"],
  },
];

export default function ActivitySurvey() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mood, setMood] = useState("");
  const [summary, setSummary] = useState<SummarizeActivityLogsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };
  
  const allQuestionsAnswered = surveyQuestions.every(q => answers[q.id]);

  const handleSummarize = async () => {
    if (!allQuestionsAnswered || !mood) {
      toast({
        title: "Missing Information",
        description: "Please answer all the questions and select your mood.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSummary(null);

    try {
      const result = await summarizeActivityLogs({ 
        mood,
        freshAir: answers.freshAir,
        connected: answers.connected,
        enjoyment: answers.enjoyment,
        sleep: answers.sleep,
        stress: answers.stress,
        medication: answers.medication,
      });
      setSummary(result);
    } catch (error) {
      console.error("Error summarizing activity survey:", error);
      toast({
        title: "Summary Failed",
        description: "Could not generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Survey</CardTitle>
        <CardDescription>
          Select your mood and answer a few questions about your day to receive personalized insights from our AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
            {surveyQuestions.map((q) => (
                <div key={q.id}>
                    <Label className="font-semibold">{q.label}</Label>
                    <RadioGroup
                        value={answers[q.id]}
                        onValueChange={(value) => handleAnswerChange(q.id, value)}
                        className="mt-2"
                        disabled={loading}
                    >
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {q.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                                <Label htmlFor={`${q.id}-${option}`} className="font-normal">{option}</Label>
                            </div>
                        ))}
                        </div>
                    </RadioGroup>
                </div>
            ))}
        </div>
         <div>
          <Label htmlFor="mood-select" className="font-semibold">Today's overall mood</Label>
          <Select onValueChange={setMood} value={mood} disabled={loading}>
            <SelectTrigger id="mood-select" className="w-full mt-2 sm:w-[240px]">
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
        <Button onClick={handleSummarize} disabled={loading || !allQuestionsAnswered || !mood}>
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
