"use client";

import { useState, useRef, useEffect } from "react";
import { summarizeActivityLogs, SummarizeActivityLogsOutput } from "@/ai/flows/summarize-activity-logs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Mic, MicOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function ActivityLogger() {
  const [activityLog, setActivityLog] = useState("");
  const [mood, setMood] = useState("");
  const [summary, setSummary] = useState<SummarizeActivityLogsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
      console.log("Speech recognition not supported");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      setActivityLog(prev => prev + finalTranscript);
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            toast({
                title: "Microphone Access Denied",
                description: "Please enable microphone access in your browser settings.",
                variant: "destructive",
            });
        }
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.stop();
    };
  }, [toast]);

  const toggleListen = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Could not start speech recognition:", error);
      }
    }
  };


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
        <div className="relative">
          <Textarea
            placeholder="e.g., Woke up early, went for a run, had a healthy breakfast, worked on a project..."
            value={activityLog}
            onChange={(e) => setActivityLog(e.target.value)}
            rows={6}
            disabled={loading}
            className="pr-12"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleListen}
            className={cn(
              "absolute right-2 top-2 h-8 w-8",
              isListening && "text-primary animate-pulse"
            )}
            title={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? <MicOff /> : <Mic />}
            <span className="sr-only">{isListening ? 'Stop voice input' : 'Start voice input'}</span>
          </Button>
        </div>
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
