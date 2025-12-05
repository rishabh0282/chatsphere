import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface UsersState {
  list: User[];
  online: string[];
  typing: Record<string, string[]>;
}

const initialState: UsersState = {
  list: [],
  online: [],
  typing: {}
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.list = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      if (!state.list.find(u => u.id === action.payload.id)) {
        state.list.push(action.payload);
      }
    },
    updateUser(state, action: PayloadAction<User>) {
      const index = state.list.findIndex(u => u.id === action.payload.id);
      if (index >= 0) {
        state.list[index] = action.payload;
      }
    },
    setOnline(state, action: PayloadAction<string[]>) {
      state.online = action.payload;
    },
    addOnline(state, action: PayloadAction<string>) {
      if (!state.online.includes(action.payload)) {
        state.online.push(action.payload);
      }
    },
    removeOnline(state, action: PayloadAction<string>) {
      state.online = state.online.filter(id => id !== action.payload);
    },
    setTyping(state, action: PayloadAction<{ channelId: string; users: string[] }>) {
      state.typing[action.payload.channelId] = action.payload.users;
    }
  }
});

export const { setUsers, addUser, updateUser, setOnline, addOnline, removeOnline, setTyping } = usersSlice.actions;
export default usersSlice.reducer;

