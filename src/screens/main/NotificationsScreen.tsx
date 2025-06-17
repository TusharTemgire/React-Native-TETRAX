import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {apiService} from '../../services/api';
import {Notification} from '../../types';

const NotificationsScreen: React.FC = ({navigation}: any) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await apiService.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.notificationId === notificationId
            ? {...notification, isRead: true}
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(n => apiService.markNotificationAsRead(n.notificationId))
      );
      setNotifications(prev =>
        prev.map(notification => ({...notification, isRead: true}))
      );
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return '📋';
      case 'project':
        return '📁';
      case 'issue':
        return '🚨';
      case 'connection':
        return '👥';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Notifications</Text>
            {unreadCount > 0 && (
              <Text className="text-sm text-gray-600">
                {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </Text>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              className="bg-primary-600 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium">Mark All Read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {notifications.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-4xl mb-4">🔔</Text>
            <Text className="text-gray-500 text-lg mb-2">No notifications yet</Text>
            <Text className="text-gray-400 text-center px-8">
              You'll receive notifications about project updates, task assignments, and more.
            </Text>
          </View>
        ) : (
          <View className="px-6 py-4">
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.notificationId}
                onPress={() => !notification.isRead && markAsRead(notification.notificationId)}
                className={`p-4 rounded-lg mb-3 border ${
                  notification.isRead
                    ? 'bg-white border-gray-200'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                <View className="flex-row items-start">
                  <Text className="text-2xl mr-3">
                    {getNotificationIcon(notification.type)}
                  </Text>
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text
                        className={`text-base flex-1 mr-2 ${
                          notification.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
                        }`}>
                        {notification.message}
                      </Text>
                      {!notification.isRead && (
                        <View className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-sm text-gray-500 capitalize">
                        {notification.type}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {formatTimeAgo(notification.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;