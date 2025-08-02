
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { MessageSquare, Send, User, Bot } from 'lucide-react';

const initialConversations = [
  {
    name: 'Gourmet Delights Catering',
    avatar: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=100&h=100&fit=crop',
    messages: [
      { from: 'them', text: 'Hello! Thanks for reaching out. How can we help with your catering needs?' },
    ],
  },
  {
    name: 'The Grand Palace',
    avatar: 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?q=80&w=100&h=100&fit=crop',
    messages: [
      { from: 'them', text: 'Hi there! We have received your booking inquiry. What date are you interested in?' },
      { from: 'me', text: 'We are looking at October 26th, 2024.' },
    ],
  },
  {
    name: 'AI Assistant',
    avatar: 'https://images.unsplash.com/photo-1579566346927-c68383817a25?q=80&w=100&h=100&fit=crop',
    messages: [
      { from: 'them', text: 'Hello! I am your AI assistant. How can I help you plan today?' },
    ],
  }
];

export default function ChatPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, { from: 'me', text: newMessage }],
    };

    const updatedConversations = conversations.map(convo =>
      convo.name === activeConversation.name ? updatedConversation : convo
    );

    setConversations(updatedConversations);
    setActiveConversation(updatedConversation);
    setNewMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <MessageSquare className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Messages
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Communicate with service providers and your AI assistant.
        </p>
      </div>

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
                    <AvatarImage src={activeConversation.avatar} data-ai-hint="logo" />
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
          </CardContent>
          <CardFooter className="p-4 border-t flex-shrink-0">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4 mr-2" /> Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
