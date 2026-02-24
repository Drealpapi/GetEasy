# 🎯 Quick Reference Guide

## Start the App
```bash
npx expo start --clear --offline
```

## Color System (Import from constants)
```typescript
import { COLORS, SPACING, FONT_SIZE } from '../../utils/constants';
```

### Most Used Colors
```typescript
COLORS.PRIMARY          // Emerald green buttons
COLORS.BACKGROUND       // White screen background
COLORS.SURFACE          // Light gray areas
COLORS.CARD             // White cards
COLORS.TEXT_PRIMARY     // Dark text
COLORS.TEXT_SECONDARY   // Gray text
COLORS.TEXT_LIGHT       // White text (on buttons)
COLORS.BORDER           // Light borders
COLORS.ERROR            // Red for errors
COLORS.SUCCESS          // Green for success
```

### Spacing
```typescript
SPACING.xs   // 4px
SPACING.sm   // 8px
SPACING.md   // 16px  ← Most common
SPACING.lg   // 24px
SPACING.xl   // 32px
SPACING.xxl  // 48px
```

### Font Sizes
```typescript
FONT_SIZE.xs   // 12px
FONT_SIZE.sm   // 14px
FONT_SIZE.md   // 16px  ← Body text
FONT_SIZE.lg   // 18px
FONT_SIZE.xl   // 24px  ← Titles
FONT_SIZE.xxl  // 32px  ← Big titles
```

## Common Patterns

### Screen Container
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});
```

### Card
```typescript
card: {
  backgroundColor: COLORS.CARD,
  borderRadius: 12,
  padding: SPACING.md,
  marginBottom: SPACING.md,
  borderWidth: 1,
  borderColor: COLORS.BORDER,
  shadowColor: COLORS.SHADOW,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}
```

### Button
```typescript
button: {
  backgroundColor: COLORS.PRIMARY,
  paddingVertical: SPACING.md,
  paddingHorizontal: SPACING.xl,
  borderRadius: 8,
  alignItems: 'center',
}
buttonText: {
  color: COLORS.TEXT_LIGHT,
  fontSize: FONT_SIZE.md,
  fontWeight: '600',
}
```

### Input
```typescript
input: {
  backgroundColor: COLORS.INPUT_BACKGROUND,
  borderWidth: 1,
  borderColor: COLORS.INPUT_BORDER,
  borderRadius: 8,
  padding: SPACING.md,
  fontSize: FONT_SIZE.md,
  color: COLORS.TEXT_PRIMARY,
}
```

### Title
```typescript
title: {
  fontSize: FONT_SIZE.xl,
  fontWeight: 'bold',
  color: COLORS.TEXT_PRIMARY,
  marginBottom: SPACING.md,
}
```

## App Structure

```
App
 └─ ThemeProvider
     └─ AuthProvider
         └─ NavigationContainer
             └─ AppNavigator
                 ├─ AuthNavigator (not logged in)
                 ├─ UserNavigator (user logged in)
                 └─ ProviderNavigator (provider logged in)
```

## Demo Auth

Any email/password works:
```typescript
import { useAuth } from '../../context/AuthContext';

const { currentUser, loginUser, logout } = useAuth();

// Login
await loginUser('any@email.com', 'anypassword');

// Check user
if (currentUser?.role === 'user') { ... }
if (currentUser?.role === 'provider') { ... }

// Logout
await logout();
```

## Navigation

### User Tabs
- Home (🏠) - Browse services
- Bookings (📅) - My bookings
- Search (🔍) - Location search
- Profile (👤) - User profile

### Provider Tabs
- Dashboard (📊) - Overview
- Bookings (📅) - Appointments
- Services (🛠️) - Manage services
- Earnings (💰) - Revenue
- Profile (👤) - Provider profile

## Troubleshooting

### Network Error
```bash
npx expo start --clear --offline
```

### Cache Issues
```bash
# Clear everything
rmdir /s /q node_modules\.cache
rmdir /s /q .expo
npm cache clean --force
npm install
npx expo start --clear
```

### Color Not Found
Make sure you import from constants:
```typescript
import { COLORS } from '../../utils/constants';
```

## Status

✅ App fully functional  
✅ 25+ colors available  
✅ Navigation working  
✅ Demo auth working  
✅ No errors  

**Ready to use!** 🎉
