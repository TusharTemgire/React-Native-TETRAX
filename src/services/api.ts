import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure the base URL for your backend
const BASE_URL = 'https://api.karyah.in/api'; // Update this with your actual backend URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  login: (email: string, pin: string) =>
    api.post('/auth/login', { email, pin }),
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
  
  sendOtp: (phone: string) =>
    api.post('/auth/send-otp', { phone }),
  
  verifyOtp: (phone: string, otp: string) =>
    api.post('/auth/verify-otp', { phone, otp }),
  
  // User endpoints
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (userData: any) =>
    api.put('/auth/profile', userData),
  
  // Projects endpoints
  getProjects: () =>
    api.get('/projects'),
  
  createProject: (projectData: any) =>
    api.post('/projects', projectData),
  
  getProject: (id: number) =>
    api.get(`/projects/${id}`),
  
  updateProject: (id: number, projectData: any) =>
    api.put(`/projects/${id}`, projectData),
  
  deleteProject: (id: number) =>
    api.delete(`/projects/${id}`),
  
  // Tasks endpoints
  getTasks: (projectId?: number) =>
    api.get('/tasks', { params: { projectId } }),
  
  createTask: (taskData: any) =>
    api.post('/tasks', taskData),
  
  getTask: (id: number) =>
    api.get(`/tasks/${id}`),
  
  updateTask: (id: number, taskData: any) =>
    api.put(`/tasks/${id}`, taskData),
  
  deleteTask: (id: number) =>
    api.delete(`/tasks/${id}`),
  
  // Issues endpoints
  getIssues: (projectId?: number) =>
    api.get('/issues', { params: { projectId } }),
  
  createIssue: (issueData: any) =>
    api.post('/issues', issueData),
  
  getIssue: (id: number) =>
    api.get(`/issues/${id}`),
  
  updateIssue: (id: number, issueData: any) =>
    api.put(`/issues/${id}`, issueData),
  
  deleteIssue: (id: number) =>
    api.delete(`/issues/${id}`),
  
  // Notifications endpoints
  getNotifications: () =>
    api.get('/notifications'),
  
  markNotificationAsRead: (id: number) =>
    api.put(`/notifications/${id}/read`),
  
  // Connections endpoints
  getConnections: () =>
    api.get('/connections'),
  
  sendConnectionRequest: (receiverId: number) =>
    api.post('/connections/send', { receiverId }),
  
  acceptConnection: (connectionId: number) =>
    api.put(`/connections/${connectionId}/accept`),
  
  rejectConnection: (connectionId: number) =>
    api.put(`/connections/${connectionId}/reject`),
  
  // Worklists endpoints
  getWorklists: () =>
    api.get('/worklists'),
  
  createWorklist: (worklistData: any) =>
    api.post('/worklists', worklistData),
  
  updateWorklist: (id: number, worklistData: any) =>
    api.put(`/worklists/${id}`, worklistData),
  
  deleteWorklist: (id: number) =>
    api.delete(`/worklists/${id}`),
};

export default api;