import { fetchInformationApi, fetchOrderListApi, getOrderIdByProductIdApi, postOrderApi, putOrderStatusApi } from "../infrastructure/api/orderApi";
import OrderImpl from "../repositories/implementations/orderImpl";
import { Text } from "react-native";
import React, { useState, useEffect } from 'react';

const orderImpl = new OrderImpl();

const formatPrice = ( price ) =>
{
   if ( price >= 1_000_000_000 )
   {
      return ( price / 1_000_000_000 ).toFixed( 1 ).replace( '.', ',' ) + ' B';
   }
   if ( price >= 1_000_000 )
   {
      return ( price / 1_000_000 ).toFixed( 1 ).replace( '.', ',' ) + ' M';
   }
   if ( price >= 1_000 )
   {
      return ( price / 1_000 ).toFixed( 1 ).replace( '.', ',' ) + ' K';
   }
   return price;
};

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
         frontColor: '#2d70f3',
         topLabelComponent: () => (
            <Text className='mb-1 font-semibold'>{formatPrice(item.totalSold)}</Text>
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
      frontColor: '#2d70f3',
      topLabelComponent: () => (
         <Text className='mb-1 font-semibold'>{item.total}</Text>
      ),
   } ) );

   return { bestSellingCategory, categoryData: transformedCategoryData };
};

export const fetchInformationController = async ( jwtToken, productId ) =>
{
   //  cek apakah franchise id x ada di orders
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

   console.log("stats control: ", status);
   

   if ( status === 'Failed' )
   {
      return { status: null, date: null, priceTotal: null, shipmentPrice: null, insurancePrice: null, adminPrice: null };
   }

   return { status, date, priceTotal, shipmentPrice, insurancePrice, adminPrice };
};

export const fetchOrderListController = () =>
{
   const [ currentPage, setCurrentPage ] = useState( 1 );
   const [ hasMore, setHasMore ] = useState( true );
   const [ orders, setOrders ] = useState( [] );
   const [ loading, setLoading ] = useState( false );
   let limit = 6;

   useEffect( () =>
   {
      setCurrentPage( 1 );
      setHasMore( true );
      setOrders( [] );
   }, [] );

   const getDataByFilter = async ( filters, jwtToken ) =>
   {
      setLoading( true );
      setCurrentPage( 1 );
      try
      {
         const { data } = await fetchOrderListApi( 1, limit, filters, jwtToken );

         const newOrders = data?.order_data || [];
         const total_pages = data?.total_pages || 1;

         setOrders( newOrders );
         if ( 1 < total_pages )
         {
            setHasMore( true );
            setCurrentPage( 2 );
         } else
         {
            setHasMore( false );
         }
      } catch ( error )
      {
         if ( error.message === 'Cannot convert null value to object')
            return
         console.log( "Error fetching products:", error );
      } finally
      {
         setLoading( false );
      }
   };


   const loadMore = async ( filters, jwtToken ) =>
   {
      if ( !hasMore || loading ) return;
      setLoading( true );
      try
      {
         const { data } = await fetchOrderListApi( currentPage, limit, filters, jwtToken );
         
         const newOrders = data?.order_data || [];
         const total_pages = data?.total_pages || 1;

         setOrders( ( prevOrders ) => [ ...prevOrders, ...newOrders ] );
         if ( currentPage < total_pages )
         {
            setHasMore( true );
            setCurrentPage( ( prevPage ) => prevPage + 1 );
         } else
         {
            setHasMore( false );
         }
      } catch ( error )
      {
         if ( error.message === 'Cannot convert null value to object' )
            return
         console.log( "Error fetching products:", error );
      } finally
      {
         setLoading( false );
      }
   };


   const resetPagination = () =>
   {
      setCurrentPage( 1 );
      setHasMore( true );
      setOrders( [] );
   };

   return {
      orders,
      hasMore,
      loading,
      loadMore,
      getDataByFilter,
      resetPagination,
   };
};

export const putOrderStatusController = async ( jwtToken, status, orderId ) =>
{
   try
   {
      const response = await putOrderStatusApi( jwtToken, status, orderId );

      if ( response.data.code === 200 )
      {
         console.log( 'ORDER STATUS successfully updated' );
         return response.data;
      } else
      {
         throw new Error( 'Failed to update ORDER STATUS' );
      }
   } catch ( error )
   {
      console.error( 'Error in update ORDER STATUS:', error );
      throw error;
   }
};

export const postOrderController = async ( jwtToken, data ) =>
{
   try
   {
      const response = await postOrderApi( jwtToken, data );

      if ( response.data.code === 200 )
      {
         console.log( 'ADD ORDER successfully ' );
         return response.data;
      } else
      {
         throw new Error( 'Failed to ADD ORDER ' );
      }
   } catch ( error )
   {
      console.error( 'Error in ADD ORDER :', error );
      throw error;
   }
};