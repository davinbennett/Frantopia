import axios from 'axios';

const API_ORDER_URL = process.env.EXPO_PUBLIC_API_ORDER_URL;

export const fetchTotalSoldAPI = async ( period, startDate, endDate, jwtToken ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   let url = `${ API_ORDER_URL }/total-sold?period=${ period }`;
   if ( startDate && endDate )
   {
      url += `&start=${ startDate }&end=${ endDate }`;
   }

   try
   {
      const response = await axios.get( url, config );
      const totalSold = response?.data?.data?.[ 'total-sold' ];

      return totalSold;
   } catch ( error )
   {
      console.error( 'Error fetching total sold:', error );
      throw error;
   }
};

export const fetchSalesAnalyticsAPI = async ( period, startDate, endDate, jwtToken ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   let url = `${ API_ORDER_URL }/sales-analytics?period=${ period }`;
   if ( startDate && endDate )
   {
      url += `&start=${ startDate }&end=${ endDate }`;
   }

   try
   {
      const response = await axios.get( url, config );
      const data = response?.data?.data?.[ 'order-data' ];

      if ( data === null )
      {
         return null;
      }

      const transformedData = data.map( item =>
      {
         if ( period === 'day' )
         {
            return { date: item.date, totalSold: item[ 'total-sold' ] };
         } else if ( period === 'yearly' )
         {
            return { year: item.year, totalSold: item[ 'total-sold' ] };
         } else if ( period === 'quarterly' )
         {
            return { quarter: item.quarter, totalSold: item[ 'total-sold' ] };
         } else if ( period === 'monthly' )
         {
            return { month: item.month, totalSold: item[ 'total-sold' ] };
         } else
         {
            return item;
         }
      } );

      return transformedData;
   } catch ( error )
   {
      console.log( 'Error fetching sales analytics API:', error );
   }
};

export const fetchCategoryAnalysisAPI = async ( period, startDate, endDate, jwtToken ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   let url = `${ API_ORDER_URL }/category-analytics?period=${ period }`;
   if ( startDate && endDate )
   {
      url += `&start=${ startDate }&end=${ endDate }`;
   }

   try
   {
      const response = await axios.get( url, config );
      const bestSellingCategory = response?.data?.data?.bestSellingCategory;
      const categoryData = response?.data?.data?.categoryData || [];

      const transformedCategoryData = categoryData.map( item => ( {
         name: item.name,
         total: item.total,
      } ) );

      return { bestSellingCategory, categoryData: transformedCategoryData };
   } catch ( error )
   {
      console.log( 'Error fetching category analytics API:', error );
      
   }
};

export const getOrderIdByProductIdApi = async ( jwtToken, productId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_ORDER_URL }/franchise-id/${ productId }`;

   try
   {
      const response = await axios.get( url, config );
      const data = response?.data?.data;

      const orderId = data?.[ "order_id" ] || null;

      return {
         orderId
      };
   } catch ( error )
   {
      console.error( "Error get OrderID API:", error );
      throw error;
   }
};


export const fetchInformationApi = async ( jwtToken, id ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_ORDER_URL }/${ id }`;

   try
   {
      const response = await axios.get( url, config );
      const data = response?.data?.data;

      const status = data?.status || null;
      const date = data?.date || null;
      const priceTotal = data?.[ "price-total" ] || null;
      const shipmentPrice = data?.[ "shipment-price" ] || null;
      const insurancePrice = data?.[ "insurance-price" ] || null;
      const adminPrice = data?.[ "admin-price" ] || null;

      return {
         status,
         date,
         priceTotal,
         shipmentPrice,
         insurancePrice,
         adminPrice,
      };
   } catch ( error )
   {
      console.error( "Error fetching information API:", error );
      throw error;
   }
};

export const fetchOrderListApi = async ( page, limit, filters = {}, jwtToken ) =>
{
   const { status, userId } = filters;

   const params = {
      page,
      limit,
      ...( status !== null && status !== undefined && { status } ),
      ...( userId !== null && userId !== undefined && { "user-id": userId } ),
   };

   const config = {
      params,
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_ORDER_URL }`;
   
   try
   {
      const response = await axios.get( url, config );
      const data = response?.data?.data || [];

      return { data };
   } catch ( error )
   {
      console.error( "Error fetchOrderListApi:", error );
      throw error;
   }
};

export const putOrderStatusApi = async ( jwtToken, status, orderId ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_ORDER_URL }/${ orderId }/status`;

   try
   {
      const response = await axios.put( url, { status: status }, config );
      return response;
   } catch ( error )
   {
      console.error( 'Error putOrderStatusApi:', error );
      throw error;
   }
};

export const postOrderApi = async ( jwtToken, data ) =>
{
   const config = {
      headers: {
         Authorization: `Bearer ${ jwtToken }`,
      },
   };

   const url = `${ API_ORDER_URL }`;

   try
   {
      const response = await axios.post( url, data, config );
      return response;
   } catch ( error )
   {
      console.error( 'Error postOrderApi:', error );
      throw error;
   }
};