# Audio Implementation for Game25

This project has been updated to include audio functionality as requested:

1. The opening song ("excel_saga_opening.mp3") autoplays when the app opens
2. The "Shukusei!!.mp3" sound plays when the game starts
3. The ending song ("excel_saga_ending.mp3") will play when the player loses (to be implemented later)
4. All songs are set to loop continuously

## Implementation Details

- Audio is managed through the `utils/useAudio.ts` custom React hook
- The opening song is initialized and played in `app/_layout.tsx` when the app loads
- The "shukusei" sound is triggered in `app/(tabs)/index.tsx` when the user taps to start the game
- The ending song functionality is prepared but will be implemented later when gameplay is added

## Audio Files

Current audio files:
- `/assets/sounds/music/excel_saga_opening.mp3`
- `/assets/sounds/music/excel_saga_ending.mp3`
- `/assets/sounds/music/Shukusei!!.mp3`

## Audio Hook Usage

The custom `useAudio` hook provides a simple interface for playing audio tracks:

```typescript
// Initialize with a track to play immediately
const { play, stop, unload } = useAudio('opening');

// Or initialize without playing anything
const { play } = useAudio(null as any);

// Play a specific track later
await play('shukusei');
```
