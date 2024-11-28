import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Divider } from 'react-native-paper';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import { fetchGalleryByIdController, fetchPackageByIdController, fetchProductDetailByIdController } from '../../../../controller/productController';
import AntDesign from '@expo/vector-icons/AntDesign';


const DetailsCustomer = ( { route, navigation } ) =>
{
   const { id, name } = route.params;
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );
   const screenHeight = Dimensions.get( 'screen' ).height;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
   const [ isLoading, setIsLoading ] = useState( true );

   const [ selectedItem, setSelectedItem ] = useState( 0 );

   const productGalleryData = [
      { id: "0", uri: 'https://via.placeholder.com/150' },
   ];

   const renderProductItem = ( { item } ) => (
      <Image
         source={{ uri: item.uri }}
         style={{ width: 100, height: 100, borderRadius: 8, marginHorizontal: 5 }}
      />
   );

   const [ selectedId, setSelectedId ] = useState( null );


   const handleSelect = ( id, item ) =>
   {
      setSelectedId( id );
      setSelectedItem( item );
   };

   const renderPackageItem = ( { item } ) =>
   {
      const isSelected = item.id === selectedId;

      return (
         <TouchableOpacity
            onPress={() => handleSelect( item.id, item )}
            className={`px-5 py-7 gap-y-2 mr-3 bg-white rounded-xl ${ isSelected ? 'border-2 border-blue-500' : ''
               }`}
         >
            {/* Radio Button */}
            <View className="absolute top-2 right-2">
               <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? '#2d70f3' : '#ccc'} // Warna ikon
               />
            </View>

            <Text className="font-bold text-lg mb-3">{item.title}</Text>
            <Text className="">Size Concept:</Text>
            <Text className="ml-6 font-bold">{item.sizeConcept || ''} x {item.sizeConcept || ''} m²</Text>
            <Text className="">Gross Profit:</Text>
            <Text
               numberOfLines={1}
               adjustsFontSizeToFit
               className="ml-6 font-bold"
            >
               {formatCurrency( item.grossProfit || '' )}
            </Text>
            <Text className="">Income:</Text>
            <Text
               numberOfLines={1}
               adjustsFontSizeToFit
               className="ml-6 font-bold"
            >
               {formatCurrency( item.income || '' )}
            </Text>
            <Text className="">Price:</Text>
            <Text
               numberOfLines={1}
               adjustsFontSizeToFit
               className="ml-6 font-bold"
            >
               {formatCurrency( item.price || '' )}
            </Text>
         </TouchableOpacity>
      );
   };

   const [ category, setCategory ] = useState( null );
   const [ established, setEstablished ] = useState( null );
   const [ description, setDescription ] = useState( null );
   const [ price, setPrice ] = useState( null );
   const [ licensed, setLicensed ] = useState( null );
   const [ location, setLocation ] = useState( null );
   const [ outletSales, setOutletSales ] = useState( null );
   const [ rating, setRating ] = useState( null );
   const [ royaltyFee, setRoyaltyFee ] = useState( null );
   const [ stock, setStock ] = useState( null );
   const [ profile, setProfile ] = useState( null );
   const [ deposit, setDeposit ] = useState( null );

   const fetchProductDetail = async () =>
   {
      try
      {
         const {
            category,
            established,
            description,
            price,
            licensed,
            location,
            outletSales,
            rating,
            royaltyFee,
            stock,
            profile,
            deposit,
            name, status
         } = await fetchProductDetailByIdController( jwtToken, id );

         setCategory( category );
         setEstablished( established );
         setDescription( description );
         setPrice( price );
         setLicensed( licensed );
         setLocation( location );
         setOutletSales( outletSales );
         setRating( rating );
         setRoyaltyFee( royaltyFee );
         setStock( stock );
         setProfile( profile );
         setDeposit( deposit );
      } catch ( error )
      {
         console.error( "Error fetching product detail:", error );
      }
   };

   const [ gallery, setGallery ] = useState( productGalleryData );

   const fetchGallery = async () =>
   {
      try
      {
         const { gallery: fetchedGallery } = await fetchGalleryByIdController( jwtToken, id );



         const formattedGallery = fetchedGallery.map( ( uri, index ) => ( {
            id: `${ index + 1 }`,
            uri,
         } ) );

         setGallery( formattedGallery );

      } catch ( error )
      {
         console.error( "Failed to fetch gallery:", error );
      }
   };

   const [ packages, setPackages ] = useState( [ { id: 0, name: '', price: 0 } ] );
   const fetchPackages = async () =>
   {
      try
      {
         const { packages: fetchedPackages } = await fetchPackageByIdController( jwtToken, id );

         const formattedPackages = fetchedPackages.map( ( pkg ) => ( {
            id: pkg.packageId,
            title: pkg.name,
            sizeConcept: pkg.sizeConcept,
            grossProfit: pkg.grossProfit,
            income: pkg.income,
            price: pkg.price,
         } ) );

         setPackages( formattedPackages );
      } catch ( error )
      {
         console.error( "Error fetching packages:", error );
      }
   };

   useEffect( () =>
   {
      Promise.all( [
         fetchProductDetail(),
         fetchGallery(),
         fetchPackages(),
      ] ).catch( error => console.error( 'Error fetching data:', error ) )
         .finally( () => setIsLoading( false ) );
   }, [ id ] );

   const formatCurrency = ( value ) =>
   {
      return 'Rp ' + value.toString().replace( /\B(?=(\d{3})+(?!\d))/g, '.' );
   };

   return (
      <View className='flex-1 bg-background '>
         <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

         {/* App Bar */}
         <View
            className="bg-blue flex-row px-5 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center"
            style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8, marginBottom: 0 }}
         >
            <Image
               source={require( '../../../../assets/icons/storeMiringKecil2.png' )}
               className='absolute -top-10 -right-10'
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <TouchableOpacity
                  onPress={() => navigation.goBack()}
               >
                  <MaterialIcons name="keyboard-arrow-left" size={32} color="white" />
               </TouchableOpacity>
               <Text className='text-3xl text-white font-semibold ml-2'>
                  {name}
               </Text>
            </View>
         </View>

         <ScrollView

            className="rounded-2xl mx-7"
            showsVerticalScrollIndicator={false}
         >
            <Image
               source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlwn9-P2hxqO3WX1CYqWLHeP6H1Zk6KwSYfA&s',
               }}
               className="w-full rounded-2xl mb-1 mt-5"
               style={{ height: screenHeight * 0.25 }}
            />
            <View className="py-5 gap-y-3">
               <Text className="text-2xl font-bold">{name || "N/A"}</Text>
               <View className='flex-row justify-between'>
                  <View className="flex-row gap-x-2 items-center">
                     <MaterialIcons name="content-cut" size={24} color="#2d70f3" />
                     <Text className="text-[#515151] font-medium">{category || "N/A"}</Text>
                  </View>
                  <View className="flex-row gap-x-1 items-center">
                     <AntDesign name="star" size={24} color="orange" />
                     <Text className='ml-1 text-lg text-[#515151]'>{rating || "N/A"}</Text>
                  </View>
               </View>

               <View className='flex-row justify-between'>
                  <Text>est. {established || "N/A"}</Text>
                  <View className='flex-row'>
                     <MaterialIcons name="location-pin" size={18} color="black" />
                     <Text className='ml-1'>{location || "N/A"}</Text>
                  </View>

               </View>


               <Divider bold />

               <Text className="font-bold text-xl text-blueDark">Detail</Text>
               <Text>{description || "No description available."}</Text>
               <Divider bold />
               <Text className="font-bold text-xl text-blueDark">Business Detail</Text>
               <View className='flex-row justify-between'>
                  <View className='bg-white rounded-xl p-4 flex-1 gap-y-3'>
                     <Text className='font-bold text-lg '>
                        Start From
                     </Text>
                     <Text
                        className='ml-4'
                        numberOfLines={1}
                        adjustsFontSizeToFit
                     >
                        {formatCurrency( price || '' )}
                     </Text>
                     <Text className='font-bold text-lg '>
                        Licensed
                     </Text>
                     <Text className='ml-4'>
                        {licensed || ''}
                     </Text>
                     <Text className='font-bold text-lg '>
                        Deposit
                     </Text>
                     <Text
                        className='ml-4'
                        numberOfLines={1}
                        adjustsFontSizeToFit
                     >
                        {formatCurrency( deposit || '' )}
                     </Text>


                  </View>
                  <View className='w-4' />
                  <View className='bg-white rounded-xl p-4 flex-1 gap-y-3'>
                     <Text className='font-bold text-lg '>
                        Royalty Fee
                     </Text>
                     <Text className='ml-4'>
                        {royaltyFee || ''}%
                     </Text>
                     <Text className='font-bold text-lg '>
                        Outlet Sales
                     </Text>
                     <Text className='ml-4'>
                        {outletSales || ''}
                     </Text>
                  </View>
               </View>
               <Divider bold />
               <Text className="font-bold text-xl text-blueDark">Products Gallery</Text>
               <FlatList
                  data={gallery}
                  keyExtractor={( item ) => item.id || item.key}
                  renderItem={renderProductItem}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ marginVertical: 10 }}
               />
               <Divider bold />
               <Text className="font-bold text-xl text-blueDark">Packages</Text>
               <FlatList
                  data={packages}
                  keyExtractor={( item ) => item.id.toString()}
                  renderItem={renderPackageItem}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{}}
               />
            </View>
         </ScrollView>

         {/* Bottom Bar */}
         <View className="bg-blue flex-row justify-between items-center px-6 pt-5 pb-2">
            {/* Logo Cart */}
            {/* <TouchableOpacity
               className="flex-row items-center flex-1 border-2 border-white rounded-xl justify-center py-3 px-5"

            >
               <FontAwesome name="cart-plus" size={22} color="white" />
               <Text className="ml-5 text-white text-lg font-bold">Add to Cart</Text>
            </TouchableOpacity>

            <View className='w-5' /> */}

            <View className='flex-1'>
               <Text className="text-white">
                  Total Order
               </Text>
               <Text
                  className="text-white text-2xl font-bold"
                  numberOfLines={1}
                  adjustsFontSizeToFit
               >
                  {formatCurrency( selectedItem.price || 0 )}
               </Text>
            </View>

            <View className='w-5' />

            {/* Checkout Button */}
            <TouchableOpacity
               className="bg-yellow rounded-xl px-5 py-3 flex-1 items-center"
               onPress={() =>
               {
                  if ( !selectedItem )
                  {
                     Alert.alert(
                        "Package must be filled",
                        "Please select a package",
                        [ { text: "OK" } ]
                     );
                     return;
                  }

                  navigation.navigate( 'Checkout', {
                     packages: selectedItem,
                     productId: id,
                     productName: name,
                     licensed: licensed,
                  } );
                  console.log( 'Selected Item:', selectedItem );
               }}
            >
               <Text className="text-white text-lg font-bold">Checkout</Text>
            </TouchableOpacity>

         </View>
      </View>
   );
};

export default DetailsCustomer;
