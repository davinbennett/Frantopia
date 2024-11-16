import { fetchInformationApi, getOrderIdByProductIdApi } from "../infrastructure/api/orderApi";
import OrderImpl from "../repositories/implementations/orderImpl";
import { Text } from "react-native";

const orderImpl = new OrderImpl();

export const totalSoldOrderController = async ( period, startDate, endDate, jwtToken ) =>
{
   return await orderImpl.getTotalSold( period, startDate, endDate, jwtToken );
};

export const fetchSalesAnalyticsController = async ( period, startDate, endDate, jwtToken ) =>
{

   const data = await orderImpl.fetchSalesAnalytics( period, startDate, endDate, jwtToken );

   if ( data === null && period == "day" )
   {
      return null;
   }

   const transformedData = data.map( ( item ) =>
   {
      const label = period === 'yearly' ? item.year
         : period === 'quarterly' ? `Q${ item.quarter }`
            : period === 'monthly' ? item.month
               : item.date;  // daily

      return {
         value: item.totalSold,
         label,
         frontColor: '#177AD5',
         topLabelComponent: () => (
            <Text className='mb-1 font-semibold'>{item.totalSold}</Text>
         ),
      };
   } );

   return transformedData.sort( ( a, b ) =>
   {
      if ( period === 'yearly' )
      {
         return a.label - b.label;
      } else if ( period === 'quarterly' )
      {
         return parseInt( a.label.slice( 1 ) ) - parseInt( b.label.slice( 1 ) );
      } else if ( period === 'monthly' )
      {
         return new Date( `2023-${ a.label }-01` ) - new Date( `2023-${ b.label }-01` );
      } else
      {
         return new Date( a.label ) - new Date( b.label );
      }
   } );
};

export const fetchCategoryAnalysisController = async ( period, startDate, endDate, jwtToken ) =>
{
   const { bestSellingCategory, categoryData } = await orderImpl.fetchCategoryAnalysis( period, startDate, endDate, jwtToken );

   if ( !bestSellingCategory || categoryData.length === 0 )
   {
      return { bestSellingCategory: null, categoryData: [] };
   }

   const transformedCategoryData = categoryData.map( item => ( {
      value: item.total,
      label: item.name,
      frontColor: '#177AD5',
      topLabelComponent: () => (
         <Text className='mb-1 font-semibold'>{item.total}</Text>
      ),
   } ) );

   return { bestSellingCategory, categoryData: transformedCategoryData };
};

export const fetchInformationController = async ( jwtToken, productId ) =>
{
   const { orderId } = await getOrderIdByProductIdApi( jwtToken, productId );

   if ( !orderId )
   {
      return {
         status: null,
         date: null,
         priceTotal: null,
         shipmentPrice: null,
         insurancePrice: null,
         adminPrice: null,
      };
   }

   const { status, date, priceTotal, shipmentPrice, insurancePrice, adminPrice } = await fetchInformationApi( jwtToken, orderId );

   if ( !status || !date || !priceTotal || !shipmentPrice || !insurancePrice || !adminPrice )
   {
      return { status: null, date: null, priceTotal: null, shipmentPrice: null, insurancePrice: null, adminPrice: null };
   }

   return { status, date, priceTotal, shipmentPrice, insurancePrice, adminPrice };
};