import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import * as Speech from "expo-speech";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ContentScreenProps {
    navigateTo: (screen: string) => void;
}

const ChristmasPage = ({ navigateTo }: ContentScreenProps) => {

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
    <View className="flex-1 bg-white p-6">
      
      {/* Heading at the Top */}
      <Text className="text-4xl font-bold text-gray-800 text-center mt-8">
        GREETING
      </Text>

      {/* Main Content Centered */}
      <View className="flex-1 items-center justify-center">
        {/* Lottie Animation */}
        <LottieView 
          source={require("../../assets/animations/christmas.json")}
          autoPlay 
          loop 
          style={{ width: 300, height: 300 }}
        />
        <View className="flex-row items-center mt-6">
          <Text className="text-3xl font-bold text-black">Merry Christmas</Text>
          <TouchableOpacity onPress={() => speak("Merry Christmas")} className="ml-3">
            <MaterialCommunityIcons name="volume-high" size={35} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity 
        className="bg-white-600 border p-4 rounded-lg mt-6 items-center"
        onPress={()=>navigateTo("ChristmasItemsPage")}
      >
        <Text className="text-black text-lg font-bold">Next</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default ChristmasPage;
