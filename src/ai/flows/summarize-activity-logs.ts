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
  mood: z.string().describe('The user\'s reported mood for the day.'),
  freshAir: z.string().describe("Whether the user got fresh air. (e.g., 'A little', 'None')"),
  connected: z.string().describe("Whether the user connected with someone. (e.g., 'Yes', 'No')"),
  enjoyment: z.string().describe("Whether the user did something enjoyable. (e.g., 'Yes', 'No')"),
  sleep: z.string().describe("The user's sleep quality. (e.g., 'Good', 'Okay', 'Poor')"),
  stress: z.string().describe("The user's stress level for the day. (e.g., 'Low', 'Moderate', 'High')"),
  medication: z.string().describe("Whether the user took their medication. (e.g., 'Yes', 'No', 'N/A')"),
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
  prompt: `You are an AI assistant that analyzes a user's daily survey answers and mood to provide gentle, encouraging insights for their well-being.

  User's Mood: {{{mood}}}
  
  Today's Survey:
  - Fresh Air: {{{freshAir}}}
  - Connected with someone: {{{connected}}}
  - Did something for enjoyment: {{{enjoyment}}}
  - Last night's sleep: {{{sleep}}}
  - Stress Level: {{{stress}}}
  - Took Medication: {{{medication}}}

  Based on this, provide a concise summary and one or two actionable, positive insights. Focus on connections between their activities and mood. For example, if they felt good and got fresh air, highlight that connection. If they felt bad and their sleep was poor, gently suggest that might be a factor. Be sensitive and supportive in your tone.
  `,
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
