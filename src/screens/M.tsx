import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Pressable,
  Animated,
} from "react-native";
import * as Speech from "expo-speech";
import ConfettiCannon from "react-native-confetti-cannon";

const SPEECH_CONFIG = { language: "hi-IN", pitch: 1.0, rate: 0.8 };
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const products = [
    {
    id: "1",
    name: "Milk Packet",
    image: require("../../assets/images/milk.png"),
    mrp: "₹60",
    expiryDate: "15/04/2024",
    mrpZone: { x: 0.35, y: 0.63, width: 0.3, height: 0.11 },
    expiryZone: { x: 0.54, y: 0.775, width: 0.3, height: 0.1 },
  },
  {
    id: "2",
    name: "Bread",
    image: require("../../assets/images/bread.png"),
    mrp: "₹40",
    expiryDate: "10/04/2024",
    mrpZone: { x: 0.35, y: 0.57, width: 0.2, height: 0.1 },
    expiryZone: { x: 0.43, y: 0.68, width: 0.2, height: 0.06 },
  },
  {
    id: "3",
    name: "Eggs",
    image: require("../../assets/images/eggs.png"),
    mrp: "₹80",
    expiryDate: "20/04/2024",
    mrpZone: { x: 0.3, y: 0.28, width: 0.4, height: 0.1 },
    expiryZone: { x: 0.31, y: 0.84, width: 0.4, height: 0.1 },
  },
  {
    id: "4",
    name: "Chocolate",
    image: require("../../assets/images/chocolate2.png"),
    mrp: "₹40",
    expiryDate: "27/10/2024",
    mrpZone: { x: 0.25, y: 0.71, width: 0.25, height: 0.1 },
    expiryZone: { x: 0.5, y: 0.705, width: 0.26, height: 0.13 },
  },
  {
    id: "5",
    name: "Boroline",
    image: require("../../assets/images/boroline.png"),
    mrp: "₹10",
    expiryDate: "",
    mrpZone: { x: 0.45, y: 0.57, width: 0.2, height: 0.15 },
    expiryZone: { x: 0.45, y: 0.57, width: 0.2, height: 0.15 },
  },
  {
    id: "6",
    name: "Tel",
    image: require("../../assets/images/tel.png"),
    mrp: "₹195",
    expiryDate: "06/2027",
    mrpZone: { x: 0.4, y: 0.59, width: 0.2, height: 0.05 },
    expiryZone: { x: 0.4, y: 0.55, width: 0.2, height: 0.05 },
  },
  {
    id: "7",
    name: "Dark Fantasy",
    image: require("../../assets/images/dark fantacy.png"),
    mrp: "₹170",
    expiryDate: "03/11/2025",
    mrpZone: { x: 0.67, y: 0.4, width: 0.2, height: 0.07 },
    expiryZone: { x: 0.67, y: 0.45, width: 0.2, height: 0.07 },
  },
  {
    id: "8",
    name: "Maggie",
    image: require("../../assets/images/maggie.png"),
    mrp: "₹120",
    expiryDate: "OCT/25",
    mrpZone: { x: 0.57, y: 0.6, width: 0.3, height: 0.05 },
    expiryZone: { x: 0.57, y: 0.65, width: 0.3, height: 0.05 },
  },
  {
    id: "9",
    name: "Chocolate",
    image: require("../../assets/images/chocolate.png"),
    mrp: "₹140",
    expiryDate: "24/Feb/202",
    mrpZone: { x: 0.5, y: 0.65, width: 0.22, height: 0.05 },
    expiryZone: { x: 0.5, y: 0.7, width: 0.22, height: 0.05 },
  },

];

const TapToFindMRP = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [highlightMRP, setHighlightMRP] = useState(false);
  const [highlightExpiry, setHighlightExpiry] = useState(false);
  const imageRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const [emojiScale, setEmojiScale] = useState(new Animated.Value(1)); 
  const [showEmoji, setShowEmoji] = useState(false); 

  const product = products[currentProductIndex];

  const speak = (text) => {
    Speech.stop();
    Speech.speak(text, SPEECH_CONFIG);
  };

  const handlePress = (event) => {
    imageRef.current.measure((x, y, width, height, pageX, pageY) => {
      const touchX = event.nativeEvent.pageX - pageX;
      const touchY = event.nativeEvent.pageY - pageY;
      const relativeX = touchX / width;
      const relativeY = touchY / height;

      const { mrpZone, expiryZone } = product;

      const isInMRPZone =
        relativeX >= mrpZone.x &&
        relativeX <= mrpZone.x + mrpZone.width &&
        relativeY >= mrpZone.y &&
        relativeY <= mrpZone.y + mrpZone.height;

      const isInExpiryZone =
        relativeX >= expiryZone.x &&
        relativeX <= expiryZone.x + expiryZone.width &&
        relativeY >= expiryZone.y &&
        relativeY <= expiryZone.y + expiryZone.height;

      if (isInMRPZone) {
        speak(`Well done! ${product.mrp}!`);
        setShowConfetti(true);
        setShowEmoji(true);
        triggerZoomEffect();
        setTimeout(() => setShowConfetti(false), 2000);
      } else if (isInExpiryZone) {
        speak(`Great job! Expiry date is ${product.expiryDate}!`);
        setShowConfetti(true);
        setShowEmoji(true);
        triggerZoomEffect();
        setTimeout(() => setShowConfetti(false), 2000);
      } else {
        speak("Oops! Try again!");
        setHighlightMRP(true);
        setHighlightExpiry(true);
        setTimeout(() => {
          setHighlightMRP(false);
          setHighlightExpiry(false);
        }, 1000);
      }
    });
  };

  const triggerZoomEffect = () => {
    Animated.sequence([
      Animated.timing(emojiScale, {
        toValue: 2, 
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(emojiScale, {
        toValue: 1, 
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => setShowEmoji(false), 1000); 
  };

  const handleNext = () => {
    Speech.stop();  
    setShowConfetti(false);
    setShowEmoji(false);
    const nextIndex = (currentProductIndex + 1) % products.length;
    setCurrentProductIndex(nextIndex);
  };

  const { mrpZone, expiryZone } = product;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍️ MRP & Expiry Date Finder</Text>

      <Pressable onPress={handlePress}>
        <View>
          <Image
            ref={imageRef}
            source={product.image}
            style={styles.image}
            resizeMode="contain"
          />
          <View
            style={{
              position: "absolute",
              left: mrpZone.x * windowWidth * 0.9,
              top: mrpZone.y * windowHeight * 0.5,
              width: mrpZone.width * windowWidth * 0.9,
              height: mrpZone.height * windowHeight * 0.5,
              borderWidth: highlightExpiry ? 2 : 0,
              borderRadius: 15,
              borderColor: highlightMRP ? "#CEB2BD" : "transparent",
              backgroundColor: highlightExpiry ? "rgba(255, 215, 0, 0.2);" : "transparent",
            }}
          />
          <View
            style={{
              position: "absolute",
              left: expiryZone.x * windowWidth * 0.9,
              top: expiryZone.y * windowHeight * 0.5,
              width: expiryZone.width * windowWidth * 0.9,
              height: expiryZone.height * windowHeight * 0.5,
              borderWidth: highlightExpiry ? 2 : 0,
              borderRadius: 15,
              borderColor: highlightExpiry ? "#CEB2BD" : "transparent",
              backgroundColor: highlightExpiry ? "rgba(255, 215, 0, 0.2);" : "transparent",
            }}
          />
          {showConfetti && (
            <ConfettiCannon
              count={80}
              origin={{ x: windowWidth / 2 - 20, y: -100 }}
              fadeOut={true}
              fallSpeed={3000}
            />
          )}
          
          {showEmoji && (
            <Animated.View
              style={[
                styles.emojiContainer,
                { transform: [{ scale: emojiScale }] },
              ]}
            >
              <Text style={styles.emoji}>🥳</Text>
            </Animated.View>
          )}
        </View>
      </Pressable>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next Product ➡️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    color: "#6A1B4D",
    textAlign: "center",
  },
  image: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.5,
    borderRadius: 25,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  button: {
    backgroundColor: "#AAD0E2",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 25,
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    borderColor: "#D9E2E0",
    borderWidth:1.5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emojiContainer: {
    position: "absolute",
    top: windowHeight * 0.2,
    left: windowWidth / 2 - 25,
  },
  emoji: {
    fontSize: 50,
    color: "#FFD700",
  },
});

export default TapToFindMRP;
