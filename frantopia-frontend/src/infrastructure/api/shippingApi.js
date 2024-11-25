import axios from 'axios';

const API_SHIPPING_URL = process.env.EXPO_PUBLIC_API_SHIPPING_URL;

export const fetchShippingAPI = async ( jwtToken ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_SHIPPING_URL }`;

   try
   {
      const response = await axios.get( url, config );
      const data = response?.data?.data || [];
      const shipping = data.map( ( item ) => ( {
         shippingId: item.ID,
         shippingMethod: item.Method,
         shippingCost: item.shipping_cost,
      } ) );

      return shipping;
   } catch ( error )
   {
      console.error( "Error fetchShippingAPI:", error );
      throw error;
   }
};