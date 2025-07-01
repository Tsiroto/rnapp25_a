# Loli-cat Game

A cross-platform game built with React Native and Expo, supporting both web and mobile platforms.

## Current Status

### Implemented Features

#### Navigation & UI
- Home screen with animated title and "Tap/Click to start" prompt
- Settings screen with collapsible sections
- Game screen placeholder with menu
- Cross-platform support (web and mobile)

#### Audio System
- Background music that plays when the app opens
- Sound effects for user interactions (confirm, click, cancel)
- Audio settings with volume controls for:
  - Master volume
  - Music volume
  - Sound effects volume
- Mute/unmute functionality (including keyboard shortcut 'm' on web)
- Persistent audio settings (saved between sessions)

#### Settings
- Fully functional audio settings
- UI placeholders for controls, account, and general settings

### Under Construction

#### Game Implementation
- The actual game mechanics and gameplay are still under development
- The game screen currently only shows a placeholder with "Game Screen" text

#### Additional Settings
- Controls settings (touch sensitivity, show controls)
- Account settings (username, email, password, logout)
- General settings (tutorial tips)

## Technical Implementation

### Audio System

Audio is implemented differently for web and native platforms:
- Web: Uses Howler.js for audio playback
- Native: Uses react-native-sound with AsyncStorage for settings persistence

The audio system is managed through the `useAudio` custom React hook:

```typescript
// Initialize with a track to play immediately
const { play, stop, playEffect } = useAudio('opening');

// Play a sound effect
await playEffect('confirm');

// Play a different track
await play('shukusei');

// Toggle mute state
toggleMute();
```

### File Structure

- `app/`: Main application code
  - `(tabs)/`: Tab-based navigation screens
  - `gameScreen.tsx`: Game implementation (placeholder)
- `assets/`: Images, sounds, and other assets
- `components/`: Reusable UI components
- `utils/`: Utility functions including audio hooks
- `constants/`: Configuration constants
