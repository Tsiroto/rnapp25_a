import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAudio } from '../utils/useAudio';

export default function GameScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const insets = useSafeAreaInsets();

  // Initialize audio hook with shukusei track
  const { play, stop, playEffect } = useAudio('shukusei');

  // Stop the track when component unmounts
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const toggleMenu = async () => {
    // Play click sound effect
    await playEffect('click');
    setMenuVisible(!menuVisible);
  };

  const handleSettings = async () => {
    // Play confirm sound effect
    await playEffect('confirm');
    setMenuVisible(false);
    router.push('/(tabs)/settings');
  };

  const handleQuit = async () => {
    // Play cancel sound effect
    await playEffect('cancel');

    // Stop the shukusei track
    await stop();

    // Add a small delay to ensure the sound has fully stopped
    await new Promise(resolve => setTimeout(resolve, 100));

    // Play the opening song
    await play('opening');

    setMenuVisible(false);
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Game content will go here */}
      <View style={styles.gameContainer}>
        <Text style={styles.gameText}>Game Screen</Text>
      </View>

      {/* Hamburger menu button */}
      <TouchableOpacity 
        style={[
          styles.menuButton,
          { top: insets.top + 10 } // Add 10 for some padding below the status bar
        ]} 
        onPress={toggleMenu}
      >
        <FontAwesome name="bars" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Menu modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <View style={[styles.menuContainer, { marginTop: insets.top + 60 }]}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleSettings}
            >
              <FontAwesome name="gear" size={20} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleQuit}
            >
              <FontAwesome name="sign-out" size={20} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>Quit</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  menuButton: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: 200,
    marginRight: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
});
