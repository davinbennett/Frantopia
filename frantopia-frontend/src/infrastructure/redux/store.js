// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import productReducer from './slice/productSlice';
import userReducer from './slice/userSlice';

const store = configureStore( {
   reducer: {
      auth: authReducer,
      product: productReducer,
      user: userReducer,
   },
} );

export default store;
