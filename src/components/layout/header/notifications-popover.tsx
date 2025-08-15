
'use client';

import { Bell, CheckCircle, Clock, MessageSquare, Gift, Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, doc, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
    id: string;
    type: string;
    message: string;
    timestamp: any;
    read: boolean;
    iconName: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
    "Booking Confirmed": <CheckCircle className="w-5 h-5 text-green-500" />,
    "New Message": <MessageSquare className="w-5 h-5 text-blue-500" />,
    "Review Reminder": <Clock className="w-5 h-5 text-gray-500" />,
    "Booking Update": <Clock className="w-5 h-5 text-yellow-500" />,
    "New Idea!": <Gift className="w-5 h-5 text-pink-500" />,
    "Review Received": <CheckCircle className="w-5 h-5 text-green-500" />,
    "Default": <Bell className="w-5 h-5 text-gray-500" />,
}

function useNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'notifications'), 
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedNotifications = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Notification));
            setNotifications(fetchedNotifications);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching notifications:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const markAllAsRead = async () => {
        if (!user) return;
        const unreadNotifs = notifications.filter(n => !n.read);
        if (unreadNotifs.length === 0) return;

        const batch = writeBatch(db);
        unreadNotifs.forEach(notif => {
            const notifRef = doc(db, 'notifications', notif.id);
            batch.update(notifRef, { read: true });
        });
        await batch.commit();
    }

    return { notifications, loading, markAllAsRead };
}

const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div className="flex items-start gap-3 p-3 hover:bg-muted/50">
        <div className="bg-primary/10 p-1.5 rounded-full">
            {iconMap[notification.iconName] || iconMap['Default']}
        </div>
        <div className="flex-1">
            <p className="font-semibold text-xs">{notification.type}</p>
            <p className="text-xs text-muted-foreground">
                {notification.message}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-0.5">
                {notification.timestamp ? formatDistanceToNow(notification.timestamp.toDate(), { addSuffix: true }) : 'just now'}
            </p>
        </div>
        {!notification.read && (
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
        )}
  </div>
)

export function NotificationsPopover() {
    const { notifications, loading, markAllAsRead } = useNotifications();
    const unreadNotifications = notifications.filter(n => !n.read);
    const hasUnread = unreadNotifications.length > 0;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
        <CardTitle className="text-base">Notifications</CardTitle>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllAsRead} disabled={!hasUnread}>
            <Check className="w-3 h-3 mr-1.5"/>
            Mark all as read
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b h-9">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
          </TabsList>
           <TabsContent value="all" className="max-h-80 overflow-y-auto">
             {loading ? (
                 <div className="flex justify-center items-center p-6"><Loader className="animate-spin" /></div>
             ) : notifications.length > 0 ? (
                <div className="flex flex-col">
                    {notifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </div>
             ) : (
                <div className="text-center p-6">
                    <Bell className="mx-auto h-7 w-7 text-muted-foreground mb-3" />
                    <h3 className="font-semibold text-sm">No notifications yet</h3>
                    <p className="text-xs text-muted-foreground">Important updates will appear here.</p>
                </div>
             )}
          </TabsContent>
          <TabsContent value="unread" className="max-h-80 overflow-y-auto">
             {loading ? (
                <div className="flex justify-center items-center p-6"><Loader className="animate-spin" /></div>
             ) : unreadNotifications.length > 0 ? (
                <div className="flex flex-col">
                    {unreadNotifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </div>
             ) : (
                <div className="text-center p-6">
                    <Bell className="mx-auto h-7 w-7 text-muted-foreground mb-3" />
                    <h3 className="font-semibold text-sm">No unread notifications</h3>
                    <p className="text-xs text-muted-foreground">You're all caught up!</p>
                </div>
             )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
