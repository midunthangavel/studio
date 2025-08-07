
'use server';
/**
 * @fileOverview A conversational AI agent for the chat page.
 * 
 * - chat: A function that responds to user messages, with the ability to use tools.
 */

import { ai } from '@/ai/genkit';
import { suggestEventIdeas } from './suggest-event-ideas';
import { SuggestEventIdeasInputSchema } from './suggest-event-ideas.types';
import { z } from 'zod';
import { ChatInput, ChatInputSchema, ChatOutput, ChatOutputSchema } from './chat.types';

const suggestEventIdeasTool = ai.defineTool(
    {
      name: 'suggestEventIdeas',
      description: 'Suggests creative ideas for an event, including theme, decoration, and activity. Use this when the user is asking for inspiration or help planning an event.',
      inputSchema: SuggestEventIdeasInputSchema,
      outputSchema: z.string().describe('A summary of the suggested ideas.'),
    },
    async (input) => {
        const ideas = await suggestEventIdeas(input);
        return `I have some ideas for you!
        Theme: ${ideas.theme}. 
        Decorations: ${ideas.decoration}. 
        Activity: ${ideas.activity}.`;
    }
  );

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: input.message,
      tools: [suggestEventIdeasTool],
      model: 'googleai/gemini-2.0-flash',
    });

    const toolResponse = llmResponse.toolRequest();

    if (toolResponse) {
        const toolResult = await toolResponse.execute();
        const secondResponse = await ai.generate({
            prompt: `You are an expert event planner. A user asked for event ideas, and you have used a tool to generate them. Now, present these ideas to the user in a friendly and conversational way based on the tool's output. The user's original query was: '${input.message}'. The tool output is: '${toolResult}'.`,
            model: 'googleai/gemini-2.0-flash',
        });
        return secondResponse.text;
    }

    return llmResponse.text;
  }
);

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}
