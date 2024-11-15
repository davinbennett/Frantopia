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
      console.error( 'Error fetching sales analytics API:', error );
      throw error;
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
      console.error( 'Error fetching sales analytics API:', error );
      throw error;
   }
};
