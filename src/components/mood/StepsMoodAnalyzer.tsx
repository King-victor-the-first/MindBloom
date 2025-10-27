
"use client";

import { useState } from "react";
import { analyzeMoodFromSteps, AnalyzeMoodFromStepsOutput } from "@/ai/flows/analyze-mood-from-steps";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Footprints } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWellnessStore } from "@/lib/data";

export default function StepsMoodAnalyzer() {
  const { steps } = useWellnessStore();
  const [analysis, setAnalysis] = useState<AnalyzeMoodFromStepsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (steps <= 0) {
      toast({
        title: "No Steps Logged",
        description: "Please enter your steps on the dashboard to get an analysis.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeMoodFromSteps({ steps });
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
          See how your physical activity might be influencing your mood. Your current step count is <span className="font-bold text-primary">{steps.toLocaleString()}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleAnalyze} disabled={loading} className="w-full">
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                </>
            ) : "Analyze My Steps"}
        </Button>
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
