export default class OrderInterface
{
   async getTotalSold ( period, startDate, endDate, jwtToken )
   {
      throw new Error( 'getTotalSold method not implemented' );
   }
   async fetchSalesAnalytics ( period, startDate, endDate, jwtToken )
   {
      throw new Error( 'fetchSalesAnalytics must be implemented' );
   }
}