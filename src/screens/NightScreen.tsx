import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import * as Speech from "expo-speech";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const NightScreen = () => {

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text);
  };

  return (
    <View className="flex-1 bg-white p-6">
      
      {/* Heading at the Top */}
      <Text className="text-4xl font-bold text-gray-800 text-center mt-8">
        HOW TO GREET?
      </Text>

      {/* Main Content Centered */}
      <View className="flex-1 items-center justify-center">
        {/* Lottie Animation */}
        <LottieView 
          source={require("../../assets/animations/night.json")}
          autoPlay 
          loop 
          style={{ width: 300, height: 300 }}
        />

        <View className="flex-row items-center mt-6">
          <Text className="text-3xl font-bold text-black">Good Night!</Text>
          <TouchableOpacity onPress={() => speak("Good Night!")} className="ml-3">
            <MaterialCommunityIcons name="volume-high" size={35} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>    
    </View>
  );
};

export default NightScreen;
