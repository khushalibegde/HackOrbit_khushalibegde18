import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ImageBackground } from "react-native";
import * as Speech from "expo-speech"; // Import Speech API

interface ContentScreenProps {
  navigateTo: (screen: string) => void;
}

const festivals = [
  { name: "DIWALI", image: require("../../assets/images/diwali.png"), bg: require("../../assets/images/diwali2.jpg") },
  { name: "CHRISTMAS", image: require("../../assets/images/christmas.png"), bg: require("../../assets/images/christmas2.jpg") },
  { name: "EID", image: require("../../assets/images/eid.jpg"), bg: require("../../assets/images/eid2.jpg") },
  { name: "HOLI", image: require("../../assets/images/holi.png"), bg: require("../../assets/images/holi2.jpg") },
];

// Function to speak the festival name
const speakFestival = (festivalName: string) => {
  Speech.stop(); // Stop any ongoing speech
  Speech.speak(festivalName,
  {
    language: "mr-IN",
    pitch: 1.0,
    rate: 0.9,
  }
  ); // Speak the festival name
};

const FestivalSelection = ({ navigateTo }: ContentScreenProps) => {
  return (
    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-3xl font-bold text-center mb-6 text-gray-800">
        🎉 Choose a Festival 🎊
      </Text>

      {festivals.map((festival, index) => (
        <TouchableOpacity 
          key={index} 
          className="rounded-xl overflow-hidden mb-4 shadow-lg"
          onPress={() => {
            speakFestival(festival.name)
            if(festival.name=="DIWALI"){
              navigateTo("DiwaliPage");
            } else if(festival.name=="EID"){
              navigateTo("EidPage");
            } else if(festival.name=="CHRISTMAS") {
              navigateTo("ChristmasPage");
            }
            }
          } // Call speech function on click
        >
          <ImageBackground 
            source={festival.bg} 
            className="w-full h-40 p-4 flex-row items-center"
            resizeMode="cover"
          >
            {/* Festival Image (Left) */}
            <Image source={festival.image} className="w-32 h-32 rounded-lg mr-6 z-10" />

            {/* Festival Name (Right) */}
            <Text className="text-2xl font-bold text-black z-10 ml-10">{festival.name}</Text>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default FestivalSelection;
