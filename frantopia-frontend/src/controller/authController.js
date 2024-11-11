import { setAuthToken, setIsAdmin } from "../infrastructure/redux/slice/authSlice";
import AuthImpl from "../repositories/implementations/authImpl";

export const loginWithGoogleController = async ( dispatch ) =>
{
   try
   {
      const { jwtToken, isAdmin } = await AuthImpl.loginWithGoogleImpl();

      console.log( 'jwtToken Controller: ', jwtToken );
      console.log( 'isAdmin Controller: ', isAdmin );

      dispatch( setAuthToken( jwtToken ) );
      dispatch( setIsAdmin( isAdmin ) );

      return { isAdmin };
   } catch ( error )
   {
      console.error( 'Login Error:', error );
      throw error;
   }
};

export const logoutController = async ( dispatch ) =>
{
   try
   {
      await AuthImpl.logoutUser();
      dispatch( setAuthToken( null ) );
      dispatch( setIsAdmin( false ) );
      console.log( "User logged out" );
   } catch ( error )
   {
      console.error( "Logout Error:", error );
      throw error;
   }
};