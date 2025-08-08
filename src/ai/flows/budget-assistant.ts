
'use server';
/**
 * @fileOverview An AI agent for parsing budget expenses from natural language.
 * 
 * - addExpensesToBudget: A function that takes a text prompt and returns structured expense data.
 */

import { ai } from '@/ai/genkit';
import { AddExpensesToBudgetInput, AddExpensesToBudgetInputSchema, AddExpensesToBudgetOutput, AddExpensesToBudgetOutputSchema, expenseCategories } from './budget-assistant.types';

const budgetPrompt = ai.definePrompt({
    name: 'budgetPrompt',
    input: { schema: AddExpensesToBudgetInputSchema },
    output: { schema: AddExpensesToBudgetOutputSchema },
    prompt: `You are a budget assistant for an event planning app. Your task is to extract expense items from the user's request and categorize them.

    User Request: "{{{prompt}}}"
    
    Valid Categories: ${expenseCategories.join(', ')}.
    
    Analyze the user's request and identify all distinct expense items. For each item, determine its name, amount, and the most appropriate category from the provided list. If an item does not fit well into any category, assign it to "Other". Return the data as a structured array of expense objects.`,
});

const addExpensesToBudgetFlow = ai.defineFlow(
  {
    name: 'addExpensesToBudgetFlow',
    inputSchema: AddExpensesToBudgetInputSchema,
    outputSchema: AddExpensesToBudgetOutputSchema,
  },
  async (input) => {
    const { output } = await budgetPrompt(input);
    return output || { expenses: [] };
  }
);

export async function addExpensesToBudget(input: AddExpensesToBudgetInput): Promise<AddExpensesToBudgetOutput> {
  return addExpensesToBudgetFlow(input);
}
