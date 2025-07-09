import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Image,
  Alert,
  Vibration,
  Dimensions,
} from "react-native";
import * as Speech from 'expo-speech';

interface ContentScreenProps {
  navigateTo: (screen: string) => void;
}

interface ComputerPart {
  id: string;
  name: string;
  description: string;
  image: any;
  features: string[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    type: 'multiple_choice' | 'matching';
    matchingPairs?: { image: string; name: string }[];
  }[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  isUnlocked: boolean;
  icon: string;
}

const computerParts: ComputerPart[] = [
  {
    id: "monitor",
    name: "Monitor",
    description: "The screen that shows what's happening on the computer",
    image: require("../../assets/images/monitor.png"),
    features: [
      "Shows pictures and text",
      "Comes in different sizes",
      "Can be bright or dark",
      "Helps us see what we're doing"
    ],
    quiz: [
      {
        question: "What does the monitor do?",
        options: [
          "Shows pictures and text",
          "Makes loud noises",
          "Cooks food",
          "Washes clothes"
        ],
        correctAnswer: 0,
        type: 'multiple_choice'
      }
    ]
  },
  {
    id: "keyboard",
    name: "Keyboard",
    description: "The part with buttons we press to type letters and numbers",
    image: require("../../assets/images/keyboard.jpg"),
    features: [
      "Has letter and number buttons",
      "Helps us type words",
      "Has special keys like Enter and Space",
      "Makes clicking sounds when pressed"
    ],
    quiz: [
      {
        question: "What do we use the keyboard for?",
        options: [
          "To type words",
          "To watch videos",
          "To play music",
          "To make phone calls"
        ],
        correctAnswer: 0,
        type: 'multiple_choice'
      }
    ]
  },
  {
    id: "mouse",
    name: "Mouse",
    description: "The small device we move to control the computer",
    image: require("../../assets/images/mouse.jpg"),
    features: [
      "Helps us click on things",
      "Has left and right buttons",
      "Moves the cursor on screen",
      "Can be wireless or connected"
    ],
    quiz: [
      {
        question: "What does the mouse help us do?",
        options: [
          "Click on things on the screen",
          "Type words",
          "Print documents",
          "Save files"
        ],
        correctAnswer: 0,
        type: 'multiple_choice'
      }
    ]
  },
  {
    id: "cpu",
    name: "CPU",
    description: "The brain of the computer that makes everything work",
    image: require("../../assets/images/cpu.jpg"),
    features: [
      "Makes the computer work",
      "Helps us run programs",
      "Gets warm when working",
      "Is inside the computer"
    ],
    quiz: [
      {
        question: "What is the CPU like?",
        options: [
          "The brain of the computer",
          "The screen of the computer",
          "The keyboard of the computer",
          "The mouse of the computer"
        ],
        correctAnswer: 0,
        type: 'multiple_choice'
      }
    ]
  },
  {
    id: "printer",
    name: "Printer",
    description: "Makes paper copies of documents and pictures",
    image: require("../../assets/images/printer.jpg"),
    features: [
      "Prints documents on paper",
      "Can print in color or black and white",
      "Makes copies of pictures",
      "Can scan documents too"
    ],
    quiz: [
      {
        question: "What does a printer do?",
        options: [
          "Makes paper copies",
          "Plays music",
          "Takes pictures",
          "Makes phone calls"
        ],
        correctAnswer: 0,
        type: 'multiple_choice'
      }
    ]
  },
  {
    id: "speakers",
    name: "Speakers",
    description: "Play sound and music from the computer",
    image: require("../../assets/images/speaker.jpg"),
    features: [
      "Plays music and sounds",
      "Can be loud or quiet",
      "Helps us hear videos",
      "Can be turned on and off"
    ],
    quiz: [
      {
        question: "What do speakers do?",
        options: [
          "Play sound and music",
          "Print documents",
          "Take pictures",
          "Type words"
        ],
        correctAnswer: 0,
        type: 'multiple_choice'
      }
    ]
  },
  {
    id: "webcam",
    name: "Webcam",
    description: "Takes pictures and videos for video calls",
    image: require("../../assets/images/webcam.jpg"),
    features: [
      "Takes pictures and videos",
      "Helps us see people on video calls",
      "Can be turned on and off",
      "Usually sits on top of the monitor"
    ],
    quiz: [
      {
        question: "What does a webcam help us do?",
        options: [
          "See people on video calls",
          "Print documents",
          "Play music",
          "Type words"
        ],
        correctAnswer: 0,
        type: 'multiple_choice'
      }
    ]
  },
  {
    id: "microphone",
    name: "Microphone",
    description: "Records sound and voice for the computer",
    image: require("../../assets/images/microphone.jpg"),
    features: [
      "Records our voice",
      "Helps us talk on video calls",
      "Can be turned on and off",
      "Can be built into the computer"
    ],
    quiz: [
      {
        question: "What does a microphone do?",
        options: [
          "Records our voice",
          "Plays music",
          "Prints documents",
          "Shows pictures"
        ],
        correctAnswer: 0,
        type: 'multiple_choice'
      }
    ]
  },
  {
    id: "usb_drive",
    name: "USB Drive",
    description: "A small device that stores and carries our files",
    image: require("../../assets/images/usb drive.jpg"),
    features: [
      "Stores our files",
      "Can be carried around",
      "Plugs into the computer",
      "Can be used on different computers"
    ],
    quiz: [
      {
        question: "What can we do with a USB drive?",
        options: [
          "Store and carry our files",
          "Play music",
          "Take pictures",
          "Print documents"
        ],
        correctAnswer: 0,
        type: 'multiple_choice'
      }
    ]
  },
  {
    id: "headphones",
    name: "Headphones",
    description: "Wear these to hear sound without disturbing others",
    image: require("../../assets/images/headphone.jpg"),
    features: [
      "Plays sound only we can hear",
      "Can be comfortable to wear",
      "Has volume control",
      "Can be wireless or connected"
    ],
    quiz: [
      {
        question: "What are headphones for?",
        options: [
          "Hearing sound privately",
          "Taking pictures",
          "Printing documents",
          "Typing words"
        ],
        correctAnswer: 0,
        type: 'multiple_choice'
      }
    ]
  }
];

const ComputerScreen = ({ navigateTo }: ContentScreenProps) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isTextToSpeech, setIsTextToSpeech] = useState(true);
  const [points, setPoints] = useState(0);
  const [currentPart, setCurrentPart] = useState<ComputerPart | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_lesson",
      title: "First Lesson",
      description: "Complete your first computer part lesson",
      points: 50,
      isUnlocked: false,
      icon: "🎓"
    },
    {
      id: "quiz_master",
      title: "Quiz Master",
      description: "Complete all quizzes correctly",
      points: 100,
      isUnlocked: false,
      icon: "🏆"
    },
    {
      id: "computer_expert",
      title: "Computer Expert",
      description: "Learn about all computer parts",
      points: 200,
      isUnlocked: false,
      icon: "🌟"
    }
  ]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ image: string; name: string }[]>([]);
  const [remainingPairs, setRemainingPairs] = useState<{ image: string; name: string }[]>([]);

  const speak = (text: string) => {
    if (isTextToSpeech) {
      Speech.speak(text, {
        language: 'en',
        pitch: 0.8,
        rate: 0.8,
      });
    }
  };

  const handlePartPress = (part: ComputerPart) => {
    speak(`Let's learn about the ${part.name}!`);
    navigateTo("PartDetailsScreen", { part }); 
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (currentPart && currentPart.quiz[currentQuiz].correctAnswer === answerIndex) {
      speak("Correct! Well done!");
      Vibration.vibrate([0, 100, 100, 100]);
      setPoints(prev => prev + 20);
      
      if (currentQuiz < currentPart.quiz.length - 1) {
        setCurrentQuiz(prev => prev + 1);
      } else {
        setShowQuiz(false);
        checkAchievements();
      }
    } else {
      speak("That's not quite right. Let's try again!");
      Vibration.vibrate([0, 500, 200, 500]);
    }
  };

  const handleMatchingSelection = (image: string, name: string) => {
    if (!selectedImage && !selectedName) {
      setSelectedImage(image);
      speak("Now select the matching name");
    } else if (selectedImage && !selectedName) {
      if (image === selectedImage) {
        setSelectedName(name);
        const newPair = { image: selectedImage, name };
        setMatchedPairs(prev => [...prev, newPair]);
        setRemainingPairs(prev => prev.filter(pair => pair.image !== selectedImage));
        setSelectedImage(null);
        setSelectedName(null);
        speak("Correct match! Well done!");
        Vibration.vibrate([0, 100, 100, 100]);
        
        if (remainingPairs.length === 1) {
          speak("Great job! You've completed the matching exercise!");
          setPoints(prev => prev + 30);
          setShowQuiz(false);
          checkAchievements();
        }
      } else {
        speak("That's not the right match. Try again!");
        Vibration.vibrate([0, 500, 200, 500]);
      }
    } else if (!selectedImage && selectedName) {
      if (name === selectedName) {
        setSelectedImage(image);
        const newPair = { image, name: selectedName };
        setMatchedPairs(prev => [...prev, newPair]);
        setRemainingPairs(prev => prev.filter(pair => pair.name !== selectedName));
        setSelectedImage(null);
        setSelectedName(null);
        speak("Correct match! Well done!");
        Vibration.vibrate([0, 100, 100, 100]);
        
        if (remainingPairs.length === 1) {
          speak("Great job! You've completed the matching exercise!");
          setPoints(prev => prev + 30);
          setShowQuiz(false);
          checkAchievements();
        }
      } else {
        speak("That's not the right match. Try again!");
        Vibration.vibrate([0, 500, 200, 500]);
      }
    }
  };

  const checkAchievements = () => {
    const newAchievements = achievements.map(achievement => {
      if (!achievement.isUnlocked) {
        switch (achievement.id) {
          case "first_lesson":
            if (points >= 50) {
              achievement.isUnlocked = true;
              speak(`Achievement unlocked: ${achievement.title}!`);
            }
            break;
          case "quiz_master":
            if (points >= 100) {
              achievement.isUnlocked = true;
              speak(`Achievement unlocked: ${achievement.title}!`);
            }
            break;
          case "computer_expert":
            if (points >= 200) {
              achievement.isUnlocked = true;
              speak(`Achievement unlocked: ${achievement.title}!`);
            }
            break;
        }
      }
      return achievement;
    });
    setAchievements(newAchievements);
  };

  const renderMatchingQuiz = () => {
    if (!currentPart || !currentPart.quiz[currentQuiz].matchingPairs) return null;

    const currentQuizData = currentPart.quiz[currentQuiz];
    const allPairs = currentQuizData.matchingPairs || [];
    const remainingImages = remainingPairs.map(pair => pair.image);
    const remainingNames = remainingPairs.map(pair => pair.name);

    return (
      <View style={styles.matchingContainer}>
        <Text style={[styles.quizQuestion, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
          {currentQuizData.question}
        </Text>
        
        <View style={styles.matchingGrid}>
          <View style={styles.matchingColumn}>
            <Text style={[styles.matchingTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              Images
            </Text>
            {remainingImages.map((image, index) => (
              <TouchableOpacity
                key={`image-${index}`}
                style={[
                  styles.matchingItem,
                  { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" },
                  selectedImage === image && styles.selectedItem
                ]}
                onPress={() => handleMatchingSelection(image, "")}
              >
                <Text style={[styles.matchingText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
                  {image}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.matchingColumn}>
            <Text style={[styles.matchingTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              Names
            </Text>
            {remainingNames.map((name, index) => (
              <TouchableOpacity
                key={`name-${index}`}
                style={[
                  styles.matchingItem,
                  { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" },
                  selectedName === name && styles.selectedItem
                ]}
                onPress={() => handleMatchingSelection("", name)}
              >
                <Text style={[styles.matchingText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {matchedPairs.length > 0 && (
          <View style={styles.matchedPairsContainer}>
            <Text style={[styles.matchingTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              Matched Pairs:
            </Text>
            {matchedPairs.map((pair, index) => (
              <View key={index} style={styles.matchedPair}>
                <Text style={[styles.matchingText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
                  {pair.image} - {pair.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderQuiz = () => {
    if (!currentPart) return null;

    const currentQuizData = currentPart.quiz[currentQuiz];
    
    if (currentQuizData.type === 'matching') {
      return renderMatchingQuiz();
    }

    return (
      <View style={styles.quizContainer}>
        <Text style={[styles.quizQuestion, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
          {currentQuizData.question}
        </Text>
        {currentQuizData.options.map((option, index) => (
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

  const renderPartDetails = () => {
    if (!currentPart) return null;

    return (
      <View style={styles.detailsContainer}>
        <Image
          source={currentPart.image}
          style={styles.detailImage}
          resizeMode="contain"
        />
        <Text style={[styles.partTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
          {currentPart.name}
        </Text>
        <Text style={[styles.partDescription, { color: isHighContrast ? "#FFFFFF" : "#666" }]}>
          {currentPart.description}
        </Text>
        
        <Text style={[styles.featuresTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
          Features:
        </Text>
        {currentPart.features.map((feature, index) => (
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
              speak("Let's take a quiz about " + currentPart.name);
            }}
          >
            <Text style={styles.quizButtonText}>Take Quiz</Text>
          </TouchableOpacity>
        ) : (
          renderQuiz()
        )}

        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
          onPress={() => {
            setCurrentPart(null);
            setShowQuiz(false);
            setCurrentQuiz(0);
            speak("Back to computer parts");
          }}
        >
          <Text style={[styles.backButtonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
            Back to Parts
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMainScreen = () => (
    <View style={styles.mainContainer}>
      <View style={styles.pointsContainer}>
        <Text style={[styles.pointsText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
          ⭐ {points}
        </Text>
      </View>

      <Text style={[styles.title, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
        Learn About Computer Parts
      </Text>

      <View style={styles.partsGrid}>
        {computerParts.map((part) => (
          <TouchableOpacity
            key={part.id}
            style={[styles.partCard, { backgroundColor: isHighContrast ? "#333333" : "#FFFFFF" }]}
            onPress={() => handlePartPress(part)}
          >
            <Image
              source={part.image}
              style={styles.partImage}
              resizeMode="contain"
            />
            <Text style={[styles.partName, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              {part.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.settingsContainer}>
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
            High Contrast Mode
          </Text>
          <Switch
            value={isHighContrast}
            onValueChange={setIsHighContrast}
            accessibilityLabel="Toggle high contrast mode"
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
            Text to Speech
          </Text>
          <Switch
            value={isTextToSpeech}
            onValueChange={setIsTextToSpeech}
            accessibilityLabel="Toggle text to speech"
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {currentPart ? renderPartDetails() : renderMainScreen()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6EDF3",
  },
  mainContainer: {
    padding: 20,
    alignItems: "center",
  },
  pointsContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pointsText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    marginTop: 60,
  },
  partsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    marginBottom: 30,
  },
  partCard: {
    width: 160,
    height: 160,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  partImage: {
    width: 150,
    height: 120,
    marginBottom: 10,
  },
  partName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  settingsContainer: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    gap: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  detailsContainer: {
    padding: 20,
    alignItems: "center",
  },
  partTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  partDescription: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
    alignSelf: "stretch",
  },
  feature: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "left",
    alignSelf: "stretch",
  },
  quizButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 200,
    alignItems: "center",
  },
  quizButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  quizContainer: {
    width: "100%",
    maxWidth: 300,
    marginTop: 20,
    gap: 15,
  },
  quizQuestion: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  quizOption: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  quizOptionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 200,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  matchingContainer: {
    width: "100%",
    maxWidth: 300,
    marginTop: 20,
    gap: 15,
  },
  matchingGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  matchingColumn: {
    flex: 1,
    gap: 10,
  },
  matchingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  matchingItem: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  selectedItem: {
    backgroundColor: "#2196F3",
  },
  matchingText: {
    fontSize: 24,
    textAlign: "center",
  },
  matchedPairsContainer: {
    marginTop: 20,
    gap: 10,
  },
  matchedPair: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
  },
  detailImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default ComputerScreen;
