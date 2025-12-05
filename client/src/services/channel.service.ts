import api from './api';
import { Channel } from '../types';

export interface CreateChannelData {
  name: string;
  description?: string;
  type?: 'PUBLIC' | 'PRIVATE' | 'DIRECT';
}

export interface UpdateChannelData {
  name?: string;
  description?: string;
}

export const channelService = {
  async getChannels(): Promise<Channel[]> {
    const response = await api.get<Channel[]>('/channels');
    return response.data;
  },

  async getChannel(id: string): Promise<Channel> {
    const response = await api.get<Channel>(`/channels/${id}`);
    return response.data;
  },

  async createChannel(data: CreateChannelData): Promise<Channel> {
    const response = await api.post<Channel>('/channels', data);
    return response.data;
  },

  async updateChannel(id: string, data: UpdateChannelData): Promise<Channel> {
    const response = await api.put<Channel>(`/channels/${id}`, data);
    return response.data;
  },

  async deleteChannel(id: string): Promise<void> {
    await api.delete(`/channels/${id}`);
  },

  async addMember(channelId: string, userId: string): Promise<void> {
    await api.post(`/channels/${channelId}/members`, { userId });
  },

  async removeMember(channelId: string, userId: string): Promise<void> {
    await api.delete(`/channels/${channelId}/members/${userId}`);
  },

  async getMembers(channelId: string) {
    const response = await api.get(`/channels/${channelId}/members`);
    return response.data;
  },
};

