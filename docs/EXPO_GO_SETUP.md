# Expo Go Setup Guide

## Quick Start

Your GetEasy app is now configured to work with Expo Go! Follow these steps:

### 1. Install Dependencies

```bash
npm install
```

### 2. Clear Cache (Important!)

```bash
npx expo start -c
```

This clears the Metro bundler cache and ensures all changes are applied.

### 3. Install Expo Go on Your Device

- **iOS**: Download from the App Store
- **Android**: Download from Google Play Store

### 4. Start the Development Server

```bash
npm start
```

Or use specific platforms:
```bash
npm run android  # For Android
npm run ios      # For iOS
```

### 5. Scan QR Code

- **iOS**: Use the Camera app to scan the QR code
- **Android**: Use the Expo Go app to scan the QR code

## What Was Fixed

### 1. Babel Configuration
- Added `react-native-reanimated/plugin` to support animations in Expo Go

### 2. Package Entry Point
- Changed from `index.js` to `node_modules/expo/AppEntry.js` for proper Expo Go compatibility

### 3. Dependencies
- Aligned all package versions with Expo SDK 54
- Added `react-native-gesture-handler` for navigation gestures
- Removed `react-native-worklets-core` (not needed with Expo Go)

### 4. App Configuration
- Added proper icon and splash screen references
- Configured expo-av plugin for video playback
- Set `userInterfaceStyle` to "automatic" for theme support

### 5. Gesture Handler
- Added `react-native-gesture-handler` import at the top of App.tsx and index.js

## Troubleshooting

### App Won't Load
1. Clear cache: `npx expo start -c`
2. Delete node_modules: `rm -rf node_modules && npm install`
3. Restart Expo Go app on your device

### Video Splash Screen Issues
- The splash video should work in Expo Go
- If it doesn't load, the app has a 7-second fallback timer
- Check that `assets/splash.mp4` exists

### Navigation Issues
- Make sure you're using the latest version of Expo Go
- Try restarting the development server

### Theme Not Persisting
- AsyncStorage is properly configured
- Theme preferences are saved automatically

## Testing Checklist

- [ ] App loads in Expo Go
- [ ] Splash screen displays (video or fallback)
- [ ] Navigation works between screens
- [ ] Theme toggle works
- [ ] Login/Registration flows work (Demo Mode - any credentials)
- [ ] User mode works with mock data
- [ ] Provider mode works with mock data
- [ ] Bottom tab navigation works
- [ ] Services display correctly
- [ ] Booking flow works

## Demo Mode

The app is currently running in **Demo Mode** with mock authentication:
- Login with **any email and password** (e.g., demo@test.com / 123456)
- User login → Logs in as "John Smith" (demo user)
- Provider login → Logs in as "Tom Electric" (demo provider)
- All data is mock data stored in memory

See `DEMO_MODE_INFO.md` for detailed demo mode instructions.

## Development Tips

1. **Hot Reload**: Shake your device to open the developer menu
2. **Debug**: Enable Remote JS Debugging from the developer menu
3. **Performance**: Use the Performance Monitor to check FPS
4. **Network**: Check network requests in the developer menu

## Next Steps

1. Test all screens in Expo Go
2. Verify user flows (login, booking, etc.)
3. Test on both iOS and Android if possible
4. Check theme switching in different scenarios
5. Test with poor network conditions

## Building for Production

When ready to build standalone apps:

```bash
# For iOS
eas build --platform ios

# For Android
eas build --platform android
```

Note: You'll need to set up EAS (Expo Application Services) for production builds.
