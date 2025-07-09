import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Vibration,
} from 'react-native';
import * as Speech from 'expo-speech';

interface ContentScreenProps {
  navigateTo: (screen: string) => void;
}

interface PartDetailsScreenProps {
  navigateTo: (screen: string) => void;
  part: {
    name: string;
    image: any;
    description: string;
    features: string[];
    quiz: { question: string; options: string[]; correctAnswer: number }[];
  };
}

const PartDetailsScreen = ({ navigateTo, part }: PartDetailsScreenProps) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isTextToSpeech, setIsTextToSpeech] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);

  const speak = (text: string) => {
    if (isTextToSpeech) {
      Speech.speak(text, {
        language: 'en',
        pitch: 0.8,
        rate: 0.8,
      });
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (part.quiz[currentQuiz].correctAnswer === answerIndex) {
      speak("Correct! Well done!");
      Vibration.vibrate([0, 100, 100, 100]);
      
      if (currentQuiz < part.quiz.length - 1) {
        setCurrentQuiz(prev => prev + 1);
      } else {
        setShowQuiz(false);
      }
    } else {
      speak("That's not quite right. Let's try again!");
      Vibration.vibrate([0, 500, 200, 500]);
    }
  };

  const renderQuiz = () => {
    const currentQuizData = part.quiz[currentQuiz];
    
    return (
      <View style={styles.quizContainer}>
        <Text style={[styles.quizQuestion, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
          {currentQuizData.question}
        </Text>
        {currentQuizData.options.map((option: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={[styles.quizOption, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
            onPress={() => handleQuizAnswer(index)}
          >
            <Text style={[styles.quizOptionText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={part.image}
          style={styles.image}
          resizeMode="contain"
        />
        
        <Text style={[styles.title, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
          {part.name}
        </Text>
        
        <Text style={[styles.description, { color: isHighContrast ? "#FFFFFF" : "#666" }]}>
          {part.description}
        </Text>

        <Text style={[styles.featuresTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
          Features:
        </Text>
        
        {part.features.map((feature: string, index: number) => (
          <Text key={index} style={[styles.feature, { color: isHighContrast ? "#FFFFFF" : "#666" }]}>
            • {feature}
          </Text>
        ))}

        {!showQuiz ? (
          <TouchableOpacity
            style={[styles.quizButton, { backgroundColor: isHighContrast ? "#0000FF" : "#2196F3" }]}
            onPress={() => {
              setShowQuiz(true);
              setCurrentQuiz(0);
              speak("Let's take a quiz about " + part.name);
            }}
          >
            <Text style={styles.quizButtonText}>Take Quiz</Text>
          </TouchableOpacity>
        ) : (
          renderQuiz()
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  feature: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  quizButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  quizButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizContainer: {
    width: '100%',
    maxWidth: 300,
    marginTop: 20,
    gap: 15,
  },
  quizQuestion: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  quizOption: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  quizOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PartDetailsScreen; 