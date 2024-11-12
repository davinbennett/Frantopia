import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Searchbar, Divider } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { BarChart } from "react-native-gifted-charts";

const AdminHome = () =>
{
  const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );

  const screenHeight = Dimensions.get( 'screen' ).height;
  const windowHeight = Dimensions.get( 'window' ).height;
  const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

  const [ searchQuery, setSearchQuery ] = useState( '' );
  const [ selectedOption, setSelectedOption ] = useState( 'Monthly' );
  const [ showDatePicker, setShowDatePicker ] = useState( false );
  const [ dateType, setDateType ] = useState( 'start' ); // "start" or "end" date
  const [ startDate, setStartDate ] = useState( null );
  const [ endDate, setEndDate ] = useState( null );

  const toggleDatePicker = () =>
  {
    setDateType( dateType === 'start' ? 'end' : 'start' );
    setShowDatePicker( true );
  };

  const onDateChange = ( event, selectedDate ) =>
  {
    if ( selectedDate )
    {
      if ( endDate && endDate.getTime() === selectedDate.getTime() )
      {
        return;
      }

      const newEndDate = new Date( selectedDate );
      setEndDate( newEndDate );

      const newStartDate = new Date( newEndDate );
      newStartDate.setDate( newEndDate.getDate() - 7 );
      setStartDate( newStartDate );

      setShowDatePicker( false );

      setSelectedOption( 'day' );
    }
  };


  const handleOptionSelect = ( option ) =>
  {
    setSelectedOption( option );
    setStartDate( null );
    setEndDate( null );
    setDateType( 'start' );
  };

  const isDateRangeSelected = startDate && endDate;

  const franchiseMonthlyBarData = [
    {
      value: 250, label: 'Jan', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 500, label: 'Mar', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 785, label: 'May', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 320, label: 'Jul', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 600, label: 'Sep', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 256, label: 'Nov', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 900, frontColor: 'white'
    },
  ];
  const franchiseQuarterlyBarData = [
    {
      value: 250, label: 'Q1', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 500, label: 'Q2', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 785, label: 'Q3', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 320, label: 'Q4', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 900, frontColor: 'white'
    },
  ];

  const franchiseDayBarData = [
    {
      value: 250, label: '1', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 500, label: '2', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 785, label: '3', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 320, label: '4', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 600, label: '5', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 256, label: '6', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 256, label: '7', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 900, frontColor: 'white'
    },
  ];

  const franchiseYearlyBarData = [
    {
      value: 500, label: '2020', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 785, label: '2021', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 320, label: '2022', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 600, label: '2023', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 256, label: '2024', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 900, frontColor: 'white'
    },
  ];

  const getBarChartData = () =>
  {
    if ( selectedOption === 'Monthly' )
    {
      return franchiseMonthlyBarData;
    } else if ( selectedOption === 'Quarterly' )
    {
      return franchiseQuarterlyBarData;
    } else if ( selectedOption === 'Yearly' )
    {
      return franchiseYearlyBarData;
    } else if ( selectedOption === 'day' )
    {
      return franchiseDayBarData;
    }

    return [];
  };

  const categoryBarData = [
    {
      value: 500, label: 'Food & Beverages', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 785, label: 'Health & Beauty', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 320, label: 'Barber & Salon', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 600, label: 'Expedition', frontColor: '#177AD5', topLabelComponent: () => (
        <Text className='mb-1 font-semibold'>50</Text>
      ),
    },
    {
      value: 900, frontColor: 'white'
    },
  ];

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
          className='absolute top-0 -left-7'
        />

        {/* Search Field */}
        <View className='flex-1'>
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
        </View>

        {/* Cart Icon */}
        <TouchableOpacity className="ml-3">
          <Ionicons name="cart-outline" size={26} color="white" />
        </TouchableOpacity>
      </View>

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
        <TouchableOpacity onPress={toggleDatePicker} className='ml-6'>
          <AntDesign name="calendar" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* DateTimePicker for Range Selection */}
      {showDatePicker && (
        <DateTimePicker
          value={dateType === 'start' ? ( startDate || new Date() ) : ( endDate || new Date() )}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Display Selected Date Range */}
      {startDate && endDate && (
        <Text className="text-center mt-4 text-blue-600">
          Selected Range: {startDate.toDateString()} - {endDate.toDateString()}
        </Text>
      )}

      {/* Container atas */}
      <View className='mx-7 my-5 bg-white rounded-xl p-5'>
        {/* Total Franchise & Total sold */}
        <View className='flex-row justify-between mb-5'>
          <View className='flex-row'>
            <View className='bg-blue rounded-lg items-center justify-center px-3'>
              <FontAwesome5 name="sort-amount-up" size={26} color="white" />
            </View>
            <View className='align-bottom ml-2'>
              <Text className=''>
                Total Franchise
              </Text>
              <Text className='text-4xl font-extrabold'>
                10
              </Text>
            </View>
          </View>
          <View className='flex-row'>
            <View className='bg-blue rounded-lg items-center justify-center px-3'>
              <MaterialIcons name="sell" size={26} color="white" />
            </View>
            <View className='ml-2'>
              <Text className=''>
                Total Franchise Sold
              </Text>
              <Text className='text-4xl font-extrabold'>
                5
              </Text>
            </View>
          </View>
        </View>

        {/* Grafik */}
        <View className='border-2'>
          <BarChart
            barWidth={26}
            noOfSections={3}
            barBorderRadius={4}
            frontColor="lightgray"
            data={getBarChartData()}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            hideYAxisText
            referenceLine1Position={420}
            referenceLine1Config={{
              color: 'gray',
              dashWidth: 2,
              dashGap: 3,
            }}

          />
        </View>
      </View>

      {/* Container bawah */}
      <View className='mx-7 my-5 bg-white rounded-xl p-5'>
        {/* Best sell category */}
        <View className='flex-row justify-between mb-5'>
          <View className='flex-row'>
            <View className='bg-blue rounded-lg items-center justify-center px-3'>
              <MaterialIcons name="category" size={26} color="white" />
            </View>
            <View className='align-bottom ml-2'>
              <Text className=''>
                Best Selling Categories
              </Text>
              <Text className='text-4xl font-extrabold'>
                Beauty
              </Text>
            </View>
          </View>
        </View>

        {/* Grafik */}
        <View className='border-2'>
          <BarChart
            barWidth={26}
            noOfSections={3}
            barBorderRadius={4}
            frontColor="lightgray"
            data={categoryBarData}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            hideYAxisText
            referenceLine1Position={420}
            referenceLine1Config={{
              color: 'gray',
              dashWidth: 2,
              dashGap: 3,
            }}
            horizontal
          />
        </View>
      </View>

    </SafeAreaView>
  );
};

export default AdminHome;

const styles = StyleSheet.create( {

} );
