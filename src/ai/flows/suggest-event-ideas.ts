
'use server';
/**
 * @fileOverview An AI agent for brainstorming event ideas.
 * 
 * - suggestEventIdeas: A function that generates event ideas based on user input.
 * - SuggestEventIdeasInput: The input type for the suggestEventIdeas function.
 * - SuggestEventIdeasOutput: The return type for the suggestEventIdeas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const SuggestEventIdeasInputSchema = z.object({
  eventType: z.string().describe('The type of event being planned (e.g., Birthday Party, Corporate Gala).'),
  guestCount: z.number().describe('The estimated number of guests.'),
  budget: z.number().describe('The total budget for the event.'),
  additionalInfo: z.string().optional().describe('Any additional information from the user, like hobbies, desired atmosphere, or favorite colors.'),
});
export type SuggestEventIdeasInput = z.infer<typeof SuggestEventIdeasInputSchema>;

const SuggestEventIdeasOutputSchema = z.object({
  theme: z.string().describe('A creative theme for the event.'),
  decoration: z.string().describe('Suggestions for decorations that match the theme.'),
  activity: z.string().describe('Suggestions for activities or entertainment for the guests.'),
});
export type SuggestEventIdeasOutput = z.infer<typeof SuggestEventIdeasOutputSchema>;


const plannerPrompt = ai.definePrompt({
    name: 'eventPlannerPrompt',
    input: { schema: SuggestEventIdeasInputSchema },
    output: { schema: SuggestEventIdeasOutputSchema },
    prompt: `You are an expert event planner, known for your creative and unique ideas. A user needs help planning an event.

    Event Details:
    - Type: {{{eventType}}}
    - Guest Count: {{{guestCount}}}
    - Budget: {{{budget}}}
    - Additional Information: {{{additionalInfo}}}
    
    Based on these details, provide one creative and cohesive suggestion for each of the following categories: a theme, a decoration, and an activity. The ideas should be appropriate for the event type, budget, and guest count.`,
});

const suggestEventIdeasFlow = ai.defineFlow(
  {
    name: 'suggestEventIdeasFlow',
    inputSchema: SuggestEventIdeasInputSchema,
    outputSchema: SuggestEventIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await plannerPrompt(input);
    return output!;
  }
);

export async function suggestEventIdeas(input: SuggestEventIdeasInput): Promise<SuggestEventIdeasOutput> {
  return suggestEventIdeasFlow(input);
}
