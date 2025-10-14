
'use server';

/**
 * @fileOverview A conversational AI flow for a therapy session.
 * 
 * - therapyConversation - A function that provides a conversational response.
 * - TherapyConversationInput - The input type for the therapyConversation function.
 * - TherapyConversationOutput - The return type for the therapyConversation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

const TherapyConversationInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
        text: z.string()
    }))
  })).describe('The conversation history.'),
  message: z.string().describe("The user's latest message."),
  voiceName: z.string().optional().describe("The voice to use for the TTS response."),
});

export type TherapyConversationInput = z.infer<typeof TherapyConversationInputSchema>;

const TherapyConversationOutputSchema = z.object({
  response: z.string().describe("The AI's conversational response."),
  audio: z.string().describe("The AI's response as a base64 encoded WAV audio string in a data URI format."),
});

export type TherapyConversationOutput = z.infer<typeof TherapyConversationOutputSchema>;

export async function therapyConversation(input: TherapyConversationInput): Promise<TherapyConversationOutput> {
  return therapyConversationFlow(input);
}

const therapyPrompt = `You are an AI therapist named Bloom. Your goal is to provide a safe, supportive, and empathetic space for the user to share their thoughts and feelings.
  
  - Listen actively and respond with empathy and understanding.
  - Ask open-ended questions to encourage reflection.
  - Do not give direct advice, but help the user explore their own solutions.
  - Keep your responses concise and conversational.
  - Maintain a calm and non-judgmental tone.
  - Do not diagnose or provide medical advice.
  - If the user is in crisis, provide a supportive message and gently suggest they contact a crisis hotline or a mental health professional.
  `;

async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs = [] as any[];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
}

const therapyConversationFlow = ai.defineFlow(
  {
    name: 'therapyConversationFlow',
    inputSchema: TherapyConversationInputSchema,
    outputSchema: TherapyConversationOutputSchema,
  },
  async (input) => {
    
    const { text: responseText } = await ai.generate({
        system: therapyPrompt,
        history: input.history,
        prompt: input.message,
    });
    
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: input.voiceName || 'Algenib' },
            },
          },
        },
        prompt: responseText,
      });
  
      if (!media) {
        throw new Error('no media returned');
      }

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      const audioBase64 = await toWav(audioBuffer);

    return {
        response: responseText,
        audio: 'data:audio/wav;base64,' + audioBase64,
    };
  }
);
