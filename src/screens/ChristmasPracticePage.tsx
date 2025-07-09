import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Speech from "expo-speech";

const questions = [
  {
    question: "Who brings gifts on Christmas?",
    options: [
      { image: require("../../assets/images/santa.jpg"), isCorrect: true, label: "Santa Claus" },
      { image: require("../../assets/images/bells.jpg"), isCorrect: false, label: "Bells" },
      { image: require("../../assets/images/gift.jpg"), isCorrect: false, label: "Gift" }
    ]
  },
  {
    question: "What rings on Christmas?",
    options: [
      { image: require("../../assets/images/santa.jpg"), isCorrect: false, label: "Santa Claus" },
      { image: require("../../assets/images/bells.jpg"), isCorrect: true, label: "Bells" },
      { image: require("../../assets/images/gift.jpg"), isCorrect: false, label: "Gift" }
    ]
  }
];

// Function to speak text
const speak = (text: string) => {
  Speech.stop();
  Speech.speak(text, {
    language: "mr-IN",
    pitch: 1.0,
    rate: 0.9,
  });
};

const ChristmasPracticePage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<boolean[]>([false, false, false]);

  const handleAnswer = (option: { isCorrect: boolean; label: string }, index: number) => {
    speak(option.label); // Speak the image label when clicked

    if (option.isCorrect) {
      setScore(score + 1);
      setShowConfetti(true);

      setTimeout(() => setShowConfetti(false), 1000);

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setDisabledOptions([false, false, false]); // Reset options for next question
        } else {
          alert(`Your score: ${score + 1}/${questions.length}`);
        }
      }, 1500);
    } else {
      // Disable only the wrong option clicked
      const updatedDisabledOptions = [...disabledOptions];
      updatedDisabledOptions[index] = true;
      setDisabledOptions(updatedDisabledOptions);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      {/* Question */}
      <Text className="text-3xl font-bold text-gray-800 text-center mb-6">
        {questions[currentQuestion].question}
      </Text>

      {/* Answer Options */}
      <View className="w-full flex-row flex-wrap justify-center items-center">
        {questions[currentQuestion].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswer(option, index)}
            className="m-2"
            disabled={disabledOptions[index]} // Disable option if it was wrong
          >
            <Image
              source={option.image}
              className={`w-40 h-40 rounded-xl ${disabledOptions[index] ? "opacity-50" : "opacity-100"}`}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Confetti Celebration */}
      {showConfetti && <ConfettiCannon count={50} origin={{ x: 200, y: 0 }} fadeOut />}
    </View>
  );
};

export default ChristmasPracticePage;
