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