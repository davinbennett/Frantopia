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

export const fetchProductDetailByIdAPI = async ( jwtToken, productId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_PRODUCT_URL }/${ productId }`;

   try
   {
      const response = await axios.get( url, config );
      const data = response?.data?.data;

      const category = data?.category || null;
      const established = data?.established || null;
      const description = data?.description || null;
      const price = data?.price || null;
      const licensed = data?.licensed || null;
      const location = data?.location || null;
      const outletSales = data?.outlet_sales || null;
      const rating = data?.rating || null;
      const royaltyFee = data?.royalty_fee || null;
      const stock = data?.stock || null;
      const profile = data?.profile || null;
      const deposit = data?.deposit || null;
      const name = data?.name || null;
      const status = data?.status || null;
      const income = data?.income || null;

      return {
         category,
         established,
         description,
         price,
         licensed,
         location,
         outletSales,
         rating,
         royaltyFee,
         stock,
         profile,
         deposit,
         name,
         status,
         income
      };

   } catch ( error )
   {
      console.error( "Error fetching ProductDetailById API:", error );
      throw error;
   }
};

export const fetchGalleryByIdAPI = async ( jwtToken, productId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_PRODUCT_URL }/${ productId }/gallery`;

   try
   {
      const response = await axios.get( url, config );
      const data = response?.data?.data;

      const gallery = data?.gallery || [];

      return {
         gallery
      };

   } catch ( error )
   {
      console.error( "Error fetching GalleryById API:", error );
      throw error;
   }
};

export const fetchPackageByIdAPI = async ( jwtToken, productId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_PRODUCT_URL }/${ productId }/package`;

   try
   {
      const response = await axios.get( url, config );
      const data = response?.data?.data || [];
      const formattedPackages = data.map( ( item ) => ( {
         packageId: item.package_id,
         name: item.name,
         sizeConcept: item.size_concept,
         grossProfit: item.gross_profit,
         income: item.income,
         price: item.price,
      } ) );

      console.log( formattedPackages );

      return formattedPackages;
   } catch ( error )
   {
      console.error( "Error fetching fetchPackageByIdAPI API:", error );
      throw error;
   }
};

export const postBusinessDataApi = async ( jwtToken, businessData ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_PRODUCT_URL }`;

   try
   {
      const response = await axios.post( url, businessData, config );
      return response;
   } catch ( error )
   {
      console.error( 'Error posting business data:', error );
      throw error;
   }
};

export const putBusinessDataApi = async ( jwtToken, businessData, productId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_PRODUCT_URL }/${ productId }`;

   try
   {
      const response = await axios.put( url, businessData, config );
      return response;
   } catch ( error )
   {
      console.error( 'Error update business data:', error );
      throw error;
   }
};