
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, ArrowLeft, Info, Phone, MoreVertical, Paperclip, Smile, MessageSquare, Send } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Conversation, Message } from '@/ai/flows/chat.types';
import type { Timestamp } from 'firebase/firestore';
import { chat } from '@/ai/flows/chat-flow';


// --- Mock Data ---

const mockTimestamp = (date: Date): Timestamp => ({
  toDate: () => date,
  toMillis: () => date.getTime(),
  seconds: Math.floor(date.getTime() / 1000),
  nanoseconds: (date.getTime() % 1000) * 1e6,
  isEqual: () => false,
  valueOf: () => '',
  toJSON: () => ({ seconds: 0, nanoseconds: 0 }),
  toString: () => '',
  _compareTo: () => 0,
  _isEqual: () => false,
  _toMillis: () => 0,
});


const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'convo_1',
    participants: {
      'user-123': { name: 'You', avatar: '' },
      'ai-assistant': { name: 'AI Planner', avatar: '/logo.png', isAi: true },
    },
    messages: [
      { id: '1', senderId: 'ai-assistant', text: "Hello! I'm your AI event planner. How can I help you brainstorm for your next event?", timestamp: mockTimestamp(new Date(Date.now() - 1000 * 60 * 60 * 24)) },
      { id: '2', senderId: 'user-123', text: "I'm planning a birthday party for my friend who loves hiking.", timestamp: mockTimestamp(new Date(Date.now() - 1000 * 60 * 50)) },
      { id: '3', senderId: 'ai-assistant', text: "That sounds fun! How about a 'Woodland Adventure' theme? Decorations could include faux moss, lanterns, and wooden signs. For an activity, you could set up a mini 'trail mix' bar.", timestamp: mockTimestamp(new Date(Date.now() - 1000 * 60 * 48)) },
    ],
  },
  {
    id: 'convo_2',
    participants: {
      'user-123': { name: 'You', avatar: '' },
      'provider_gourmet-delights-catering': { name: 'Gourmet Delights', avatar: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=100&h=100&fit=crop' },
    },
    messages: [
      { id: '4', senderId: 'provider_gourmet-delights-catering', text: 'Hi there! Thanks for your interest in our catering services. Do you have a date in mind?', timestamp: mockTimestamp(new Date(Date.now() - 1000 * 60 * 60 * 48)) },
    ],
  },
];

MOCK_CONVERSATIONS.forEach(convo => {
    const lastMessage = convo.messages[convo.messages.length - 1];
    if(lastMessage) {
        convo.lastMessage = {
            text: lastMessage.text,
            timestamp: lastMessage.timestamp
        };
    }
});

// --- End Mock Data ---


export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, loading]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !activeConversation || !user) return;

    const myUserId = 'user-123'; // Using mock user ID

    const userMessage: Message = {
      id: String(Date.now()),
      senderId: myUserId,
      text: newMessage,
      timestamp: mockTimestamp(new Date()),
    };
    
    const currentMessageText = newMessage;
    setNewMessage('');

    const updatedConversation = {
        ...activeConversation,
        messages: [...activeConversation.messages, userMessage]
    };
    setActiveConversation(updatedConversation);

    const otherParticipant = Object.values(activeConversation.participants).find(p => p.isAi);

    if (otherParticipant?.isAi) {
        setLoading(true);
        try {
            const aiResponse = await chat({ message: currentMessageText });
            const aiMessage: Message = {
                id: String(Date.now() + 1),
                senderId: 'ai-assistant',
                text: aiResponse,
                timestamp: mockTimestamp(new Date())
            };
            
             const finalConversation = {
                ...updatedConversation,
                messages: [...updatedConversation.messages, aiMessage]
            };
            setActiveConversation(finalConversation);
            setConversations(prevConvos => prevConvos.map(c => 
                c.id === finalConversation.id ? finalConversation : c
            ));
        } catch(e) {
            console.error(e);
            const aiMessage: Message = {
                id: String(Date.now() + 1),
                senderId: 'ai-assistant',
                text: "Sorry, I'm having trouble connecting right now.",
                timestamp: mockTimestamp(new Date())
            };
            const finalConversation = {
                ...updatedConversation,
                messages: [...updatedConversation.messages, aiMessage]
            };
            setActiveConversation(finalConversation);
        } finally {
            setLoading(false);
        }
    }
  };

  const getOtherParticipant = (convo: Conversation) => {
      // Using mock user ID
      const otherParticipantId = Object.keys(convo.participants).find(id => id !== 'user-123');
      return otherParticipantId ? convo.participants[otherParticipantId] : null;
  }

  const ConversationList = () => (
    <div className='bg-background h-full flex flex-col'>
        <div className='p-4 flex justify-between items-center border-b shrink-0'>
            <h1 className='text-2xl font-bold'>Messages</h1>
            <Button variant='ghost' size='icon'>
                <Info className='w-5 h-5' />
            </Button>
        </div>
        <div className='p-4 space-y-4 overflow-y-auto flex-1'>
             <h2 className='text-sm font-semibold text-muted-foreground'>Friends</h2>
            {conversations.map((convo) => {
                const otherParticipant = getOtherParticipant(convo);
                if (!otherParticipant) return null;
                const lastMessageTime = convo.lastMessage?.timestamp ? formatDistanceToNow(convo.lastMessage.timestamp.toDate(), { addSuffix: true }) : '';
                return (
                <button
                    key={convo.id}
                    className={cn(
                        "w-full flex items-center gap-3 text-left p-2 rounded-lg hover:bg-muted",
                        activeConversation?.id === convo.id && 'bg-muted'
                    )}
                    onClick={() => setActiveConversation(convo)}
                >
                    <Avatar className='h-12 w-12'>
                        <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} data-ai-hint="logo" />
                        <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <div className='flex justify-between items-center'>
                            <p className="font-semibold truncate">{otherParticipant.name}</p>
                            <p className="text-xs text-muted-foreground whitespace-nowrap">{lastMessageTime}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{convo.lastMessage?.text}</p>
                    </div>
                </button>
                )
            })}
        </div>
    </div>
  )

  const ActiveConversation = () => {
    if (!activeConversation) return null;
    const otherParticipant = getOtherParticipant(activeConversation);

    return (
        <div className="flex flex-col h-full bg-muted/30">
            <header className="flex-shrink-0 flex items-center gap-4 p-3 border-b bg-background">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActiveConversation(null)}>
                    <ArrowLeft />
                </Button>
                <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10'>
                        <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} data-ai-hint="logo" />
                        <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className='text-lg font-semibold'>{otherParticipant?.name}</h2>
                </div>
                <div className='ml-auto flex items-center gap-2'>
                    <Button variant='ghost' size='icon'>
                        <Phone className='w-5 h-5' />
                    </Button>
                     <Button variant='ghost' size='icon'>
                        <MoreVertical className='w-5 h-5' />
                    </Button>
                </div>
            </header>
            <main className="flex-grow p-4 space-y-6">
                {activeConversation.messages.map((message) => {
                const fromMe = message.senderId === 'user-123'; // Using mock user ID
                return (
                    <div
                        key={message.id}
                        className={cn('flex items-end gap-2', fromMe ? 'justify-end' : 'justify-start')}
                    >
                        {!fromMe && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={otherParticipant?.avatar} data-ai-hint="logo" />
                            <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        )}
                        <div
                        className={cn(
                            'max-w-md p-3 rounded-2xl',
                            fromMe
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-background rounded-bl-none'
                        )}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        </div>
                    </div>
                )
                })}
                {loading && (
                    <div className="flex items-end gap-2 justify-start">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={otherParticipant?.avatar} data-ai-hint="logo" />
                            <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="max-w-xs p-3 rounded-lg bg-background">
                            <Loader className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 border-t bg-background flex-shrink-0">
                <div className="flex w-full items-center space-x-2 bg-muted rounded-full px-2">
                 <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Smile className="w-5 h-5" />
                </Button>
                <Input
                    type="text"
                    placeholder="Type message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    disabled={loading}
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none text-base h-12"
                />
                 <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Paperclip className="w-5 h-5" />
                </Button>
                <Button onClick={handleSendMessage} disabled={loading || !newMessage.trim()} size='icon' className='rounded-full h-10 w-10'>
                    <Send className="w-5 h-5" />
                </Button>
                </div>
            </footer>
        </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] h-[calc(100vh-4rem)]">
        <div className={cn("hidden md:block border-r h-full", activeConversation && "hidden md:block")}>
           <ConversationList />
        </div>
        <div className={cn("md:col-start-2 h-full", !activeConversation && "hidden md:flex md:items-center md:justify-center")}>
           {activeConversation ? (
                <ActiveConversation />
            ) : (
                <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground" />
                    <h2 className="mt-2 text-xl font-semibold">Select a conversation</h2>
                    <p className="text-muted-foreground">Start chatting with your vendors and our AI assistant.</p>
                </div>
            )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
