
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, addDoc, updateDoc, arrayUnion, getDoc, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Send, User, Bot, Loader, ArrowLeft, Info, Phone, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { PageWrapper } from '@/components/shared/page-wrapper';
import { chat } from '@/ai/flows/chat-flow';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Conversation, Message } from '@/ai/flows/chat.types';

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, loading]);

  useEffect(() => {
    if (!user) return;

    const q = query(
        collection(db, "conversations"), 
        where(`participants.${user.uid}`, '!=', null)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const convos: Conversation[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const lastMessage = data.messages?.[data.messages.length - 1];
            convos.push({
                 id: doc.id,
                 ...data,
                 lastMessage: {
                     text: lastMessage?.text || "No messages yet",
                     timestamp: lastMessage?.timestamp || data.createdAt
                 }
            } as Conversation);
        });
       
        convos.sort((a, b) => (b.lastMessage?.timestamp?.toMillis() || 0) - (a.lastMessage?.timestamp?.toMillis() || 0));
        setConversations(convos);
        setConversationsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

   useEffect(() => {
    if (activeConversation) {
        const unsub = onSnapshot(doc(db, 'conversations', activeConversation.id), (doc) => {
            if (doc.exists()) {
                 const data = doc.data();
                 const lastMessage = data.messages?.[data.messages.length - 1];
                 setActiveConversation(prev => ({
                     ...prev!,
                     ...data,
                      lastMessage: {
                        text: lastMessage?.text || "No messages yet",
                        timestamp: lastMessage?.timestamp || data.createdAt
                     }
                 }));
            }
        });
        return () => unsub();
    }
   }, [activeConversation?.id]);


  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !activeConversation || !user) return;

    const conversationRef = doc(db, 'conversations', activeConversation.id);

    const userMessage = {
      senderId: user.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
    };

    setNewMessage('');
    await updateDoc(conversationRef, {
        messages: arrayUnion(userMessage)
    });
    
    const otherParticipant = Object.values(activeConversation.participants).find(p => p.isAi);

    if (otherParticipant?.isAi) {
        setLoading(true);
        try {
            const result = await chat({ message: newMessage });
            
            const aiMessage = { 
                senderId: 'ai-assistant',
                text: result,
                timestamp: serverTimestamp()
            };
             await updateDoc(conversationRef, {
                messages: arrayUnion(aiMessage)
            });

        } catch (error) {
            console.error("Error fetching AI suggestion:", error);
            const errorMessage = { 
                senderId: 'ai-assistant',
                text: 'Sorry, I had trouble coming up with ideas right now. Please try again.',
                timestamp: serverTimestamp()
             };
            await updateDoc(conversationRef, {
                messages: arrayUnion(errorMessage)
            });
        } finally {
            setLoading(false);
        }
    }
  };

  const getOtherParticipant = (convo: Conversation) => {
      if (!user) return null;
      const otherParticipantId = Object.keys(convo.participants).find(id => id !== user.uid);
      return otherParticipantId ? convo.participants[otherParticipantId] : null;
  }

  const ConversationList = () => (
    <div className='bg-background h-screen'>
        <div className='p-4 flex justify-between items-center border-b'>
            <h1 className='text-2xl font-bold'>Messages</h1>
            <Button variant='ghost' size='icon'>
                <Info className='w-5 h-5' />
            </Button>
        </div>
        <div className='p-4 space-y-4'>
             <h2 className='text-sm font-semibold text-muted-foreground'>Friends</h2>
            {conversations.map((convo) => {
                const otherParticipant = getOtherParticipant(convo);
                if (!otherParticipant) return null;
                const lastMessageTime = convo.lastMessage?.timestamp ? formatDistanceToNow(convo.lastMessage.timestamp.toDate(), { addSuffix: true }) : '';
                return (
                <button
                    key={convo.id}
                    className="w-full flex items-center gap-3 text-left p-2 rounded-lg hover:bg-muted"
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
        <div className="flex flex-col h-screen bg-muted/30">
            <header className="flex-shrink-0 flex items-center gap-4 p-3 border-b bg-background">
                <Button variant="ghost" size="icon" onClick={() => setActiveConversation(null)}>
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
            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                {activeConversation.messages.map((message, index) => {
                const fromMe = message.senderId === user?.uid;
                return (
                    <div
                        key={index}
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

  if (conversationsLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <ProtectedRoute>
       {activeConversation ? <ActiveConversation /> : <ConversationList />}
    </ProtectedRoute>
  );
}
