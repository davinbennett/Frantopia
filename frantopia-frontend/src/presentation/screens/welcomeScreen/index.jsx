// import React from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
// import tailwind from 'tailwind-rn';

// export default function WelcomeScreen() {
//   return (
//     <View style={tailwind('flex-1 bg-gray-100')}>
//       <View style={tailwind('flex-1 bg-blue-500 items-center justify-center')}>
//         {/* Background Image */}
//         <View style={tailwind('absolute top-0 left-0 right-0 bottom-0')}>
//           <Image
//             source={{ uri: 'https://path-to-your-background-image' }} // Ganti URL dengan link gambar background jika ada
//             style={tailwind('w-full h-full opacity-10')}
//           />
//         </View>

//         {/* Illustration */}
//         <Image
//           source={{ uri: 'https://path-to-your-illustration' }} // Ganti URL dengan link gambar ilustrasi
//           style={tailwind('w-48 h-48')}
//         />

//         {/* Welcome Text */}
//         <Text style={tailwind('text-white text-2xl font-bold mt-4')}>
//           Hello UMKMers, Welcome 🙌
//         </Text>
//       </View>

//       <View style={tailwind('flex-1 p-6')}>
//         {/* Title */}
//         <Text style={tailwind('text-center text-lg font-bold text-blue-500 mb-4')}>
//           Welcome
//         </Text>

//         {/* Description */}
//         <ScrollView style={tailwind('mb-4')}>
//           <Text style={tailwind('text-gray-600 text-justify')}>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vulputate vel ligula ut dapibus. Nulla ac commodo magna, vitae imperdiet eros. Morbi mauris lacus, aliquet in tellus ac, sagittis euismod orci. Ut velit eros, sodales in dui ac, semper dignissim mauris.
//             {/* Tambahkan teks deskripsi lebih lanjut sesuai keperluan */}
//           </Text>
//         </ScrollView>

//         {/* Continue Button */}
//         <TouchableOpacity style={tailwind('bg-blue-500 py-4 rounded-full')}>
//           <Text style={tailwind('text-white text-center font-bold text-lg')}>
//             Continue
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
