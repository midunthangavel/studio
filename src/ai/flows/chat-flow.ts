
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
import { addExpensesToBudget } from './budget-assistant';
import { AddExpensesToBudgetInputSchema } from './budget-assistant.types';
import { searchVenuesTool } from './search-venues-tool';

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

  const addExpensesToBudgetTool = ai.defineTool(
    {
        name: 'addExpensesToBudget',
        description: 'Adds one or more expense items to the user\'s event budget. Use this when the user asks to add, track, or manage expenses.',
        inputSchema: AddExpensesToBudgetInputSchema.pick({prompt: true}),
        outputSchema: z.string().describe('A confirmation message summarizing the expenses that were added.'),
    },
    async (input) => {
        // In a real app, you would save this to the database here.
        // For this example, we just process the text.
        const { expenses } = await addExpensesToBudget({ prompt: input.prompt });
        const expenseSummary = expenses.map(e => `${e.name} ($${e.amount})`).join(', ');
        return `I have added the following expenses to your budget: ${expenseSummary}.`;
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
      tools: [suggestEventIdeasTool, addExpensesToBudgetTool, searchVenuesTool],
      model: 'googleai/gemini-2.0-flash',
    });

    const toolRequest = llmResponse.toolRequest();

    if (toolRequest) {
        const toolResult = await toolRequest.execute();
        const secondResponse = await ai.generate({
            prompt: `You are an expert event planner. A user made a request, and you have used a tool to fulfill it. Now, present the result to the user in a friendly and conversational way based on the tool's output. The user's original query was: '${input.message}'. The tool output is: '${toolResult}'.`,
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
