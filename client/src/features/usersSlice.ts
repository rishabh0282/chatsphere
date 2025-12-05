import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UsersState {
  online: string[];
  typing: Record<string, string[]>;
}

const initialState: UsersState = {
  online: [],
  typing: {}
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setOnline(state, action: PayloadAction<string[]>) {
      state.online = action.payload;
    },
    setTyping(state, action: PayloadAction<{ channelId: string; users: string[] }>) {
      state.typing[action.payload.channelId] = action.payload.users;
    }
  }
});

export const { setOnline, setTyping } = usersSlice.actions;
export default usersSlice.reducer;

