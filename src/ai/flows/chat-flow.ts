
'use server';
/**
 * @fileOverview A conversational AI agent for the chat page.
 * 
 * - chat: A function that responds to user messages, with the ability to use tools.
 * - ChatInput: The input type for the chat function.
 * - ChatOutput: The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { suggestEventIdeas, SuggestEventIdeasInput, SuggestEventIdeasOutput } from './suggest-event-ideas';
import { z } from 'zod';

const suggestEventIdeasTool = ai.defineTool(
    {
      name: 'suggestEventIdeas',
      description: 'Suggests creative ideas for an event, including theme, decoration, and activity. Use this when the user is asking for inspiration or help planning an event.',
      inputSchema: z.object({
        eventType: z.string().describe('The type of event being planned (e.g., Birthday Party, Corporate Gala).'),
        guestCount: z.number().describe('The estimated number of guests.'),
        budget: z.number().describe('The total budget for the event.'),
        additionalInfo: z.string().optional().describe('Any additional information from the user, like hobbies, desired atmosphere, or favorite colors.'),
      }),
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

const ChatInputSchema = z.object({
    message: z.string(),
});
type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.string();
type ChatOutput = z.infer<typeof ChatOutputSchema>;


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
