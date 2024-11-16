import { fetchProductsApi } from "../infrastructure/api/productApi";
import { ProductImpl } from "../repositories/implementations/productImpl";
import { useState, useEffect } from 'react';
const productImpl = new ProductImpl();

export const getTotalProduct = async ( jwtToken ) =>
{
   return await productImpl.getTotalProduct( jwtToken );
};

export const useProductListController = () =>
{
   const [ currentPage, setCurrentPage ] = useState( 1 );
   const [ hasMore, setHasMore ] = useState( true );
   const [ products, setProducts ] = useState( [] );
   const [ loading, setLoading ] = useState( false );
   let limit = 6;

   useEffect( () =>
   {
      setCurrentPage( 1 );
      setHasMore( true );
      setProducts( [] );
   }, [] );

   const getDataByFilter = async ( filters, jwtToken ) =>
   {
      setLoading( true );
      try
      {
         const data = await fetchProductsApi( 1, limit, filters, jwtToken );
         const { products: newProducts, total_pages } = data.data;

         setProducts( newProducts );
         if ( currentPage < total_pages )
         {
            setHasMore( true );
            setCurrentPage( 2 );
         } else
         {
            setHasMore( false ); 
         }
      } catch ( error )
      {
         console.error( "Error fetching products:", error );
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
         const data = await fetchProductsApi( currentPage, limit, filters, jwtToken );
         const { products: newProducts, total_pages } = data.data;

         setProducts( ( prevProducts ) => [ ...prevProducts, ...newProducts ] );
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
         console.error( "Error fetching products:", error );
      } finally
      {
         setLoading( false );
      }
   };

   const resetPagination = () =>
   {
      setCurrentPage( 1 );
      setHasMore( true );
      setProducts( [] );
   };

   return {
      products,
      hasMore,
      loading,
      loadMore,
      getDataByFilter,
      resetPagination, 
   };
};
