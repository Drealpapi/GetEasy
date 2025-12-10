# Splash Video Setup Instructions

## Adding Your Video

1. **Prepare Your Video File**
   - Format: MP4 (recommended)
   - Duration: 7 seconds or less
   - Resolution: 1080x1920 (portrait) or 1920x1080 (landscape)
   - File size: Keep under 10MB for better performance

2. **Add Video to Assets**
   - Place your video file in the `assets/` folder
   - Name it `splash-video.mp4` or update the filename in the code

3. **Enable Video Splash Screen**
   - Open `App.tsx`
   - Change the import from `SplashScreenSimple` to `SplashScreen`
   - Update the component usage:
   ```tsx
   import SplashScreen from "./src/screens/SplashScreen";
   
   // In AppContent function, replace:
   <SplashScreenSimple onFinish={handleSplashFinish} />
   // with:
   <SplashScreen onFinish={handleSplashFinish} />
   ```

4. **Uncomment Video Code**
   - Open `src/screens/SplashScreen.tsx`
   - Uncomment the `<Video>` component (lines with /* */)
   - Update the source path if you used a different filename

## Current Setup

The app currently uses `SplashScreenSimple` which shows:
- Animated GetEasy logo
- Loading progress bar
- 7-second duration
- Smooth fade-in animations

## Installation Requirements

Make sure you have expo-av installed:
```bash
npx expo install expo-av
```

## Troubleshooting

- **Video not playing**: Check file format and path
- **App crashes**: Ensure expo-av is properly installed
- **Video too long**: The splash will automatically end after 7 seconds regardless of video length
- **Performance issues**: Reduce video file size or resolution

## Fallback Behavior

If the video fails to load or play:
- The app will show a fallback screen with the logo
- After 7 seconds, it will automatically proceed to the role selection screen
- No user interaction is blocked