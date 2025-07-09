import React from "react";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import * as Speech from "expo-speech";

interface ContentScreenProps {
  navigateTo: (screen: string) => void;
}

// Greetings data
const greetings = [
  { name: "Good Morning", bg: require("../../assets/images/morning.jpg") },
  { name: "Good Night", bg: require("../../assets/images/night.jpg") },
  { name: "Hello", bg: require("../../assets/images/smile.jpg") },
  { name: "Nice to meet you", bg: require("../../assets/images/thankyou.jpg") },
];

// Function to speak the greeting
const speakGreeting = (greeting: string) => {
  Speech.stop();
  Speech.speak(greeting, {
    language: "mr-IN",
    pitch: 1.0,
    rate: 0.9,
  });
};

const GreetingsScreen = ({ navigateTo }: ContentScreenProps) => {
  return (
    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-3xl font-bold text-center mb-6 text-gray-800">
        👋 LEARN GREETINGS 🙏
      </Text>

      {greetings.map((greeting, index) => (
        <TouchableOpacity 
          key={index} 
          className="rounded-xl overflow-hidden mb-4 shadow-lg"
          onPress={() => {
            if(greeting.name == "Good Morning"){
              speakGreeting(greeting.name);
              navigateTo("MorningScreen");
            } else if (greeting.name == "Good Night"){
              speakGreeting(greeting.name);
              navigateTo("NightScreen");
            } else if(greeting.name == "Hello"){
              speakGreeting(greeting.name);
              navigateTo("HelloScreen");
            } else if(greeting.name == "Nice to meet you"){
              speakGreeting(greeting.name);
              navigateTo("MeetScreen");
            }
            }
          } // Speak greeting on click
        >
          <ImageBackground 
            source={greeting.bg} 
            className="w-full h-40 p-4 flex items-center justify-center"
            resizeMode="cover"
          >
            {/* Greeting Name (Centered) */}
            <Text className="text-2xl font-bold text-black px-4 py-2 rounded-lg">
              {greeting.name}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default GreetingsScreen;
