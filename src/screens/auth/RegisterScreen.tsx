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
import {apiService} from '../../services/api';

const RegisterScreen: React.FC = ({navigation}: any) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    pin: '',
    confirmPin: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {register} = useAuth();

  const handleSendOtp = async () => {
    if (!formData.phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.sendOtp(formData.phone);
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent to your phone number');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.pin || !formData.confirmPin) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }

    if (!otpSent || !otp) {
      Alert.alert('Error', 'Please verify your phone number first');
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP first
      await apiService.verifyOtp(formData.phone, otp);
      
      // Then register
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        pin: formData.pin,
      });
    } catch (error: any) {
      Alert.alert('Registration Failed', error?.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View className="flex-1 px-6 py-8">
            <View className="mb-8">
              <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
                Create Account
              </Text>
              <Text className="text-center text-gray-600">
                Join Karyah and start managing projects
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </Text>
                <View className="flex-row space-x-2">
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChangeText={(value) => updateFormData('phone', value)}
                    keyboardType="phone-pad"
                  />
                  <TouchableOpacity
                    className="bg-primary-600 rounded-lg px-4 py-3"
                    onPress={handleSendOtp}
                    disabled={isLoading || otpSent}>
                    <Text className="text-white font-medium">
                      {otpSent ? 'Sent' : 'Send OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {otpSent && (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    OTP *
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                    placeholder="Enter OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>
              )}

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Location
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  placeholder="Enter your location"
                  value={formData.location}
                  onChangeText={(value) => updateFormData('location', value)}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  PIN *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  placeholder="Create a 6-digit PIN"
                  value={formData.pin}
                  onChangeText={(value) => updateFormData('pin', value)}
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Confirm PIN *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  placeholder="Confirm your PIN"
                  value={formData.confirmPin}
                  onChangeText={(value) => updateFormData('confirmPin', value)}
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity
                className={`bg-primary-600 rounded-lg py-4 mt-4 ${
                  isLoading ? 'opacity-50' : ''
                }`}
                onPress={handleRegister}
                disabled={isLoading}>
                <Text className="text-white text-center font-semibold text-lg">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-8">
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                className="py-2">
                <Text className="text-center text-primary-600 font-medium">
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;