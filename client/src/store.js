// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Components/Auth/userSlice';

const store = configureStore ({
  reducer: {
    user: userReducer,
  },
});

export default store;
