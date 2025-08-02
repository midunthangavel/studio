
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { MessageSquare, Send, User, Bot, Loader } from 'lucide-react';
import { PageWrapper } from '@/components/page-wrapper';
import { suggestEventIdeas } from '@/ai/flows/suggest-event-ideas';
import { useToast } from '@/hooks/use-toast';

const initialConversations = [
  {
    name: 'AI Assistant',
    avatar: 'https://images.unsplash.com/photo-1579566346927-c68383817a25?q=80&w=100&h=100&fit=crop',
    messages: [
      { from: 'them', text: 'Hello! I am your AI assistant. How can I help you plan today? You can ask me for ideas for a birthday party for 50 guests with a $2000 budget.' },
    ],
    isAi: true,
  },
  {
    name: 'Gourmet Delights Catering',
    avatar: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=100&h=100&fit=crop',
    messages: [
      { from: 'them', text: 'Hello! Thanks for reaching out. How can we help with your catering needs?' },
    ],
    isAi: false,
  },
  {
    name: 'The Grand Palace',
    avatar: 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?q=80&w=100&h=100&fit=crop',
    messages: [
      { from: 'them', text: 'Hi there! We have received your booking inquiry. What date are you interested in?' },
      { from: 'me', text: 'We are looking at October 26th, 2024.' },
    ],
    isAi: false,
  },
  {
    name: 'Timeless Moments Photo',
    avatar: 'https://images.unsplash.com/photo-1512295767273-b684ac69f887?q=80&w=100&h=100&fit=crop',
    messages: [
      { from: 'them', text: 'Yes, we are available on that date. Would you like to see our packages?' },
    ],
    isAi: false,
  },
  {
    name: 'Prestige Bridal Cars',
    avatar: 'https://images.unsplash.com/photo-1618951012351-38a6a79b21e8?q=80&w=100&h=100&fit=crop',
    messages: [
      { from: 'them', text: 'Your car is booked! We look forward to being part of your special day.' },
    ],
    isAi: false,
  }
];

export default function ChatPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const userMessage = { from: 'me', text: newMessage };

    // Update UI immediately with user's message
    const updatedConversationWithUserMessage = {
      ...activeConversation,
      messages: [...activeConversation.messages, userMessage],
    };
    
    const updatedConversationsWithUserMessage = conversations.map(convo =>
        convo.name === activeConversation.name ? updatedConversationWithUserMessage : convo
    );

    setConversations(updatedConversationsWithUserMessage);
    setActiveConversation(updatedConversationWithUserMessage);
    setNewMessage('');
    setLoading(true);

    if (activeConversation.isAi) {
        try {
            // A simple way to parse the user's message for demo purposes.
            // A more robust solution would use a more sophisticated NLP approach.
            const guestCountMatch = newMessage.match(/(\d+)\s*guests?/i);
            const budgetMatch = newMessage.match(/\$?(\d+)/i);
            
            const eventType = newMessage.split(" for ")[1]?.split(" with ")[0] || "party";
            const guestCount = guestCountMatch ? parseInt(guestCountMatch[1]) : 50;
            const budget = budgetMatch ? parseInt(budgetMatch[1]) : 5000;

            const result = await suggestEventIdeas({
                eventType: eventType,
                guestCount: guestCount,
                budget: budget,
                additionalInfo: newMessage,
            });
            
            const aiResponse = `I have some ideas for you!
            Theme: ${result.theme}. 
            Decorations: ${result.decoration}. 
            Activity: ${result.activity}.`;

            const aiMessage = { from: 'them', text: aiResponse };

            const updatedConversationWithAiMessage = {
                ...updatedConversationWithUserMessage,
                messages: [...updatedConversationWithUserMessage.messages, aiMessage],
            };
            const updatedConversationsWithAiMessage = conversations.map(convo =>
                convo.name === activeConversation.name ? updatedConversationWithAiMessage : convo
            );
            setConversations(updatedConversationsWithAiMessage);
            setActiveConversation(updatedConversationWithAiMessage);

        } catch (error) {
            console.error("Error fetching AI suggestion:", error);
            const errorMessage = { from: 'them', text: 'Sorry, I had trouble coming up with ideas right now. Please try again.' };
            const updatedConversationWithError = {
                ...updatedConversationWithUserMessage,
                messages: [...updatedConversationWithUserMessage.messages, errorMessage],
            };
            const updatedConversationsWithError = conversations.map(convo =>
                convo.name === activeConversation.name ? updatedConversationWithError : convo
            );
            setConversations(updatedConversationsWithError);
            setActiveConversation(updatedConversationWithError);
        } finally {
            setLoading(false);
        }
    } else {
        // Placeholder for non-AI chat logic
        // In a real app, this would send the message to a backend service
        setTimeout(() => {
             const replyMessage = { from: 'them', text: 'Thanks for your message! We will get back to you shortly.'};
             const updatedConversationWithReply = {
                ...updatedConversationWithUserMessage,
                messages: [...updatedConversationWithUserMessage.messages, replyMessage],
            };
            const updatedConversationsWithReply = conversations.map(convo =>
                convo.name === activeConversation.name ? updatedConversationWithReply : convo
            );
            setConversations(updatedConversationsWithReply);
            setActiveConversation(updatedConversationWithReply);
            setLoading(false);
        }, 1000)
    }
  };

  return (
    <PageWrapper
        icon={MessageSquare}
        title="Messages"
        description="Communicate with service providers and your AI assistant."
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-2">
              {conversations.map((convo, index) => (
                <Button
                  key={index}
                  variant={activeConversation.name === convo.name ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2 h-auto p-2"
                  onClick={() => setActiveConversation(convo)}
                >
                  <Avatar>
                    <AvatarImage src={convo.avatar} alt={convo.name} data-ai-hint="logo" />
                    <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                     <p className="font-semibold text-sm">{convo.name}</p>
                     <p className="text-xs text-muted-foreground truncate max-w-40">{convo.messages[convo.messages.length - 1].text}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col h-[70vh]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} data-ai-hint="logo" />
                <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {activeConversation.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
            {activeConversation.messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  message.from === 'me' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.from !== 'me' && (
                   <Avatar className="h-8 w-8">
                     {activeConversation.isAi ? <Bot /> : <AvatarImage src={activeConversation.avatar} data-ai-hint="logo" />}
                    <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                    message.from === 'me'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                 {message.from === 'me' && (
                   <Avatar className="h-8 w-8">
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {loading && (
                <div className="flex items-end gap-2 justify-start">
                    <Avatar className="h-8 w-8">
                       {activeConversation.isAi ? <Bot /> : <AvatarImage src={activeConversation.avatar} data-ai-hint="logo" />}
                        <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-muted">
                        <Loader className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter className="p-4 border-t flex-shrink-0">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                disabled={loading}
              />
              <Button onClick={handleSendMessage} disabled={loading}>
                <Send className="w-4 h-4 mr-2" /> Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageWrapper>
  );
}
