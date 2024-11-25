import { getAddressByIdAPI, putAddressApi } from "../infrastructure/api/userApi";

export const getAddressByIdController = async ( jwtToken, userId ) =>
{
   try
   {
      const {
         latitude = 0,
         longitude = 0,
         postalCode = null,
         address = null,
      } = await getAddressByIdAPI( jwtToken, userId );

      return {
         latitude,
         longitude,
         postalCode,
         address,
      };
   } catch ( error )
   {
      console.error( "Error in getAddressByIdController:", error );
      return {
         latitude : 0,
         longitude : 0,
         postalCode : null,
         address : null
      };
   }
};

export const putAddressController = async ( jwtToken, addressData, userId ) =>
{
   try
   {
      const response = await putAddressApi( jwtToken, addressData, userId );

      if ( response.data.code === 200 )
      {
         console.log( 'ADDRESS successfully updated' );
         return response.data;
      } else
      {
         throw new Error( 'Failed to update ADDRESS' );
      }
   } catch ( error )
   {
      console.error( 'Error in update ADDRESS:', error );
      throw error;
   }
};
