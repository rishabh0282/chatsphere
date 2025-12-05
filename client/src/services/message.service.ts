import api from './api';
import { Message } from '../types';

export interface SendMessageData {
  content: string;
  channelId: string;
  parentId?: string;
  attachments?: string[];
}

export interface UpdateMessageData {
  content: string;
}

export const messageService = {
  async getMessages(
    channelId: string,
    limit: number = 50,
    before?: string
  ): Promise<Message[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (before) params.append('before', before);

    const response = await api.get<Message[]>(
      `/channels/${channelId}/messages?${params}`
    );
    return response.data;
  },

  async getMessage(id: string): Promise<Message> {
    const response = await api.get<Message>(`/messages/${id}`);
    return response.data;
  },

  async sendMessage(data: SendMessageData): Promise<Message> {
    const response = await api.post<Message>('/messages', data);
    return response.data;
  },

  async updateMessage(id: string, data: UpdateMessageData): Promise<Message> {
    const response = await api.put<Message>(`/messages/${id}`, data);
    return response.data;
  },

  async deleteMessage(id: string): Promise<void> {
    await api.delete(`/messages/${id}`);
  },

  async addReaction(messageId: string, emoji: string): Promise<void> {
    await api.post(`/messages/${messageId}/reactions`, { emoji });
  },

  async removeReaction(messageId: string, emoji: string): Promise<void> {
    await api.delete(`/messages/${messageId}/reactions/${emoji}`);
  },
};

