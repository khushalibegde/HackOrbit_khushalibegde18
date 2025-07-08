import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import * as Speech from "expo-speech";

interface HeaderProps {
  name: string;
  age: number;
}

const Header = ({ name, age }: HeaderProps) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [bounceAnim] = useState(new Animated.Value(0));
  const [floatAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(bounceAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 6, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: -6, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const speak = () => {
    Speech.stop(); 
    Speech.speak(`Hello ${name}, you are ${age} years old!`,{
      language: "hi-IN", 
      pitch: 1.0, 
      rate: 1.0, 
    });
    
  };

  return (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]} >
      <Animated.Text style={[styles.floatingElement, { transform: [{ translateY: floatAnim }] }]}>🎈</Animated.Text>
      <Animated.Text style={[styles.floatingElement, { transform: [{ translateY: floatAnim }] }]}>☁️</Animated.Text>

      <Text style={styles.mascot}>🐻</Text>

      <View style={{ alignItems: "center" }} >
        <TouchableOpacity onPress={speak} >
        <Text style={styles.headerText}>Hello, {name}!</Text>
        <Text style={styles.subText}>{age} years old 🎉</Text>
        </TouchableOpacity>
        
      </View>

      <TouchableOpacity onPress={speak} style={styles.soundButton}>
        <Text style={styles.soundText}>🔊</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 100,
    backgroundColor: "#6EC6FF", 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    position: "relative",
    borderColor: "#c7e9ff",
    //#4399d1
    borderWidth: 5,
  },
  headerText: {
    color: "#FFD700", 
    fontSize: 24,
    fontWeight: "bold",
  },
  subText: {
    color: "#FFFFFF", 
    fontSize: 18,
    marginTop: 2,
    fontWeight: "600",
  },
  soundButton: {
    backgroundColor: "#f6f6f6", 
    padding: 14,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderColor: "#c7e9ff",
    borderWidth: 5,
  },
  soundText: {
    fontSize: 22,
    color: "white",
  },
  mascot: {
    fontSize: 36,
    color: "#FFD700",
  },
  floatingElement: {
    position: "absolute",
    fontSize: 22,
    top: 15,
    color: "#FF69B4", // Fun Pink
  },
});

export default Header;
