import { useEffect, useState, useCallback, useRef } from 'react';
import { Howl } from 'howler';

export type EffectSound = 'click' | 'confirm' | 'cancel';
export type MusicTrack = 'shukusei' | 'opening' | string;

const effects: Record<EffectSound, string> = {
  click: '/sounds/interface/toggle_003.mp3',
  confirm: '/sounds/interface/confirmation_002.mp3',
  cancel: '/sounds/interface/glass_001.mp3',
};

const musicTracks: Record<string, string> = {
  shukusei: '/sounds/music/shukusei.mp3',
  opening: '/sounds/music/opening.mp3',
};

export function useAudio(initialTrack?: MusicTrack) {
  const [isMuted, setIsMuted] = useState(false);
  const [effectsVolume, setEffectsVolume] = useState(100);
  const [masterVolume, setMasterVolume] = useState(100);
  const currentMusic = useRef<Howl | null>(null);

  // Play initial track if provided
  useEffect(() => {
    if (initialTrack) {
      const trackPath = musicTracks[initialTrack] || initialTrack;
      const vol = isMuted ? 0 : (masterVolume / 100);
      const music = new Howl({
        src: [trackPath],
        volume: vol,
        loop: true,
      });

      music.play();
      currentMusic.current = music;
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm') setIsMuted((prev) => !prev);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Update music volume when settings change
  useEffect(() => {
    if (currentMusic.current) {
      const vol = isMuted ? 0 : (masterVolume / 100);
      currentMusic.current.volume(vol);
    }
  }, [isMuted, masterVolume]);

  const playEffect = useCallback(
      (effect: EffectSound) => {
        const vol = isMuted ? 0 : (effectsVolume / 100) * (masterVolume / 100);
        const sound = new Howl({ src: [effects[effect]], volume: vol });
        sound.play();
      },
      [isMuted, effectsVolume, masterVolume]
  );

  const play = useCallback((track: MusicTrack) => {
    // Stop current music if any
    if (currentMusic.current) {
      currentMusic.current.stop();
    }

    // Get track path
    const trackPath = musicTracks[track] || track;

    // Create and play new track
    const vol = isMuted ? 0 : (masterVolume / 100);
    const music = new Howl({
      src: [trackPath],
      volume: vol,
      loop: true,
    });

    music.play();
    currentMusic.current = music;
  }, [isMuted, masterVolume]);

  const stop = useCallback(() => {
    if (currentMusic.current) {
      currentMusic.current.stop();
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
    saveSettings: () => {}, // optional no-op or localStorage
  };
}
