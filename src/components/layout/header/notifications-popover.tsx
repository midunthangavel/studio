
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
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      read: false,
    },
    {
      type: "New Message",
      message: "Gourmet Delights sent you a message regarding your catering query.",
      time: "1 day ago",
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      read: true,
    },
      {
      type: "Review Reminder",
      message: "Don't forget to leave a review for Lakeside Manor.",
      time: "3 days ago",
      icon: <Clock className="w-5 h-5 text-gray-500" />,
      read: true,
    },
     {
      type: "Booking Update",
      message: "Prestige Bridal Cars has updated your booking status to Pending.",
      time: "4 days ago",
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      read: false,
    },
    {
      type: "New Idea!",
      message: "Your AI Assistant has new ideas for your anniversary party.",
      time: "5 days ago",
      icon: <Gift className="w-5 h-5 text-pink-500" />,
      read: false,
    },
];

const unreadNotifications = notifications.filter(n => !n.read);

const NotificationItem = ({ notification }: { notification: (typeof notifications)[0]}) => (
    <div className="flex items-start gap-3 p-3 hover:bg-muted/50">
        <div className="bg-primary/10 p-1.5 rounded-full">
            {notification.icon}
        </div>
        <div className="flex-1">
            <p className="font-semibold text-xs">{notification.type}</p>
            <p className="text-xs text-muted-foreground">
                {notification.message}
            </p>
        </div>
        {!notification.read && (
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
        )}
  </div>
)

export function NotificationsPopover() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
        <CardTitle className="text-base">Notifications</CardTitle>
        <Button variant="ghost" size="sm" className="h-7 text-xs">
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
             <div className="flex flex-col">
                {notifications.map((notification, index) => (
                    <NotificationItem key={index} notification={notification} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="unread" className="max-h-80 overflow-y-auto">
             {unreadNotifications.length > 0 ? (
                <div className="flex flex-col">
                    {unreadNotifications.map((notification, index) => (
                        <NotificationItem key={index} notification={notification} />
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
