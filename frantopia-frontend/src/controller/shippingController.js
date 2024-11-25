import { fetchShippingAPI } from './../infrastructure/api/shippingApi';

export const fetchShippingController = async ( jwtToken ) =>
{
   try
   {
      const shippings = await fetchShippingAPI( jwtToken );

      return { shippings };
   } catch ( error )
   {
      console.error( "Error in fetchShippingController:", error );
      return { shippings: [] };
   }
};