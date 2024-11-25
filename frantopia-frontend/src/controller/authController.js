import { setAuthToken, setIsAdmin, setUserId } from "../infrastructure/redux/slice/authSlice";
import AuthImpl from "../repositories/implementations/authImpl";

export const loginWithGoogleController = async ( dispatch ) =>
{
   try
   {
      const { jwtToken, isAdmin, userId } = await AuthImpl.loginWithGoogleImpl();

      dispatch( setAuthToken( jwtToken ) );
      dispatch( setIsAdmin( isAdmin ) );
      dispatch( setUserId( userId ) );

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
      dispatch( setUserId( null ) );
      console.log( "User logged out" );
   } catch ( error )
   {
      console.error( "Logout Error:", error );
      throw error;
   }
};