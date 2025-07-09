import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as Speech from "expo-speech";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MorningScreen = () => {
  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: "mr-IN",
      pitch: 1.0,
      rate: 0.9,
    });
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-4xl font-bold text-gray-800 text-center mt-8">
        HOW TO GREET?
      </Text>

      {/* Main Content Centered */}
      <View className="flex-1 items-center justify-center">
        {/* Image */}
        <Image 
          source={require("../../assets/images/morning2.jpg")}
          style={{ width: 300, height: 300, borderRadius: 20 }}
        />

        {/* Good Morning Text with Speaker */}
        <View className="flex-row items-center mt-6">
          <Text className="text-3xl font-bold text-black">Good Morning!</Text>
          <TouchableOpacity onPress={() => speak("Good Morning!")} className="ml-3">
            <MaterialCommunityIcons name="volume-high" size={35} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MorningScreen;
