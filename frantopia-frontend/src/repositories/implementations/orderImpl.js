import { fetchCategoryAnalysisAPI, fetchSalesAnalyticsAPI, fetchTotalSoldAPI } from "../../infrastructure/api/orderApi";
import OrderInterface from "../interfaces/orderInterface";

export default class OrderImpl extends OrderInterface
{
   async getTotalSold ( period, startDate, endDate, jwtToken )
   {
      return await fetchTotalSoldAPI( period, startDate, endDate, jwtToken );
   }
   async fetchSalesAnalytics ( period, startDate, endDate, jwtToken )
   {
      return await fetchSalesAnalyticsAPI( period, startDate, endDate, jwtToken );
   }
   async fetchCategoryAnalysis ( period, startDate, endDate, jwtToken )
   {
      return await fetchCategoryAnalysisAPI( period, startDate, endDate, jwtToken );
   }
}