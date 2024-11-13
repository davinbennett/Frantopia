import axios from 'axios';

const API_PRODUCT_URL = process.env.EXPO_PUBLIC_API_PRODUCT_URL;

export const fetchTotalProduct = async ( jwtToken ) =>
{
   try
   {
      const response = await axios.get( `${ API_PRODUCT_URL }/total-product`, {
         headers: {
            Authorization: `Bearer ${ jwtToken }`,
         },
      });

      return response.data?.data?.[ 'total-product' ] ?? 0;
   } catch ( error )
   {
      console.error( 'Error fetching total product:', error );
      throw error;
   }
};