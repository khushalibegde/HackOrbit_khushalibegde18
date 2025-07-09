import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import * as Speech from "expo-speech";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface ContentScreenProps {
    navigateTo: (screen: string) => void;
}

const { width } = Dimensions.get("window"); // Get screen width

const DiwaliItemsPage = ({ navigateTo }: ContentScreenProps) => {
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
        Diwali Items
      </Text>

      {/* Items List */}
      <View className="mt-6">
        
        {/* Diya */}
        <View className="items-center">
          <LottieView 
            source={require("../../assets/animations/diya.json")}
            autoPlay 
            loop 
            style={{ width: width, height: width }} // Full width animation
          />
          <View className="flex-row items-center mt-2">
            <Text className="text-3xl font-bold text-black">Diya</Text>
            <TouchableOpacity onPress={() => speak("Diya")} className="ml-3">
              <MaterialCommunityIcons name="volume-high" size={40} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Fireworks */}
        <View className="items-center mt-8">
          <LottieView 
            source={require("../../assets/animations/rocket.json")}
            autoPlay 
            loop 
            style={{ width: width, height: width }} // Full width animation
          />
          <View className="flex-row items-center mt-2">
            <Text className="text-3xl font-bold text-black">Fireworks</Text>
            <TouchableOpacity onPress={() => speak("Fireworks")} className="ml-3">
              <MaterialCommunityIcons name="volume-high" size={40} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sweets (Using Image) */}
        <View className="items-center mt-8">
          <Image 
            source={require("../../assets/images/sweet.png")} // Replace with your sweets image
            style={{ width: width * 0.9, height: width * 0.6, borderRadius: 20 }}
            resizeMode="cover"
          />
          <View className="flex-row items-center mt-2">
            <Text className="text-3xl font-bold text-black">Sweets</Text>
            <TouchableOpacity onPress={() => speak("Sweets")} className="ml-3">
              <MaterialCommunityIcons name="volume-high" size={40} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {/* Practice Button */}
      <TouchableOpacity 
        className="bg-blue-600 py-4 rounded-2xl mx-6 mt-8 mb-8"
        onPress={() => navigateTo("DiwaliPracticePage")}
      >
        <Text className="text-white text-center text-2xl font-bold">Practice Here</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
};

export default DiwaliItemsPage;
