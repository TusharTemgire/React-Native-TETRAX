import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import {apiService} from '../../services/api';

const ProfileScreen: React.FC = ({navigation}: any) => {
  const {user, logout, updateUser} = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.updateProfile(formData);
      updateUser(response.data);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', style: 'destructive', onPress: logout},
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Profile</Text>
          {!isEditing ? (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="bg-primary-600 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium">Edit</Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={handleCancel}
                className="bg-gray-500 px-4 py-2 rounded-lg">
                <Text className="text-white font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={isLoading}
                className={`bg-primary-600 px-4 py-2 rounded-lg ${
                  isLoading ? 'opacity-50' : ''
                }`}>
                <Text className="text-white font-medium">
                  {isLoading ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Profile Picture */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-primary-600 items-center justify-center mb-4">
            {user?.profilePhoto ? (
              <Image
                source={{uri: user.profilePhoto}}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <Text className="text-white text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            )}
          </View>
          {isEditing && (
            <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-lg">
              <Text className="text-gray-700 font-medium">Change Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Information */}
        <View className="space-y-6">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Name</Text>
            {isEditing ? (
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                placeholder="Enter your name"
              />
            ) : (
              <Text className="text-lg text-gray-900 bg-white px-4 py-3 rounded-lg border border-gray-200">
                {user?.name || 'Not set'}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
            {isEditing ? (
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text className="text-lg text-gray-900 bg-white px-4 py-3 rounded-lg border border-gray-200">
                {user?.email || 'Not set'}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Phone</Text>
            {isEditing ? (
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text className="text-lg text-gray-900 bg-white px-4 py-3 rounded-lg border border-gray-200">
                {user?.phone || 'Not set'}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Location</Text>
            {isEditing ? (
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
                placeholder="Enter your location"
              />
            ) : (
              <Text className="text-lg text-gray-900 bg-white px-4 py-3 rounded-lg border border-gray-200">
                {user?.location || 'Not set'}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Bio</Text>
            {isEditing ? (
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={formData.bio}
                onChangeText={(value) => updateFormData('bio', value)}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            ) : (
              <Text className="text-lg text-gray-900 bg-white px-4 py-3 rounded-lg border border-gray-200 min-h-[100px]">
                {user?.bio || 'No bio added yet'}
              </Text>
            )}
          </View>

          {/* Account Settings */}
          <View className="pt-6 border-t border-gray-200">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Account Settings
            </Text>
            
            <View className="space-y-3">
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
                className="bg-white p-4 rounded-lg border border-gray-200 flex-row justify-between items-center">
                <Text className="text-gray-900 font-medium">Notifications</Text>
                <Text className="text-gray-400">›</Text>
              </TouchableOpacity>

              <TouchableOpacity className="bg-white p-4 rounded-lg border border-gray-200 flex-row justify-between items-center">
                <Text className="text-gray-900 font-medium">Privacy Settings</Text>
                <View className={`px-2 py-1 rounded-full ${
                  user?.isPublic ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    user?.isPublic ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {user?.isPublic ? 'Public' : 'Private'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="bg-white p-4 rounded-lg border border-gray-200 flex-row justify-between items-center">
                <Text className="text-gray-900 font-medium">Change PIN</Text>
                <Text className="text-gray-400">›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-600 p-4 rounded-lg mt-8">
            <Text className="text-white font-semibold text-center text-lg">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;