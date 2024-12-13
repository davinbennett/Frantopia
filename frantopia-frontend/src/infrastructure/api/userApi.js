import axios from 'axios';

const API_USER_URL = process.env.EXPO_PUBLIC_API_USER_URL;

export const getAddressByIdAPI = async ( jwtToken, userId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_USER_URL }/${ userId }/address`;

   try
   {
      const response = await axios.get( url, config );
      const data = response?.data?.data;

      const latitude = data?.latitude || 0;
      const longitude = data?.longitude || 0;
      const postalCode = data?.postalCode || null;
      const address = data?.address || null;

      return {
         latitude,
         longitude,
         postalCode,
         address,
      };

   } catch ( error )
   {
      console.error( "Error getAddressByIdAPI:", error );
      throw error;
   }
};

export const putAddressApi = async ( jwtToken, addressData, userId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_USER_URL }/${ userId }/address`;

   try
   {
      const response = await axios.put( url, addressData, config );
      return response;
   } catch ( error )
   {
      console.error( 'Error putAddressApi:', error );
      throw error;
   }
};

export const getProfileByIdAPI = async ( jwtToken, userId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_USER_URL }/${ userId }/profile`;

   try
   {
      const response = await axios.get( url, config );
      const data = response?.data?.data;

      const userName = data?.name || "";
      const profilePicture = data?.profile_picture || "";

      return {
         userName,
         profilePicture,
      };

   } catch ( error )
   {
      console.error( "Error getProfileByIdAPI:", error );
      throw error;
   }
};

export const getCountCartByIdAPI = async ( jwtToken, userId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_USER_URL }/${ userId }/cart/count`;

   try
   {
      const response = await axios.get( url, config );

      const data = response?.data?.data || {};

      const countCart = data?.count || 0;

      return {
         countCart: countCart,
      };
   } catch ( error )
   {
      console.error( "Error getCountCartByIdAPI:", error.response?.data || error.message );
      throw error;
   }
};

export const fetchCartByIdAPI = async ( jwtToken, userId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_USER_URL }/${ userId }/cart`;

   try
   {
      const response = await axios.get( url, config );
      const data = response?.data?.data || null;

      const listCart = data[ 'list-cart' ] || [];
      const formattedListCart = listCart.map( item => ( {
         cartId: item?.cart_id || null,
         franchiseId: item?.franchise_id || null,
         packageId: item?.package_id || null,
         franchiseName: item?.[ 'franchise-name' ] || null,
         packageName: item?.[ 'package-name' ] || null,
         sizeConcept: item?.size_concept || null,
         grossProfit: item?.gross_profit || null,
         income: item?.income || null,
         price: item?.price || null,
         status: item?.status || null,
         profile: item?.profile || null,
         licensed: item?.licensed || null,
      } ) );

      return { formattedListCart };
   } catch ( error )
   {
      const errorMessage = error.response?.data?.error || error.message;
      console.log( 'Error fetchCartByIdAPI:', errorMessage );

      if ( errorMessage === 'Cart not found' )
      {
         console.log( 's' );

         return { formattedListCart: [] };
      }
      return { formattedListCart: [] };
   }
};

export const deleteCartAPI = async ( jwtToken, userId, cartId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_USER_URL }/${ userId }/cart`;

   try
   {
      const response = await axios.delete( url, {
         ...config,
         data: { cart_id: cartId },
      } );

      return response.data;
   } catch ( error )
   {
      console.error( "Error deleting cart:", error );
      throw error;
   }
};


export const postCartApi = async ( jwtToken, userId, data ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_USER_URL }/${ userId }/cart`;

   try
   {
      const response = await axios.post( url, data, config );
      return response;
   } catch ( error )
   {
      console.error( 'Error postCartApi:', error );
      throw error;
   }
};

export const putStatusCartAPI = async ( jwtToken, userId, cartId, status ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_USER_URL }/${ userId }/cart/status`;
   console.log( 'sa: ', cartId );
   try
   {
      const response = await axios.put( url, { cart_id: cartId, status: status }, config );

      return response.data;
   } catch ( error )
   {
      console.error( "Error updating status cart API:", error );
      throw error;
   }
};