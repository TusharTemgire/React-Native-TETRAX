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
import {Issue} from '../../types';

const IssuesScreen: React.FC = ({navigation}: any) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const response = await apiService.getIssues();
      setIssues(response.data);
    } catch (error) {
      console.error('Error loading issues:', error);
      Alert.alert('Error', 'Failed to load issues');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadIssues();
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'reopened':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const handleCreateIssue = () => {
    navigation.navigate('CreateIssue');
  };

  const handleIssuePress = (issue: Issue) => {
    navigation.navigate('IssueDetails', {issueId: issue.issueId});
  };

  const statusFilters = [
    {key: 'all', label: 'All'},
    {key: 'open', label: 'Open'},
    {key: 'in-progress', label: 'In Progress'},
    {key: 'resolved', label: 'Resolved'},
    {key: 'closed', label: 'Closed'},
  ];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading issues...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-900">Issues</Text>
          <TouchableOpacity
            onPress={handleCreateIssue}
            className="bg-red-600 px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">Report Issue</Text>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <TextInput
          className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900 mb-4"
          placeholder="Search issues..."
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
                    ? 'bg-red-600'
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
        {filteredIssues.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg mb-4">No issues found</Text>
            <TouchableOpacity
              onPress={handleCreateIssue}
              className="bg-red-600 px-6 py-3 rounded-lg">
              <Text className="text-white font-medium">Report Your First Issue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredIssues.map((issue) => (
            <TouchableOpacity
              key={issue.issueId}
              onPress={() => handleIssuePress(issue)}
              className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-lg font-semibold text-gray-900 flex-1 mr-3">
                  {issue.title}
                </Text>
                <View className={`px-2 py-1 rounded-full ${getPriorityColor(issue.priority)}`}>
                  <Text className="text-xs font-medium capitalize">
                    {issue.priority}
                  </Text>
                </View>
              </View>
              
              <Text className="text-gray-600 mb-3" numberOfLines={2}>
                {issue.description}
              </Text>
              
              <View className="flex-row justify-between items-center mb-3">
                <View className={`px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                  <Text className="text-xs font-medium capitalize">
                    {issue.status.replace('-', ' ')}
                  </Text>
                </View>
                {issue.dueDate && (
                  <Text className="text-sm text-gray-500">
                    Due: {new Date(issue.dueDate).toLocaleDateString()}
                  </Text>
                )}
              </View>

              {/* Approval Status */}
              <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                <View className={`px-2 py-1 rounded-full ${
                  issue.isApproved ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    issue.isApproved ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {issue.isApproved ? 'Approved' : 'Pending Approval'}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">
                  Created: {new Date(issue.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default IssuesScreen;