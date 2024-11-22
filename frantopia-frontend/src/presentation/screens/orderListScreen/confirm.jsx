import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ImageBackground, StatusBar, Dimensions, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Portal, Button, RadioButton, Divider } from 'react-native-paper';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const Confirm = () =>
{
   const screenHeight = Dimensions.get( 'screen' ).height;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

   const [ isLoading, setIsLoading ] = useState( true );
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );

   return (
      <View className='flex-1 bg-background px-7 '>
         <ScrollView>
            <Text>Confirm</Text>
         </ScrollView>
      </View>
   );
};

export default Confirm;