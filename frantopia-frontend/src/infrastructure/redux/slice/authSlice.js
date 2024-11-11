import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   jwtToken: null,
   isAdmin: false,
};

const authSlice = createSlice( {
   name: 'auth',
   initialState,
   reducers: {
      setAuthToken: ( state, action ) =>
      {
         state.jwtToken = action.payload;
      },
      setIsAdmin: ( state, action ) =>
      {
         state.isAdmin = action.payload;
      },
   },
} );

export const { setAuthToken, setIsAdmin } = authSlice.actions;
export default authSlice.reducer;