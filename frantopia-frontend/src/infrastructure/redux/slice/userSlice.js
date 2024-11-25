import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   latitudePinPoint: 0.0,
   longitudePinPoint: 0.0,
   addressPinPoint: null,
};

const userSlice = createSlice( {
   name: 'user',
   initialState,
   reducers: {
      setLatitudePinPoint: ( state, action ) =>
      {
         state.latitudePinPoint = action.payload;
      },
      setLongitudePinPoint: ( state, action ) =>
      {
         state.longitudePinPoint = action.payload;
      },
      setAddressPinPoint: ( state, action ) =>
      {
         state.addressPinPoint = action.payload;
      },
   },
} );

export const { setLatitudePinPoint, setLongitudePinPoint, setAddressPinPoint } = userSlice.actions;
export default userSlice.reducer;