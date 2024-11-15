import { fetchProductsApi } from "../infrastructure/api/productApi";
import { ProductImpl } from "../repositories/implementations/productImpl";
import { useState } from 'react';
const productImpl = new ProductImpl();

export const getTotalProduct = async ( jwtToken ) =>
{
   return await productImpl.getTotalProduct( jwtToken );
};

export const useProductListController = () =>
{
   // State untuk pagination dan produk
   const [ currentPage, setCurrentPage ] = useState( 1 );
   const [ hasMore, setHasMore ] = useState( true ); // Menandakan apakah masih ada produk lebih banyak
   const [ products, setProducts ] = useState( [] );
   const [ loading, setLoading ] = useState( false );
   let limit = 6;

   // Fungsi untuk memuat lebih banyak produk
   const loadMore = async ( filters, jwtToken ) =>
   {
      if ( !hasMore || loading ) return;  // Jika tidak ada halaman lagi atau sedang loading, hentikan

      setLoading( true );  // Menandakan loading sedang berjalan

      try
      {
         // Panggil API untuk mendapatkan produk berdasarkan halaman dan filter
         const data = await fetchProductsApi( currentPage, limit, filters, jwtToken );

         // Ambil produk baru dan total halaman dari response
         const { products: newProducts, total_pages } = data.data;

         // Update state produk
         setProducts( ( prevProducts ) => [ ...prevProducts, ...newProducts ] );

         // Update status pagination
         if ( currentPage < total_pages )
         {
            setHasMore( true );
            setCurrentPage( ( prevPage ) => prevPage + 1 );
         } else
         {
            setHasMore( false ); // Tidak ada produk lg
         }
      } catch ( error )
      {
         console.error( "Error fetching products:", error );
      } finally
      {
         setLoading( false );
      }
   };

   return {
      products,       // Data produk yang telah dimuat
      hasMore,        // Status apakah masih ada produk lebih lanjut
      loading,        // Status loading
      loadMore,       // Fungsi untuk load lebih banyak produk
   };
};