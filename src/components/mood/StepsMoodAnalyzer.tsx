"use client";

import { useState } from "react";
import { analyzeMoodFromSteps, AnalyzeMoodFromStepsOutput } from "@/ai/flows/analyze-mood-from-steps";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Footprints } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StepsMoodAnalyzer() {
  const [steps, setSteps] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeMoodFromStepsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    const stepCount = parseInt(steps);
    if (isNaN(stepCount) || stepCount < 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of steps.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeMoodFromSteps({ steps: stepCount });
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing mood:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze mood from steps. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Footprints className="w-6 h-6" />
          Mood from Steps
        </CardTitle>
        <CardDescription>
          See how your physical activity might be influencing your mood.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="number"
            placeholder="Enter today's step count"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleAnalyze} disabled={loading} className="sm:w-auto w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze
          </Button>
        </div>
        {analysis && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">AI Analysis:</h4>
            <p className="text-sm text-foreground">{analysis.mood}</p>
            <div className="mt-2 text-xs text-muted-foreground">
              Confidence: {Math.round(analysis.confidence * 100)}%
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
