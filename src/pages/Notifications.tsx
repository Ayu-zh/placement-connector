
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, CheckCheck, Trash2, UserPlus, MessageSquare } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { ApiService } from '@/services/api';
import { Notification } from '@/types/backend';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user notifications
  const { 
    data: notifications = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => user ? ApiService.notifications.getByUser(user.id) : Promise.resolve([]),
    enabled: !!user
  });

  // Mark notification as read mutation
  const markAsRead = useMutation({
    mutationFn: (notificationId: string) => ApiService.notifications.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  });

  // Mark all notifications as read mutation
  const markAllAsRead = useMutation({
    mutationFn: () => user ? ApiService.notifications.markAllAsRead(user.id) : Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      toast({
        title: "All notifications marked as read",
        description: "Your notifications have been updated."
      });
    }
  });

  // Delete notification mutation
  const deleteNotification = useMutation({
    mutationFn: (notificationId: string) => ApiService.notifications.delete(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      toast({
        title: "Notification deleted",
        description: "The notification has been removed."
      });
    }
  });

  // Auto-mark notifications as read when viewing them
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length > 0) {
      unreadNotifications.forEach(notification => {
        markAsRead.mutate(notification.id);
      });
    }
  }, [notifications]);

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'connection_request':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'request_accepted':
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case 'system':
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            Please log in to view your notifications.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              Loading notifications...
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-red-500">
              Error loading notifications. Please try again.
            </div>
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-4 opacity-30" />
              <p>You don't have any notifications yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.isRead ? "opacity-75" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-full p-2 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-base">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        
                        {notification.relatedTo && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {notification.relatedTo.name}
                            </Badge>
                          </div>
                        )}
                        
                        {notification.from && (
                          <p className="text-xs text-muted-foreground mt-2">
                            From: {notification.from.name}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center">
                          <Calendar className="h-3 w-3 mr-1 inline" />
                          {formatDate(notification.createdAt)}
                        </span>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => deleteNotification.mutate(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    
                    {notification.type === 'connection_request' && (
                      <div className="mt-3">
                        <Button size="sm" variant="default" className="mr-2">
                          <MessageSquare className="h-4 w-4 mr-1" /> Respond
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
