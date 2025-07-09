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

const ChristmasItemsPage = ({ navigateTo }: ContentScreenProps) => {
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
        Christmas Items
      </Text>

      <View className="mt-6">
        
        <View className="items-center">
          <LottieView 
            source={require("../../assets/animations/santa.json")}
            autoPlay 
            loop 
            style={{ width: width, height: width }} // Full width animation
          />
          <View className="flex-row items-center mt-2">
            <Text className="text-3xl font-bold text-black">Santa Claus</Text>
            <TouchableOpacity onPress={() => speak("Santa Claus")} className="ml-3">
              <MaterialCommunityIcons name="volume-high" size={40} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Fireworks */}
        <View className="items-center mt-8">
          <LottieView 
            source={require("../../assets/animations/bells.json")}
            autoPlay 
            loop 
            style={{ width: width, height: width }} // Full width animation
          />
          <View className="flex-row items-center mt-2">
            <Text className="text-3xl font-bold text-black">Bells</Text>
            <TouchableOpacity onPress={() => speak("Bells")} className="ml-3">
              <MaterialCommunityIcons name="volume-high" size={40} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sweets (Using Image) */}
        <View className="items-center mt-8">
          <LottieView 
            source={require("../../assets/animations/gift.json")}
            autoPlay 
            loop 
            style={{ width: width, height: width }} // Full width animation
          />
          <View className="flex-row items-center mt-2">
            <Text className="text-3xl font-bold text-black">Gift</Text>
            <TouchableOpacity onPress={() => speak("Gift")} className="ml-3">
              <MaterialCommunityIcons name="volume-high" size={40} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Practice Button */}
      <TouchableOpacity 
        className="bg-blue-600 py-4 rounded-2xl mx-6 mt-8 mb-8"
        onPress={() => navigateTo("ChristmasPracticePage")}
      >
        <Text className="text-white text-center text-2xl font-bold">Practice Here</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
};

export default ChristmasItemsPage;
