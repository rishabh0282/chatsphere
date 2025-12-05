import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import channelsReducer from '../features/channelsSlice';
import messagesReducer from '../features/messagesSlice';
import usersReducer from '../features/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    users: usersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

