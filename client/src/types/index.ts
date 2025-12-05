export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  status?: 'ONLINE' | 'OFFLINE' | 'AWAY';
  lastSeen?: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type?: 'PUBLIC' | 'PRIVATE' | 'DIRECT';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  content: string;
  channelId: string;
  senderId: string;
  sender?: User;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
  attachments?: string[];
  reactions?: Reaction[];
}

export interface Reaction {
  id: string;
  emoji: string;
  messageId: string;
  userId: string;
  user?: User;
  createdAt?: string;
}

