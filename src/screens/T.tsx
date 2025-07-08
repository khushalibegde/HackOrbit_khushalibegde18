import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Vibration,
  Dimensions,
} from 'react-native';
import * as Speech from 'expo-speech';
import LottieView from 'lottie-react-native';
import { Easing } from 'react-native';

import moveCar from '../../assets/animations/walk.json';
import slowCar from '../../assets/animations/slow.json';
import stopCar from '../../assets/animations/stop.json';

const screenWidth = Dimensions.get('window').width;

const lottieSources = {
  move: moveCar,
  slow: slowCar,
  stop: stopCar,
};
const bgColors = {
  move: '#d4fcdc',
  slow: '#fff5cc',
  stop: '#ffd6d6',
};


const signals = [
  { color: 'green', action: 'Go', animation: 'move', size: 90, mirror: false },
  { color: 'yellow', action: 'Slow', animation: 'slow', size: 120, mirror: true },
  { color: 'red', action: 'Stop', animation: 'stop', size: 70, mirror: false },
];

const lottieSizeConfig = {
  move: { width: 100, height: 100 },
  slow: { width: 80, height: 80 },
  stop: { width: 150, height: 100 },
};

const SignalButton = ({ type, label, onPress, size = 100, mirror = false }) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef(null);

  useEffect(() => {
    lottieRef.current?.play();

    let animation;

    if (type === 'stop') {
      animation = Animated.timing(animValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      });
    } else if (type === 'slow') {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 260,
            duration: 4800,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    } else {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 260,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    }

    animation.start();

    return () => {
      animation?.stop();
      lottieRef.current?.reset();
    };
  }, [type]);

  return (
    <TouchableOpacity
  onPress={onPress}
  style={[styles.carButton, { backgroundColor: bgColors[type] }]}
>

      <Animated.View style={{ transform: [{ translateX: animValue }] }}>
        <LottieView
  ref={lottieRef}
  source={lottieSources[type]}
  style={{
    width: lottieSizeConfig[type].width,
    height: lottieSizeConfig[type].height,
    transform: type === 'slow' ? [{ scaleX: -1 }] : [],
  }}
  loop
  autoPlay
/>


      </Animated.View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};


const TrafficSignalGame = () => {
  const [currentSignal, setCurrentSignal] = useState(signals[0]);
  const [signalIndex, setSignalIndex] = useState(0);
  const emojiCarAnim = useRef(new Animated.Value(0)).current;
  const emojiOpacity = useRef(new Animated.Value(1)).current;

  const carAnimations = {
    move: () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(emojiCarAnim, {
            toValue: 300,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(emojiOpacity, {
            toValue: 0,
            duration: 300,
            delay: 1300,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(emojiCarAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(emojiOpacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();
    },
    slow: () => {
      Animated.sequence([
        Animated.timing(emojiCarAnim, {
          toValue: 300,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(emojiOpacity, {
          toValue: 0,
          duration: 300,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.timing(emojiCarAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(emojiOpacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();
    },
    stop: () => {
      Animated.timing(emojiCarAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    },
  };


  const handleSignalChange = () => {
  const randomIndex = Math.floor(Math.random() * signals.length);
  const signal = signals[randomIndex];
  setCurrentSignal(signal);

  // Custom voice prompt based on the random signal
  const prompt = {
    green: 'Now it is green. What should the car do?',
    yellow: 'Yellow signal! What will you do?',
    red: 'Signal is red. What should the car do?',
  };

  Speech.speak(prompt[signal.color]);
};



  const handleSelection = (selectedSignal) => {
  if (selectedSignal.action === currentSignal.action) {
    // Custom response based on the color
    const response = {
      green: 'Correct! The car should go at the green signal.',
      yellow: 'Correct! The car should slow down at the yellow signal.',
      red: 'Correct! The car should stop at the red signal.',
    };
    Speech.stop();
    Speech.speak(response[currentSignal.color]);
    Vibration.vibrate(100);
    carAnimations[selectedSignal.animation]();
  } else {
    Speech.stop();
    Speech.speak('Oops! Try again.');
    Vibration.vibrate(400);
  }

  setTimeout(handleSignalChange, 2000);
};


  useEffect(() => {
    handleSignalChange();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚦 Traffic Signal Game</Text>

      <View style={styles.trafficLight}>
        {['red', 'yellow', 'green'].map((color, index) => {
          const brightColors = {
            red: '#ff3b30',
            yellow: '#ffcc00',
            green: '#4cd964',
          };
          return (
            <View
              key={index}
              style={[
                styles.light,
                {
                  backgroundColor: brightColors[color],
                  opacity: currentSignal.color === color ? 1 : 0.3,
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.verticalButtons}>
  {signals.map((sig, idx) => (
    <SignalButton
      key={idx}
      type={sig.animation}
      label={sig.action}
      size={sig.size}
      mirror={sig.mirror}
      onPress={() => handleSelection(sig)}
    />
  ))}
</View>


      <Animated.View
        style={[
          styles.emojiCar,
          {
            transform: [{ translateX: emojiCarAnim }, { scaleX: -1 }],
            opacity: emojiOpacity,
          },
        ]}
      >
        <Text style={styles.carText}>🚗</Text>
      </Animated.View>
    </View>
  );
};

export default TrafficSignalGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  trafficLight: {
    width: 60,
    height: 180,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
  },
  light: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#999',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  verticalButtons: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 20,
    marginBottom: 60,
  },
  carButton: {
    alignItems: 'flex-start',
    width: screenWidth - 40,
    height: 100,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    justifyContent: 'center',
    elevation: 3,
    paddingLeft: 20,
  },
  label: {
    marginTop: -30,
    marginLeft: screenWidth / 2 - 30,
    fontSize: 16,
  },
  emojiCar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  carText: {
    fontSize: 50,
  },
});
