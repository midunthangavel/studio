
'use server';
/**
 * @fileOverview An AI agent for brainstorming event ideas.
 * 
 * - suggestEventIdeas: A function that generates event ideas based on user input.
 * - SuggestEventIdeasInput: The input type for the suggestEventIdeas function.
 * - SuggestEventIdeasOutput: The return type for the suggestEventIdeas function.
 */

import { ai } from '@/ai/genkit';
import { SuggestEventIdeasInput, SuggestEventIdeasInputSchema, SuggestEventIdeasOutput, SuggestEventIdeasOutputSchema } from './suggest-event-ideas.types';


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
