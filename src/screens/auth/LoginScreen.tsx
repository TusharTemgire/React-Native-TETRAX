import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';

const LoginScreen: React.FC = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuth();

  const handleLogin = async () => {
    if (!email || !pin) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, pin);
    } catch (error: any) {
      Alert.alert('Login Failed', error?.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View className="flex-1 justify-center px-6">
            <View className="mb-8">
              <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
                Welcome to Karyah
              </Text>
              <Text className="text-center text-gray-600">
                Project Management Made Simple
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  PIN
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChangeText={setPin}
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity
                className={`bg-primary-600 rounded-lg py-4 ${
                  isLoading ? 'opacity-50' : ''
                }`}
                onPress={handleLogin}
                disabled={isLoading}>
                <Text className="text-white text-center font-semibold text-lg">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-8">
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                className="py-2">
                <Text className="text-center text-primary-600 font-medium">
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;