'use server';
/**
 * @fileOverview Summarizes user activity logs using AI to provide insights into how activities affect mood and well-being.
 *
 * - summarizeActivityLogs - A function that takes activity logs as input and returns a summary.
 * - SummarizeActivityLogsInput - The input type for the summarizeActivityLogs function.
 * - SummarizeActivityLogsOutput - The return type for the summarizeActivityLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeActivityLogsInputSchema = z.object({
  activityLogs: z.string().describe('A detailed log of the user\'s daily activities.'),
  mood: z.string().describe('The user\'s reported mood for the day.'),
});

export type SummarizeActivityLogsInput = z.infer<typeof SummarizeActivityLogsInputSchema>;

const SummarizeActivityLogsOutputSchema = z.object({
  summary: z.string().describe('A summary of the activity logs and their impact on the user\'s mood.'),
  insights: z.string().describe('Insights into how specific activities are affecting the user\'s well-being.'),
});

export type SummarizeActivityLogsOutput = z.infer<typeof SummarizeActivityLogsOutputSchema>;

export async function summarizeActivityLogs(input: SummarizeActivityLogsInput): Promise<SummarizeActivityLogsOutput> {
  return summarizeActivityLogsFlow(input);
}

const summarizeActivityLogsPrompt = ai.definePrompt({
  name: 'summarizeActivityLogsPrompt',
  input: {schema: SummarizeActivityLogsInputSchema},
  output: {schema: SummarizeActivityLogsOutputSchema},
  prompt: `You are an AI assistant that analyzes a user's activity logs and mood to provide insights into their well-being.\n\n  Activity Logs: {{{activityLogs}}}\n  Mood: {{{mood}}}\n\n  Provide a summary of the activity logs and their impact on the user's mood. Also, provide insights into how specific activities are affecting the user's well-being.\n`,
});

const summarizeActivityLogsFlow = ai.defineFlow(
  {
    name: 'summarizeActivityLogsFlow',
    inputSchema: SummarizeActivityLogsInputSchema,
    outputSchema: SummarizeActivityLogsOutputSchema,
  },
  async input => {
    const {output} = await summarizeActivityLogsPrompt(input);
    return output!;
  }
);
