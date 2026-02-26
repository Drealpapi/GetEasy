# GetEasy - Service Booking Platform

A modern React Native mobile application for booking services, built with Expo.

## Project Structure

This project follows a **feature-based architecture** for better scalability and maintainability.

```
src/
├── features/              # Feature modules (self-contained)
│   ├── auth/             # Authentication & authorization
│   ├── user/             # User-facing features
│   ├── provider/         # Service provider features
│   └── booking/          # Booking management
├── shared/               # Shared across all features
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Common React hooks
│   ├── utils/           # Helper functions
│   └── constants/       # App-wide constants
├── core/                # Core app functionality
│   ├── navigation/      # Navigation setup
│   ├── services/        # API & data services
│   └── types/          # Global TypeScript types
└── config/             # App configuration
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on device)

### Installation

```bash
npm install
```

### Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Clear cache and start
npm run start:clear
```

## Features

- **User Features**
  - Browse and search services
  - Book appointments
  - Manage bookings
  - Leave reviews
  - Location-based search

- **Provider Features**
  - Dashboard with analytics
  - Manage services
  - View appointments
  - Track earnings
  - Respond to reviews

- **Authentication**
  - Role-based login (User/Provider)
  - Registration flows
  - Demo mode for testing

## Tech Stack

- React Native 0.81.5
- Expo ~54.0
- React Navigation 7.x
- TypeScript
- React Context API for state management

## Documentation

- [Restructure Guide](docs/RESTRUCTURE_GUIDE.md) - Details about the new architecture
- [Quick Start](docs/QUICK_START.md) - Getting started guide
- [Expo Setup](docs/EXPO_GO_SETUP.md) - Expo Go configuration

## Development

The project uses a feature-based architecture where each feature is self-contained with its own:
- Components
- Screens
- Context/State
- Hooks
- Types (if feature-specific)

Shared code is explicitly separated in the `shared/` directory, and core functionality lives in `core/`.

## License

Private
