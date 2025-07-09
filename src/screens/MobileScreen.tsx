import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AccessibilityInfo,
  Vibration,
  Alert,
  Switch,
  ScrollView,
  useColorScheme,
  TextInput,
} from "react-native";
import { Audio } from "expo-av";
import * as Speech from 'expo-speech';

type Screen = 'main' | 'dialpad' | 'messages' | 'learning' | 'emergency' | 'achievements' | 'sos';

interface EmergencyContact {
  name: string;
  number: string;
  type: 'police' | 'ambulance' | 'fire' | 'custom';
  icon: string;
  description?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  isUnlocked: boolean;
  icon: string;
}

const MobileScreen = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isTextToSpeech, setIsTextToSpeech] = useState(true);
  const [points, setPoints] = useState(0);
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [dialedNumber, setDialedNumber] = useState('');
  const [messageText, setMessageText] = useState('');
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { 
      name: "Police", 
      number: "911", 
      type: "police", 
      icon: "👮",
      description: "For emergencies requiring law enforcement"
    },
    { 
      name: "Ambulance", 
      number: "911", 
      type: "ambulance", 
      icon: "🚑",
      description: "For medical emergencies"
    },
    { 
      name: "Fire Department", 
      number: "911", 
      type: "fire", 
      icon: "🚒",
      description: "For fire emergencies"
    },
  ]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({});
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_call",
      title: "First Call",
      description: "Make your first phone call",
      points: 50,
      isUnlocked: false,
      icon: "📞"
    },
    {
      id: "emergency_ready",
      title: "Emergency Ready",
      description: "Learn how to use emergency contacts",
      points: 100,
      isUnlocked: false,
      icon: "🚨"
    },
    {
      id: "message_master",
      title: "Message Master",
      description: "Send your first text message",
      points: 75,
      isUnlocked: false,
      icon: "💬"
    },
    {
      id: "tutorial_complete",
      title: "Learning Champion",
      description: "Complete all tutorials",
      points: 200,
      isUnlocked: false,
      icon: "🏆"
    },
    {
      id: "custom_contact",
      title: "Contact Creator",
      description: "Add your first custom emergency contact",
      points: 50,
      isUnlocked: false,
      icon: "📱"
    },
    {
      id: "emergency_expert",
      title: "Emergency Expert",
      description: "Learn about all emergency services",
      points: 150,
      isUnlocked: false,
      icon: "🎓"
    },
    {
      id: "interactive_learner",
      title: "Interactive Learner",
      description: "Complete all interactive learning exercises",
      points: 100,
      isUnlocked: false,
      icon: "🎯"
    }
  ]);
  const colorScheme = useColorScheme();
  const [editingContact, setEditingContact] = useState<number | null>(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showScenarioFeedback, setShowScenarioFeedback] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [currentLearningStep, setCurrentLearningStep] = useState(0);

  const learningSteps = [
    {
      title: "Unlocking Your Phone",
      description: "Let's learn how to unlock your phone!",
      action: () => speak("Let's learn how to unlock your phone!"),
      task: () => (
        <View style={styles.unlockTask}>
          <Text style={[styles.taskText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
            Swipe up to unlock
          </Text>
          <TouchableOpacity
            style={[styles.swipeButton, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
            onPress={() => {
              setShowPinInput(true);
              speak("Enter your PIN to unlock");
            }}
          >
            <Text style={[styles.swipeButtonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              Swipe Up
            </Text>
          </TouchableOpacity>
        </View>
      )
    },
    {
      title: "Making a Call",
      description: "Now let's learn how to make a phone call!",
      action: () => speak("Now let's learn how to make a phone call!"),
      task: () => (
        <View style={styles.callTask}>
          <Text style={[styles.taskText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
            Tap the Dial Number button
          </Text>
          <TouchableOpacity
            style={[styles.taskButton, { backgroundColor: isHighContrast ? "#0000FF" : "#2196F3" }]}
            onPress={() => {
              setCurrentScreen('dialpad');
              speak("Great! Now you can dial a number");
            }}
          >
            <Text style={styles.taskButtonText}>Dial Number</Text>
          </TouchableOpacity>
        </View>
      )
    },
    {
      title: "Sending Messages",
      description: "Let's learn how to send text messages!",
      action: () => speak("Let's learn how to send text messages!"),
      task: () => (
        <View style={styles.messageTask}>
          <Text style={[styles.taskText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
            Tap the Send Message button
          </Text>
          <TouchableOpacity
            style={[styles.taskButton, { backgroundColor: isHighContrast ? "#FFFF00" : "#FFC107" }]}
            onPress={() => {
              setCurrentScreen('messages');
              speak("Great! Now you can type and send a message");
            }}
          >
            <Text style={[styles.taskButtonText, { color: "#000" }]}>Send Message</Text>
          </TouchableOpacity>
        </View>
      )
    },
    {
      title: "Emergency Services",
      description: "Important! Learn how to use emergency services!",
      action: () => speak("Important! Learn how to use emergency services!"),
      task: () => (
        <View style={styles.emergencyTask}>
          <Text style={[styles.taskText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
            Tap the Emergency SOS button
          </Text>
          <TouchableOpacity
            style={[styles.taskButton, { backgroundColor: isHighContrast ? "#FF0000" : "#FF0000" }]}
            onPress={() => {
              setCurrentScreen('sos');
              speak("Great! Now you can access emergency services");
            }}
          >
            <Text style={styles.taskButtonText}>Emergency SOS</Text>
          </TouchableOpacity>
        </View>
      )
    }
  ];

  const tutorialSteps = [
    {
      title: "Welcome!",
      description: "Let's learn how to use your phone!",
      action: () => speak("Welcome! Let's learn how to use your phone!")
    },
    {
      title: "Making a Call",
      description: "First, let's learn how to make a call. Tap the 'Dial Number' button.",
      action: () => speak("First, let's learn how to make a call. Tap the 'Dial Number' button.")
    },
    {
      title: "Receiving Calls",
      description: "Now, let's learn how to receive calls. Tap the 'Receive Call' button.",
      action: () => speak("Now, let's learn how to receive calls. Tap the 'Receive Call' button.")
    },
    {
      title: "Emergency SOS",
      description: "Important! Learn how to use the Emergency SOS button.",
      action: () => speak("Important! Learn how to use the Emergency SOS button.")
    },
    {
      title: "Text Messages",
      description: "Let's learn how to send text messages. Tap the 'Send Message' button.",
      action: () => speak("Let's learn how to send text messages. Tap the 'Send Message' button.")
    },
    {
      title: "Emergency Services",
      description: "Learn about different emergency services and when to use them.",
      action: () => speak("Let's learn about different emergency services and when to use them.")
    },
    {
      title: "Custom Contacts",
      description: "Learn how to add your own emergency contacts.",
      action: () => speak("Now, let's learn how to add your own emergency contacts.")
    }
  ];

  const interactiveExercises = [
    {
      title: "Emergency Scenarios",
      description: "Practice what to do in different emergency situations",
      scenarios: [
        {
          question: "What should you do if you see a fire?",
          options: [
            { text: "Call Fire Department (911)", correct: true },
            { text: "Try to put it out yourself", correct: false },
            { text: "Wait for someone else to call", correct: false }
          ],
          explanation: "Always call emergency services first. Never try to put out a fire yourself unless it's very small and you know how."
        },
        {
          question: "When should you call an ambulance?",
          options: [
            { text: "For serious injuries or medical emergencies", correct: true },
            { text: "For a small cut", correct: false },
            { text: "When you're bored", correct: false }
          ],
          explanation: "Call an ambulance for serious injuries, chest pain, difficulty breathing, or other life-threatening conditions."
        },
        {
          question: "What should you do if you see someone breaking into a house?",
          options: [
            { text: "Call Police (911)", correct: true },
            { text: "Confront the person", correct: false },
            { text: "Ignore it", correct: false }
          ],
          explanation: "Always call the police for suspicious activity. Never confront potential criminals yourself."
        },
        {
          question: "When should you call emergency services?",
          options: [
            { text: "When someone is unconscious", correct: true },
            { text: "When you need directions", correct: false },
            { text: "When you're late for work", correct: false }
          ],
          explanation: "Call emergency services for life-threatening situations like unconsciousness, severe injuries, or medical emergencies."
        }
      ]
    }
  ];

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const speak = (text: string) => {
    if (isTextToSpeech) {
      Speech.speak(text, {
        language: 'en',
        pitch: 0.8,
        rate: 0.8,
      });
    }
  };

  const checkAchievements = () => {
    const newAchievements = achievements.map(achievement => {
      if (!achievement.isUnlocked) {
        switch (achievement.id) {
          case "first_call":
            if (points >= 50) {
              achievement.isUnlocked = true;
              speak(`Achievement unlocked: ${achievement.title}!`);
            }
            break;
          case "emergency_ready":
            if (emergencyContacts.length > 3) {
              achievement.isUnlocked = true;
              speak(`Achievement unlocked: ${achievement.title}!`);
            }
            break;
          case "message_master":
            if (points >= 75) {
              achievement.isUnlocked = true;
              speak(`Achievement unlocked: ${achievement.title}!`);
            }
            break;
          case "tutorial_complete":
            if (currentTutorialStep === tutorialSteps.length - 1) {
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

  useEffect(() => {
    checkAchievements();
  }, [points, currentTutorialStep, emergencyContacts]);

  const handleEmergencyCall = (contact: EmergencyContact) => {
    Vibration.vibrate([0, 500, 200, 500]);
    speak(`Calling ${contact.name}`);
    Alert.alert(
      `Calling ${contact.name}`,
      `Are you sure you want to call ${contact.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Call",
          onPress: () => {
            speak(`Connecting to ${contact.name}`);
            setPoints(prev => prev + 20);
          }
        }
      ]
    );
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.number) {
      const contact: EmergencyContact = {
        name: newContact.name,
        number: newContact.number,
        type: 'custom',
        icon: newContact.icon || "👤",
        description: newContact.description
      };
      setEmergencyContacts(prev => [...prev, contact]);
      setIsAddingContact(false);
      setNewContact({});
      speak("New emergency contact added!");
      setPoints(prev => prev + 25);
    }
  };

  const handleEditContact = (index: number) => {
    setEditingContact(index);
    setNewContact(emergencyContacts[index]);
  };

  const handleDeleteContact = (index: number) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this emergency contact?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            setEmergencyContacts(prev => prev.filter((_, i) => i !== index));
            speak("Emergency contact deleted");
          }
        }
      ]
    );
  };

  const handleUpdateContact = () => {
    if (editingContact !== null && newContact.name && newContact.number) {
      const updatedContacts = [...emergencyContacts];
      updatedContacts[editingContact] = {
        ...updatedContacts[editingContact],
        name: newContact.name,
        number: newContact.number,
        description: newContact.description
      };
      setEmergencyContacts(updatedContacts);
      setEditingContact(null);
      setNewContact({});
      speak("Emergency contact updated!");
    }
  };

  const handleScenarioAnswer = (isCorrect: boolean) => {
    setShowScenarioFeedback(true);
    if (isCorrect) {
      speak("Correct! Well done!");
      setPoints(prev => prev + 20);
      setCompletedScenarios(prev => [...prev, currentScenario]);
    } else {
      speak("That's not quite right. Let's try another scenario.");
    }
  };

  const renderAddContactForm = () => (
    <View style={styles.addContactForm}>
      <Text style={[styles.formTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
        Add New Emergency Contact
      </Text>
      <TextInput
        style={[styles.formInput, { 
          backgroundColor: isHighContrast ? "#333333" : "#FFFFFF",
          color: isHighContrast ? "#FFFFFF" : "#333"
        }]}
        placeholder="Contact Name"
        placeholderTextColor={isHighContrast ? "#999999" : "#666666"}
        value={newContact.name}
        onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
      />
      <TextInput
        style={[styles.formInput, { 
          backgroundColor: isHighContrast ? "#333333" : "#FFFFFF",
          color: isHighContrast ? "#FFFFFF" : "#333"
        }]}
        placeholder="Phone Number"
        placeholderTextColor={isHighContrast ? "#999999" : "#666666"}
        value={newContact.number}
        onChangeText={(text) => setNewContact(prev => ({ ...prev, number: text }))}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[styles.formInput, { 
          backgroundColor: isHighContrast ? "#333333" : "#FFFFFF",
          color: isHighContrast ? "#FFFFFF" : "#333"
        }]}
        placeholder="Description (optional)"
        placeholderTextColor={isHighContrast ? "#999999" : "#666666"}
        value={newContact.description}
        onChangeText={(text) => setNewContact(prev => ({ ...prev, description: text }))}
        multiline
      />
      <View style={styles.formButtons}>
        <TouchableOpacity
          style={[styles.formButton, { backgroundColor: isHighContrast ? "#FF0000" : "#f44336" }]}
          onPress={() => setIsAddingContact(false)}
        >
          <Text style={styles.formButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.formButton, { backgroundColor: isHighContrast ? "#00FF00" : "#4CAF50" }]}
          onPress={handleAddContact}
        >
          <Text style={styles.formButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmergencyContacts = () => (
    <View style={styles.emergencyContainer}>
      <Text style={[styles.emergencyTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
        Emergency Contacts
      </Text>
      {emergencyContacts.map((contact, index) => (
        <View key={index} style={styles.emergencyContactCard}>
          <TouchableOpacity
            style={[styles.emergencyButton, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
            onPress={() => handleEmergencyCall(contact)}
          >
            <View style={styles.emergencyContactInfo}>
              <Text style={[styles.emergencyButtonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
                {contact.icon} {contact.name}
              </Text>
              {contact.description && (
                <Text style={[styles.emergencyDescription, { color: isHighContrast ? "#FFFFFF" : "#666" }]}>
                  {contact.description}
                </Text>
              )}
            </View>
            <Text style={[styles.emergencyNumber, { color: isHighContrast ? "#FFFFFF" : "#666" }]}>
              {contact.number}
            </Text>
          </TouchableOpacity>
          {contact.type === 'custom' && (
            <View style={styles.contactActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: isHighContrast ? "#0000FF" : "#2196F3" }]}
                onPress={() => handleEditContact(index)}
              >
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: isHighContrast ? "#FF0000" : "#f44336" }]}
                onPress={() => handleDeleteContact(index)}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      <TouchableOpacity
        style={[styles.addContactButton, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
        onPress={() => setIsAddingContact(true)}
      >
        <Text style={[styles.addContactButtonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
          + Add New Contact
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsContainer}>
      <Text style={[styles.achievementsTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
        Your Achievements
      </Text>
      {achievements.map((achievement, index) => (
        <View
          key={index}
          style={[
            styles.achievementItem,
            { backgroundColor: isHighContrast ? "#333333" : "#FFFFFF" }
          ]}
        >
          <Text style={[styles.achievementIcon, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
            {achievement.icon}
          </Text>
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              {achievement.title}
            </Text>
            <Text style={[styles.achievementDescription, { color: isHighContrast ? "#FFFFFF" : "#666" }]}>
              {achievement.description}
            </Text>
          </View>
          <Text style={[styles.achievementPoints, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
            {achievement.points} ⭐
          </Text>
        </View>
      ))}
    </View>
  );

  const playSound = async (soundType: 'ringtone' | 'dialtone' | 'connected' | 'ended') => {
    try {
      console.log(`Playing sound: ${soundType}`);
      Vibration.vibrate([0, 100, 100, 100]);
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  const handleReceiveCall = async () => {
    Vibration.vibrate([0, 500, 200, 500]);
    await playSound('ringtone');
    speak("Someone is calling you! Would you like to answer?");
    
    Alert.alert(
      "Incoming Call",
      "Someone is calling you! Would you like to answer?",
      [
        {
          text: "Answer",
          onPress: () => {
            setIsCallActive(true);
            playSound('connected');
            speak("Call connected!");
            setPoints(prev => prev + 10);
          },
        },
        {
          text: "Decline",
          onPress: () => {
            playSound('ended');
            speak("Call declined");
          },
        },
      ]
    );
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    playSound('ended');
    speak("Call ended");
    setPoints(prev => prev + 5);
  };

  const handleDialNumber = () => {
    playSound('dialtone');
    speak("Dialing a number");
    setPoints(prev => prev + 5);
  };

  const handleSOS = () => {
    Vibration.vibrate([0, 500, 200, 500, 200, 500]);
    speak("Emergency SOS activated! Help is on the way!");
    Alert.alert(
      "Emergency SOS",
      "Help is on the way! Stay calm and wait for assistance.",
      [{ text: "OK", onPress: () => {} }]
    );
  };

  const handleVoiceMessage = () => {
    speak("Starting voice message recording");
    setPoints(prev => prev + 15);
  };

  const handleNumberPress = (num: string) => {
    setDialedNumber(prev => prev + num);
    speak(num);
    Vibration.vibrate([0, 50]);
  };

  const handleDeleteNumber = () => {
    setDialedNumber(prev => prev.slice(0, -1));
    speak("Delete");
    Vibration.vibrate([0, 50]);
  };

  const handleCall = () => {
    if (dialedNumber.length > 0) {
      speak(`Calling ${dialedNumber}`);
      setPoints(prev => prev + 10);
      setDialedNumber('');
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      speak("Message sent!");
      setPoints(prev => prev + 10);
      setMessageText('');
    }
  };

  const renderScenarioFeedback = () => (
    <View style={styles.scenarioFeedback}>
      <Text style={[styles.feedbackText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
        {interactiveExercises[0].scenarios[currentScenario].explanation}
      </Text>
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
        onPress={() => {
          setShowScenarioFeedback(false);
          if (currentScenario < interactiveExercises[0].scenarios.length - 1) {
            setCurrentScenario(prev => prev + 1);
          }
        }}
      >
        <Text style={[styles.nextButtonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
          Next Scenario
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDialPad = () => (
    <View style={styles.dialPadContainer}>
      <Text style={[styles.dialedNumber, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
        {dialedNumber || "Enter number"}
      </Text>
      <View style={styles.dialPadGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dialPadButton, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
            onPress={() => handleNumberPress(num.toString())}
            accessibilityLabel={`Dial ${num}`}
          >
            <Text style={[styles.dialPadButtonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.dialPadActions}>
        <TouchableOpacity
          style={[styles.dialPadActionButton, { backgroundColor: isHighContrast ? "#FF0000" : "#f44336" }]}
          onPress={handleDeleteNumber}
        >
          <Text style={styles.dialPadActionButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dialPadActionButton, { backgroundColor: isHighContrast ? "#00FF00" : "#4CAF50" }]}
          onPress={handleCall}
        >
          <Text style={styles.dialPadActionButtonText}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMessages = () => (
    <View style={styles.messagesContainer}>
      <TextInput
        style={[styles.messageInput, { 
          backgroundColor: isHighContrast ? "#333333" : "#FFFFFF",
          color: isHighContrast ? "#FFFFFF" : "#333"
        }]}
        value={messageText}
        onChangeText={setMessageText}
        placeholder="Type your message..."
        placeholderTextColor={isHighContrast ? "#999999" : "#666666"}
        multiline
      />
      <TouchableOpacity
        style={[styles.sendButton, { backgroundColor: isHighContrast ? "#00FF00" : "#4CAF50" }]}
        onPress={handleSendMessage}
      >
        <Text style={styles.sendButtonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSOSScreen = () => (
    <View style={styles.sosContainer}>
      <Text style={[styles.sosTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
        Emergency Services
      </Text>
      <View style={styles.sosButtons}>
        <TouchableOpacity
          style={[styles.emergencySosButton, { backgroundColor: isHighContrast ? "#0000FF" : "#2196F3" }]}
          onPress={() => handleEmergencyCall(emergencyContacts[0])}
        >
          <Text style={styles.sosButtonText}>👮 Police</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.emergencySosButton, { backgroundColor: isHighContrast ? "#FF0000" : "#f44336" }]}
          onPress={() => handleEmergencyCall(emergencyContacts[1])}
        >
          <Text style={styles.sosButtonText}>🚑 Ambulance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.emergencySosButton, { backgroundColor: isHighContrast ? "#FFA500" : "#FF9800" }]}
          onPress={() => handleEmergencyCall(emergencyContacts[2])}
        >
          <Text style={styles.sosButtonText}>�� Fire Brigade</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.addEmergencyButton, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
        onPress={() => setIsAddingContact(true)}
      >
        <Text style={[styles.addEmergencyButtonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
          + Add Emergency Contact
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLearningMode = () => (
    <View style={styles.learningContainer}>
      <Text style={[styles.learningTitle, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
        {learningSteps[currentLearningStep].title}
      </Text>
      <Text style={[styles.learningDescription, { color: isHighContrast ? "#FFFFFF" : "#666" }]}>
        {learningSteps[currentLearningStep].description}
      </Text>
      {learningSteps[currentLearningStep].task()}
      <View style={styles.learningNavigation}>
        <TouchableOpacity
          style={[styles.learningButton, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
          onPress={() => {
            if (currentLearningStep > 0) {
              setCurrentLearningStep(prev => prev - 1);
              learningSteps[currentLearningStep - 1].action();
            }
          }}
          disabled={currentLearningStep === 0}
        >
          <Text style={[styles.learningButtonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
            Previous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.learningButton, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
          onPress={() => {
            if (currentLearningStep < learningSteps.length - 1) {
              setCurrentLearningStep(prev => prev + 1);
              learningSteps[currentLearningStep + 1].action();
            }
          }}
          disabled={currentLearningStep === learningSteps.length - 1}
        >
          <Text style={[styles.learningButtonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMainScreen = () => (
    <>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>⭐ {points}</Text>
      </View>
      
      <Text style={styles.title}>Phone Learning</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.receiveButton]}
          onPress={handleReceiveCall}
          accessibilityLabel="Receive call button"
          accessibilityHint="Double tap to simulate receiving a phone call"
        >
          <Text style={styles.buttonText}>📞 Receive Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dialButton]}
          onPress={() => setCurrentScreen('dialpad')}
          accessibilityLabel="Dial number button"
          accessibilityHint="Double tap to open dial pad"
        >
          <Text style={styles.buttonText}>🔢 Dial Number</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.voiceMessageButton]}
          onPress={() => setCurrentScreen('messages')}
          accessibilityLabel="Send message button"
          accessibilityHint="Double tap to open messages"
        >
          <Text style={styles.buttonText}>💬 Send Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.sosButton]}
          onPress={() => setCurrentScreen('sos')}
          accessibilityLabel="Emergency SOS button"
          accessibilityHint="Double tap to access emergency services"
        >
          <Text style={styles.buttonText}>🚨 Emergency SOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isHighContrast ? "#0000FF" : "#2196F3" }]}
          onPress={() => setCurrentScreen('learning')}
          accessibilityLabel="Learning mode button"
          accessibilityHint="Double tap to start learning mode"
        >
          <Text style={styles.buttonText}>📚 Learning Mode</Text>
        </TouchableOpacity>

        {isCallActive && (
          <TouchableOpacity
            style={[styles.button, styles.endCallButton]}
            onPress={handleEndCall}
            accessibilityLabel="End call button"
            accessibilityHint="Double tap to end the current call"
          >
            <Text style={styles.buttonText}>❌ End Call</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.settingsContainer}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>High Contrast Mode</Text>
          <Switch
            value={isHighContrast}
            onValueChange={setIsHighContrast}
            accessibilityLabel="Toggle high contrast mode"
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Text to Speech</Text>
          <Switch
            value={isTextToSpeech}
            onValueChange={setIsTextToSpeech}
            accessibilityLabel="Toggle text to speech"
          />
        </View>
      </View>

      <Text style={styles.instructions}>
        {isCallActive
          ? "Call is active! Tap 'End Call' to hang up"
          : "Tap 'Receive Call' to simulate an incoming call"}
      </Text>
    </>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isHighContrast ? "#000000" : "#f5f5f5",
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 30,
      color: isHighContrast ? "#FFFFFF" : "#333",
      textAlign: "center",
    },
    buttonContainer: {
      width: "100%",
      maxWidth: 300,
      gap: 20,
    },
    button: {
      padding: 25,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      minHeight: 80,
    },
    receiveButton: {
      backgroundColor: isHighContrast ? "#00FF00" : "#4CAF50",
    },
    dialButton: {
      backgroundColor: isHighContrast ? "#0000FF" : "#2196F3",
    },
    endCallButton: {
      backgroundColor: isHighContrast ? "#FF0000" : "#f44336",
    },
    sosButton: {
      backgroundColor: isHighContrast ? "#FF0000" : "#FF0000",
    },
    voiceMessageButton: {
      backgroundColor: isHighContrast ? "#FFFF00" : "#FFC107",
    },
    buttonText: {
      color: isHighContrast ? "#000000" : "white",
      fontSize: 22,
      fontWeight: "bold",
    },
    instructions: {
      marginTop: 30,
      fontSize: 18,
      color: isHighContrast ? "#FFFFFF" : "#666",
      textAlign: "center",
    },
    settingsContainer: {
      width: "100%",
      maxWidth: 300,
      marginTop: 20,
      padding: 15,
      backgroundColor: isHighContrast ? "#333333" : "#FFFFFF",
      borderRadius: 10,
      gap: 15,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    settingText: {
      fontSize: 18,
      color: isHighContrast ? "#FFFFFF" : "#333",
    },
    pointsContainer: {
      position: "absolute",
      top: 20,
      right: 20,
      backgroundColor: isHighContrast ? "#FFFFFF" : "#FFD700",
      padding: 10,
      borderRadius: 20,
    },
    pointsText: {
      fontSize: 20,
      fontWeight: "bold",
      color: isHighContrast ? "#000000" : "#333",
    },
    // Dial Pad Styles
    dialPadContainer: {
      width: "100%",
      maxWidth: 300,
      alignItems: "center",
    },
    dialedNumber: {
      fontSize: 32,
      marginBottom: 20,
      textAlign: "center",
    },
    dialPadGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 10,
    },
    dialPadButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
    },
    dialPadButtonText: {
      fontSize: 24,
      fontWeight: "bold",
    },
    dialPadActions: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginTop: 20,
    },
    dialPadActionButton: {
      padding: 15,
      borderRadius: 10,
      minWidth: 100,
      alignItems: "center",
    },
    dialPadActionButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    // Messages Styles
    messagesContainer: {
      width: "100%",
      maxWidth: 300,
      gap: 20,
    },
    messageInput: {
      height: 100,
      padding: 15,
      borderRadius: 10,
      fontSize: 18,
    },
    sendButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },
    sendButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    // Learning Mode Styles
    learningContainer: {
      width: "100%",
      maxWidth: 300,
      alignItems: "center",
      gap: 20,
    },
    learningTitle: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
    },
    learningDescription: {
      fontSize: 18,
      textAlign: "center",
      marginBottom: 20,
    },
    learningNavigation: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      gap: 20,
    },
    learningButton: {
      flex: 1,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },
    learningButtonText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    // Emergency Contacts Styles
    emergencyContainer: {
      width: "100%",
      maxWidth: 300,
      gap: 15,
    },
    emergencyTitle: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },
    emergencyButton: {
      padding: 20,
      borderRadius: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    emergencyButtonText: {
      fontSize: 20,
      fontWeight: "bold",
    },
    emergencyNumber: {
      fontSize: 18,
    },
    
    // Achievements Styles
    achievementsContainer: {
      width: "100%",
      maxWidth: 300,
      gap: 15,
    },
    achievementsTitle: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },
    achievementItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      borderRadius: 10,
      gap: 15,
    },
    achievementIcon: {
      fontSize: 24,
    },
    achievementInfo: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    achievementDescription: {
      fontSize: 14,
    },
    achievementPoints: {
      fontSize: 16,
      fontWeight: "bold",
    },
    // Add Contact Form Styles
    addContactForm: {
      width: "100%",
      maxWidth: 300,
      gap: 15,
      padding: 20,
      backgroundColor: isHighContrast ? "#333333" : "#FFFFFF",
      borderRadius: 10,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
    },
    formInput: {
      padding: 15,
      borderRadius: 8,
      fontSize: 16,
    },
    formButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    formButton: {
      flex: 1,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    formButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    
    // Enhanced Emergency Contact Styles
    emergencyContactInfo: {
      flex: 1,
    },
    emergencyDescription: {
      fontSize: 14,
      marginTop: 4,
    },
    addContactButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
    },
    addContactButtonText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    // Scenario Feedback Styles
    scenarioFeedback: {
      width: "100%",
      maxWidth: 300,
      gap: 15,
      padding: 20,
      backgroundColor: isHighContrast ? "#333333" : "#FFFFFF",
      borderRadius: 10,
    },
    feedbackText: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 10,
    },
    nextButton: {
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    nextButtonText: {
      fontSize: 16,
      fontWeight: "bold",
    },
    
    // Contact Card Styles
    emergencyContactCard: {
      marginBottom: 10,
    },
    contactActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 10,
      marginTop: 5,
    },
    actionButton: {
      padding: 8,
      borderRadius: 5,
      minWidth: 60,
      alignItems: "center",
    },
    actionButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
    },
    // SOS Screen Styles
    sosContainer: {
      width: "100%",
      maxWidth: 300,
      gap: 20,
      alignItems: "center",
    },
    sosTitle: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },
    sosButtons: {
      width: "100%",
      gap: 15,
    },
    emergencySosButton: {
      padding: 25,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    sosButtonText: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
    },
    addEmergencyButton: {
      width: "100%",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
    },
    addEmergencyButtonText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    
    // Learning Mode Task Styles
    unlockTask: {
      width: "100%",
      alignItems: "center",
      gap: 20,
    },
    callTask: {
      width: "100%",
      alignItems: "center",
      gap: 20,
    },
    messageTask: {
      width: "100%",
      alignItems: "center",
      gap: 20,
    },
    emergencyTask: {
      width: "100%",
      alignItems: "center",
      gap: 20,
    },
    taskText: {
      fontSize: 18,
      textAlign: "center",
      marginBottom: 10,
    },
    swipeButton: {
      width: "100%",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    swipeButtonText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    taskButton: {
      width: "100%",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    taskButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {currentScreen === 'main' && renderMainScreen()}
      {currentScreen === 'dialpad' && (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
            onPress={() => setCurrentScreen('main')}
          >
            <Text style={[styles.buttonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              Back to Main
            </Text>
          </TouchableOpacity>
          {renderDialPad()}
        </>
      )}
      {currentScreen === 'messages' && (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
            onPress={() => setCurrentScreen('main')}
          >
            <Text style={[styles.buttonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              Back to Main
            </Text>
          </TouchableOpacity>
          {renderMessages()}
        </>
      )}
      {currentScreen === 'learning' && (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
            onPress={() => setCurrentScreen('main')}
          >
            <Text style={[styles.buttonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              Back to Main
            </Text>
          </TouchableOpacity>
          {renderLearningMode()}
        </>
      )}
      {currentScreen === 'emergency' && (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
            onPress={() => setCurrentScreen('main')}
          >
            <Text style={[styles.buttonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              Back to Main
            </Text>
          </TouchableOpacity>
          {renderEmergencyContacts()}
        </>
      )}
      {currentScreen === 'achievements' && (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
            onPress={() => setCurrentScreen('main')}
          >
            <Text style={[styles.buttonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              Back to Main
            </Text>
          </TouchableOpacity>
          {renderAchievements()}
        </>
      )}
      {currentScreen === 'sos' && (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isHighContrast ? "#333333" : "#E0E0E0" }]}
            onPress={() => setCurrentScreen('main')}
          >
            <Text style={[styles.buttonText, { color: isHighContrast ? "#FFFFFF" : "#333" }]}>
              Back to Main
            </Text>
          </TouchableOpacity>
          {renderSOSScreen()}
        </>
      )}
    </ScrollView>
  );
};

export default MobileScreen;
