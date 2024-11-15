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
      } );

      return response.data?.data?.[ 'total-product' ] ?? 0;
   } catch ( error )
   {
      console.error( 'Error fetching total product:', error );
      throw error;
   }
};

export const fetchProductsApi = async ( page, limit, filters = {}, jwtToken ) =>
{
   const { priceMin, priceMax, location, category } = filters;

   const params = {
      page,
      limit,
      ...( priceMin !== null && priceMin !== undefined && { "price-min": priceMin } ),
      ...( priceMax !== null && priceMax !== undefined && { "price-max": priceMax } ),
      ...( location !== null && location !== undefined && { location } ),
      ...( category !== null && category !== undefined && { category } ),
   };

   try
   {
      const response = await axios.get( `${ API_PRODUCT_URL }`, {
         params,
         headers: {
            Authorization: `Bearer ${ jwtToken }`, 
         },
      } );

      return response.data;
   } catch ( error )
   {
      console.error( "Error fetching products:", error );
      throw error;
   }
};