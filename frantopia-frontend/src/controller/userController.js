import { deleteCartAPI, fetchCartByIdAPI, getAddressByIdAPI, getCountCartByIdAPI, getProfileByIdAPI, postCartApi, putAddressApi, putStatusCartAPI } from "../infrastructure/api/userApi";

export const getAddressByIdController = async ( jwtToken, userId ) =>
{
   try
   {
      const {
         latitude = 0,
         longitude = 0,
         postalCode = null,
         address = null,
      } = await getAddressByIdAPI( jwtToken, userId );

      return {
         latitude,
         longitude,
         postalCode,
         address,
      };
   } catch ( error )
   {
      console.error( "Error in getAddressByIdController:", error );
      return {
         latitude: 0,
         longitude: 0,
         postalCode: null,
         address: null
      };
   }
};

export const putAddressController = async ( jwtToken, addressData, userId ) =>
{
   try
   {
      const response = await putAddressApi( jwtToken, addressData, userId );

      if ( response.data.code === 200 )
      {
         console.log( 'ADDRESS successfully updated' );
         return response.data;
      } else
      {
         throw new Error( 'Failed to update ADDRESS' );
      }
   } catch ( error )
   {
      console.error( 'Error in update ADDRESS:', error );
      throw error;
   }
};

export const getProfileByIdController = async ( jwtToken, userId ) =>
{
   try
   {
      const {
         userName = "",
         profilePicture = "",
      } = await getProfileByIdAPI( jwtToken, userId );

      return {
         userName,
         profilePicture,
      };
   } catch ( error )
   {
      console.error( "Error in getProfileByIdController:", error );
      return {
         userName: "",
         profilePicture: "",
      };
   }
};

export const getCountCartByIdController = async ( jwtToken, userId ) =>
{
   try
   {
      const {
         countCart = 0,
      } = await getCountCartByIdAPI( jwtToken, userId );

      return {
         countCart,
      };
   } catch ( error )
   {
      console.error( "Error in getCountCartByIdController:", error );
      return {
         countCart: 0,
      };
   }
};

export const fetchCartByIdController = async ( jwtToken, userId ) =>
{
   try
   {
      const { formattedListCart = [] } = await fetchCartByIdAPI( jwtToken, userId );

      if ( formattedListCart.length === 0 )
      {
         return { formattedListCart: [] };
      }

      return { formattedListCart };
   } catch ( error )
   {
      console.error( 'Error in fetchCartByIdController:', error );
      return { formattedListCart: [] };
   }
};

export const deleteCartController = async ( jwtToken, userId, cartId ) =>
{
   try
   {
      const response = await deleteCartAPI( jwtToken, userId, cartId );


      if ( response.message === "Cart item deleted successfully" )
      {
         console.log( 'CART successfully delete controller' );
         return response.message;
      } else
      {
         throw new Error( 'Failed to delete cart' );
      }
   } catch ( error )
   {
      console.error( 'Error in delete cart controller:', error );
      throw error;
   }
};

export const postCartController = async ( jwtToken, userId, data ) =>
{
   try
   {
      const response = await postCartApi( jwtToken, userId, data );
      console.log('s: ' , response.data);
      

      if ( response.data.message === "Item added to cart successfully" )
      {
         console.log( 'CART successfully post controller' );
         return response.data.message;
      } else
      {
         throw new Error( 'Failed to post cart' );
      }
   } catch ( error )
   {
      console.error( 'Error in post cart controller:', error );
      throw error;
   }
};

export const putStatusCartController = async ( jwtToken, userId, cartId, status ) =>
{
   try
   {
      const response = await putStatusCartAPI( jwtToken, userId, cartId, status );

      console.log('ssss: ', cartId);
      
      if ( response.message === "Cart item status successfully updated" )
      {
         console.log( 'status CART successfully update controller' );
         return response.message;
      } else
      {
         throw new Error( 'Failed to update status cart' );
      }
   } catch ( error )
   {
      console.error( 'Error in update status cart controller:', error );
      throw error;
   }
};