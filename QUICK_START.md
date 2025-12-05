# GetEasy - Quick Start

## ✅ Setup Complete

Your app is now configured and ready to run!

## 🚀 Start the App

```bash
npm start
```

Then:
1. Scan the QR code with **Expo Go** app on your phone
2. The app will load and show the login screen

## 📱 Demo Login

The app has mock authentication:

- **Login as User** → See user dashboard
- **Login as Provider** → See provider dashboard

## 🎯 What's Working

- ✅ SDK 54 (compatible with your Expo Go)
- ✅ Mock authentication system
- ✅ Role-based navigation
- ✅ Mock data (services, bookings, reviews)
- ✅ TypeScript support
- ✅ Emerald green theme

## 📂 Project Structure

```
src/
├── context/DemoAuthContext.tsx    # Mock auth
├── navigation/                     # App routing
├── screens/                        # All screens
├── services/mock/mockData.ts      # Mock data & CRUD
├── types/                          # TypeScript types
└── utils/                          # Constants & helpers
```

## 🎨 Theme Colors

- Primary: `#0a8a60` (Emerald Green)
- Dark: `#076644` (Emerald Dark)

## 📝 Next Steps

Build out your screens:
1. User screens (Home, Booking, Profile, Reviews)
2. Provider screens (Dashboard, Services, Earnings, Reviews)
3. Components (ServiceCard, BookingCard, etc.)

All mock data is in `src/services/mock/mockData.ts` - ready to use!
