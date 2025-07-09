import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, Image, ImageBackground } from "react-native";
import * as Speech from "expo-speech";
import ConfettiCannon from "react-native-confetti-cannon";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const emergencyScenes = [
  { id: "1", image: require("../../assets/images/police3.jpg"), correctNumber: "100", helper: "Call the police!", emoji: "🚓", name: "Police" },
  { id: "2", image: require("../../assets/images/firefighter2.jpg"), correctNumber: "101", helper: "Call the fire brigade!", emoji: "🚒", name: "Fire Brigade" },
  { id: "3", image: require("../../assets/images/ambulance2.jpg"), correctNumber: "102", helper: "Call an ambulance!", emoji: "🚑", name: "Ambulance" },
  { id: "4", image: require("../../assets/images/child2.jpg"), correctNumber: "1098", helper: "Call the child helpline!", emoji: "❤️", name: "Child Helpline" },
];

const RescueGame = () => {
  const [currentScene, setCurrentScene] = useState(emergencyScenes[0]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [reaction, setReaction] = useState("🤔");
  const [disabledKeys, setDisabledKeys] = useState([]);
  const [mascotAnim] = useState(new Animated.Value(0));

  const moveMascot = () => {
    Animated.sequence([
      Animated.timing(mascotAnim, { toValue: -10, duration: 200, useNativeDriver: true }),
      Animated.timing(mascotAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const askQuestion = () => {
    setReaction("🤔");
    const randomScene = emergencyScenes[Math.floor(Math.random() * emergencyScenes.length)];
    setCurrentScene(randomScene);
    setDisabledKeys([]);
    Speech.speak(randomScene.helper, { rate: 0.8 });
    moveMascot();
  };

  const checkAnswer = (number) => {
    const selectedScene = emergencyScenes.find(scene => scene.correctNumber === number);
    if (number === currentScene.correctNumber) {
      Speech.speak("Yes! You saved the day!", { rate: 0.8 });
      setReaction("😃");
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        askQuestion();
      }, 2000);
    } else {
      Speech.speak(` ${selectedScene.name}.`, { rate: 0.8 });
      setReaction("😢");
      setDisabledKeys([...disabledKeys, number]);
      moveMascot();
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/bg1.webp")} style={styles.background}>
      <BlurView intensity={120} style={styles.blurOverlay}>
        <View style={styles.container}>
          <Text style={styles.title}>🚨 Rescue Mission! 🚁</Text>
          <Animated.Text style={[styles.mascot, { transform: [{ translateY: mascotAnim }] }]}>{reaction}</Animated.Text>

          <Image source={currentScene.image} style={styles.image} />

          <View style={styles.keypad}>
            {emergencyScenes.map((scene) => (
              <TouchableOpacity
                key={scene.correctNumber}
                style={[styles.keyWrapper, disabledKeys.includes(scene.correctNumber) && styles.disabledKey]}
                onPress={() => checkAnswer(scene.correctNumber)}
                disabled={disabledKeys.includes(scene.correctNumber)}
              >
                <LinearGradient
                  colors={disabledKeys.includes(scene.correctNumber) ? ["#b0b0b0", "#ccc"] : ["#FF9A00", "#FFD700"]}
                  style={styles.key}
                >
                  <Text style={styles.keyText}>
                    {scene.correctNumber} {scene.emoji}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {showConfetti && <ConfettiCannon count={100} origin={{ x: 180, y: 0 }} />}
        </View>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover", justifyContent: "center" },
  blurOverlay: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 30, fontWeight: "bold", color: "#FFF", textShadowColor: "black", textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 },
  mascot: { fontSize: 50, marginBottom: 10 },
  image: { width: 250, height: 250, borderRadius: 20, marginBottom: 20, borderWidth: 5, borderColor: "#FFF" },
  keypad: { flexDirection: "row", justifyContent: "center", width: "80%", marginTop: 10, flexWrap: "wrap" },
  keyWrapper: { margin: 8, borderRadius: 15, overflow: "hidden" },
  key: { padding: 15, width: 90, alignItems: "center", borderRadius: 15, justifyContent: "center" },
  disabledKey: { opacity: 0.5 },
  keyText: { fontSize: 20, fontWeight: "bold", color: "#000", textAlign: "center" },
});

export default RescueGame;
