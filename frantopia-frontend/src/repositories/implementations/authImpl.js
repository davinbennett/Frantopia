
import { loginToBackendApi } from '../../infrastructure/api/authApi';
import { signInWithGoogleOauth2, signOutOauth2 } from '../../infrastructure/oauth2';
import { getTokenAdminStorage, removeTokenAdminStorage, saveTokenAdminStorage } from '../../infrastructure/storage/authStorage';
import AuthInterface from '../interfaces/authInterface';


class AuthImpl extends AuthInterface
{
   async loginWithGoogleImpl ()
   {
      // Authenticate with Google
      const { idToken, accessToken, userInfo } = await signInWithGoogleOauth2();
      const email = userInfo.data.user.email;

      // Get JWT token from backend API
      const jwtToken = await loginToBackendApi( idToken, accessToken, email );

      // Save token and admin status in storage
      const isAdmin = email === 'davinbennet99@gmail.com';
      await saveTokenAdminStorage( jwtToken, isAdmin );

      return { jwtToken, isAdmin };
   }

   async logoutUser ()
   {
      // Log out user and clear stored tokens
      await signOutOauth2();
      await removeTokenAdminStorage();
   }

   async checkToken ()
   {
      const { jwtToken, isAdmin } = await getTokenAdminStorage();
      return { jwtToken, isAdmin };
   }
}

export default new AuthImpl();