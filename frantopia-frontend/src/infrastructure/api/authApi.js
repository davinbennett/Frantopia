import axios from 'axios';

export const loginToBackendApi = async ( idToken, accessToken ) =>
{
   const API_AUTH_URL = process.env.EXPO_PUBLIC_API_AUTH_URL

   const response = await axios.post( `${ API_AUTH_URL }/login`, {
      idToken,
      accessToken,
   } );

   const jwtToken = response.data?.data?.jwtToken;
   const userId = response.data?.data?.user_id;

   console.log(response.data?.data);
   

   return {jwtToken, userId};
};