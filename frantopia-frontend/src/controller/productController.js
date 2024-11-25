import { fetchGalleryByIdAPI, fetchPackageByIdAPI, fetchProductDetailByIdAPI, fetchProductsApi, getPackageByIdAPI, getProfileByIdAPI, postBusinessDataApi, putBusinessDataApi, putProductStatusApi } from "../infrastructure/api/productApi";
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
   let limit = 7;

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

export const fetchProductDetailByIdController = async ( jwtToken, productId ) =>
{
   try
   {
      const {
         category = null,
         established = null,
         description = null,
         price = null,
         licensed = null,
         location = null,
         outletSales = null,
         rating = null,
         royaltyFee = null,
         stock = null,
         profile = null,
         deposit = null,
         name = null,
         status = null,
         income = null
      } = await fetchProductDetailByIdAPI( jwtToken, productId );

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
      console.error( "Error in fetchProductDetailByIdController:", error );
      return {
         category: null,
         established: null,
         description: null,
         price: null,
         licensed: null,
         location: null,
         outletSales: null,
         rating: null,
         royaltyFee: null,
         stock: null,
         profile: null,
         deposit: null,
         name: null,
         status: null,
         income: null
      };
   }
};

export const fetchGalleryByIdController = async ( jwtToken, productId ) =>
{
   try
   {
      const { gallery = [] } = await fetchGalleryByIdAPI( jwtToken, productId );

      return { gallery };
   } catch ( error )
   {
      console.error( "Error in fetchGalleryByIdController:", error );
      return { gallery: [] };
   }
};

export const fetchPackageByIdController = async ( jwtToken, productId ) =>
{
   try
   {
      const packages = await fetchPackageByIdAPI( jwtToken, productId );

      return { packages };
   } catch ( error )
   {
      console.error( "Error in fetchPackageByIdController:", error );
      return { packages: [] };
   }
};

export const postBusinessDataController = async ( jwtToken, businessData ) =>
{
   try
   {
      const response = await postBusinessDataApi( jwtToken, businessData );

      if ( response.status === 200 )
      {
         console.log( 'Business data successfully submitted' );
         return response.data;
      } else
      {
         throw new Error( 'Failed to submit business data' );
      }
   } catch ( error )
   {
      console.error( 'Error in submitBusinessData:', error );
      throw error;
   }
};

export const putBusinessDataController = async ( jwtToken, businessData, productId ) =>
{
   try
   {
      const response = await putBusinessDataApi( jwtToken, businessData, productId );

      if ( response.status === 200 )
      {
         console.log( 'Business data successfully updated' );
         return response.data;
      } else
      {
         throw new Error( 'Failed to update business data' );
      }
   } catch ( error )
   {
      console.error( 'Error in update BusinessData:', error );
      throw error;
   }
};

export const getPackageByIdController = async ( jwtToken, productId, packageId ) =>
{
   try
   {
      const {
         grossProfit = null,
         income = null,
         name = null,
         price = null,
         sizeConcept = null,
      } = await getPackageByIdAPI( jwtToken, productId, packageId );

      return {
         grossProfit,
         income,
         name,
         price,
         sizeConcept
      };
   } catch ( error )
   {
      console.error( "Error in getPackageByIdController:", error );
      return {
         grossProfit: null,
         income: null,
         name: null,
         price: null,
         sizeConcept: null,
      };
   }
};

export const putProductStatusController = async ( jwtToken, status, productId ) =>
{
   try
   {
      const response = await putProductStatusApi( jwtToken, status, productId );

      if ( response.data.code === 200 )
      {
         console.log( 'PRODUCT STATUS successfully updated' );
         return response.data;
      } else
      {
         throw new Error( 'Failed to update PRODUCT STATUS' );
      }
   } catch ( error )
   {
      console.error( 'Error in update PRODUCT STATUS:', error );
      throw error;
   }
};

