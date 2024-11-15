export class ProductInterface
{
   async getTotalProduct ( jwtToken )
   {
      throw new Error( 'Method not implemented' );
   }

   async fetchProducts ( page, limit, filters, jwtToken )
   {
      throw new Error( 'Method not implemented' );
   }
}