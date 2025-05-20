import React from 'react';
import { Bell, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import useStore from '../store';

const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead } = useStore();
  
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <Button
            variant="outline"
            onClick={() => {
              // This would mark all as read in a real app
              alert("This would mark all notifications as read");
            }}
          >
            Mark all as read
          </Button>
        </div>
        
        {sortedNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedNotifications.map(notification => (
              <Card 
                key={notification.id} 
                className={notification.read ? 'bg-white' : 'bg-cyan-50 border-cyan-200'}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="primary" className="ml-2">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Check className="h-4 w-4" />}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;