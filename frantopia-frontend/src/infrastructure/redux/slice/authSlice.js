import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   jwtToken: null,
   isAdmin: false,
   userId: 0,
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
      setUserId: ( state, action ) =>
      {
         state.userId = action.payload;
      },
   },
} );

export const { setAuthToken, setIsAdmin, setUserId } = authSlice.actions;
export default authSlice.reducer;