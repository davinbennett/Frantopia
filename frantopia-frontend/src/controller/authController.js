import { signInWithGoogle } from "../infrastructure/oauth2";
import AuthImpl from "../repositories/implementations/authImpl";

export const loginWithGoogle = async () =>
{
   try
   {
      const { idToken, accessToken, userInfo } = await signInWithGoogle();

      const jwtToken = await AuthImpl.loginUser( idToken, accessToken );

      console.log( 'jwt:' ,jwtToken );

      const isAdmin = userInfo.data.user.email === 'davinbennet99@gmail.com';
      return { jwtToken, isAdmin };
   } catch ( error )
   {
      console.error( 'Login Error:', error );
      throw error;
   }
};

export const logout = async () =>
{
   try
   {
      await signOut();
      console.log( 'User logged out' );
   } catch ( error )
   {
      console.error( 'Logout Error:', error );
      throw error;
   }
};