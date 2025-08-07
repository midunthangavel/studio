
import { z } from 'zod';
import type { Timestamp } from 'firebase/firestore';

export const SuggestEventIdeasInputSchema = z.object({
    eventType: z.string().describe('The type of event being planned (e.g., Birthday Party, Corporate Gala).'),
    guestCount: z.number().describe('The estimated number of guests.'),
    budget: z.number().describe('The total budget for the event.'),
    additionalInfo: z.string().optional().describe('Any additional information from the user, like hobbies, desired atmosphere, or favorite colors.'),
});

export const ChatInputSchema = z.object({
    message: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.string();
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

export interface Conversation {
    id: string;
    participants: {
        [key: string]: {
            name: string;
            avatar: string;
            isAi?: boolean;
        }
    };
    messages: Message[];
    lastMessage?: {
        text: string;
        timestamp: Timestamp;
    }
}
