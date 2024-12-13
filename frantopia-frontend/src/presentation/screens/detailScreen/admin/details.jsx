import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Dimensions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Divider } from 'react-native-paper';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import { fetchGalleryByIdController, fetchPackageByIdController, fetchProductDetailByIdController } from '../../../../controller/productController';
import AntDesign from '@expo/vector-icons/AntDesign';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const DetailsAdmin = ( { id, name } ) =>
{
   const screenHeight = Dimensions.get( 'screen' ).height;
   const windowHeight = Dimensions.get( 'window' ).height;

   const [ isLoading, setIsLoading ] = useState( true );
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );

   const productGalleryData = [
      { id: "0", uri: 'https://via.placeholder.com/150' },
   ];

   const renderProductItem = ( { item } ) => (
      <Image
         source={{ uri: item.uri }}
         style={{ width: 100, height: 100, borderRadius: 8, marginHorizontal: 5 }}
      />
   );

   const renderPackageItem = ( { item } ) =>
   {
      const formatCurrency = ( value ) =>
      {
         return new Intl.NumberFormat( 'id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
         } ).format( value );
      };

      return (
         <View
            className="p-5 gap-y-2 mr-3"
            style={{
               borderWidth: 1,
               borderColor: '#ccc',
               shadowColor: 'black',
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.1,
               shadowRadius: 12,
               elevation: 0,
               borderRadius: 8,
            }}
         >
            <Text className="font-bold text-lg mb-3">{item.title}</Text>
            <Text className="">Size Concept:</Text>
            <Text className="ml-6 font-bold">{item.sizeConcept} m²</Text>
            <Text className="">Gross Profit:</Text>
            <Text className="ml-6 font-bold">{formatCurrency( item.grossProfit )}</Text>
            <Text className="">Income:</Text>
            <Text className="ml-6 font-bold">{formatCurrency( item.income )}</Text>
            <Text className="">Price:</Text>
            <Text className="ml-6 font-bold">{formatCurrency( item.price )}</Text>
         </View>
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
         console.log( 'status: ', status );
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
         console.log( fetchedGallery );

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
      <View className='flex-1 bg-background px-7 '>
         <FlatList
            showsVerticalScrollIndicator={false}
            data={{}}
            ListHeaderComponent={
               <View
                  style={{
                     shadowColor: 'black',
                     shadowOffset: { width: 0, height: 1 },
                     shadowOpacity: 0.1,
                     elevation: 1,
                     marginVertical: 18,
                  }}
                  className="bg-white rounded-2xl mb-5 "
               >
                  {
                     profile ? (
                        <Image
                           source={{
                              uri: profile,
                           }}
                           className="w-full rounded-tl-2xl rounded-tr-2xl mb-1"
                           style={{ height: screenHeight * 0.2 }}
                        />
                     ) : (
                        <SkeletonPlaceholder>
                           <SkeletonPlaceholder.Item width="100%" height={screenHeight * 0.2} />
                        </SkeletonPlaceholder>
                     )
                  }

                  <View className="p-5 gap-y-3">
                     <Text className="text-2xl font-bold">{name || "N/A"}</Text>

                     <View className='flex-row justify-between'>
                        <View className="flex-row gap-x-2 items-center">
                           <MaterialIcons name="content-cut" size={20} color="#2d70f3" />
                           <Text className="text-[#515151] font-medium">{category || "N/A"}</Text>
                        </View>
                        <View className="flex-row gap-x-1 items-center">
                           <AntDesign name="star" size={20} color="orange" />
                           <Text className='ml-1 font-medium text-[#515151]'>{rating || "N/A"}</Text>
                        </View>
                     </View>

                     <View className='flex-row justify-between'>
                        <Text className='flex-1'>est. {established || "N/A"}</Text>
                        <View className='flex-row flex-1 justify-end'>
                           <MaterialIcons name="location-pin" size={18} color="grey" />
                           <Text className='ml-1'>{location || "N/A"}</Text>
                        </View>
                     </View>

                     <Divider bold />

                     <Text className="font-bold text-xl text-blueDark">Detail</Text>
                     <Text>{description || "No description available."}</Text>

                     <Divider bold />

                     <Text className="font-bold text-xl text-blueDark">Business Detail</Text>
                     <View className='flex-row justify-between'>
                        <View className='rounded-xl ml-4 flex-1 gap-y-3'>
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

                        <View className='rounded-xl flex-1 gap-y-3'>
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
               </View>
            }
         />
      </View>
   );
};

export default DetailsAdmin;
