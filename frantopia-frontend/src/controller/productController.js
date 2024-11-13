import { ProductImpl } from "../repositories/implementations/productImpl";

const productImpl = new ProductImpl();

export const getTotalProduct = async ( jwtToken ) =>
{
   return await productImpl.getTotalProduct( jwtToken );
};