export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: 'Low' | 'Moderate' | 'Extreme';
  status: 'Not Started' | 'In Progress' | 'Completed';
  due_date: string | null;
  image_path: string | null;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  completed: number;
  in_progress: number;
  not_started: number;
}