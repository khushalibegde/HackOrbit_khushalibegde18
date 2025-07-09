import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import * as Speech from "expo-speech";
import Header from "../../components/Header";
interface ContentScreenProps {
  navigateTo: (screen: string) => void;
}
const Home = ({ navigateTo }: ContentScreenProps) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  interface Option {
    text: string;
    image: any;
    speechText: string;
  }

  const speak = (text: string): void => {
    Speech.stop(); 
    Speech.speak(text, {
      language: "hi-IN", 
      pitch: 1.0, 
      rate: 1.0, 
    });
    setSelectedItem(text);
  };
  
  const darkenColor = (color: string, percent: number) => {
    let num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = Math.max((num >> 16) - amt, 0),
      G = Math.max(((num >> 8) & 0x00ff) - amt, 0),
      B = Math.max((num & 0x0000ff) - amt, 0);

    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1).toUpperCase()}`;
  };

  const colors = ["#F886A8", "#FE8D6F", "#FDC453", "#DFDD6C", "#A0DDFF", "#9ADBC5"];
  const options: Option[] = [
    { text: "Learn My Birthday! 🎉📅", image: require("../../assets/images/dob.png"), speechText: "Learn My Birthday!" },
    { text: "Learn Helpline Numbers! ☎️", image: require("../../assets/images/helpline.png"), speechText: "Learn Helpline Numbers!" },
    { text: "Everyday Greetings! 👋😊", image: require("../../assets/images/greetings.png"), speechText: "Everyday Greetings!" },
    { text: "Celebrate Festivals! 🎉🌟", image: require("../../assets/images/festivals.png"), speechText: "Celebrate Festivals" },
    { text: "Learn Traffic Signals! 🚦🚗", image: require("../../assets/images/signal.png"), speechText: "Learn Traffic Signals!" },
    { text: "Find MRP & Expiry Date!🛒🔍", image: require("../../assets/images/mrp.png"), speechText: "Find MRP & Expiry Date!" },
    { text: "Learn Mobile Features! 📱✨", image: require("../../assets/images/phone.png"), speechText: "Learn About Mobile Features" },
    { text: "Learn Computer Features! 💻", image: require("../../assets/images/computer.png"), speechText: "Learn About Computer Features" },
    /*{ text: "How Do I Feel? 😊🎭", image: require("../../assets/images/emotions.png"), speechText: "How Do I Feel?" },*/
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F8FF" }}>
      <Header name="Kartik" age={20} />
      <ScrollView contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}>
        {options.map((item, index) => {
          const backgroundColor = selectedItem === item.speechText ? "#1E40AF" : colors[index % colors.length];
          const borderColor = darkenColor(backgroundColor, 20); 

          return (
            <TouchableOpacity
              key={index}
              style={{ 
                backgroundColor,
                padding: 4,
                borderRadius: 8,
                marginVertical: 10,
                alignItems: "center",
                width: "95%",
                flexDirection: "row",
                height: 150,
                borderColor,
                borderWidth: 3, 
                paddingHorizontal: 10, 
              }}
              onPress={() => {
                if(item.text == "Celebrate Festivals! 🎉🌟"){
                  speak(item.speechText);
                  navigateTo("FestivalSelection");
                } 
                if(item.text == "How Do I Feel? 😊🎭"){
                  speak(item.speechText);
                  navigateTo("Feelings");
                }
                if(item.text == "Learn My Birthday! 🎉📅"){
                  speak(item.speechText);
                  navigateTo("BirthdayScreen");
                }
                if(item.text == "Learn Helpline Numbers! ☎️"){
                  speak(item.speechText);
                  navigateTo("HelplineScreen");
                }
                if(item.text == "Learn Traffic Signals! 🚦🚗" ){
                  speak(item.speechText);
                  navigateTo("TrafficScreen");
                }
                if(item.text == "Find MRP & Expiry Date!🛒🔍"){
                  speak(item.speechText);
                  navigateTo("MRPScreen");
                }
                if(item.text == "Learn Mobile Features! 📱✨"){ 
                  speak(item.speechText);
                  navigateTo("MobileScreen");
                }
                if(item.text == "Learn Computer Features! 💻"){
                  speak(item.speechText);
                  navigateTo("ComputerScreen");
                }
                if(item.text == "Everyday Greetings! 👋😊"){
                  speak(item.speechText);
                  navigateTo("GreetingsScreen");
                }
                else{
                speak(item.speechText);
              }}}
            >
              <Image source={item.image} style={{ width: 130, height: 130 }} />
              <Text style={{ 
                  color: "white", 
                  fontSize: 18, 
                  fontWeight: "700",
                  flexShrink: 1, 
                }} 
                numberOfLines={2} 
                ellipsizeMode="tail" 
              >{item.text}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Home;
