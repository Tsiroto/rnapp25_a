import { StyleSheet, Image, Text, Animated, Easing, Platform, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { useAudio } from '@/utils/useAudio';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomeScreen() {
  // Initialize audio hook with opening track but don't play it automatically
  // We'll rely on the root layout to play the opening song
  const { play, playEffect, isMuted, toggleMute, saveSettings } = useAudio('opening', false);

  const handlePress = async () => {
    // Play the confirm sound effect for the tap/click action
    await playEffect('confirm');

    // Navigate to game screen
    router.push('/gameScreen');
  };

  const handleToggleMute = () => {
    // Toggle the mute state using the toggleMute function from useAudio
    toggleMute();
    // Save the settings to local storage
    saveSettings();
    // Play a click sound effect when toggling (only when unmuting)
    if (isMuted) {
      playEffect('click');
    }
  };

  // Animation values
  const titleOpacityAnim = useRef(new Animated.Value(0)).current; // Title opacity
  const bottomTextOpacityAnim = useRef(new Animated.Value(0.8)).current; // Bottom text opacity (start at 0.8 to ensure it's always visible)
  const bottomTextScaleAnim = useRef(new Animated.Value(1)).current; // Bottom text scale

  // Determine text based on platform
  const startText = Platform.OS === 'web' ? "Click to start!" : "Tap to start!";

  useEffect(() => {
    // Fade in the title to full opacity and keep it stable
    Animated.timing(titleOpacityAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      // After title fade-in is complete, start the bottom text animation
      if (finished) {
        // Start the bottom text animation directly with pulsing
        // Since we're starting with opacity 0.8, we can go directly to the pulsing animation
        Animated.timing(bottomTextOpacityAnim, {
          toValue: 1, // Go to maximum pulsing opacity
          duration: 1000,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            // Pulsing animation for bottom text (scale and opacity)
            // Ensure the animation never stops and never fades out completely
            Animated.loop(
              Animated.sequence([
                Animated.parallel([
                  Animated.timing(bottomTextScaleAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                  }),
                  Animated.timing(bottomTextOpacityAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                  }),
                ]),
                Animated.parallel([
                  Animated.timing(bottomTextScaleAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                  }),
                  Animated.timing(bottomTextOpacityAnim, {
                    toValue: 0.8, // Minimum opacity to ensure it never fades out completely
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                  }),
                ]),
              ])
            ).start(({ finished }) => {
              // If the animation somehow finishes, restart it to ensure continuous pulsing
              if (finished) {
                bottomTextOpacityAnim.setValue(0.8); // Reset to minimum opacity
                bottomTextScaleAnim.setValue(1); // Reset to minimum scale

                // Restart the loop
                Animated.loop(
                  Animated.sequence([
                    Animated.parallel([
                      Animated.timing(bottomTextScaleAnim, {
                        toValue: 1.1,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                      }),
                      Animated.timing(bottomTextOpacityAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                      }),
                    ]),
                    Animated.parallel([
                      Animated.timing(bottomTextScaleAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                      }),
                      Animated.timing(bottomTextOpacityAnim, {
                        toValue: 0.8, // Minimum opacity to ensure it never fades out completely
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                      }),
                    ]),
                  ])
                ).start();
              }
            });
          }
        });
      }
    });
  }, []);

  return (
    <TouchableOpacity 
      style={{ flex: 1 }} 
      activeOpacity={0.8} 
      onPress={handlePress}
    >
      <SafeAreaView style={styles.container}>
        <Image 
          source={
            Platform.OS === 'web'
              ? require('../../assets/images/gataros.png')
              : require('../../assets/images/gata.png')
          }
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.titleContainer}>
          <Animated.Text 
            style={[
              styles.title,
              {
                opacity: titleOpacityAnim,
              }
            ]}
          >
            Loli-cat
          </Animated.Text>
        </View>
        <View style={styles.bottomTextContainer}>
          <Animated.Text 
            style={[
              styles.bottomText,
              {
                transform: [{ scale: bottomTextScaleAnim }],
                opacity: bottomTextOpacityAnim,
              }
            ]}
          >
            {startText}
          </Animated.Text>
        </View>

        {/* Mute/Unmute Button */}
        <TouchableOpacity 
          style={styles.muteButton}
          onPress={handleToggleMute}
          activeOpacity={0.7}
        >
          <FontAwesome 
            name={isMuted ? "volume-off" : "volume-up"} 
            size={24} 
            color="#ffffff" 
          />
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    position: 'absolute',
    top: '25%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  muteButton: {
    position: 'absolute',
    bottom: 20, // Position above the navigation
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Ensure it's above other elements
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
