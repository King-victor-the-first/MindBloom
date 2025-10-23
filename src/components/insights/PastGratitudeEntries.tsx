"use client";

import { useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { GratitudeEntry } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, BookHeart } from "lucide-react";
import { summarizeGratitudeJournals, SummarizeGratitudeJournalsOutput } from "@/ai/flows/summarize-gratitude-journals";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


// These variables are expected to be globally available in the Firebase Hosting environment.
declare var __app_id: string | undefined;

export default function PastGratitudeEntries() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [summary, setSummary] = useState<SummarizeGratitudeJournalsOutput | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const journalQuery = useMemoFirebase(() => {
    if (!user) return null;
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    return query(
      collection(firestore, `artifacts/${appId}/users/${user.uid}/gratitudeJournal`),
      orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);

  const { data: entries, isLoading } = useCollection<GratitudeEntry>(journalQuery);

  const handleSummarize = async () => {
    if (!entries || entries.length === 0) return;
    setIsSummarizing(true);
    setSummary(null);

    try {
      const formattedEntries = entries.map(e => ({ date: e.date, entry: e.entry }));
      const result = await summarizeGratitudeJournals({ entries: formattedEntries });
      setSummary(result);
    } catch (error) {
      console.error("Error summarizing gratitude entries:", error);
      toast({
        title: "Summary Failed",
        description: "Could not generate a summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
     <div>
        <div className="text-center mb-8">
            <h2 className="text-3xl font-headline font-bold">Your Gratitude Journal</h2>
            <p className="text-muted-foreground mt-1">Review your past entries and reflect on the good things.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <BookHeart className="w-6 h-6" />
                     Past Entries
                   </div>
                    <Button onClick={handleSummarize} disabled={isLoading || isSummarizing || !entries || entries.length < 1} size="sm">
                        {isSummarizing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Wand2 className="mr-2 h-4 w-4" />
                        )}
                        AI Summary
                    </Button>
                </CardTitle>
                <CardDescription>
                    Here are your most recent gratitude journal entries.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin text-primary"/>
                    </div>
                )}

                {!isLoading && summary && (
                     <div className="mb-4 p-4 bg-muted/50 rounded-lg space-y-2 animate-in fade-in">
                        <h4 className="font-semibold font-headline">Your Gratitude Reflection</h4>
                        <p className="text-sm text-foreground">{summary.summary}</p>
                    </div>
                )}
                
                {!isLoading && entries && entries.length > 0 && (
                  <Accordion type="single" collapsible className="w-full">
                    {entries.map((entry) => (
                      <AccordionItem value={entry.id} key={entry.id}>
                        <AccordionTrigger>
                           {format(new Date(entry.createdAt?.seconds * 1000 || entry.date), "MMMM d, yyyy")}
                        </AccordionTrigger>
                        <AccordionContent>
                           <p className="text-muted-foreground italic">"{entry.entry}"</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}

                {!isLoading && (!entries || entries.length === 0) && (
                    <p className="text-center text-muted-foreground py-8">
                        You haven't written any gratitude entries yet.
                    </p>
                )}
            </CardContent>
        </Card>
     </div>
  );
}
