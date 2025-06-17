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
import {Project} from '../../types';

const ProjectsScreen: React.FC = ({navigation}: any) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await apiService.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
      Alert.alert('Error', 'Failed to load projects');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProjects();
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateProject = () => {
    navigation.navigate('CreateProject');
  };

  const handleProjectPress = (project: Project) => {
    navigation.navigate('ProjectDetails', {projectId: project.projectId});
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading projects...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-900">Projects</Text>
          <TouchableOpacity
            onPress={handleCreateProject}
            className="bg-primary-600 px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">New Project</Text>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <TextInput
          className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900"
          placeholder="Search projects..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filteredProjects.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg mb-4">No projects found</Text>
            <TouchableOpacity
              onPress={handleCreateProject}
              className="bg-primary-600 px-6 py-3 rounded-lg">
              <Text className="text-white font-medium">Create Your First Project</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredProjects.map((project) => (
            <TouchableOpacity
              key={project.projectId}
              onPress={() => handleProjectPress(project)}
              className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-lg font-semibold text-gray-900 flex-1 mr-3">
                  {project.name}
                </Text>
                <View className={`px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  <Text className="text-xs font-medium capitalize">
                    {project.status}
                  </Text>
                </View>
              </View>
              
              <Text className="text-gray-600 mb-4" numberOfLines={3}>
                {project.description}
              </Text>
              
              <View className="flex-row justify-between items-center mb-3">
                <View>
                  <Text className="text-sm text-gray-500">Progress</Text>
                  <Text className="text-lg font-semibold text-primary-600">
                    {project.progress}%
                  </Text>
                </View>
                <View className="flex-1 mx-4">
                  <View className="w-full h-2 bg-gray-200 rounded-full">
                    <View
                      className="h-2 bg-primary-600 rounded-full"
                      style={{width: `${project.progress}%`}}
                    />
                  </View>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                <Text className="text-sm text-gray-500">
                  Start: {new Date(project.startDate).toLocaleDateString()}
                </Text>
                <Text className="text-sm text-gray-500">
                  End: {new Date(project.endDate).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectsScreen;