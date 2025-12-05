import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Channel } from '../types';

interface ChannelsState {
  list: Channel[];
  activeChannelId: string | null;
}

const initialState: ChannelsState = {
  list: [],
  activeChannelId: null
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels(state, action: PayloadAction<Channel[]>) {
      state.list = action.payload;
    },
    setActiveChannel(state, action: PayloadAction<string | null>) {
      state.activeChannelId = action.payload;
    }
  }
});

export const { setChannels, setActiveChannel } = channelsSlice.actions;
export default channelsSlice.reducer;

