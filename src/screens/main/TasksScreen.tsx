import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {apiService} from '../../services/api';
import {Task} from '../../types';

const TasksScreen: React.FC = ({navigation}: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await apiService.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
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

  const handleCreateTask = () => {
    navigation.navigate('CreateTask');
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetails', {taskId: task.taskId});
  };

  const handleStatusUpdate = async (taskId: number, newStatus: string) => {
    try {
      await apiService.updateTask(taskId, {status: newStatus});
      loadTasks();
      Alert.alert('Success', 'Task status updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const statusFilters = [
    {key: 'all', label: 'All'},
    {key: 'pending', label: 'Pending'},
    {key: 'in-progress', label: 'In Progress'},
    {key: 'completed', label: 'Completed'},
  ];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-900">Tasks</Text>
          <TouchableOpacity
            onPress={handleCreateTask}
            className="bg-primary-600 px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">New Task</Text>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <TextInput
          className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900 mb-4"
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-2">
            {statusFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setFilterStatus(filter.key)}
                className={`px-4 py-2 rounded-full ${
                  filterStatus === filter.key
                    ? 'bg-primary-600'
                    : 'bg-gray-200'
                }`}>
                <Text
                  className={`font-medium ${
                    filterStatus === filter.key
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filteredTasks.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg mb-4">No tasks found</Text>
            <TouchableOpacity
              onPress={handleCreateTask}
              className="bg-primary-600 px-6 py-3 rounded-lg">
              <Text className="text-white font-medium">Create Your First Task</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <TouchableOpacity
              key={task.taskId}
              onPress={() => handleTaskPress(task)}
              className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-lg font-semibold text-gray-900 flex-1 mr-3">
                  {task.title}
                </Text>
                <View className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  <Text className="text-xs font-medium capitalize">
                    {task.priority}
                  </Text>
                </View>
              </View>
              
              <Text className="text-gray-600 mb-3" numberOfLines={2}>
                {task.description}
              </Text>
              
              <View className="flex-row justify-between items-center mb-3">
                <View className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                  <Text className="text-xs font-medium capitalize">
                    {task.status}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Text>
              </View>

              {/* Quick Status Actions */}
              {task.status !== 'completed' && task.status !== 'cancelled' && (
                <View className="flex-row space-x-2 pt-3 border-t border-gray-100">
                  {task.status === 'pending' && (
                    <TouchableOpacity
                      onPress={() => handleStatusUpdate(task.taskId, 'in-progress')}
                      className="bg-blue-600 px-3 py-1 rounded">
                      <Text className="text-white text-xs font-medium">Start</Text>
                    </TouchableOpacity>
                  )}
                  {task.status === 'in-progress' && (
                    <TouchableOpacity
                      onPress={() => handleStatusUpdate(task.taskId, 'completed')}
                      className="bg-green-600 px-3 py-1 rounded">
                      <Text className="text-white text-xs font-medium">Complete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TasksScreen;