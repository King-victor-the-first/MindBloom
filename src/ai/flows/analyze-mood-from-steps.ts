// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Analyzes user mood based on fitness tracker data (step count).
 *
 * - analyzeMoodFromSteps - Analyzes mood based on steps.
 * - AnalyzeMoodFromStepsInput - The input type for the analyzeMoodFromSteps function.
 * - AnalyzeMoodFromStepsOutput - The return type for the analyzeMoodFromSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMoodFromStepsInputSchema = z.object({
  steps: z
    .number()
    .describe('The number of steps taken by the user on a given day.'),
});
export type AnalyzeMoodFromStepsInput = z.infer<
  typeof AnalyzeMoodFromStepsInputSchema
>;

const AnalyzeMoodFromStepsOutputSchema = z.object({
  mood: z
    .string()
    .describe(
      'The analyzed mood of the user, based on their step count. Should be a short summary of the users mood.
      ' + 'For example: "The user is likely feeling energetic and positive due to their high activity level."'      
    ),
  confidence: z
    .number()
    .describe(
      'A confidence score between 0 and 1 indicating the accuracy of the mood analysis.'
    ),
});
export type AnalyzeMoodFromStepsOutput = z.infer<
  typeof AnalyzeMoodFromStepsOutputSchema
>;

export async function analyzeMoodFromSteps(
  input: AnalyzeMoodFromStepsInput
): Promise<AnalyzeMoodFromStepsOutput> {
  return analyzeMoodFromStepsFlow(input);
}

const analyzeMoodFromStepsPrompt = ai.definePrompt({
  name: 'analyzeMoodFromStepsPrompt',
  input: {schema: AnalyzeMoodFromStepsInputSchema},
  output: {schema: AnalyzeMoodFromStepsOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing user mood based on their daily step count.

  Analyze the user's mood based on the number of steps they took in a day. Provide a mood assessment and a confidence score (0-1).

  Step Count: {{{steps}}}
  `,
});

const analyzeMoodFromStepsFlow = ai.defineFlow(
  {
    name: 'analyzeMoodFromStepsFlow',
    inputSchema: AnalyzeMoodFromStepsInputSchema,
    outputSchema: AnalyzeMoodFromStepsOutputSchema,
  },
  async input => {
    const {output} = await analyzeMoodFromStepsPrompt(input);
    return output!;
  }
);
