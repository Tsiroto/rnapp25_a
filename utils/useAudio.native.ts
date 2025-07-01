import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

Sound.setCategory('Playback');

export type EffectSound = 'click' | 'confirm' | 'cancel';
export type MusicTrack = 'shukusei' | 'opening' | string;

const effects: Record<EffectSound, any> = {
  click: require('../assets/sounds/interface/toggle_003.mp3'),
  confirm: require('../assets/sounds/interface/confirmation_002.mp3'),
  cancel: require('../assets/sounds/interface/glass_001.mp3'),
};

const musicTracks: Record<string, any> = {
  shukusei: require('../assets/sounds/music/shukusei.mp3'),
  opening: require('../assets/sounds/music/opening.mp3'),
};

const STORAGE_KEYS = {
  isMuted: '@audio_isMuted',
  effectsVolume: '@audio_effectsVolume',
  masterVolume: '@audio_masterVolume',
};

export function useAudio(initialTrack?: MusicTrack) {
  const [isMuted, setIsMuted] = useState(false);
  const [effectsVolume, setEffectsVolume] = useState(100);
  const [masterVolume, setMasterVolume] = useState(100);
  const currentMusic = useRef<Sound | null>(null);

  // Load settings from storage
  useEffect(() => {
    (async () => {
      const muted = await AsyncStorage.getItem(STORAGE_KEYS.isMuted);
      const fxVol = await AsyncStorage.getItem(STORAGE_KEYS.effectsVolume);
      const masterVol = await AsyncStorage.getItem(STORAGE_KEYS.masterVolume);
      if (muted !== null) setIsMuted(JSON.parse(muted));
      if (fxVol !== null) setEffectsVolume(Number(fxVol));
      if (masterVol !== null) setMasterVolume(Number(masterVol));
    })();
  }, []);

  // Play initial track if provided
  useEffect(() => {
    if (initialTrack) {
      const trackResource = musicTracks[initialTrack] || initialTrack;
      const sound = new Sound(trackResource, Sound.MAIN_BUNDLE, (error) => {
        if (!error) {
          const vol = isMuted ? 0 : (masterVolume / 100);
          sound.setVolume(vol);
          sound.setNumberOfLoops(-1); // Loop indefinitely
          sound.play();
          currentMusic.current = sound;
        } else {
          console.error('Failed to load initial music track:', error);
        }
      });
    }
  }, []);

  useEffect(() => {
    void AsyncStorage.setItem(STORAGE_KEYS.isMuted, JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    void AsyncStorage.setItem(STORAGE_KEYS.effectsVolume, String(effectsVolume));
  }, [effectsVolume]);

  useEffect(() => {
    void AsyncStorage.setItem(STORAGE_KEYS.masterVolume, String(masterVolume));
  }, [masterVolume]);

  // Update music volume when settings change
  useEffect(() => {
    if (currentMusic.current) {
      const vol = isMuted ? 0 : (masterVolume / 100);
      currentMusic.current.setVolume(vol);
    }
  }, [isMuted, masterVolume]);

  const playEffect = useCallback(
      (effect: EffectSound) => {
        const vol = isMuted ? 0 : (effectsVolume / 100) * (masterVolume / 100);
        const sound = new Sound(effects[effect], Sound.MAIN_BUNDLE, (error) => {
          if (!error) {
            sound.setVolume(vol);
            sound.play(() => sound.release());
          } else {
            console.error('Failed to play sound:', error);
          }
        });
      },
      [isMuted, effectsVolume, masterVolume]
  );

  const play = useCallback((track: MusicTrack) => {
    // Stop current music if any
    if (currentMusic.current) {
      currentMusic.current.stop();
      currentMusic.current.release();
      currentMusic.current = null;
    }

    // Get track resource
    const trackResource = musicTracks[track] || track;

    // Create and play new track
    const sound = new Sound(trackResource, Sound.MAIN_BUNDLE, (error) => {
      if (!error) {
        const vol = isMuted ? 0 : (masterVolume / 100);
        sound.setVolume(vol);
        sound.setNumberOfLoops(-1); // Loop indefinitely
        sound.play();
        currentMusic.current = sound;
      } else {
        console.error('Failed to load music track:', error);
      }
    });
  }, [isMuted, masterVolume]);

  const stop = useCallback(() => {
    if (currentMusic.current) {
      currentMusic.current.stop();
      currentMusic.current.release();
      currentMusic.current = null;
    }
  }, []);

  return {
    isMuted,
    setIsMuted,
    toggleMute: () => setIsMuted((prev) => !prev),
    effectsVolume,
    setEffectsVolume,
    masterVolume,
    setMasterVolume,
    playEffect,
    play,
    stop,
    saveSettings: async () => {
      await AsyncStorage.setItem(STORAGE_KEYS.isMuted, JSON.stringify(isMuted));
      await AsyncStorage.setItem(STORAGE_KEYS.effectsVolume, String(effectsVolume));
      await AsyncStorage.setItem(STORAGE_KEYS.masterVolume, String(masterVolume));
    },
  };
}
