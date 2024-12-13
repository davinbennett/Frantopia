import { Image, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import React from 'react';
import
{
   useNavigation,
} from '@react-navigation/native';
import { loginWithGoogleController } from '../../../controller/authController';
import { useDispatch } from 'react-redux';
import { setIsAdmin } from '../../../infrastructure/redux/slice/authSlice';

const LoginScreen = () =>
{
   const navigation = useNavigation();
   const dispatch = useDispatch();

   const handleLogin = async () =>
   {
      try
      {
         const { isAdmin } = await loginWithGoogleController( dispatch );
         console.log( 'isAdmin Login Screen: ', isAdmin );
         navigation.replace( 'BottomTabNavigation',
            { isAdmin }
         );
      } catch ( error )
      {
         if ( error.message && error.message.includes( 'getTokens requires a user to be signed in' ) )
         {
            return;
         }
         console.log( 'Login failed', error.message );
      }
   };

   return (
      <SafeAreaView className="flex-1 justify-evenly items-center px-5 bg-blue">
         <StatusBar backgroundColor="#2D70F3" barStyle="light-content" />
         <Image
            source={require( '../../../assets/icons/homeBGmiring.png' )}
            className='absolute top-20 -left-20'
         />
         <Image
            source={require( '../../../assets/icons/homeBGmiring2.png' )}
            className='absolute top-2 -right-10'
         />
         <Image
            source={require( '../../../assets/icons/homeBGmiring2.png' )}
            className='absolute bottom-10 -right-16'
         />

         <Text className="text-white text-3xl font-bold">
            Get It On Now
         </Text>

         <Image
            source={require( '../../../assets/images/login.png' )}
            className="my-6"
         />

         {/* Button Google SignIn */}
         <TouchableOpacity
            className="w-full flex-row bg-white justify-center items-center gap-x-3 py-4 rounded-lg"
            onPress={handleLogin}
         >
            <Image
               source={{ uri: 'https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Google-512.png' }}
               className="w-5 h-5"
            />
            <Text className="text-black font-semibold text-md ">
               Continue with Google
            </Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};

export default LoginScreen;
