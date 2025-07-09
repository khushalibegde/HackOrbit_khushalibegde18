import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";
import * as Animatable from "react-native-animatable";
import ConfettiCannon from "react-native-confetti-cannon";
import { Svg, Path, Circle, Rect } from "react-native-svg";

// Types
interface Signal {
  id: string;
  name: string;
  color: string;
  emoji: string;
  description: string;
  action: string;
  image: any;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  signal: string;
  hint: string;
}

// Constants
const SPEECH_CONFIG = { language: "hi-IN", pitch: 1.0, rate: 1.2 };

const SIGNALS: Signal[] = [
  {
    id: "red",
    name: "Red Light",
    color: "#FF3B30",
    emoji: "🔴",
    description: "Stop! Don't walk or cross the road.",
    action: "STOP",
    image: require("../../assets/images/traffic/red-light.png"),
  },
  {
    id: "yellow",
    name: "Yellow Light",
    color: "#FFCC00",
    emoji: "🟡",
    description: "Wait! Be ready to stop.",
    action: "WAIT",
    image: require("../../assets/images/traffic/yellow-light.png"),
  },
  {
    id: "green",
    name: "Green Light",
    color: "#34C759",
    emoji: "🟢",
    description: "Go! It's safe to cross.",
    action: "GO",
    image: require("../../assets/images/traffic/green-light.png"),
  },
];

const QUESTIONS: Question[] = [
  {
    id: "1",
    question: "The traffic light is red. What should the car do?",
    options: ["Stop", "Go fast", "Slow down", "Honk"],
    correctAnswer: 0,
    signal: "red",
    hint: "Red means stop!",
  },
  {
    id: "2",
    question: "The traffic light is yellow. What should the car do?",
    options: ["Speed up", "Stop", "Be ready to stop", "Turn around"],
    correctAnswer: 2,
    signal: "yellow",
    hint: "Yellow means wait and be ready to stop!",
  },
  {
    id: "3",
    question: "The traffic light is green. What should the car do?",
    options: ["Stop", "Go", "Wait", "Park"],
    correctAnswer: 1,
    signal: "green",
    hint: "Green means go!",
  },
];

// Reusable Components
const TrafficSignal: React.FC<{ signal: Signal; isActive: boolean }> = ({ signal, isActive }) => (
  <View style={[styles.signalContainer, { backgroundColor: signal.color }]}>
    <Image source={signal.image} style={styles.signalImage} />
    <Text style={styles.signalText}>{signal.action}</Text>
    {isActive && <Animatable.View animation="pulse" iterationCount="infinite" style={styles.activeIndicator} />}
  </View>
);

const Car: React.FC<{ position: Animated.Value; isMoving: boolean }> = ({ position, isMoving }) => (
  <Animated.View style={[styles.carContainer, { transform: [{ translateX: position }] }]}>
    <Svg width="60" height="60" viewBox="0 0 512 512">
      {/* Car Body */}
      <Path
        d="M120 280C120 260 140 240 160 240H352C372 240 392 260 392 280V320C392 340 372 360 352 360H160C140 360 120 340 120 320V280Z"
        fill="#FF0000"
      />
      {/* Car Roof */}
      <Path
        d="M160 240C160 220 180 200 200 200H312C332 200 352 220 352 240V280H160V240Z"
        fill="#FF0000"
      />
      {/* Windows */}
      <Path
        d="M180 220C180 210 190 200 200 200H312C322 200 332 210 332 220V260H180V220Z"
        fill="#87CEEB"
      />
      {/* Wheels */}
      <Circle cx="180" cy="360" r="40" fill="#000000" />
      <Circle cx="332" cy="360" r="40" fill="#000000" />
      {/* Headlight */}
      <Circle cx="380" cy="300" r="20" fill="#FFD700" />
      {/* Taillight */}
      <Circle cx="132" cy="300" r="20" fill="#FF0000" />
    </Svg>
  </Animated.View>
);

const QuestionCard: React.FC<{
  question: Question;
  onAnswer: (index: number) => void;
  selectedAnswer: number | null;
  showFeedback: boolean;
}> = ({ question, onAnswer, selectedAnswer, showFeedback }) => (
  <View style={styles.questionCard}>
    <Text style={styles.questionText}>{question.question}</Text>
    <Text style={styles.hintText}>Hint: {question.hint}</Text>
    <View style={styles.optionsContainer}>
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedAnswer === index && styles.selectedOption,
            showFeedback && index === question.correctAnswer && styles.correctOption,
          ]}
          onPress={() => onAnswer(index)}
          disabled={selectedAnswer !== null}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const TrafficScreen = () => {
  const [currentSignal, setCurrentSignal] = useState(SIGNALS[0]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const carPosition = useRef(new Animated.Value(0)).current;
  const carScale = useRef(new Animated.Value(1)).current;
  const hasSpoken = useRef(false);

  useEffect(() => {
    if (!hasSpoken.current) {
      speak("Welcome to Traffic Safety Learning! Watch the car and traffic signals, then answer the questions!");
      hasSpoken.current = true;
    }
  }, []);

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text.replace(/[\u{1F300}-\u{1F9FF}]/gu, ''), SPEECH_CONFIG);
  };

  const animateCar = (signal: Signal) => {
    if (signal.id === 'green') {
      // Reset car position to left
      carPosition.setValue(0);
      carScale.setValue(1);
      
      // Animate car movement
      Animated.parallel([
        // Move car from left to right
        Animated.timing(carPosition, {
          toValue: Dimensions.get('window').width - 100, // Move to right edge minus car width
          duration: 3000,
          useNativeDriver: true
        }),
        // Add a slight bounce effect
        Animated.sequence([
          Animated.timing(carScale, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true
          }),
          Animated.timing(carScale, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true
          })
        ])
      ]).start();
    } else {
      // For red and yellow, move car back to start
      Animated.timing(carPosition, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start();
    }
  };

  const handleSignalChange = (signal: Signal) => {
    setCurrentSignal(signal);
    animateCar(signal);
    speak(`${signal.name}! ${signal.description}`);
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const isCorrect = index === QUESTIONS[currentQuestion].correctAnswer;
    setShowFeedback(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setShowConfetti(true);
      speak("Great job! That's correct!");
    } else {
      speak("Oops! Try again!");
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setShowConfetti(false);
      }
    }, 2000);
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>🚦 Traffic Safety Learning</Text>
        <Text style={styles.score}>Score: {score} ⭐</Text>

        <View style={styles.roadContainer}>
          <View style={styles.trafficSignalContainer}>
            <TrafficSignal signal={currentSignal} isActive={true} />
          </View>
          <View style={styles.carTrack}>
            <Car position={carPosition} isMoving={true} />
          </View>
        </View>

        <View style={styles.signalsContainer}>
          {SIGNALS.map(signal => (
            <TouchableOpacity
              key={signal.id}
              style={[styles.signalButton, { backgroundColor: signal.color }]}
              onPress={() => handleSignalChange(signal)}
            >
              <Text style={styles.signalButtonText}>{signal.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <QuestionCard
          question={QUESTIONS[currentQuestion]}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
        />

        {showConfetti && (
          <ConfettiCannon count={100} origin={{ x: Dimensions.get("window").width / 2, y: 0 }} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: "#F3F8FF", alignItems: "center", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#1A237E", marginBottom: 15, textAlign: "center" },
  score: { fontSize: 28, color: "#C62828", marginBottom: 20, fontWeight: "bold" },
  roadContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#424242",
    borderRadius: 10,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  trafficSignalContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  signalContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signalImage: { width: 40, height: 40 },
  signalText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  activeIndicator: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  carTrack: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  carContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  signalsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },
  signalButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signalButtonText: {
    fontSize: 24,
  },
  questionCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  questionText: {
    fontSize: 24,
    color: "#1A237E",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  hintText: {
    fontSize: 18,
    color: "#1A237E",
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#BBDEFB",
  },
  correctOption: {
    backgroundColor: "#C8E6C9",
  },
  optionText: {
    fontSize: 18,
    color: "#1A237E",
    fontWeight: "500",
  },
});

export default TrafficScreen;
