import { fetchTotalProduct } from "../../infrastructure/api/productApi";
import { ProductInterface } from "../interfaces/productInterface";

export class ProductImpl extends ProductInterface
{
   async getTotalProduct ( jwtToken )
   {
      return await fetchTotalProduct( jwtToken );
   }
}