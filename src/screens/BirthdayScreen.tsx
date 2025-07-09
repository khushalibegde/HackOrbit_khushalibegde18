import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import LottieView from "lottie-react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Speech from "expo-speech";

export default function BirthdayLearningScreen() {
  const [animationPlay, setAnimationPlay] = useState(false);
  const [yearDigits, setYearDigits] = useState(["_", "_", "_", "_"]);
  const confettiRef = useRef<ConfettiCannon | null>(null);
  const birthdayText = "April 22, 2004";
  const bounceAnim = useRef(new Animated.Value(1)).current; 

  const revealYear = (index = 0, digits = ["2", "0", "0", "4"]) => {
    if (index < digits.length) {
      setTimeout(() => {
        setYearDigits((prev) => {
          const newDigits = [...prev];
          newDigits[index] = digits[index];
          return newDigits;
        });

        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        ]).start();

        revealYear(index + 1, digits);
      }, 500);
    } else {
      setTimeout(() => setAnimationPlay(false), 4000);
    }
  };

  const speakBirthday = () => {
    const speechText = "Your birthday is April 22, Two Thousand and Four. 2... 0... 0... 4...";
    Speech.speak(speechText, { rate: 0.8 });
    revealYear();
  };

  const handlePress = () => {
    setAnimationPlay(true);
    speakBirthday();
    confettiRef.current && confettiRef.current.start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎂 Your Special Day! 🎉</Text>
      
      <TouchableOpacity onPress={handlePress} style={styles.birthdayButton}>
        <Text style={styles.birthdayText}>{birthdayText}</Text>
      </TouchableOpacity>

      <View style={styles.yearContainer}>
        {yearDigits.map((digit, index) => (
          <Animated.Text key={index} style={[styles.yearDigit, { transform: [{ scale: bounceAnim }] }]}>
            {digit}
          </Animated.Text>
        ))}
      </View>

      {animationPlay && (
        <LottieView
          source={require("../../assets/animations/birthday.json")}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      )}

      <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} autoStart={false} ref={confettiRef} />

      <TouchableOpacity onPress={handlePress} style={styles.replayButton}>
        <Text style={styles.replayText}>🔄 Replay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF3E6",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF69B4",
    marginBottom: 20,
    fontFamily: "Comic Sans MS",
  },
  birthdayButton: {
    backgroundColor: "#FFB6C1",
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
  },
  birthdayText: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  animation: {
    width: 250,
    height: 250,
    position: "absolute",
    bottom: 20,
  },
  yearContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  yearDigit: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF4081",
    marginHorizontal: 5,
    fontFamily: "Comic Sans MS",
  },
  replayButton: {
    marginTop: 30,
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
  },
  replayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
