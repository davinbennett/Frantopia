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