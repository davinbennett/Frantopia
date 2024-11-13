// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import productReducer from './slice/productSlice';

const store = configureStore( {
   reducer: {
      auth: authReducer,
      product: productReducer,
   },
} );

export default store;
