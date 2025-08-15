
'use client';

import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, ArrowLeft, Info, Phone, MoreVertical, Paperclip, Smile, MessageSquare, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Conversation, Message } from '@/ai/flows/chat.types';
import { chat } from '@/ai/flows/chat-flow';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, addDoc, serverTimestamp, orderBy, limit, setDoc, getDoc, Timestamp } from 'firebase/firestore';


function useConversations(userId: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const initialAiConvo = useMemo(() => {
    if (!userId) return null;
    const initialMessage: Message = { 
        id: 'initial', 
        senderId: 'ai-assistant', 
        text: "Hello! I'm your AI event planner. How can I help you brainstorm for your next event?", 
        timestamp: Timestamp.now() 
    };
    return {
        id: [userId, 'ai-assistant'].sort().join('_'),
        participants: {
            [userId]: { name: 'You', avatar: '' },
            'ai-assistant': { name: 'AI Planner', avatar: '/logo.png', isAi: true },
        },
        messages: [initialMessage],
        lastMessage: initialMessage,
    };
  }, [userId]);


  useEffect(() => {
    if (!userId || !initialAiConvo) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'conversations'),
      where(`participants.${userId}.name`, '!=', null)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convos: Conversation[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const lastMessage = data.lastMessage || data.messages?.[data.messages.length - 1] || null;
        convos.push({ 
            id: doc.id,
            ...data,
            lastMessage
        } as Conversation);
      });

      // Add a default AI conversation if it doesn't exist
      const hasAiConvo = convos.some(c => c.participants['ai-assistant']);
      if (!hasAiConvo) {
        convos.unshift(initialAiConvo as Conversation);
      }
      
      convos.sort((a, b) => {
        const timeA = a.lastMessage?.timestamp?.toDate?.()?.getTime() || 0;
        const timeB = b.lastMessage?.timestamp?.toDate?.()?.getTime() || 0;
        return timeB - timeA;
      });

      setConversations(convos);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching conversations: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, initialAiConvo]);

  return { conversations, loading };
}


export default function ChatPage() {
  const { user } = useAuth();
  const { conversations, loading: conversationsLoading } = useConversations(user?.uid || null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (conversationsLoading || conversations.length === 0) return;
  
    const urlParams = new URLSearchParams(window.location.search);
    const newConvoId = urlParams.get('new');
    
    if (newConvoId) {
      const newConvo = conversations.find(c => c.id === newConvoId);
      if (newConvo) {
        setActiveConversation(newConvo);
      }
      // Clean up URL after setting conversation
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else if (!activeConversation) {
      // Set the first conversation as active by default if none is selected
      setActiveConversation(conversations[0]);
    }
  }, [conversations, conversationsLoading, activeConversation]);


  useEffect(() => {
    if (!activeConversation) return;

    setMessagesLoading(true);
    const messagesRef = collection(db, 'conversations', activeConversation.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(50));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
       // If it's the initial AI message, don't fetch from DB, use the hardcoded one.
      if (activeConversation.id === [user?.uid, 'ai-assistant'].sort().join('_') && msgs.length === 0) {
        setMessages(activeConversation.messages);
      } else {
        setMessages(msgs);
      }
      setMessagesLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setMessagesLoading(false);
    });

    return () => unsubscribe();
  }, [activeConversation?.id, activeConversation, user?.uid]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages, aiTyping]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !activeConversation || !user) return;

    const currentMessageText = newMessage;
    setNewMessage('');

    const conversationRef = doc(db, 'conversations', activeConversation.id);
    const messagesRef = collection(conversationRef, 'messages');

    const userMessage: Omit<Message, 'id' | 'timestamp'> = {
      senderId: user.uid,
      text: currentMessageText,
    };
    
    // Optimistically update UI
    const tempMessage: Message = { ...userMessage, id: Date.now().toString(), timestamp: Timestamp.now() };
    setMessages(prev => [...prev, tempMessage]);

    const messageTimestamp = serverTimestamp();
    await addDoc(messagesRef, { ...userMessage, timestamp: messageTimestamp });
    
    // Update last message on conversation
    const lastMessageData = { text: currentMessageText, timestamp: messageTimestamp };
    
    // Check if conversation exists before trying to update it.
    const convoSnap = await getDoc(conversationRef);
    if(convoSnap.exists()) {
        await setDoc(conversationRef, { lastMessage: lastMessageData, updatedAt: serverTimestamp() }, { merge: true });
    } else {
        await setDoc(conversationRef, { ...activeConversation, lastMessage: lastMessageData, createdAt: serverTimestamp() });
    }


    const otherParticipant = Object.keys(activeConversation.participants).find(id => id !== user.uid);
    if (otherParticipant === 'ai-assistant') {
        setAiTyping(true);
        try {
            const aiResponse = await chat({ message: currentMessageText });
            const aiMessage: Omit<Message, 'id' | 'timestamp'> = {
                senderId: 'ai-assistant',
                text: aiResponse,
            };
            const aiTimestamp = serverTimestamp();
            await addDoc(messagesRef, { ...aiMessage, timestamp: aiTimestamp });
             await setDoc(conversationRef, { lastMessage: {text: aiResponse, timestamp: aiTimestamp}, updatedAt: serverTimestamp() }, { merge: true });

        } catch(e) {
            console.error(e);
            toast({
                variant: 'destructive',
                title: 'AI Error',
                description: "Sorry, I'm having trouble connecting right now."
            });
        } finally {
            setAiTyping(false);
        }
    }
  };

  const getOtherParticipant = (convo: Conversation) => {
      if (!user) return null;
      const otherParticipantId = Object.keys(convo.participants).find(id => id !== user.uid);
      return otherParticipantId ? convo.participants[otherParticipantId] : null;
  }

  const ConversationList = () => (
    <div className='bg-background h-full flex flex-col'>
        <div className='p-3 flex justify-between items-center border-b shrink-0'>
            <h1 className='text-xl font-bold'>Messages</h1>
            <Button variant='ghost' size='icon'>
                <Info className='w-4 h-4' />
            </Button>
        </div>
        <div className='p-2 space-y-2 overflow-y-auto flex-1'>
            {conversationsLoading ? (
                <div className='flex justify-center items-center h-full'>
                    <Loader className="w-5 h-5 animate-spin" />
                </div>
            ) : (
                <>
                <h2 className='text-xs font-semibold text-muted-foreground px-2'>Chats</h2>
                {conversations.map((convo) => {
                    const otherParticipant = getOtherParticipant(convo);
                    if (!otherParticipant) return null;
                    const lastMessageTime = convo.lastMessage?.timestamp?.toDate ? formatDistanceToNow(convo.lastMessage.timestamp.toDate(), { addSuffix: true }) : '';
                    return (
                    <button
                        key={convo.id}
                        className={cn(
                            "w-full flex items-center gap-3 text-left p-2 rounded-lg hover:bg-muted",
                            activeConversation?.id === convo.id && 'bg-muted'
                        )}
                        onClick={() => setActiveConversation(convo)}
                    >
                        <Avatar className='h-10 w-10'>
                            <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} data-ai-hint="logo" />
                            <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <div className='flex justify-between items-center'>
                                <p className="font-semibold truncate text-sm">{otherParticipant.name}</p>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">{lastMessageTime}</p>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{convo.lastMessage?.text}</p>
                        </div>
                    </button>
                    )
                })}
                </>
            )}
        </div>
    </div>
  )

  const ActiveConversation = () => {
    if (!activeConversation || !user) return null;
    const otherParticipant = getOtherParticipant(activeConversation);

    return (
        <div className="flex flex-col h-full bg-muted/30">
            <header className="flex-shrink-0 flex items-center gap-3 p-2 border-b bg-background sticky top-0 z-10 md:top-14">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActiveConversation(null)}>
                    <ArrowLeft />
                </Button>
                <div className='flex items-center gap-2'>
                    <Avatar className='h-9 w-9'>
                        <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} data-ai-hint="logo" />
                        <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className='text-base font-semibold'>{otherParticipant?.name}</h2>
                </div>
                <div className='ml-auto flex items-center gap-1'>
                    <Button variant='ghost' size='icon'>
                        <Phone className='w-4 h-4' />
                    </Button>
                     <Button variant='ghost' size='icon'>
                        <MoreVertical className='w-4 h-4' />
                    </Button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                    <div className='flex justify-center items-center h-full'>
                        <Loader className="w-5 h-5 animate-spin" />
                    </div>
                ) : (
                    <>
                    {messages.map((message) => {
                    const fromMe = message.senderId === user.uid;
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
                                'max-w-md p-2 px-3 rounded-2xl',
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
                    {aiTyping && (
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
                    </>
                )}
            </main>
            <footer className="p-2 border-t bg-background flex-shrink-0 sticky bottom-0 md:bottom-16">
                <div className="flex w-full items-center space-x-2 bg-muted rounded-full pl-2 pr-1">
                 <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Smile className="w-5 h-5" />
                </Button>
                <Input
                    type="text"
                    placeholder="Type message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    disabled={aiTyping}
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none text-sm h-10"
                />
                 <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Paperclip className="w-5 h-5" />
                </Button>
                <Button onClick={handleSendMessage} disabled={aiTyping || !newMessage.trim()} size='icon' className='rounded-full h-8 w-8'>
                    <Send className="w-4 h-4" />
                </Button>
                </div>
            </footer>
        </div>
    )
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] h-[calc(100vh-3.5rem)]">
        <div className={cn("border-r h-full overflow-y-auto", activeConversation ? "hidden md:block" : "block")}>
           <ConversationList />
        </div>
        <div className={cn("md:col-start-2 h-full overflow-y-auto", !activeConversation && "hidden md:flex md:items-center md:justify-center")}>
           {activeConversation ? (
                <ActiveConversation />
            ) : (
                <div className="text-center p-4">
                     {conversationsLoading ? (
                        <Loader className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
                    ) : (
                    <>
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground" />
                    <h2 className="mt-2 text-lg font-semibold">Select a conversation</h2>
                    <p className="text-muted-foreground text-sm">Start chatting with your vendors and our AI assistant.</p>
                    </>
                    )}
                </div>
            )}
        </div>
      </div>
  );
}
