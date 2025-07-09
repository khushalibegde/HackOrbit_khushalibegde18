import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Image } from "react-native";
import LottieView from "lottie-react-native";
import * as Speech from "expo-speech";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface ContentScreenProps {
    navigateTo: (screen: string) => void;
}

const { width } = Dimensions.get("window"); // Get screen width

const EidItemsPage = ({ navigateTo }: ContentScreenProps) => {
  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text,
    {
      language: "mr-IN",
      pitch: 1.0,
      rate: 0.9,
    }
    );
  };

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <Text className="text-4xl font-bold text-gray-800 text-center mt-8">
        Eid Items
      </Text>

      {/* Items List */}
      <View className="mt-6">
        
        <View className="items-center">
          <LottieView 
            source={require("../../assets/animations/mosque.json")}
            autoPlay 
            loop 
            style={{ width: width, height: width }} // Full width animation
          />
          <View className="flex-row items-center mt-2">
            <Text className="text-3xl font-bold text-black">Mosque</Text>
            <TouchableOpacity onPress={() => speak("Mosque")} className="ml-3">
              <MaterialCommunityIcons name="volume-high" size={40} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-center mt-8">
          <LottieView 
            source={require("../../assets/animations/quran.json")}
            autoPlay 
            loop 
            style={{ width: width, height: width }} // Full width animation
          />
          <View className="flex-row items-center mt-2">
            <Text className="text-3xl font-bold text-black">Quran</Text>
            <TouchableOpacity onPress={() => speak("Quran")} className="ml-3">
              <MaterialCommunityIcons name="volume-high" size={40} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sweets (Using Image) */}
        <View className="items-center mt-8">
          <Image 
            source={require("../../assets/images/henna2.jpg")} // Replace with your sweets image
            style={{ width: width * 0.9, height: width * 0.6, borderRadius: 20 }}
            resizeMode="cover"
          />
          <View className="flex-row items-center mt-2">
            <Text className="text-3xl font-bold text-black">Henna</Text>
            <TouchableOpacity onPress={() => speak("Henna")} className="ml-3">
              <MaterialCommunityIcons name="volume-high" size={40} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {/* Practice Button */}
      <TouchableOpacity 
        className="bg-blue-600 py-4 rounded-2xl mx-6 mt-8 mb-8"
        onPress={() => navigateTo("EidPracticePage")}
      >
        <Text className="text-white text-center text-2xl font-bold">Practice Here</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
};

export default EidItemsPage;
