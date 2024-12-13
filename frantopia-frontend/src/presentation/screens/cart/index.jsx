import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useSelector } from 'react-redux';
import { fetchCartByIdController, getCountCartByIdController } from '../../../controller/userController';
import { Badge } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Cart = ( ) =>
{
   const navigation = useNavigation();
   const [ countCart, setCountCart ] = useState( 0 );

   const { jwtToken, isAdmin, userId } = useSelector( ( state ) => state.auth );
   const [ isLoading, setIsLoading ] = useState( true );

   const getCountCart = async () =>
   {
      try
      {
         const { countCart } = await getCountCartByIdController( jwtToken, userId );
         setCountCart( countCart );
      } catch ( error )
      {
         console.error( "Error get count cart:", error );
      }
   };

   useFocusEffect(
      React.useCallback( () =>
      {
         setIsLoading( true ); 
         getCountCart();
         setIsLoading( false );
      }, [ jwtToken, userId ] )
   );

   return (
      <TouchableOpacity
         onPress={() =>
         {
            navigation.navigate( 'YourCart' );
         }}
      >
         <Feather name="shopping-cart" size={22} color="white" />
         <Badge
            size={16}
            
            style={{ position: 'absolute', top: -5, right: -5 }}>
            {countCart}
         </Badge>
      </TouchableOpacity>
   );
};

export default Cart;