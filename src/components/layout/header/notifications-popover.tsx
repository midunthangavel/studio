
'use client';

import { Bell, CheckCircle, Clock, MessageSquare, Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const notifications = [
    {
      type: "Booking Confirmed",
      message: "Your booking for The Grand Palace is confirmed for Oct 26, 2024.",
      time: "2 hours ago",
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      read: false,
    },
    {
      type: "New Message",
      message: "Gourmet Delights sent you a message regarding your catering query.",
      time: "1 day ago",
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      read: true,
    },
      {
      type: "Review Reminder",
      message: "Don't forget to leave a review for Lakeside Manor.",
      time: "3 days ago",
      icon: <Clock className="w-6 h-6 text-gray-500" />,
      read: true,
    },
     {
      type: "Booking Update",
      message: "Prestige Bridal Cars has updated your booking status to Pending.",
      time: "4 days ago",
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      read: false,
    },
    {
      type: "New Idea!",
      message: "Your AI Assistant has new ideas for your anniversary party.",
      time: "5 days ago",
      icon: <Gift className="w-6 h-6 text-pink-500" />,
      read: false,
    },
];

const unreadNotifications = notifications.filter(n => !n.read);

const NotificationItem = ({ notification }: { notification: (typeof notifications)[0]}) => (
    <div className="flex items-start gap-4 p-4 hover:bg-muted/50">
        <div className="bg-primary/10 p-2 rounded-full">
            {notification.icon}
        </div>
        <div className="flex-1">
            <p className="font-semibold text-sm">{notification.type}</p>
            <p className="text-xs text-muted-foreground">
                {notification.message}
            </p>
        </div>
        {!notification.read && (
            <div className="w-2 h-2 rounded-full bg-primary mt-1"></div>
        )}
  </div>
)

export function NotificationsPopover() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <CardTitle className="text-lg">Notifications</CardTitle>
        <Button variant="ghost" size="sm">
            <Check className="w-4 h-4 mr-2"/>
            Mark all as read
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="max-h-96 overflow-y-auto">
             <div className="flex flex-col">
                {notifications.map((notification, index) => (
                    <NotificationItem key={index} notification={notification} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="unread" className="max-h-96 overflow-y-auto">
             {unreadNotifications.length > 0 ? (
                <div className="flex flex-col">
                    {unreadNotifications.map((notification, index) => (
                        <NotificationItem key={index} notification={notification} />
                    ))}
                </div>
             ) : (
                <div className="text-center p-8">
                    <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                    <h3 className="font-semibold">No unread notifications</h3>
                    <p className="text-sm text-muted-foreground">You're all caught up!</p>
                </div>
             )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
