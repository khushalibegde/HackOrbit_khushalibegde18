import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

const moods = [
  { color: "#FFD700", label: "Happy", speech: " खुश, Happy, cheerful", image: require("../../assets/images/happy2.png"), gradient: ["#FFD700", "#FFEE9D"] },
  { color: "#FF6B6B", label: "Angry", speech: " गुस्सा, Angry, frustrated", image: require("../../assets/images/angry.png"), gradient: ["#FF6B6B", "#FFA3A3"] },
  { color: "#9EC532", label: "Disgusted", speech: "बुरा लगना, Disgusted, grossed out", image: require("../../assets/images/disgust.png"), gradient: ["#9EC532", "#C8E086"] },
  { color: "#82CAFF", label: "Sad", speech: "दुखी, Sad, downhearted", image: require("../../assets/images/sad2.png"), gradient: ["#82CAFF", "#B8E2FF"] },
  { color: "#B388FF", label: "Fearful", speech: "डर, Fearful, anxious", image: require("../../assets/images/fear1.png"), gradient: ["#B388FF", "#D9C2FF"] },
];

const months = [
  { name: "January", days: 31, emoji: "❄️" },
  { name: "February", days: 28, emoji: "❤️" },
  { name: "March", days: 31, emoji: "🌷" },
  { name: "April", days: 30, emoji: "🌧️" },
  { name: "May", days: 31, emoji: "🌼" },
  { name: "June", days: 30, emoji: "☀️" },
  { name: "July", days: 31, emoji: "🏖️" },
  { name: "August", days: 31, emoji: "🌻" },
  { name: "September", days: 30, emoji: "🍂" },
  { name: "October", days: 31, emoji: "🎃" },
  { name: "November", days: 30, emoji: "🦃" },
  { name: "December", days: 31, emoji: "🎄" },
];

const today = new Date();
const currentDay = today.getDate();
const currentMonthIndex = today.getMonth();

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodData, setMoodData] = useState<Record<string, string>>({});

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    try {
      const savedData = await AsyncStorage.getItem("moodData");
      if (savedData) {
        setMoodData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to load mood data", error);
    }
  };

  const saveMoodData = async (data: Record<string, string>) => {
    try {
      await AsyncStorage.setItem("moodData", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save mood data", error);
    }
  };

  const handleMoodSelect = (color: string, speech: string): void => {
    
    Speech.stop(); 
    setSelectedMood(color);
    Speech.speak(speech, {
      pitch: 1.0,
      rate: 1.0,
      language: "hi-IN",
  });
  };

  const handleDayPress = (monthIndex: number, day: number): void => {
    Speech.speak(`${day} ${months[monthIndex].name}`);
    if (selectedMood && (monthIndex < currentMonthIndex || (monthIndex === currentMonthIndex && day <= currentDay))) {
      const updatedData = { ...moodData, [`${months[monthIndex].name}-${day}`]: selectedMood };
      setMoodData(updatedData);
      saveMoodData(updatedData);
    }
  };

  const getMoodGradient = (color: string | null) => {
    if (!color) return ["#f5f5f5", "#e0e0e0"];
    const mood = moods.find(m => m.color === color);
    return mood ? mood.gradient : ["#f5f5f5", "#e0e0e0"];
  };

  return (
    <LinearGradient colors={["#F8F4FF", "#E8F4FF"]} style={styles.container}>
      <Text style={styles.header}>Mood Calendar {today.getFullYear()} 🌈</Text>
      
      <View style={styles.content}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.monthsContainer}>
            {months.map((month, monthIndex) => (
              <View key={month.name} style={styles.monthContainer}>
                <View style={styles.monthHeader}>
                  <Text style={styles.monthText}>{month.emoji} {month.name}</Text>
                </View>
                <View style={styles.gridContainer}>
                  {Array.from({ length: month.days }, (_, i) => i + 1).map((day) => {
                    const isDisabled = monthIndex > currentMonthIndex || (monthIndex === currentMonthIndex && day > currentDay);
                    const moodColor = moodData[`${month.name}-${day}`];
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => !isDisabled && handleDayPress(monthIndex, day)}
                        disabled={isDisabled}
                      >
                        <LinearGradient
                          colors={getMoodGradient(moodColor)}
                          style={[
                            styles.dayBox,
                            isDisabled && styles.disabledDay,
                            day === currentDay && monthIndex === currentMonthIndex && styles.currentDay
                          ]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Text style={[
                            styles.dayText,
                            moodColor && styles.dayTextFilled,
                            isDisabled && styles.dayTextDisabled
                          ]}>
                            {day}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        
        <View style={styles.moodSelector}>
          {moods.map((mood) => (
            <TouchableOpacity 
              key={mood.color} 
              onPress={() => handleMoodSelect(mood.color, mood.speech)}
              style={[
                styles.moodButton,
                selectedMood === mood.color && styles.selectedMoodButton,
                { borderColor: mood.color }
              ]}
            >
              <LinearGradient 
                colors={mood.gradient} 
                style={styles.moodGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Image source={mood.image} style={styles.moodImage} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    paddingTop: 40
  },
  header: { 
    fontSize: 26, 
    fontWeight: "bold", 
    marginBottom: 20,
    textAlign: 'center',
    color: '#5E35B1',
    fontFamily: 'Avenir',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3
  },
  content: { 
    flexDirection: "row", 
    flex: 1 
  },
  scrollContainer: {
    flex: 1,
    marginRight: 15,
  },
  monthsContainer: { 
    flexDirection: "column",
    paddingBottom: 20
  },
  monthContainer: { 
    alignItems: "center", 
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
    padding: 12,
    shadowColor: '#4fabc9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 4,
    elevation: 3, 
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)'
  },
  monthHeader: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 5
  },
  monthText: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: '#5E35B1',
    fontFamily: 'Avenir'
  },
  gridContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "center",
    maxWidth: width * 0.6
  },
  moodSelector: { 
    width: width * 0.3,
    alignItems: 'center'
  },
  moodButton: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden'
  },
  selectedMoodButton: {
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },
  moodGradient: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  moodImage: { 
    width: 120, 
    height: 110,
  },
  dayBox: {
    width: 30,
    height: 30,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)'
  },
  currentDay: {
    borderWidth: 2,
    borderColor: '#5E35B1',
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3
  },
  disabledDay: {
    opacity: 0.6,
  },
  dayText: { 
    fontSize: 12,
    color: '#222',
    fontFamily: 'Avenir'
  },
  dayTextFilled: {
    color: '#000',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 2
  },
  dayTextDisabled: {
    color: '#999'
  }
});