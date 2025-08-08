
'use server';
/**
 * @fileOverview An AI agent for generating mood board images.
 * 
 * - generateMoodBoard: A function that generates an image based on a text prompt.
 */

import { ai } from '@/ai/genkit';
import { GenerateMoodBoardInput, GenerateMoodBoardInputSchema, GenerateMoodBoardOutput, GenerateMoodBoardOutputSchema } from './generate-mood-board.types';

const generateMoodBoardFlow = ai.defineFlow(
  {
    name: 'generateMoodBoardFlow',
    inputSchema: GenerateMoodBoardInputSchema,
    outputSchema: GenerateMoodBoardOutputSchema,
  },
  async ({ prompt }) => {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: prompt,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media.url) {
        throw new Error('Image generation failed to return a data URI.');
    }
    
    return media.url;
  }
);

export async function generateMoodBoard(input: GenerateMoodBoardInput): Promise<GenerateMoodBoardOutput> {
  return generateMoodBoardFlow(input);
}
