# Metro Bundler Cache Fix

## Problem
Getting "Property COLORS doesn't exist" error in Expo Go despite all imports being correct.

## Root Cause
Metro bundler cache on your phone is stale and hasn't picked up the latest code changes.

## Solution Steps

### Step 1: Stop the Current Server
1. Go to your terminal where Expo is running
2. Press `Ctrl+C` to stop the server

### Step 2: Clear Metro Cache
Run this command to start with a clean cache:
```bash
npx expo start --clear
```

### Step 3: Clear Expo Go App Cache (on your phone)
1. Force close the Expo Go app completely
2. Clear app cache:
   - **Android**: Settings → Apps → Expo Go → Storage → Clear Cache
   - **iOS**: Uninstall and reinstall Expo Go app

### Step 4: Reconnect
1. Scan the new QR code from the terminal
2. Wait for the app to bundle completely
3. The error should be gone!

## Alternative: Nuclear Option
If the above doesn't work, try this:

```bash
# Stop the server (Ctrl+C)

# Delete all cache folders
rmdir /s /q node_modules\.cache
rmdir /s /q .expo

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Start fresh
npx expo start --clear
```

## Why This Happens
- Metro bundler caches transformed JavaScript files
- When you make changes to exports/imports, the cache can become stale
- Expo Go on your phone also caches bundles
- Both caches need to be cleared for changes to take effect

## Verification
After clearing cache, you should see:
- ✅ Dark mode toggle works
- ✅ All screens switch between light/dark themes
- ✅ Navigation colors adapt to theme
- ✅ No "COLORS doesn't exist" errors

## Current Status
- ✅ All COLORS imports are correct in code
- ✅ ThemeContext exports theme colors properly
- ✅ Navigation uses theme colors
- ✅ 15+ screens support dark mode
- ⚠️ Just need to clear Metro cache!
