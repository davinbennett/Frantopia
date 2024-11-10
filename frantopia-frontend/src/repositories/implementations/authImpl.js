import AuthInterface from '../interfaces/authInterface';
import { loginToBackend } from '../../infrastructure/api/authApi';
import { saveToken } from '../../infrastructure/storage/authStorage';


class AuthImpl extends AuthInterface
{
   async loginUser ( idToken, accessToken )
   {
      const jwtToken = await loginToBackend( idToken, accessToken );
      await saveToken( jwtToken );

      return jwtToken;
   }
}

export default new AuthImpl();