
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, addDoc, updateDoc, arrayUnion, getDoc, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { MessageSquare, Send, User, Bot, Loader, ArrowLeft } from 'lucide-react';
import { PageWrapper } from '@/components/shared/page-wrapper';
import { chat } from '@/ai/flows/chat-flow';
import { ProtectedRoute } from '@/components/shared/protected-route';

interface Message {
  id: string;
  text: string;
  from: 'me' | 'them';
  senderId: string;
  timestamp: Timestamp;
}

interface Conversation {
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

  if (conversationsLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  const getOtherParticipant = (convo: Conversation) => {
      if (!user) return null;
      const otherParticipantId = Object.keys(convo.participants).find(id => id !== user.uid);
      return otherParticipantId ? convo.participants[otherParticipantId] : null;
  }

  return (
    <ProtectedRoute>
    <PageWrapper
        icon={MessageSquare}
        title="Messages"
        description="Communicate with service providers and your AI assistant."
    >
      <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto">
        {!activeConversation ? (
            <Card>
            <CardHeader>
                <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
                <div className="space-y-2">
                {conversations.map((convo) => {
                    const otherParticipant = getOtherParticipant(convo);
                    if (!otherParticipant) return null;
                    return (
                    <Button
                    key={convo.id}
                    variant='ghost'
                    className="w-full justify-start gap-2 h-auto p-2"
                    onClick={() => setActiveConversation(convo)}
                    >
                    <Avatar>
                        <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} data-ai-hint="logo" />
                        <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                        <p className="font-semibold text-sm">{otherParticipant.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-40">{convo.lastMessage?.text}</p>
                    </div>
                    </Button>
                    )
                })}
                </div>
            </CardContent>
            </Card>
        ) : (
            <Card className="flex flex-col h-[70vh]">
            {user && (
                <>
                <CardHeader className="flex-shrink-0 flex-row items-center gap-4 space-y-0">
                    <Button variant="ghost" size="icon" onClick={() => setActiveConversation(null)}>
                        <ArrowLeft />
                    </Button>
                    <div className='flex items-center gap-2'>
                        <Avatar>
                            <AvatarImage src={getOtherParticipant(activeConversation)?.avatar} alt={getOtherParticipant(activeConversation)?.name} data-ai-hint="logo" />
                            <AvatarFallback>{getOtherParticipant(activeConversation)?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className='text-base'>{getOtherParticipant(activeConversation)?.name}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
                    {activeConversation.messages.map((message, index) => {
                    const from = message.senderId === user.uid ? 'me' : 'them';
                    const isAi = getOtherParticipant(activeConversation)?.isAi;
                    return (
                        <div
                            key={index}
                            className={`flex items-end gap-2 ${
                            from === 'me' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            {from !== 'me' && (
                            <Avatar className="h-8 w-8">
                                {isAi ? <Bot /> : <AvatarImage src={getOtherParticipant(activeConversation)?.avatar} data-ai-hint="logo" />}
                                <AvatarFallback>{getOtherParticipant(activeConversation)?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            )}
                            <div
                            className={`max-w-xs p-3 rounded-lg ${
                                from === 'me'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                            >
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            </div>
                            {from === 'me' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                            )}
                        </div>
                    )
                    })}
                    {loading && (
                        <div className="flex items-end gap-2 justify-start">
                            <Avatar className="h-8 w-8">
                            {getOtherParticipant(activeConversation)?.isAi ? <Bot /> : <AvatarImage src={getOtherParticipant(activeConversation)?.avatar} data-ai-hint="logo" />}
                                <AvatarFallback>{getOtherParticipant(activeConversation)?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="max-w-xs p-3 rounded-lg bg-muted">
                                <Loader className="h-5 w-5 animate-spin" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
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
                        <Send className="w-4 h-4" />
                    </Button>
                    </div>
                </CardFooter>
                </>
            )}
            </Card>
        )}
      </div>
    </PageWrapper>
    </ProtectedRoute>
  );
}
