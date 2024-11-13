import axios from 'axios';

export const loginToBackendApi = async ( idToken, accessToken ) =>
{
   const API_AUTH_URL = process.env.EXPO_PUBLIC_API_AUTH_URL

   const response = await axios.post( `${ API_AUTH_URL }/login`, {
      idToken,
      accessToken,
   } );
   return response.data.data.jwtToken;
};