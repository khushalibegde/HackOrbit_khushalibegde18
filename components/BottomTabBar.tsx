import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import * as Animatable from "react-native-animatable";
import Mood from "../src/screens/Mood";
import Profile from "../src/screens/Profile";

interface ContentScreenProps {
  navigateTo: (screen: string) => void;
}
const Tab = createBottomTabNavigator();

const speak = (text: string): void => {
  Speech.stop();
  Speech.speak(text, {
        language: "hi-IN", 
        pitch: 1.0, 
        rate: 1.0, 
      });
};

const getTabIcon = (routeName: string, focused: boolean) => {
  const iconNames: { [key: string]: string } = {
    Home: focused ? "home" : "home-outline",
    Mood: focused ? "book" : "book-outline",
    Profile: focused ? "person" : "person-outline",
  };
  return iconNames[routeName] || "home";
};

const BottomTabBar = ({ navigateTo }: ContentScreenProps) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Animatable.View animation={focused ? "bounceIn" : undefined} duration={600}>
            <Ionicons
              name={getTabIcon(route.name, focused) as keyof typeof Ionicons.glyphMap}
              size={focused ? size + 6 : size}
              color={color}
            />
          </Animatable.View>
        ),
        tabBarActiveTintColor: "#8668ad",
        tabBarInactiveTintColor: "#42658a",
        tabBarStyle: {
          backgroundColor: "#E9E3EE",
          height: 65,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 5,
          elevation: 10,
          borderColor: "#A99ABD",
          borderWidth: 5,
        },
        tabBarLabelStyle: { fontSize: 13, fontWeight: "bold" },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Mood"
        children={() => null}
        listeners={{
          tabPress: () => {
            speak("Mood");
            navigateTo("Mood");
          },
        }}
      />
      <Tab.Screen
        name="Home"
        children={() => null} 
        listeners={{
          tabPress: () => {
            speak("Home");
            navigateTo("Home");
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        children={() => null}
        listeners={{
          tabPress: () => {
            speak("Profile");
            navigateTo("Profile");
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabBar;
