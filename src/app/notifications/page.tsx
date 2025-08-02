
import { Bell, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const notifications = [
  {
    type: "Booking Confirmed",
    message: "Your booking for The Grand Palace is confirmed for Oct 26, 2024.",
    time: "2 hours ago",
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
  },
  {
    type: "New Message",
    message: "Gourmet Delights sent you a message regarding your catering query.",
    time: "1 day ago",
    icon: <Clock className="w-6 h-6 text-blue-500" />,
  },
    {
    type: "Review Reminder",
    message: "Don't forget to leave a review for Lakeside Manor.",
    time: "3 days ago",
    icon: <Clock className="w-6 h-6 text-gray-500" />,
  },
];

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
       <div className="text-center mb-12">
        <Bell className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Notifications
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Stay updated with your event planning activities.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>You have {notifications.length} unread notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={index}>
                <div className="flex items-start gap-4 p-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {notification.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{notification.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
