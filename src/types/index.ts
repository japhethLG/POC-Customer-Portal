export interface Booking {
  id: string;
  ref: string;
  title: string;
  status: 'Scheduled' | 'In Progress' | 'Complete';
  dateDisplay: {
    day: string;
    month: string;
  };
  fullDate: string;
  address: string;
  technician: {
    name: string;
    avatar: string;
  };
  type: string;
  attachments: Attachment[];
}

export interface Attachment {
  name: string;
  type: 'pdf' | 'image';
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system' | 'technician';
  timestamp: Date;
  isTyping?: boolean;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    email: string;
    name: string;
  };
  message?: string;
}

// ServiceM8 Integration Types (Future)
export interface ServiceM8Config {
  apiKey?: string;
  webhookSecret?: string;
  enabled: boolean;
}

export interface ServiceM8Job {
  uuid: string;
  status: string;
  job_address: string;
  job_description: string;
  // Add more fields as needed for ServiceM8 integration
}

