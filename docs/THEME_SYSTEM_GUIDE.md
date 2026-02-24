# Theme System Guide

## Overview
Your app has a complete dark/light theme system that works globally across all screens.

## How It Works

### 1. Theme Context (`src/context/ThemeContext.tsx`)
Provides theme colors and controls:
```typescript
const { colors, isDarkMode, toggleTheme } = useTheme();
```

### 2. Available Colors
```typescript
colors.PRIMARY          // Emerald green (adapts to theme)
colors.BACKGROUND       // White (light) / Dark (dark)
colors.TEXT_PRIMARY     // Black (light) / White (dark)
colors.TEXT_SECONDARY   // Gray shades
colors.CARD_BACKGROUND  // Card backgrounds
colors.BORDER           // Border colors
colors.SUCCESS          // Success green
colors.ERROR            // Error red
colors.WARNING          // Warning orange
```

### 3. Using Theme in Screens

#### Import the hook:
```typescript
import { useTheme } from '../../context/ThemeContext';
```

#### Use in component:
```typescript
export default function MyScreen() {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <Text style={[styles.text, { color: colors.TEXT_PRIMARY }]}>
        Hello World
      </Text>
    </View>
  );
}
```

#### Dynamic styles:
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
  },
});
```

### 4. Legacy COLORS (for backward compatibility)
Some screens still use static COLORS from `src/utils/constants.ts`:
```typescript
import { COLORS } from '../../utils/constants';
```

These work fine but don't support dark mode. To add dark mode support, switch to `useTheme()`.

## Screens with Dark Mode Support ✅

### User Screens:
- ✅ HomeScreen
- ✅ BookingScreen  
- ✅ AddReviewScreen
- ✅ ProfileScreen
- ✅ All Auth screens

### Provider Screens:
- ✅ DashboardScreen
- ✅ ProviderProfileScreen
- ✅ All Auth screens

### Navigation:
- ✅ UserNavigator (tab bar + headers)
- ✅ ProviderNavigator (tab bar + headers)

## Screens Without Dark Mode (still work fine)
These use static COLORS and work perfectly, just don't switch themes:
- ServiceDetailScreen
- LocationSearchScreen
- BookingFormScreen
- BookingDetailScreen
- ReviewsScreen (user & provider)
- AppointmentsScreen
- ManageServicesScreen
- EarningsScreen

## Theme Toggle
Users can toggle theme from:
- Profile screen (both user and provider)
- ThemeSettings component

## Theme Persistence
- Theme preference is saved to AsyncStorage
- Automatically loads on app restart
- Supports system theme detection

## Adding Dark Mode to a Screen

### Step 1: Import useTheme
```typescript
import { useTheme } from '../../context/ThemeContext';
```

### Step 2: Get colors
```typescript
const { colors } = useTheme();
```

### Step 3: Replace static colors
```typescript
// Before:
backgroundColor: COLORS.WHITE,
color: COLORS.BLACK,

// After:
backgroundColor: colors.BACKGROUND,
color: colors.TEXT_PRIMARY,
```

### Step 4: Remove unused COLORS import
```typescript
// Remove or update:
import { COLORS, SPACING, FONT_SIZE } from '../../utils/constants';

// To:
import { SPACING, FONT_SIZE } from '../../utils/constants';
```

## Best Practices

1. **Use theme colors for backgrounds and text**
   - `colors.BACKGROUND` for main backgrounds
   - `colors.CARD_BACKGROUND` for cards
   - `colors.TEXT_PRIMARY` for main text
   - `colors.TEXT_SECONDARY` for secondary text

2. **Keep brand colors consistent**
   - `colors.PRIMARY` (emerald green) works in both themes
   - `colors.SUCCESS`, `colors.ERROR`, `colors.WARNING` are theme-aware

3. **Test both themes**
   - Toggle theme in Profile screen
   - Check all screens look good in both modes

4. **Use SPACING and FONT_SIZE from constants**
   - These don't change with theme
   - Keep using them from `utils/constants.ts`

## Troubleshooting

### "Property COLORS doesn't exist"
- Clear Metro cache: `npx expo start --clear`
- Clear Expo Go app cache on phone
- See `METRO_CACHE_FIX.md` for details

### Theme not switching
- Make sure you're using `colors` from `useTheme()`
- Check you're not using static `COLORS` from constants
- Verify ThemeProvider wraps your app in App.tsx

### Colors look wrong
- Check you're using the right color property
- `colors.TEXT_PRIMARY` not `colors.PRIMARY` for text
- `colors.BACKGROUND` not `colors.SURFACE` for main backgrounds
