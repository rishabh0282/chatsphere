export interface SocketMessagePayload {
  id: string;
  content: string;
  channelId: string;
  senderId: string;
  attachments?: string[];
  createdAt?: string;
}

