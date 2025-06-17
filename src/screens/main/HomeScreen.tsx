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
import {useAuth} from '../../context/AuthContext';
import {apiService} from '../../services/api';
import {Project, Task, Issue, Notification} from '../../types';

const HomeScreen: React.FC = ({navigation}: any) => {
  const {user} = useAuth();
  const [dashboardData, setDashboardData] = useState({
    projects: [] as Project[],
    tasks: [] as Task[],
    issues: [] as Issue[],
    notifications: [] as Notification[],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [projectsRes, tasksRes, issuesRes, notificationsRes] = await Promise.all([
        apiService.getProjects(),
        apiService.getTasks(),
        apiService.getIssues(),
        apiService.getNotifications(),
      ]);

      setDashboardData({
        projects: projectsRes.data.slice(0, 3), // Show only 3 recent projects
        tasks: tasksRes.data.slice(0, 5), // Show only 5 recent tasks
        issues: issuesRes.data.slice(0, 3), // Show only 3 recent issues
        notifications: notificationsRes.data.slice(0, 3), // Show only 3 recent notifications
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'in-progress':
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </Text>
          <Text className="text-gray-600 mt-1">
            Here's what's happening with your projects
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between space-x-4">
            <View className="flex-1 bg-white p-4 rounded-lg border border-gray-200">
              <Text className="text-2xl font-bold text-primary-600">
                {dashboardData.projects.length}
              </Text>
              <Text className="text-gray-600 text-sm">Active Projects</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-lg border border-gray-200">
              <Text className="text-2xl font-bold text-orange-600">
                {dashboardData.tasks.length}
              </Text>
              <Text className="text-gray-600 text-sm">Pending Tasks</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-lg border border-gray-200">
              <Text className="text-2xl font-bold text-red-600">
                {dashboardData.issues.length}
              </Text>
              <Text className="text-gray-600 text-sm">Open Issues</Text>
            </View>
          </View>
        </View>

        {/* Recent Projects */}
        <View className="px-6 py-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Recent Projects
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
              <Text className="text-primary-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          {dashboardData.projects.map((project) => (
            <View
              key={project.projectId}
              className="bg-white p-4 rounded-lg mb-3 border border-gray-200">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-semibold text-gray-900 flex-1">
                  {project.name}
                </Text>
                <View className={`px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  <Text className="text-xs font-medium capitalize">
                    {project.status}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-600 mb-3" numberOfLines={2}>
                {project.description}
              </Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-500">
                  Progress: {project.progress}%
                </Text>
                <View className="w-20 h-2 bg-gray-200 rounded-full">
                  <View
                    className="h-2 bg-primary-600 rounded-full"
                    style={{width: `${project.progress}%`}}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Tasks */}
        <View className="px-6 py-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Recent Tasks
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
              <Text className="text-primary-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          {dashboardData.tasks.map((task) => (
            <View
              key={task.taskId}
              className="bg-white p-4 rounded-lg mb-3 border border-gray-200">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-base font-medium text-gray-900 flex-1">
                  {task.title}
                </Text>
                <View className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  <Text className="text-xs font-medium capitalize">
                    {task.priority}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                {task.description}
              </Text>
              <View className="flex-row justify-between items-center">
                <View className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                  <Text className="text-xs font-medium capitalize">
                    {task.status}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-between space-x-4">
            <TouchableOpacity 
              className="flex-1 bg-primary-600 p-4 rounded-lg"
              onPress={() => navigation.navigate('Projects', {screen: 'CreateProject'})}>
              <Text className="text-white font-semibold text-center">
                New Project
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-orange-600 p-4 rounded-lg"
              onPress={() => navigation.navigate('Tasks', {screen: 'CreateTask'})}>
              <Text className="text-white font-semibold text-center">
                New Task
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;