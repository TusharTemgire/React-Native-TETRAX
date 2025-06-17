export interface User {
  userId: number;
  name: string;
  email: string;
  phone: string;
  location?: string;
  bio?: string;
  profilePhoto?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  projectId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  taskId: number;
  title: string;
  description: string;
  projectId: number;
  assignedUserId: number;
  creatorUserId: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  parentId?: number;
  reassignedUserIds?: number[];
  dependentTaskIds?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  issueId: number;
  title: string;
  description: string;
  projectId: number;
  creatorUserId: number;
  assignedUserId?: number;
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'reopened';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  isApproved: boolean;
  reassignHistory?: any[];
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  notificationId: number;
  userId: number;
  type: 'task' | 'project' | 'issue' | 'connection' | 'system';
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  connectionId: number;
  senderId: number;
  receiverId: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Worklist {
  worklistId: number;
  name: string;
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}