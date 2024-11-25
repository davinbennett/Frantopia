import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StatusBar, Dimensions, Keyboard, ActivityIndicator, Pressable, Alert, ScrollView, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Modal, Portal, Button } from 'react-native-paper';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import { fetchGalleryByIdController, fetchPackageByIdController, fetchProductDetailByIdController, putBusinessDataController } from '../../../controller/productController';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { Input } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { v4 as uuidv4 } from 'uuid';

const EditBussiness = ( { navigation, route } ) =>
{
   const { id } = route.params;
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );
   const screenHeight = Dimensions.get( 'screen' ).height;
   const screenWidth = Dimensions.get( 'screen' ).width;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

   const categories = [
      { label: 'Health & Beauty', value: 'Health & Beauty' },
      { label: 'Expedition', value: 'Expedition' },
      { label: 'Food & Beverage', value: 'Food & Beverage' },
      { label: 'Barber & Salon', value: 'Barber & Salon' },
   ];

   const [ category, setCategory ] = useState( null );
   const [ established, setEstablished ] = useState( null );
   const [ description, setDescription ] = useState( null );
   const [ prices, setPrice ] = useState( null );
   const [ licensed, setLicensed ] = useState( null );
   const [ location, setLocation ] = useState( null );
   const [ outletSales, setOutletSales ] = useState( null );
   const [ rating, setRating ] = useState( null );
   const [ royaltyFee, setRoyaltyFee ] = useState( null );
   const [ stock, setStock ] = useState( null );
   const [ profile, setProfile ] = useState( null );
   const [ deposit, setDeposit ] = useState( null );
   const [ name, setName ] = useState( null );
   const [ status, setStatus ] = useState( null );
   const [ gallery, setGallery ] = useState( [] );
   const [ packages, setPackages ] = useState( [] );
   const [ income, setIncome ] = useState( null );

   const [ errorName, setErrorName ] = useState( '' );
   const [ errorCategory, setErrorCategory ] = useState( '' );
   const [ errorDesc, setErrorDesc ] = useState( '' );
   const [ errorLocation, setErrorLocation ] = useState( '' );
   const [ errorLicensed, setErrorLicensed ] = useState( '' );
   const [ errorEst, setErrorEst ] = useState( '' );
   const [ errorIncome, setErrorIncome ] = useState( '' );
   const [ errorPrice, setErrorPrice ] = useState( "" );
   const [ errorRating, setErrorRating ] = useState( "" );
   const [ errorDeposit, setErrorDeposit ] = useState( "" );
   const [ errorRoyaltyFee, setErrorRoyaltyFee ] = useState( "" );
   const [ errorOutletSales, setErrorOutletSales ] = useState( "" );

   const [ pickerVisibleIncome, setPickerVisibleIncome ] = useState( false );
   const [ currentIndexIncome, setCurrentIndexIncome ] = useState( null );
   const [ tempMonthIncome, setTempMonthIncome ] = useState( new Date() );

   const [ profileOld, setProfileOld ] = useState( null );
   const [ galleryOld, setGalleryOld ] = useState( [] );


   // get data product
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
            name,
            status,
            income
         } = await fetchProductDetailByIdController( jwtToken, id );

         const formattedIncome = income.map( ( { income, month } ) => ( {
            income,
            month,
         } ) );

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
         setName( name );
         setStatus( status );
         setIncome( formattedIncome );


         setProfileOld( profile );

      } catch ( error )
      {
         console.error( "Error fetching product detail:", error );
      }
   };

   // get data gallery
   const fetchGallery = async () =>
   {
      try
      {
         const { gallery: fetchedGallery } = await fetchGalleryByIdController( jwtToken, id );

         if ( Array.isArray( fetchedGallery ) )
         {
            const formattedGallery = fetchedGallery.map( ( uri ) => ( {
               id: uuidv4(),
               uri: uri,
            } ) );

            setGallery( formattedGallery );
            setGalleryOld( formattedGallery );
         } else
         {
            setGallery( [] );
            setGalleryOld( [] );
         }

      } catch ( error )
      {
         console.error( "Failed to fetch gallery:", error );
      }
   };


   // get data package
   const fetchPackages = async () =>
   {
      try
      {
         const { packages: fetchedPackages } = await fetchPackageByIdController( jwtToken, id );

         const formattedPackages = fetchedPackages.map( ( pkg ) => ( {
            id: pkg.packageId,
            name: pkg.name,
            sizeConcept: pkg.sizeConcept.toString(),
            grossProfit: pkg.grossProfit.toString(),
            income: pkg.income.toString(),
            price: pkg.price.toString(),
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
      ] ).catch( error => console.error( 'Error fetching data:', error ) );
   }, [ id ] );


   // profile
   const [ uploading, setUploading ] = useState( false );
   const takePhotoFromCamera = async () =>
   {
      try
      {
         const imageResult = await ImagePicker.openCamera( {
            width: 1200,
            height: 780,
            cropping: true,
         } );
         setProfile( imageResult.path );
      } catch ( error )
      {
         console.error( 'Error taking photo:', error );
      }
   };

   const takePhotoFromGallery = async () =>
   {
      try
      {
         const imageResult = await ImagePicker.openPicker( {
            width: 1200,
            height: 780,
            cropping: true,
         } );
         setProfile( imageResult.path );
      } catch ( error )
      {
         console.error( 'Error selecting photo:', error );
      }
   };

   // Location
   const [ modalVisibleLocation, setModalVisibleLocation ] = useState( false );
   const [ selectedPlace, setSelectedPlace ] = useState( null );

   // est
   const [ isDatePickerVisible, setDatePickerVisibility ] = useState( false );
   const [ date, setDate ] = useState( new Date() );
   const [ selectedYear, setSelectedYear ] = useState( '' );

   // format currency
   const formatCurrency = ( value ) =>
   {
      return 'Rp ' + value.toString().replace( /\B(?=(\d{3})+(?!\d))/g, '.' );
   };

   // validasi uang
   const validateCurrency = ( text, setValue, setError ) =>
   {
      if ( !text )
      {
         setError( "Deposit is required." );
         setValue( "" );
         return;
      }

      const formattedValue = formatCurrency( text );

      // Simpan ke state
      setError( "" );
      setValue( formattedValue );
   };

   // Validasi angka
   const validateNumber = ( text, setter, errorSetter ) =>
   {
      const numericText = text.replace( /[^0-9]/g, '' );
      setter( numericText );

      if ( !numericText.trim() )
      {
         errorSetter( 'This field is required.' );
      } else
      {
         errorSetter( '' );
      }
   };

   // Validasi rating
   const validateRating = ( text ) =>
   {
      const validText = text.replace( /[^0-9.]/g, "" );

      if ( ( validText.match( /\./g ) || [] ).length > 1 )
      {
         setErrorRating( "Rating should only contain one decimal point." );
      } else if ( parseFloat( validText ) > 5 )
      {
         setErrorRating( "Rating cannot be greater than 5." );
      } else if ( validText === "" )
      {
         setErrorRating( "Rating is required." );
      } else
      {
         setErrorRating( "" );
      }

      setRating( validText );
   };

   // INCOME
   const handleUpdateIncome = ( index, field, value ) =>
   {
      const updatedData = [ ...income ];
      updatedData[ index ][ field ] = value;
      setIncome( updatedData );
   };

   // GALLERY
   const [ imageGallery, setImageGallery ] = useState( null );
   const takePhotoFromCamera_Gallery = async () =>
   {
      try
      {
         const imageResult = await ImagePicker.openCamera( {
            width: screenWidth * 0.4,
            height: screenWidth * 0.4,
            cropping: true,
         } );
         setImageGallery( imageResult.path );
         const newPhoto = {
            id: uuidv4(),
            uri: imageResult.path,
         };
         setGallery( ( prevGallery ) => [ ...prevGallery, newPhoto ] );
      } catch ( error )
      {
         console.error( 'Error taking photo:', error );
      }
   };

   const takePhotoFromGallery_Gallery = async () =>
   {
      try
      {
         const imageResult = await ImagePicker.openPicker( {
            width: screenWidth * 0.4,
            height: screenWidth * 0.4,
            cropping: true,
         } );
         setImageGallery( imageResult.path );
         const newPhoto = {
            id: uuidv4(),
            uri: imageResult.path,
         };
         setGallery( ( prevGallery ) => [ ...prevGallery, newPhoto ] );
      } catch ( error )
      {
         console.error( 'Error selecting photo:', error );
      }
   };

   const handleAddPhoto = () =>
   {
      Alert.alert(
         'Choose Image Source',
         'Select an image from...',
         [
            { text: 'Camera', onPress: takePhotoFromCamera_Gallery },
            { text: 'Gallery', onPress: takePhotoFromGallery_Gallery },
            { text: 'Cancel', style: 'cancel' },
         ]
      );
   };


   // packages
   const [ isModalVisiblePackages, setIsModalVisiblePackages ] = useState( false );
   const [ newPackage, setNewPackage ] = useState( {
      name: '',
      sizeConcept: '',
      grossProfit: '',
      income: '',
      price: '',
   } );

   const handleAddPackage = () =>
   {
      if (
         !newPackage.name ||
         !newPackage.sizeConcept ||
         !newPackage.grossProfit ||
         !newPackage.income ||
         !newPackage.price
      )
      {
         alert( 'All fields are required!' );
         return;
      }

      const packageWithId = { ...newPackage, id: uuidv4() };
      setPackages( ( prev ) => [ ...prev, packageWithId ] );
      setNewPackage( { name: '', sizeConcept: '', grossProfit: '', income: '', price: '' } );
      setIsModalVisiblePackages( false );
   };

   const renderPackageItem = ( { item } ) =>
   {
      if ( item.isAddButton )
      {
         return (
            <Pressable
               onPress={() => setIsModalVisiblePackages( true )}
               className={` justify-center items-center bg-grayDark rounded-xl`}
               style={{
                  width: screenWidth * 0.45,
                  height: screenHeight * 0.31
               }}
            >
               <MaterialIcons name="add-business" size={30} color="white" />
            </Pressable>
         );
      }

      const handleDeletePackage = ( id ) =>
      {
         setPackages( ( prevPackages ) => prevPackages.filter( ( packages ) => packages.id !== id ) );
      };

      return (
         <View
            className="justify-between bg-white p-3 rounded-xl mb-2 mr-10"
            style={{
               shadowColor: 'black',
               shadowOffset: { width: 2, height: 2 },
               shadowOpacity: 0.1,
               elevation: 2,
               width: screenWidth * 0.45,
               height: screenHeight * 0.31,
               marginRight: 10
            }}
         >
            <Text className="font-bold text-xl">{item.name}</Text>
            <View>
               <Text className="text-sm">Size Concept:</Text>
               <Text
                  className="ml-4 text-base font-semibold"
                  adjustsFontSizeToFit
                  numberOfLines={1}
               >
                  {formatSizeConcept( item.sizeConcept )}
               </Text>
            </View>
            <View>
               <Text className="text-sm">Gross Profit:</Text>
               <Text
                  className="ml-4 text-base font-semibold"
                  adjustsFontSizeToFit
                  numberOfLines={1}
               >
                  {formatCurrency( item.grossProfit )}
               </Text>
            </View>
            <View>
               <Text className="text-sm">Income:</Text>
               <Text
                  className="ml-4 text-base font-semibold"
                  adjustsFontSizeToFit
                  numberOfLines={1}
               >
                  {formatCurrency( item.income )}
               </Text>
            </View>
            <View>
               <Text className="text-sm">Price:</Text>
               <Text
                  className="ml-4 text-base font-semibold"
                  adjustsFontSizeToFit
                  numberOfLines={1}
               >
                  {formatCurrency( item.price )}
               </Text>
            </View>


            {/* Trash */}
            <Pressable
               onPress={() => handleDeletePackage( item.id )}
               className="absolute top-3 right-4"
            >
               <FontAwesome5 name="trash" size={18} color="#BFBFBF" />
            </Pressable>
         </View>
      );
   };

   const formatSizeConcept = ( size ) =>
   {
      return `${ size } x ${ size } m²`;
   };

   // handle update foto
   const handleUpdateProfileAndGallery = async () =>
   {
      let profileUrl = profile;

      // **Profile Logic**
      if ( profile !== profileOld )
      {
         // Hapus profile lama jika berbeda
         if ( profileOld )
         {
            try
            {
               const profileOldRef = storage().refFromURL( profileOld );
               await profileOldRef.delete();
            } catch ( error )
            {
               if ( error.code !== "storage/object-not-found" )
               {
                  console.error( `Error deleting old profile: ${ profileOld }`, error );
               }
            }
         }

         // Unggah profile baru jika ada
         if ( profile )
         {
            const profileFileName = `${ uuidv4() }.jpg`;
            const profileStorageRef = storage().ref( profileFileName );
            await profileStorageRef.putFile( profile );
            profileUrl = await profileStorageRef.getDownloadURL();
         }
      }

      console.log( 'gallery: ', gallery );
      console.log( 'gallery old: ', galleryOld );



      // **Gallery Logic**
      const updatedGallery = [];
      const galleryOldUrls = galleryOld.map( item => item.uri );
      const galleryNewUrls = gallery.map( item => item.uri );

      // Hapus file yang ada di galleryOld tetapi tidak ada di gallery
      for ( const oldUri of galleryOldUrls )
      {
         if ( !galleryNewUrls.includes( oldUri ) )
         {
            try
            {
               const oldRef = storage().refFromURL( oldUri );
               await oldRef.delete();
            } catch ( error )
            {
               if ( error.code !== "storage/object-not-found" )
               {
                  console.error( `Error deleting gallery item: ${ oldUri }`, error );
               }
            }
         }
      }

      // Upload file baru yang ada di gallery tetapi tidak ada di galleryOld
      for ( const newItem of gallery )
      {
         if ( !galleryOldUrls.includes( newItem.uri ) )
         {
            try
            {
               const newFileName = `${ uuidv4() }.jpg`;
               const newStorageRef = storage().ref( newFileName );
               await newStorageRef.putFile( newItem.uri );
               const newUrl = await newStorageRef.getDownloadURL();
               updatedGallery.push( newUrl ); // Simpan URL baru ke updatedGallery
            } catch ( error )
            {
               console.error( `Error uploading new gallery item: ${ newItem.uri }`, error );
            }
         } else
         {
            // Jika sudah ada di galleryOld, tetap tambahkan URL ke updatedGallery
            updatedGallery.push( newItem.uri );
         }
      }
      console.log( 'Updated gallery: ' + updatedGallery );



      return {
         profileUrl,
         galleryUrls: updatedGallery,
      };
   };



   // SUBMIT
   const handleUpdate = async () =>
   {
      if ( !name ) setErrorName( 'Business Name is required.' );
      if ( !category ) setErrorCategory( 'Category is required.' );
      if ( !description.trim() ) setErrorDesc( 'Description is required.' );
      if ( !location.trim() ) setErrorLocation( 'Location is required.' );
      if ( !licensed.trim() ) setErrorLicensed( 'License is required.' );
      if ( !established.toString().trim() ) setErrorEst( 'Established is required.' );
      if ( income.length == 0 ) setErrorIncome( 'Income cannot be empty.' );
      if ( !prices.toString().trim() ) setErrorPrice( 'Price cannot be empty.' );
      if ( !rating.toString().trim() ) setErrorRating( 'Rating cannot be empty.' );
      if ( !deposit.toString().trim() ) setErrorDeposit( 'Deposit cannot be empty.' );
      if ( !royaltyFee.toString().trim() ) setErrorRoyaltyFee( 'Royalty fee cannot be empty.' );
      if ( !outletSales.toString().trim() ) setErrorOutletSales( 'Outlet sales cannot be empty.' );

      if ( name && category && description && location && licensed && established.toString() && income.length > 0 && prices.toString() && rating.toString() && deposit.toString() && royaltyFee.toString() && outletSales.toString() )
      {
         setUploading( true );

         try
         {
            const { profileUrl, galleryUrls } = await handleUpdateProfileAndGallery( profile, profileOld, gallery, galleryOld );

            const businessData = {
               name,
               category,
               established: parseInt( established ) || 0,
               description: description,
               price: parseInt( prices ) || 0,
               licensed,
               rating: parseFloat( rating ) || 0.0,
               location,
               deposit: parseInt( deposit ) || 0,
               royalty_fee: parseInt( royaltyFee ) || 0,
               outlet_sales: parseInt( outletSales ) || 0,
               stock,
               profile: profileUrl,
               gallery: galleryUrls,
               income: income.map( ( item ) => ( {
                  ...item,
                  income: parseInt( item.income ) || 0,
               } ) ),
               status,
               package_franchises: packages.map( ( { id, grossProfit, income, price, sizeConcept, ...rest } ) => ( {
                  ...rest,
                  gross_profit: parseInt( grossProfit ) || 0,
                  income: parseInt( income ) || 0,
                  price: parseInt( price ) || 0,
                  size_concept: parseInt( sizeConcept ) || 0,
               } ) ),
            };

            const response = await putBusinessDataController( jwtToken, businessData, id );
            Alert.alert(
               'Success',
               'Business updated successfully!',
               [
                  {
                     text: 'OK',
                     onPress: () =>
                     {
                        navigation.goBack();
                     },
                  },
               ]
            );

         } catch ( error )
         {
            console.error( 'Error uploading files:', error );
            Alert.alert( 'Error', 'Something went wrong during the upload.' );
         } finally
         {
            setUploading( false );
         }
      }
   };


   return (
      <View className='flex-1 bg-background'>
         <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

         {/* App Bar */}
         <View
            className="bg-blue flex-row px-5 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center"
            style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8, marginBottom: 18 }}
         >
            <Image
               source={require( '../../../assets/icons/storeMiringKecil2.png' )}
               className='absolute -top-10 -right-10'
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <TouchableOpacity
                  onPress={() => navigation.goBack()}
               >
                  <MaterialIcons name="keyboard-arrow-left" size={32} color="white" />
               </TouchableOpacity>
               <Text className='text-3xl text-white font-semibold ml-2'>
                  Edit Business
               </Text>
            </View>
         </View>

         <ScrollView>
            <View className='px-7'>
               <View className='flex-1 bg-white rounded-2xl mb-5'
                  style={{
                     shadowColor: 'black',
                     shadowOffset: { width: 0, height: 2 },
                     shadowOpacity: 0.1,
                     elevation: 3,
                  }}
               >
                  {/* PHOTO */}
                  <Pressable
                     className='w-full rounded-tl-2xl rounded-tr-2xl bg-grayDark justify-center items-center'
                     style={{ height: screenHeight * 0.2 }}
                     onPress={() =>
                     {
                        Alert.alert(
                           'Choose Image Source',
                           'Select an image from...',
                           [
                              { text: 'Camera', onPress: takePhotoFromCamera },
                              { text: 'Gallery', onPress: takePhotoFromGallery },
                              { text: 'Cancel', style: 'cancel' },
                           ]
                        );
                     }}
                  >
                     {uploading ? (
                        <ActivityIndicator size="large" color="#fff" />
                     ) : profile ? (
                        <Image
                           source={{ uri: profile }}
                           style={{
                              width: '100%',
                              height: '100%',
                              resizeMode: 'cover',
                           }}
                           className='rounded-tl-2xl rounded-tr-2xl'
                        />
                     ) : (
                        <View className='bg-[#979797] rounded-full'>
                           <MaterialIcons name="add-photo-alternate" size={24} color="white" style={{ padding: 7 }} />
                        </View>
                     )}
                  </Pressable>

                  {/* Details */}
                  <View className='px-5 py-6'>
                     <View>
                        <Input
                           label="Business Name*"
                           labelStyle={{
                              fontSize: 14,
                              fontWeight: 'normal',
                              color: 'black',
                           }}
                           inputContainerStyle={{
                              borderColor: '#94acfc',
                              borderBottomWidth: 1,
                           }}
                           containerStyle={{
                              paddingHorizontal: 0,
                              marginBottom: 0,
                           }}
                           inputStyle={{
                              fontSize: 14,
                           }}
                           value={name}
                           onChangeText={( text ) =>
                           {
                              setName( text );
                              if ( text.trim() )
                              {
                                 setErrorName( '' );
                              }
                           }}
                           errorMessage={errorName}
                           errorStyle={{
                              marginHorizontal: 0,
                           }}
                        />
                     </View>
                     <View>
                        <Text>Category*</Text>
                        <Dropdown
                           data={categories}
                           labelField="label"
                           valueField="value"
                           placeholder=""
                           value={category}
                           onChange={( item ) =>
                           {
                              setCategory( item.value );
                              if ( item.value ) setErrorCategory( '' );
                           }}
                           style={{
                              borderColor: '#2D70F3',
                              borderWidth: 1,
                              borderRadius: 5,
                              paddingHorizontal: 14,
                              paddingVertical: 12,
                              backgroundColor: 'white',
                              marginTop: 8
                           }}
                           containerStyle={{
                              borderRadius: 5,
                           }}
                           placeholderStyle={{
                              color: '#999',
                              fontSize: 14,
                           }}
                           selectedTextStyle={{
                              color: 'black',
                              fontSize: 14,
                           }}
                        />
                        {errorCategory ?
                           <Text style={{
                              color: 'red',
                              fontSize: 12,
                              marginTop: 5,
                           }}>
                              {errorCategory}
                           </Text> : null
                        }
                     </View>
                     <View className='pt-7'>
                        <Input
                           label="Description*"
                           labelStyle={{
                              fontSize: 14,
                              fontWeight: 'normal',
                              color: 'black',
                           }}
                           inputContainerStyle={{
                              borderColor: '#94acfc',
                              borderBottomWidth: 1,
                           }}
                           containerStyle={{
                              paddingHorizontal: 0,
                           }}
                           inputStyle={{
                              fontSize: 14,
                           }}
                           value={description}
                           onChangeText={( text ) =>
                           {
                              setDescription( text );
                              if ( text.trim() ) setErrorDesc( '' );
                           }}
                           errorMessage={errorDesc}
                           errorStyle={{
                              marginHorizontal: 0,
                           }}
                        />
                     </View>
                     <View>
                        <Input
                           label="Location*"
                           labelStyle={{
                              fontSize: 14,
                              fontWeight: 'normal',
                              color: 'black',
                           }}
                           inputContainerStyle={{
                              borderColor: '#94acfc',
                              borderBottomWidth: 1,
                           }}
                           containerStyle={{
                              paddingHorizontal: 0,
                           }}
                           inputStyle={{
                              fontSize: 14,
                           }}
                           value={location}
                           onFocus={() => setModalVisibleLocation( true )}
                           errorMessage={errorLocation}
                           cursorColor={'white'}
                           errorStyle={{
                              marginHorizontal: 0,
                           }}
                        />

                        {/* Modal Location */}
                        <Portal>
                           <Modal
                              visible={modalVisibleLocation}
                              onDismiss={() =>
                              {
                                 Keyboard.dismiss();
                                 setModalVisibleLocation( false );
                              }}
                              contentContainerStyle={{
                                 backgroundColor: 'white',
                                 padding: 20,
                                 marginHorizontal: 20,
                                 borderRadius: 10,
                                 maxHeight: '80%',
                                 minHeight: '60%',
                              }}
                           >
                              <View>
                                 <Text className='font-bold text-xl mb-2'>
                                    Select Location
                                 </Text>
                              </View>

                              {/* Google Places Injoyouput */}
                              <View className="flex-1">
                                 <GooglePlacesAutocomplete
                                    placeholder="Search..."
                                    onPress={( data, details = null ) =>
                                    {
                                       setSelectedPlace( {
                                          name: data.description,
                                          details: details?.geometry?.location,
                                       } );
                                    }}
                                    query={{
                                       key: process.env.EXPO_PUBLIC_API_GOOGLEPLACE,
                                       language: 'en',
                                    }}
                                    fetchDetails={true}
                                    enablePoweredByContainer={false}
                                    styles={{
                                       textInput: {
                                          backgroundColor: '#f9f9f9',
                                          height: 40,
                                          borderRadius: 5,
                                          paddingHorizontal: 10,
                                          borderWidth: 1,
                                          borderColor: '#ddd',
                                       },
                                    }}
                                 />
                              </View>

                              {/* Display Tempat yang Dipilih */}
                              {selectedPlace && (
                                 <View className="p-3 bg-gray-100 rounded-md">
                                    <Text className="text-lg font-bold">
                                       Selected Place:
                                    </Text>
                                    <Text className="">
                                       {selectedPlace.name}
                                    </Text>
                                 </View>
                              )}

                              {/* Reset Button */}
                              {selectedPlace && (
                                 <Button
                                    style={{
                                       marginBottom: 5,
                                       borderColor: "#F3B02D"
                                    }}
                                    mode="outlined"
                                    textColor='#F3B02D'
                                    onPress={() =>
                                    {
                                       setSelectedPlace( null );
                                       setLocation( null );
                                    }}
                                 >
                                    Reset
                                 </Button>
                              )}

                              {/* Button untuk Menutup Modal */}
                              <Button
                                 mode="contained"
                                 onPress={() => 
                                 {
                                    setLocation( selectedPlace?.name || '' );
                                    if ( selectedPlace )
                                    {
                                       setErrorLocation( '' );
                                    }
                                    setModalVisibleLocation( false );
                                 }}
                                 buttonColor='#F3B02D'
                              >
                                 Confirm
                              </Button>
                           </Modal>
                        </Portal>
                     </View>

                     {/* licensed */}
                     <View>
                        <Input
                           label="Licensed*"
                           labelStyle={{
                              fontSize: 14,
                              fontWeight: 'normal',
                              color: 'black',
                           }}
                           inputContainerStyle={{
                              borderColor: '#94acfc',
                              borderBottomWidth: 1,
                           }}
                           containerStyle={{
                              paddingHorizontal: 0,
                              marginBottom: 0,
                           }}
                           inputStyle={{
                              fontSize: 14,
                           }}
                           value={licensed}
                           onChangeText={( text ) =>
                           {
                              setLicensed( text );
                              if ( text.trim() ) setErrorLicensed( '' );
                           }}
                           errorMessage={errorLicensed}
                           errorStyle={{
                              marginHorizontal: 0,
                           }}
                        />
                     </View>

                     {/* est */}
                     <View>
                        <View className="border-b border-[#94acfc] pb-2">
                           <Text style={{ fontSize: 14 }} className="font-normal text-black mb-1">Established*</Text>
                           <TouchableOpacity
                              onPress={() =>
                              {
                                 setDatePickerVisibility( true );
                                 if ( established.toString().trim() )
                                 {
                                    setErrorEst( '' );
                                 }
                              }}
                              className="py-1"
                           >
                              <Text className="text-base text-black">
                                 {established}
                              </Text>
                           </TouchableOpacity>
                        </View>
                        {errorEst && (
                           <Text className="text-red-500 text-sm mt-1">
                              Established ifs required.
                           </Text>
                        )}

                        <Portal>
                           <Modal
                              visible={isDatePickerVisible}
                              onDismiss={() => setDatePickerVisibility( false )}
                              contentContainerStyle={{
                                 backgroundColor: 'white',
                                 padding: 20,
                                 marginHorizontal: 20,
                                 borderRadius: 10,
                              }}
                           >
                              <Text className="text-lg font-bold text-center mb-4">Select Year</Text>
                              <DatePicker
                                 modal={false}
                                 date={date}
                                 mode="date"
                                 maximumDate={new Date()}
                                 minimumDate={new Date( 1900, 0, 1 )}
                                 onDateChange={( selectedDate ) =>
                                 {
                                    setDate( selectedDate );
                                    setErrorEst( '' );
                                 }}
                              />
                              <View className="flex-row justify-between mt-4">
                                 <Button
                                    mode="outlined"
                                    onPress={() => setDatePickerVisibility( false )}
                                    textColor="black"
                                    style={{ borderColor: '#ddd', marginHorizontal: 4 }}
                                 >
                                    Cancel
                                 </Button>
                                 <Button
                                    mode="contained"
                                    onPress={() =>
                                    {
                                       const year = date.getFullYear();
                                       setSelectedYear( year.toString() );
                                       setEstablished( year.toString() );
                                       setDatePickerVisibility( false );
                                    }}
                                    buttonColor="#F3B02D"
                                 >
                                    Confirm
                                 </Button>
                              </View>
                           </Modal>
                        </Portal>
                     </View>

                     {/* Price */}
                     <View className='mt-7'>
                        <Input
                           label="Price*"
                           labelStyle={{
                              fontSize: 14,
                              fontWeight: 'normal',
                              color: 'black',
                           }}
                           inputContainerStyle={{
                              borderColor: '#94acfc',
                              borderBottomWidth: 1,
                           }}
                           containerStyle={{
                              paddingHorizontal: 0,
                              marginBottom: 0,
                           }}
                           inputStyle={{
                              fontSize: 14,
                           }}
                           value={formatCurrency( prices?.toString() || "" )}
                           onChangeText={( text ) => validateNumber( text, setPrice, setErrorPrice )}
                           errorMessage={errorPrice}
                           errorStyle={{
                              marginHorizontal: 0,
                           }}
                           inputMode='numeric'
                        />
                     </View>

                     {/* Rating */}
                     <View>
                        <Input
                           label="Rating*"
                           labelStyle={{
                              fontSize: 14,
                              fontWeight: 'normal',
                              color: 'black',
                           }}
                           inputContainerStyle={{
                              borderColor: '#94acfc',
                              borderBottomWidth: 1,
                           }}
                           containerStyle={{
                              paddingHorizontal: 0,
                              marginBottom: 0,
                           }}
                           inputStyle={{
                              fontSize: 14,
                           }}
                           value={rating?.toString() || ''}
                           inputMode='decimal'
                           onChangeText={( text ) => validateRating( text )}
                           errorMessage={errorRating}
                           errorStyle={{
                              marginHorizontal: 0,
                           }}
                        />
                     </View>

                     {/* Deposit */}
                     <View>
                        <Input
                           label="Deposit*"
                           labelStyle={{
                              fontSize: 14,
                              fontWeight: 'normal',
                              color: 'black',
                           }}
                           inputContainerStyle={{
                              borderColor: '#94acfc',
                              borderBottomWidth: 1,
                           }}
                           containerStyle={{
                              paddingHorizontal: 0,
                              marginBottom: 0,
                           }}
                           inputStyle={{
                              fontSize: 14,
                           }}
                           value={formatCurrency( deposit?.toString() || '' )}
                           onChangeText={( text ) => validateNumber( text, setDeposit, setErrorDeposit )}
                           errorMessage={errorDeposit}
                           errorStyle={{
                              marginHorizontal: 0,
                           }}
                           inputMode='numeric'
                        />
                     </View>

                     {/* Royalty Fee */}
                     <View>
                        <Input
                           label="Royalty Fee*"
                           labelStyle={{
                              fontSize: 14,
                              fontWeight: 'normal',
                              color: 'black',
                           }}
                           inputContainerStyle={{
                              borderColor: '#94acfc',
                              borderBottomWidth: 1,
                           }}
                           containerStyle={{
                              paddingHorizontal: 0,
                              marginBottom: 0,
                           }}
                           inputStyle={{
                              fontSize: 14,
                           }}
                           value={`% ${ royaltyFee?.toString() || '' }`}
                           onChangeText={( text ) => validateNumber( text, setRoyaltyFee, setErrorRoyaltyFee )}
                           errorMessage={errorRoyaltyFee}
                           errorStyle={{
                              marginHorizontal: 0,
                           }}
                           inputMode='numeric'
                        />
                     </View>

                     {/* Outlet Sales */}
                     <View>
                        <Input
                           label="Outlet Sales*"
                           labelStyle={{
                              fontSize: 14,
                              fontWeight: 'normal',
                              color: 'black',
                           }}
                           inputContainerStyle={{
                              borderColor: '#94acfc',
                              borderBottomWidth: 1,
                           }}
                           containerStyle={{
                              paddingHorizontal: 0,
                              marginBottom: 0,
                           }}
                           inputStyle={{
                              fontSize: 14,
                           }}
                           value={outletSales?.toString() || ""}
                           onChangeText={( text ) => validateNumber( text, setOutletSales, setErrorOutletSales )}
                           errorMessage={errorOutletSales}
                           errorStyle={{
                              marginHorizontal: 0,
                           }}
                           inputMode='numeric'
                        />
                     </View>

                     {/* Income */}
                     <View className=''>
                        <Text className="mb-2">Income*</Text>
                        <FlatList
                           data={income}
                           renderItem={( { item, index } ) => (
                              <View className="gap-y-2 p-2 border border-[#94acfc] rounded-xl mr-3 ">
                                 <TouchableOpacity
                                    onPress={() =>
                                    {
                                       setCurrentIndexIncome( index );
                                       setPickerVisibleIncome( true );
                                    }}
                                    className="flex-1 border border-zinc-300 rounded-md px-2 py-2 text-xl justify-center"
                                 >
                                    <Text className={` ${ item.month ? 'text-black' : 'text-[#777777]' }`}>
                                       {item.month || 'Select Month'}
                                    </Text>
                                 </TouchableOpacity>
                                 <TextInput
                                    placeholder="Income"
                                    value={formatCurrency( item.income.toString() || '' )}
                                    onChangeText={( text ) => handleUpdateIncome( index, 'income', text.replace( /[^0-9]/g, '' ) )}
                                    keyboardType="numeric"
                                    className="flex-1 border border-zinc-300 rounded-md px-2 py-1"
                                 />
                                 <TouchableOpacity
                                    onPress={() =>
                                    {
                                       const updatedData = [ ...income ];
                                       updatedData.splice( index, 1 );
                                       setIncome( updatedData );
                                    }}
                                 >
                                    <Text className="text-red-500 font-bold self-center">Remove</Text>
                                 </TouchableOpacity>

                              </View>
                           )}
                           keyExtractor={( item, index ) => index.toString()}
                           horizontal
                        />
                        {errorIncome ? (
                           <Text style={{ color: 'red', marginVertical: 8 }}>{errorIncome}</Text>
                        ) : null}
                        <TouchableOpacity
                           onPress={() =>
                           {
                              setIncome( ( prev ) => [ ...prev, { month: '', income: '' } ] );
                              setErrorIncome( '' );
                           }}
                           className="bg-blue my-4 p-3 rounded-md items-center"
                        >
                           <Text className="text-white font-bold">+ Add Income</Text>
                        </TouchableOpacity>

                        <Portal>
                           {pickerVisibleIncome && (
                              <Modal visible={pickerVisibleIncome} onDismiss={() => setPickerVisibleIncome( false )}>
                                 <DatePicker
                                    modal
                                    open={pickerVisibleIncome}
                                    date={tempMonthIncome}
                                    mode="date"
                                    onConfirm={( selectedDate ) =>
                                    {
                                       const formattedDate = selectedDate.toLocaleDateString( 'en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                       } );
                                       handleUpdateIncome( currentIndexIncome, 'month', formattedDate );
                                       setPickerVisibleIncome( false );
                                    }}
                                    onCancel={() => setPickerVisibleIncome( false )}
                                    maximumDate={new Date()}
                                 />
                              </Modal>
                           )}
                        </Portal>
                     </View>

                     {/* Product Gallery */}
                     <View>
                        <Text className='mb-2'>
                           Products Gallery
                        </Text>
                        <FlatList
                           data={[ ...gallery, { id: 'add-button', isAddButton: true } ]}
                           keyExtractor={( item ) => item.id.toString()}
                           renderItem={( { item } ) =>
                           {
                              if ( item.isAddButton )
                              {
                                 return (
                                    <Pressable
                                       onPress={handleAddPhoto}
                                       className=" h-36 justify-center items-center bg-grayDark border-2 border-white rounded-xl"
                                       style={{
                                          width: screenWidth * 0.4,
                                          height: screenWidth * 0.4
                                       }}
                                    >
                                       <MaterialIcons name="add-photo-alternate" size={30} color="white" />
                                    </Pressable>
                                 );
                              }

                              const handleDeletePhoto = ( id ) =>
                              {
                                 setGallery( ( prevGallery ) => prevGallery.filter( ( photo ) => photo.id !== id ) );
                              };

                              return (
                                 <View>
                                    <Image
                                       source={{ uri: item.uri }}
                                       style={{
                                          width: screenWidth * 0.4,
                                          height: screenWidth * 0.4,
                                          marginRight: 10,
                                          borderRadius: 8,
                                       }}
                                    />


                                    <Pressable
                                       onPress={() => handleDeletePhoto( item.id )}
                                       className="absolute top-3 right-6 bg-white p-2 rounded-full"
                                    >
                                       <FontAwesome5 name="trash" size={16} color="#403c3c" />
                                    </Pressable>
                                 </View>
                              );
                           }}
                           horizontal
                           showsHorizontalScrollIndicator={false}
                        />
                     </View>

                     {/* packages */}
                     <View className='py-7'>
                        <Text className='mb-2'>
                           Packages
                        </Text>
                        <FlatList
                           data={[ ...packages, { id: 'add-button', isAddButton: true } ]}
                           keyExtractor={( item ) => item.id.toString()}
                           renderItem={renderPackageItem}
                           showsVerticalScrollIndicator={false}
                           horizontal
                        />

                        {/* Modal for Adding New Package */}
                        <Portal>
                           <Modal
                              visible={isModalVisiblePackages}
                              onDismiss={() => setIsModalVisiblePackages( false )}
                              contentContainerStyle={{
                                 backgroundColor: 'white',
                                 padding: 20,
                                 marginHorizontal: 20,
                                 borderRadius: 10,

                              }}
                           >
                              <Text className="text-xl font-bold mb-6">Add New Package</Text>

                              <View className="mb-4">
                                 <Text className="text-zinc-500 mb-1">Package Name</Text>
                                 <TextInput
                                    value={newPackage.name}
                                    onChangeText={( text ) => setNewPackage( ( prev ) => ( { ...prev, name: text } ) )}
                                    className="border-b border-[#94acfc]  pb-1"
                                 />
                              </View>
                              <View className="mb-4">
                                 <Text className="text-zinc-500 mb-1">Size Concept</Text>
                                 <TextInput
                                    keyboardType="numeric"
                                    value={newPackage.sizeConcept}
                                    onChangeText={( text ) => setNewPackage( ( prev ) => ( { ...prev, sizeConcept: text } ) )}
                                    className="border-b border-[#94acfc] pb-1"
                                 />
                              </View>
                              <View className="mb-4">
                                 <Text className="text-zinc-500 mb-1">Gross Profit</Text>
                                 <TextInput
                                    keyboardType="numeric"
                                    value={newPackage.grossProfit}
                                    onChangeText={( text ) => setNewPackage( ( prev ) => ( { ...prev, grossProfit: text } ) )}
                                    className="border-b border-[#94acfc] pb-1"
                                 />
                              </View>
                              <View className="mb-4">
                                 <Text className="text-zinc-500 mb-1">Income</Text>
                                 <TextInput
                                    keyboardType="numeric"
                                    value={newPackage.income}
                                    onChangeText={( text ) => setNewPackage( ( prev ) => ( { ...prev, income: text } ) )}
                                    className="border-b border-[#94acfc] pb-1"
                                 />
                              </View>
                              <View className="mb-10">
                                 <Text className="text-zinc-500 mb-1">Price</Text>
                                 <TextInput
                                    keyboardType="numeric"
                                    value={newPackage.price}
                                    onChangeText={( text ) => setNewPackage( ( prev ) => ( { ...prev, price: text } ) )}
                                    className="border-b border-[#94acfc] pb-1"
                                 />
                              </View>

                              <Button mode="contained" onPress={handleAddPackage} buttonColor='#f3b02d'>
                                 Add Package
                              </Button>
                           </Modal>
                        </Portal>
                     </View>

                     {/* Button Add */}
                     <Button
                        mode="contained"
                        onPress={handleUpdate}
                        buttonColor='#f3b02d'
                     >
                        Update Business
                     </Button>
                  </View>
               </View>
            </View>
         </ScrollView>
      </View>
   );
};

export default EditBussiness;