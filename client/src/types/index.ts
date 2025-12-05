export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type?: 'PUBLIC' | 'PRIVATE' | 'DIRECT';
}

export interface Message {
  id: string;
  content: string;
  channelId: string;
  senderId: string;
  createdAt?: string;
  attachments?: string[];
}

