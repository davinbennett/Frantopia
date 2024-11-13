import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTotalProduct } from '../../../controller/productController';

export const fetchTotalProduct = createAsyncThunk(
   'product/fetchTotalProduct',
   async () =>
   {
      return await getTotalProduct();
   }
);

const productSlice = createSlice( {
   name: 'product',
   initialState: {
      totalProduct: 0,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: ( builder ) =>
   {
      builder
         .addCase( fetchTotalProduct.pending, ( state ) =>
         {
            state.loading = true;
            state.error = null;
         } )
         .addCase( fetchTotalProduct.fulfilled, ( state, action ) =>
         {
            state.loading = false;
            state.totalProduct = action.payload;
         } )
         .addCase( fetchTotalProduct.rejected, ( state, action ) =>
         {
            state.loading = false;
            state.error = action.error.message;
         } );
   },
} );

export default productSlice.reducer;