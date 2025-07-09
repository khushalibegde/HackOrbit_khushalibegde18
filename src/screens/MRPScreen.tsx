import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import * as Speech from "expo-speech";
import * as Animatable from "react-native-animatable";
import ConfettiCannon from "react-native-confetti-cannon";

// Types
interface Product {
  id: string;
  name: string;
  image: any;
  mrp: string;
  expiryDate: string;
  description: string;
}

interface ButtonProps {
  text: string;
  color: string;
  onPress: () => void;
}

// Constants
const SPEECH_CONFIG = { language: "hi-IN", pitch: 1.0, rate: 0.8 };

const products: Product[] = [
  {
    id: "1",
    name: "Milk Packet",
    image: require("../../assets/images/milk.png"),
    mrp: "₹60",
    expiryDate: "15/04/2024",
    description: "Look for a white packet with a cow picture! 🐄 The price is written in big numbers. This milk makes our bones strong! 💪",
  },
  {
    id: "2",
    name: "Bread",
    image: require("../../assets/images/bread.png"),
    mrp: "₹40",
    expiryDate: "10/04/2024",
    description: "Find the brown packet with bread slices! 🍞 The price is on the front. This bread helps us grow tall! 🌱",
  },
  {
    id: "3",
    name: "Eggs",
    image: require("../../assets/images/eggs.png"),
    mrp: "₹80",
    expiryDate: "20/04/2024",
    description: "Look for the white eggs in a box! 🥚 The price is on the top. Eggs give us energy to play! ⚡",
  },
];

// Reusable Components
const AnimatedButton: React.FC<ButtonProps> = ({ text, color, onPress }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const ProductImage: React.FC<{ image: any; rotation: Animated.Value }> = ({ image, rotation }) => {
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.Image
      source={image}
      style={[styles.productImage, { transform: [{ rotate: spin }] }]}
    />
  );
};

const InfoContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Animatable.View animation="fadeIn" style={styles.infoContainer}>
    {children}
  </Animatable.View>
);

// Main Component
const MRPScreen = () => {
  const [currentProduct, setCurrentProduct] = useState(products[0]);
  const [showValue, setShowValue] = useState<'mrp' | 'expiry' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasSpoken = useRef(false);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!hasSpoken.current) {
      speak("Welcome! Let’s learn to find the price and expiry date on things. Tap the buttons to begin!");
      hasSpoken.current = true;
    }
  }, []);

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text.replace(/[\u{1F300}-\u{1F9FF}]/gu, ''), SPEECH_CONFIG);
  };

  const animateProduct = () => {
    Animated.sequence([
      Animated.timing(rotation, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(rotation, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]).start();
  };

  const handleAction = (action: 'mrp' | 'expiry' | 'hint' | 'next') => {
    switch (action) {
      case 'mrp':
      case 'expiry':
        setShowValue(action);
        speak(`Look for the ${action === 'mrp' ? 'price' : 'expiry date'} on the product!`);
        break;
      case 'hint':
        setShowHint(true);
        speak(currentProduct.description);
        setTimeout(() => setShowHint(false), 10000);
        break;
      case 'next':
        const currentIndex = products.findIndex(p => p.id === currentProduct.id);
        const nextProduct = products[(currentIndex + 1) % products.length];
        setCurrentProduct(nextProduct);
        setShowValue(null);
        setShowHint(false);
        speak(`Let's look at ${nextProduct.name}`);
        break;
    }
  };

  const buttons = [
    { text: "Show MRP", color: "#4CAF50", onPress: () => handleAction('mrp') },
    { text: "Show Expiry Date", color: "#2196F3", onPress: () => handleAction('expiry') },
    { text: "Get Hint", color: "#FF9800", onPress: () => handleAction('hint') },
    { text: "Next Product", color: "#9C27B0", onPress: () => handleAction('next') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍️ MRP & Expiry Date Finder</Text>

      <TouchableOpacity onPress={animateProduct} style={styles.productContainer}>
        <ProductImage image={currentProduct.image} rotation={rotation} />
      </TouchableOpacity>

      {showValue && (
        <InfoContainer>
          <Text style={styles.valueText}>
            {showValue === 'mrp' ? 'Price: ' : 'Expiry Date: '}
            {showValue === 'mrp' ? currentProduct.mrp : currentProduct.expiryDate}
          </Text>
        </InfoContainer>
      )}

      {showHint && (
        <InfoContainer>
          <Text style={styles.hintText}>{currentProduct.description}</Text>
        </InfoContainer>
      )}

      <View style={styles.buttonContainer}>
        {buttons.map((button, index) => (
          <AnimatedButton key={index} {...button} />
        ))}
      </View>

      {showConfetti && (
        <ConfettiCannon count={100} origin={{ x: Dimensions.get("window").width / 2, y: 0 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F8FF", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2C3E50", marginBottom: 10, textAlign: "center" },
  productContainer: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  productImage: { width: 250, height: 250, resizeMode: "contain" },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  valueText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  buttonContainer: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  button: { padding: 15, borderRadius: 15, minWidth: 150, alignItems: "center", justifyContent: "center", margin: 5 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  hintText: { fontSize: 16, color: "#2C3E50", textAlign: "center" },
});

export default MRPScreen;
