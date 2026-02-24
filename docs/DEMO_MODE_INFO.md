# Demo Mode - Authentication Guide

Your GetEasy app is now running in **Demo Mode** with mock authentication since the backend isn't available yet.

## How to Login

### User Login
1. Go to "Login as User"
2. Enter **any email** (e.g., demo@user.com)
3. Enter **any password** (e.g., 123456)
4. Click "Login"

You'll be logged in as: **John Smith** (Demo User)

### Provider Login
1. Go to "Login as Provider"
2. Enter **any email** (e.g., demo@provider.com)
3. Enter **any password** (e.g., 123456)
4. Click "Login"

You'll be logged in as: **Tom Electric** (Demo Provider)

## Demo Features

### As a User (John Smith):
- Browse services across different states
- View service details and provider profiles
- Book appointments with providers
- View your booking history
- Leave reviews for completed services
- Manage your profile

### As a Provider (Tom Electric):
- View your dashboard with stats
- Manage your services (add, edit, delete)
- View and manage appointment requests
- Accept or decline bookings
- View your earnings
- See customer reviews

## Mock Data Available

- **5 Demo Users**: John Smith, Sarah Johnson, Michael Brown, Emily Davis, David Wilson
- **5 Demo Providers**: Tom Electric, Lisa Plumbing, Mark Clean, Anna Tutor, Carlos Mechanic
- **10 Services**: Across categories like Electricians, Plumbers, Cleaners, Tutors, Mechanics
- **7 Bookings**: In various states (Pending, Accepted, Completed)
- **2 Reviews**: Sample reviews for completed services

## Registration

Registration also works in demo mode:
- Fill out the registration form with any valid email format
- Accept the terms and conditions
- You'll be automatically logged in as the demo user/provider

## Important Notes

1. **No Real Backend**: All data is stored in memory and will reset when you restart the app
2. **Any Credentials Work**: Email/password validation is minimal in demo mode
3. **Instant Login**: No actual authentication happens - you're immediately logged in
4. **Mock Data**: All services, bookings, and reviews are pre-populated mock data
5. **State-Based**: Services are filtered by state (California, Texas, Florida, New York, Illinois)

## When Backend is Ready

To switch from demo mode to real backend:
1. Update `src/context/AuthContext.tsx` to call real API endpoints
2. Replace mock data calls with actual API calls in `src/services/api/`
3. Add proper error handling and validation
4. Implement real authentication tokens (JWT, etc.)

## Testing Scenarios

### Test User Flow:
1. Login as user
2. Browse services in different states
3. Book a service
4. View booking status
5. Leave a review after completion

### Test Provider Flow:
1. Login as provider
2. View dashboard statistics
3. Add a new service
4. Accept/decline booking requests
5. View earnings breakdown

Enjoy testing the app! 🚀
