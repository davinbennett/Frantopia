import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { BarChart } from "react-native-gifted-charts";
import { getTotalProduct } from '../../../controller/productController';
import { fetchCategoryAnalysisController, fetchSalesAnalyticsController, totalSoldOrderController } from '../../../controller/orderController';
import DatePicker from 'react-native-date-picker';

const AdminHome = () =>
{
  const { jwtToken, isAdmin, userId } = useSelector( ( state ) => state.auth );

  const screenHeight = Dimensions.get( 'screen' ).height;
  const windowHeight = Dimensions.get( 'window' ).height;
  const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

  const [ selectedOption, setSelectedOption ] = useState( 'Monthly' );
  const [ startDate, setStartDate ] = useState( null );
  const [ endDate, setEndDate ] = useState( null );

  const [ open, setOpen ] = useState( false );
  const [ date, setDate ] = useState( new Date() );

  const [ totalProduct, setTotalProduct ] = useState( 0 );
  const [ loading, setLoading ] = useState( true );

  const [ totalSold, setTotalSold ] = useState( null );

  const [ barChartData, setBarChartData ] = useState( [] );
  const [ maxDataValue, setMaxDataValue ] = useState( 0 );

  const [ barChartDataCategory, setBarChartDataCategory ] = useState( [] );
  const [ maxDataValueCategory, setMaxDataValueCategory ] = useState( 0 );
  const [ bestSellingCategory, setBestSellingCategory ] = useState( '-' );

  const [ refreshing, setRefreshing ] = useState( false );

  const formatPrice = ( price ) =>
  {
    if ( price >= 1_000_000_000 )
    {
      return 'Rp. ' + ( Math.floor( price / 1_000_000_000 * 10 ) / 10 ).toString().replace( '.', ',' ) + ' B';
    }
    if ( price >= 1_000_000 )
    {
      return 'Rp. ' + ( Math.floor( price / 1_000_000 * 10 ) / 10 ).toString().replace( '.', ',' ) + ' M';
    }
    if ( price >= 1_000 )
    {
      return 'Rp. ' + ( Math.floor( price / 1_000 * 10 ) / 10 ).toString().replace( '.', ',' ) + ' K';
    }
    return 'Rp. ' + price;
  };

  useEffect( () =>
  {
    console.log( 'jwt: ', jwtToken );
  }, [] );

  useEffect( () =>
  {
    if ( jwtToken )
    {
      setLoading( true );

      Promise.all( [
        fetchTotalProduct(),
        loadTotalSold(),
        getBarChartData(),
        getBarChartDataCategory(),
        console.log( "admin? ", isAdmin ),
      ] )
        .catch( error => console.log( 'Error fetching data:', error ) )
        .finally( () => setLoading( false ) );
    }
  }, [ jwtToken, selectedOption, startDate, endDate ] );

  const handleRefresh = async () =>
  {
    setRefreshing( true );
    Promise.all( [
      fetchTotalProduct(),
      loadTotalSold(),
      getBarChartData(),
      getBarChartDataCategory(),
      console.log( "admin? ", isAdmin ),
    ] )
      .catch( error => console.log( 'Error fetching data:', error ) )
      .finally( () => setLoading( false ) );
    setRefreshing( false );
  };

  const calculateMaxDataValueCategory = ( data ) =>
  {
    return data.length > 0 ? Math.max( ...data.map( item => item.value ) ) : 0;
  };

  const getBarChartDataCategory = async () =>
  {
    try
    {
      setLoading( true );

      const period = startDate && endDate ? 'day' : selectedOption;

      const { bestSellingCategory, categoryData } = await fetchCategoryAnalysisController( period.toLowerCase(), startDate, endDate, jwtToken );

      if ( bestSellingCategory === null )
      {
        setBestSellingCategory( '-' );
      }

      if ( !categoryData || categoryData.length === 0 )
      {
        setBarChartDataCategory( [] );
      } else
      {
        setBestSellingCategory( bestSellingCategory );
        setBarChartDataCategory( categoryData );
        setMaxDataValueCategory( calculateMaxDataValueCategory( categoryData ) );
      }
    } catch ( error )
    {
      console.log( 'Error fetching bar chart data:', error );
    } finally
    {
      setLoading( false );
    }
  };


  const calculateMaxDataValue = ( data ) =>
  {
    return data.length > 0 ? Math.max( ...data.map( item => item.value ) ) : 0;
  };


  const getBarChartData = async () =>
  {
    try
    {
      setLoading( true );

      const period = startDate && endDate ? 'day' : selectedOption;

      const data = await fetchSalesAnalyticsController( period.toLowerCase(), startDate, endDate, jwtToken );
      if ( data == null || data.length === 0 )
      {
        setBarChartData( [] );
      } else
      {
        setBarChartData( data );
        setMaxDataValue( calculateMaxDataValue( data ) );
      }
    } catch ( error )
    {
      console.error( 'Error fetching bar chart data:', error );
      return [];
    } finally
    {
      setLoading( false );
    }
  };

  const loadTotalSold = async () =>
  {
    try
    {
      setLoading( true );

      const period = startDate && endDate ? 'day' : selectedOption;

      const totalSoldData = await totalSoldOrderController( period.toLowerCase(), startDate, endDate, jwtToken );
      setTotalSold( totalSoldData );
    } catch ( error )
    {
      console.error( 'Error loading total sold data:', error );
    } finally
    {
      setLoading( false );
    }
  };

  const fetchTotalProduct = async () =>
  {
    try
    {
      const product = await getTotalProduct( jwtToken );
      setTotalProduct( product );
      setLoading( false );
    } catch ( error )
    {
      console.error( 'Error fetching total product:', error );
      setLoading( false );
    }
  };

  const handleOptionSelect = ( option ) =>
  {
    setSelectedOption( option );
    setStartDate( null );
    setEndDate( null );
  };

  const isDateRangeSelected = startDate && endDate;

  const formatDate = ( dateString ) =>
  {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const date = new Date( dateString );
    const day = date.getDate();
    const month = months[ date.getMonth() ];
    const year = date.getFullYear().toString().slice( -2 );
    return `${ day } ${ month }'${ year }`;
  };

  return (
    <SafeAreaView className='bg-background flex-1' edges={[ 'left', 'right', 'bottom' ]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* App Bar */}
      <View
        className="bg-blue flex-row px-7 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center"
        style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8, marginBottom: 18 }}
      >
        <Image
          source={require( '../../../assets/icons/storeMiringKecil.png' )}
          className='absolute -top-4 -left-7'
        />

        <Text className='text-3xl text-white font-semibold'>
          Home
        </Text>

        {/* Search Field */}
        {/* <View className='flex-1'>
          <Searchbar
            placeholder="Find your franchise"
            placeholderTextColor='#B1B1B1'
            cursorColor='grey'
            onChangeText={setSearchQuery}
            iconColor='#B1B1B1'
            backgroundColor='#FFFFFF'
            value={searchQuery}
            traileringIconColor='black'
            style={{
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              elevation: 0,
              alignItems: 'center',
              paddingHorizontal: 5,
              height: 37,
            }}
            inputStyle={{
              borderRadius: 50,
              minHeight: 0,
            }}
          />
        </View> */}

      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 18 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[ "#1e90ff" ]}
          />
        }
      >
        {/* Monthly - DatePicker */}
        <View className='w-full flex-row items-center px-7'>
          <View
            className='flex-1 bg-white flex-row items-center rounded-xl'
            style={{
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              elevation: 3,
            }}
          >
            <TouchableOpacity
              className={`flex-1 ${ selectedOption === 'Monthly' && !isDateRangeSelected ? 'bg-blue' : 'bg-white' } py-4 rounded-tl-xl rounded-bl-xl`}
              onPress={() => handleOptionSelect( 'Monthly' )}
            >
              <Text
                className={`text-center font-medium ${ selectedOption === 'Monthly' && !isDateRangeSelected ? 'text-white' : 'text-black' }`}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Monthly
              </Text>
            </TouchableOpacity>

            <View className={`w-[1px] h-7 ${ selectedOption === 'Monthly' || selectedOption === 'Quarterly' ? 'bg-white' : 'bg-[#BFBFBF]' }`} />

            {/* Quarterly Option */}
            <TouchableOpacity
              className={`flex-1 ${ selectedOption === 'Quarterly' && !isDateRangeSelected ? 'bg-blue' : 'bg-white' } py-4`}
              onPress={() => handleOptionSelect( 'Quarterly' )}
            >
              <Text
                className={`text-center font-medium ${ selectedOption === 'Quarterly' && !isDateRangeSelected ? 'text-white' : 'text-black' }`}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Quarterly
              </Text>
            </TouchableOpacity>

            <View className={`w-[1px] h-7 ${ selectedOption === 'Quarterly' || selectedOption === 'Yearly' ? 'bg-white' : 'bg-[#BFBFBF]' }`} />

            {/* Yearly Option */}
            <TouchableOpacity
              className={`flex-1 ${ selectedOption === 'Yearly' && !isDateRangeSelected ? 'bg-blue' : 'bg-white' } py-4 rounded-br-xl rounded-tr-xl`}
              onPress={() => handleOptionSelect( 'Yearly' )}
            >
              <Text
                className={`text-center font-medium ${ selectedOption === 'Yearly' && !isDateRangeSelected ? 'text-white' : 'text-black' }`}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Yearly
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker Icon */}
          <TouchableOpacity onPress={() => setOpen( true )} className='ml-6'>
            <AntDesign name="calendar" size={26} color="black" />
          </TouchableOpacity>
          <DatePicker
            modal
            open={open}
            date={date}
            onConfirm={( selectedDate ) =>
            {
              setOpen( false );
              setDate( selectedDate );

              const formattedDate = selectedDate.toISOString().split( 'T' )[ 0 ];

              const newStartDate = new Date( selectedDate );

              newStartDate.setDate( newStartDate.getDate() - 7 );

              const formattedStartDate = newStartDate.toISOString().split( 'T' )[ 0 ];

              setStartDate( formattedStartDate );
              setEndDate( formattedDate );

              setSelectedOption( 'day' );
            }}
            onCancel={() =>
            {
              setOpen( false );
            }}
            mode='date'
          />
        </View>

        {/* Display Selected Date Range */}
        {startDate && endDate && (
          <View>
            <Text className="text-center mt-5 text-lg">
              Selected Range Date :
            </Text>
            <Text className="text-center mt-1 font-bold text-xl">
              {formatDate( startDate )} - {formatDate( endDate )}
            </Text>
          </View>
        )}

        {/* Container atas */}
        <View
          className='mx-7 my-5 bg-white rounded-xl p-5 truncate '
          style={{
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            elevation: 3,
          }}
        >
          {/* Total Franchise & Total sold */}
          <View className='flex-row justify-between mb-5 truncate'>
            <View className='flex-row flex-wrap'>
              <View className='bg-blue rounded-lg items-center justify-center px-3 truncate'>
                <FontAwesome5 name="sort-amount-up" size={26} color="white" />
              </View>
              <View className='align-bottom ml-2'>
                <Text
                  className=''
                  numberOfLines={2}
                >
                  Total Franchise
                </Text>
                {loading ? (
                  <View className="w-16 h-8 bg-gray-300 rounded-md" />
                ) : (
                  <Text className='text-3xl font-extrabold'>
                    {totalProduct}
                  </Text>
                )}
              </View>
            </View>
            <View className='flex-row'>
              <View className='bg-blue rounded-lg items-center justify-center px-3'>
                <MaterialIcons name="sell" size={26} color="white" />
              </View>
              <View className='ml-2'>
                <Text
                  className=''
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  Total Franchise Sold
                </Text>
                <Text className='text-3xl font-extrabold'>
                  {formatPrice( totalSold )}
                </Text>
              </View>
            </View>
          </View>

          {/* Grafik */}
          <View className=''>
            {barChartData && barChartData.length > 0 ? (
              <BarChart
                barWidth={46}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={barChartData}
                yAxisThickness={0}
                xAxisThickness={0}
                hideRules
                hideYAxisText
                maxValue={maxDataValue * 1.12}
              />
            ) : (
              <Text className='text-lg font-medium text-center'>
                Data is Empty
              </Text>
            )}
          </View>
        </View>

        {/* Container bawah */}
        <View
          className='mx-7 bg-white rounded-xl p-5'
          style={{
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            elevation: 3,
          }}
        >
          {/* Best sell category */}
          <View className='flex-row justify-between'>
            <View className='flex-row'>
              <View className='bg-blue rounded-lg items-center justify-center px-3'>
                <MaterialIcons name="category" size={26} color="white" />
              </View>
              <View className='align-bottom ml-2'>
                <Text className=''>
                  Best Selling Categories
                </Text>
                <Text className='text-3xl font-extrabold'>
                  {bestSellingCategory}
                </Text>
              </View>
            </View>
          </View>

          {/* Grafik */}
          <View className=''>
            {barChartDataCategory && barChartDataCategory.length > 0 ? (
              <BarChart
                barWidth={73}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={barChartDataCategory}
                yAxisThickness={0}
                xAxisThickness={0}
                hideRules
                hideYAxisText
                maxValue={maxDataValueCategory * 1.12}
              />
            ) : (
              <Text className="text-lg font-medium text-center">
                Data is Empty
              </Text>
            )}

          </View>
        </View>
        {/* <TouchableOpacity onPress={() => { console.log( jwtToken ); }}>
          <Text>
            S
          </Text>
        </TouchableOpacity> */}

      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminHome;

const styles = StyleSheet.create( {

} );
