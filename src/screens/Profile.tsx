import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions 
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Profile() {
  const [floatingItems, setFloatingItems] = useState([]);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSparkles = Array.from({ length: 5 }).map(() => ({
        id: Date.now() + Math.random(),
        animation: new Animated.Value(0),
        xPos: Math.random() * 100 - 50,
        yPos: Math.random() * 100 - 50,
      }));
      setSparkles((prev) => [...prev, ...newSparkles]);

      newSparkles.forEach((sparkle) => {
        Animated.timing(sparkle.animation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start(() => {
          setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id));
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const createFloatingItems = (icon, color) => {
    const newItems = Array.from({ length: 10 }).map(() => ({
      id: Date.now() + Math.random(),
      animation: new Animated.Value(0),
      xPos: Math.random() * width - width / 2,
      yPos: Math.random() * height - height / 2,
      icon,
      color,
    }));
    setFloatingItems((prev) => [...prev, ...newItems]);

    newItems.forEach((item) => {
      Animated.timing(item.animation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        setFloatingItems((prev) => prev.filter((i) => i.id !== item.id));
      });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileWrapper}>
      <View style={{ width: 160, height: 160, borderRadius: 80, overflow: "hidden", borderColor: "white", borderWidth: 2}}>
        <Image 
          source={require("../../assets/images/pfp1.png")} 
          style={{ 
            width: "120%", 
            height: "120%", 
            resizeMode: "cover",
            transform: [{ translateY: 0 },{translateX: -10}] 
          }} 
        />
      </View>


        {sparkles.map((sparkle) => (
          <Animated.View
            key={sparkle.id}
            style={{
              position: "absolute",
              top: `${50 + sparkle.yPos}%`,
              left: `${50 + sparkle.xPos}%`,
              opacity: sparkle.animation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
            }}
          >
            <FontAwesome5 name="star" size={12} color="#FFD700" />
          </Animated.View>
        ))}
      </View>

      <Text style={styles.name}>Khushali Begde</Text>
      <Text style={styles.username}>@khushiiii</Text>
      <Text style={styles.age}>Age: 21</Text>
      <Text style={styles.bio}>🌟 Always Smiling | Loves Music 🎶 | Super Friendly 🤗</Text>
      <Text style={styles.location}>📍 Nagpur</Text>

      <Text style={styles.sectionTitle}>Learning Style</Text>
      <Text style={styles.learningStyle}>🎨 Visual | 🎵 Auditory | 🤲 Hands-on</Text>

      <View style={styles.badgeContainer}>
        {[
          { icon: "star", color: "#FFD700", label: "Superstar" },
          { icon: "music", color: "#1E90FF", label: "Music Lover" },
          { icon: "heart", color: "#FF69B4", label: "Kind Soul" },
        ].map(({ icon, color, label }) => (
          <TouchableOpacity key={icon} style={styles.badge} onPress={() => createFloatingItems(icon, color)}>
            <FontAwesome5 name={icon} size={20} color={color} />
            <Text style={styles.badgeText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {floatingItems.map((item) => (
        <Animated.View
          key={item.id}
          style={[
            styles.floatingItem,
            {
              opacity: item.animation,
              transform: [
                { translateY: item.animation.interpolate({ inputRange: [0, 1], outputRange: [0, -Math.random() * height] }) },
                { translateX: item.animation.interpolate({ inputRange: [0, 1], outputRange: [item.xPos, item.xPos + Math.random() * 100 - 50] }) },
              ],
            },
          ]}
        >
          <FontAwesome5 name={item.icon} size={20} color={item.color} solid />
        </Animated.View>
      ))}

      <TouchableOpacity style={styles.bottomHeartContainer} onPress={() => createFloatingItems("heart", "#FF69B4")}>
        <FontAwesome5 name="heart" size={50} color="#FF69B4"/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF4E6",
    padding: 20,
  },
  profileWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80, // Ensure it's exactly half of width/height
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 15,
    overflow: "hidden", // Important for clipping edges
  },
  
  name: { fontSize: 26, fontWeight: "bold", color: "#333" },
  username: { fontSize: 18, color: "#777", marginBottom: 5 },
  age: { fontSize: 16, color: "#777", marginBottom: 5 },
  bio: { fontSize: 18, color: "#555", marginVertical: 8, textAlign: "center", paddingHorizontal: 20 },
  location: { fontSize: 16, color: "#777", marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 10, color: "#333" },
  learningStyle: { fontSize: 16, color: "#555", marginBottom: 10, textAlign: "center" },
  badgeContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 15 },
  badge: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 8, borderRadius: 15, marginHorizontal: 5 },
  badgeText: { fontSize: 14, marginLeft: 5, fontWeight: "bold" },
  floatingItem: { position: "absolute", top: "50%" },
  bottomHeartContainer: { position: "absolute", bottom: 30, alignSelf: "center" },
});