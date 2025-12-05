import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../types';

interface MessagesState {
  byChannel: Record<string, Message[]>;
}

const initialState: MessagesState = {
  byChannel: {}
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<{ channelId: string; messages: Message[] }>) {
      state.byChannel[action.payload.channelId] = action.payload.messages;
    },
    addMessage(state, action: PayloadAction<Message>) {
      const channelMessages = state.byChannel[action.payload.channelId] || [];
      state.byChannel[action.payload.channelId] = [...channelMessages, action.payload];
    }
  }
});

export const { setMessages, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;

