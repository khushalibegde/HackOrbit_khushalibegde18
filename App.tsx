import React, { useState, useEffect } from "react";
import { View, StyleSheet, BackHandler, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler"; 
import BottomTabBar from "./components/BottomTabBar";
import Home from "./src/screens/Home";
import FestivalSelection from "./src/screens/FestivalSelection";
import Mood from "./src/screens/Mood";
import Profile from "./src/screens/Profile";
import BirthdayScreen from "./src/screens/BirthdayScreen";
import MRPScreen from "./src/screens/MRPScreen";
import ComputerScreen from "./src/screens/ComputerScreen";
import GreetingsScreen from "./src/screens/GreetingsScreen";
import MobileScreen from "./src/screens/MobileScreen";
import TrafficScreen from "./src/screens/TrafficScreen";
import Feelings from "./src/screens/Feelings";
import HelplineScreen from "./src/screens/HelplineScreen";
import RescueScreen from "./src/screens/RescueGame";
import DiwaliPage from "./src/screens/DiwaliPage";
import DiwaliItemsPage from "./src/screens/DiwaliItemsPage";
import DiwaliPracticePage from "./src/screens/DiwaliPracticePage";
import EidPage from "./src/screens/EidPage";
import EidItemsPage from "./src/screens/EidItemsPage";
import EidPracticePage from "./src/screens/EidPracticePage";
import ChristmasPage from "./src/screens/ChristmasPage";
import ChristmasItemsPage from "./src/screens/ChristmasItemsPage";
import ChristmasPracticePage from "./src/screens/ChristmasPracticePage";
import MorningScreen from "./src/screens/MorningScreen";
import NightScreen from "./src/screens/NightScreen";
import HelloScreen from "./src/screens/HelloScreen";
import MeetScreen from "./src/screens/MeetScreen";
import PartDetailsScreen from "./src/screens/PartDetailsScreen";

export default function App() {
  type ScreenState = { name: string; params?: any };
  
  const [currentScreen, setCurrentScreen] = useState<ScreenState>({ name: "Home", params: {} });
  const [previousScreen, setPreviousScreen] = useState<ScreenState | null>(null);

  const navigateTo = (screen: string, params: any = {}) => {  
    setPreviousScreen(currentScreen);
    setCurrentScreen({ name: screen, params });
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (currentScreen.name !== "Home") {
        setCurrentScreen(previousScreen || { name: "Home", params: {} });
        return true; 
      } else {
        Alert.alert("Exit App", "Do you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [currentScreen, previousScreen]);

  const renderScreen = () => {
    switch (currentScreen.name) {
      case "Home": return <Home navigateTo={navigateTo} />;
      case "Mood": return <Mood />;
      case "Profile": return <Profile />;
      case "BirthdayScreen": return <BirthdayScreen />;
      case "MRPScreen": return <MRPScreen />;
      case "ComputerScreen": return <ComputerScreen navigateTo={navigateTo} />;
      case "GreetingsScreen": return <GreetingsScreen navigateTo={navigateTo} />;
      case "HelplineScreen": return <HelplineScreen navigateTo={navigateTo} />;
      case "MobileScreen": return <MobileScreen />;
      case "TrafficScreen": return <TrafficScreen />;
      case "Feelings": return <Feelings />;
      case "RescueScreen": return <RescueScreen />;
      case "FestivalSelection": return <FestivalSelection navigateTo={navigateTo} />;
      case "DiwaliPage": return <DiwaliPage navigateTo={navigateTo} />;
      case "DiwaliItemsPage": return <DiwaliItemsPage navigateTo={navigateTo} />;
      case "DiwaliPracticePage": return <DiwaliPracticePage />;
      case "EidPage": return <EidPage navigateTo={navigateTo} />;
      case "EidItemsPage": return <EidItemsPage navigateTo={navigateTo} />;
      case "EidPracticePage": return <EidPracticePage />;
      case "ChristmasPage": return <ChristmasPage navigateTo={navigateTo} />;
      case "ChristmasItemsPage": return <ChristmasItemsPage navigateTo={navigateTo} />;
      case "ChristmasPracticePage": return <ChristmasPracticePage />;
      case "MorningScreen": return <MorningScreen />;
      case "NightScreen": return <NightScreen />;
      case "HelloScreen": return <HelloScreen />;
      case "MeetScreen": return <MeetScreen />;
      case "PartDetailsScreen":
        return <PartDetailsScreen navigateTo={navigateTo} part={currentScreen.params.part} />
      default: return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.screenContainer}>{renderScreen()}</View>
        <View style={styles.bottomTabContainer}>
          <BottomTabBar navigateTo={navigateTo} />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  bottomTabContainer: {
    height: 65,
  },
});
