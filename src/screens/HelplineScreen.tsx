import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Vibration, Image } from "react-native";
import * as Speech from "expo-speech";
import LottieView from "lottie-react-native";

interface ContentScreenProps {
  navigateTo: (screen: string) => void;
}

const emergencyContacts = [
  { name: "Police", number: "100", image: require("../../assets/images/police3.jpg"), animation: require("../../assets/animations/siren.json") },
  { name: "Fire Fighter", number: "101", image: require("../../assets/images/firefighter2.jpg"), animation: require("../../assets/animations/fire2.json") },
  { name: "Ambulance", number: "102", image: require("../../assets/images/ambulance2.jpg"), animation: require("../../assets/animations/light.json") },
  { name: "Child Helpline", number: "1098", image: require("../../assets/images/child2.jpg"), animation: require("../../assets/animations/heart.json") },
];

const HelplineScreen = ({ navigateTo }: ContentScreenProps) => {
  const scaleAnims = useRef<{ [key: number]: Animated.Value }>({});
  const animationRefs = useRef<{ [key: number]: LottieView | null }>({});

  emergencyContacts.forEach((_, index) => {
    if (!scaleAnims.current[index]) {
      scaleAnims.current[index] = new Animated.Value(1);
    }
  });

  const speakNumber = (contactName: string, number: string, index: number) => {
    const cleanedName = contactName.replace(/[�-�]./g, "").trim();
    const message = `${cleanedName.includes("Helpline") ? cleanedName : cleanedName + " Helpline"} number is ${number}.`;

    Speech.stop();
    Speech.speak(message, { pitch: 1.1, rate: 0.9 });

    animateNumber(index);
    startAnimation(index);
  };

  const animateNumber = (index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims.current[index], { toValue: 2, duration: 300, useNativeDriver: true }),
      Animated.timing(scaleAnims.current[index], { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const startAnimation = (index: number) => {
    if (animationRefs.current[index]) {
      animationRefs.current[index]?.play();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚨 Emergency Helpline 🚨</Text>
      <View style={styles.grid}>
        {emergencyContacts.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={styles.box}
            onPress={() => speakNumber(contact.name, contact.number, index)}
            activeOpacity={0.8}
          >
            <Image source={contact.image} style={styles.image} resizeMode="cover" />
            <Text style={styles.text}>{contact.name}</Text>
            <Animated.Text style={[styles.number, { transform: [{ scale: scaleAnims.current[index] }] }]}>
              {contact.number}
            </Animated.Text>
            <LottieView
              ref={(ref) => (animationRefs.current[index] = ref)}
              source={contact.animation}
              style={styles.animation}
              loop={false}
              autoPlay={false}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => {
          Vibration.vibrate(50);
          navigateTo("RescueScreen");
        }}
      >
        <Animated.Text style={styles.playText}>🎮 Play Game</Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B263B",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#FFD700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  box: {
    width: "48%",
    height: 260,
    backgroundColor: "#2C3E50",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 3,
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  image: {
    width: 150,
    height: 140,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: "#FFD700",
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  number: {
    fontSize: 20,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  animation: {
    top: -7,
    width: 80,
    height: 80,
  },
  playButton: {
    marginTop: 15,
    backgroundColor: "#6c5ce7",
    padding: 12,
    borderRadius: 15,
    width: 250,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  playText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HelplineScreen;
