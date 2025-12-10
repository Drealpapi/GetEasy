# GetEasy Backend Development Prompt - Comprehensive Implementation Guide

## Project Overview & Context
You are building a **complete REST API backend** for **GetEasy** - a React Native mobile application that connects service customers (Users) with service providers (Providers). This is a **two-sided marketplace** similar to TaskRabbit or Thumbtack.

### Business Model
- **Users** book services from **Providers**
- **Platform takes 10% commission** from each completed booking
- **Providers** offer services in categories: Electricians, Plumbers, Cleaners, Tutors, Mechanics
- **Location-based matching** within US states
- **Review system** affects provider ratings and visibility

### Technical Context
- **Frontend**: React Native with TypeScript (Expo)
- **Authentication**: JWT-based with role separation
- **Database**: PostgreSQL (recommended) or MongoDB
- **Payment**: Stripe integration required
- **File Storage**: AWS S3 or Cloudinary for images
- **Email**: SMTP for notifications and password reset

### Key Features to Implement
1. **Dual-role authentication** (Users vs Providers)
2. **Service marketplace** with location filtering
3. **Booking management** with status workflows
4. **Payment processing** with commission handling
5. **Review and rating system**
6. **Real-time notifications**

## Core Requirements

## 1. AUTHENTICATION SYSTEM - DETAILED IMPLEMENTATION

### Authentication Architecture
Implement **JWT-based stateless authentication** with **role-based access control**. The system must handle two distinct user types with different registration flows and permissions.

### 1.1 Database Schema for Authentication

**Users Table:**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'provider')),
    state VARCHAR(50),
    avatar_url TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_state ON users(state);
```

**Provider Profiles Table (Extended data for providers):**
```sql
CREATE TABLE provider_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    description TEXT,
    service_categories TEXT[] NOT NULL, -- Array of categories
    years_experience INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10,2),
    city VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents TEXT[], -- URLs to verification docs
    business_license VARCHAR(255),
    insurance_info TEXT,
    availability_schedule JSONB, -- Store weekly schedule
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_provider_profiles_user_id ON provider_profiles(user_id);
CREATE INDEX idx_provider_profiles_categories ON provider_profiles USING GIN(service_categories);
```

### 1.2 Registration Data Structures

**User Registration Request:**

**User Registration:**
```typescript
interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  state?: string;
  acceptedTerms: boolean;
}
```

**Provider Registration:**
```typescript
interface ProviderRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  businessName: string;
  serviceCategory: string;
  state: string;
  acceptedTerms: boolean;
  acceptedProviderTerms: boolean;
}
```

### 1.3 Authentication Endpoints - Detailed Implementation

**POST /api/auth/register/user**
```javascript
// Request Body Validation
{
  "name": "string (required, 2-100 chars)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 chars)",
  "phone": "string (required, valid phone format)",
  "state": "string (optional, must be in SUPPORTED_STATES)",
  "acceptedTerms": "boolean (required, must be true)"
}

// Implementation Logic:
1. Validate all input fields
2. Check if email already exists
3. Hash password using bcrypt (salt rounds: 12)
4. Generate email verification token
5. Create user record with role='user'
6. Send verification email
7. Return JWT token + user data (without password)

// Success Response (201):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "+1234567890",
      "state": "California",
      "isEmailVerified": false,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt-token-here",
    "expiresIn": "24h"
  },
  "message": "User registered successfully. Please verify your email."
}
```

**POST /api/auth/register/provider**
```javascript
// Request Body Validation
{
  "name": "string (required, 2-100 chars)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 chars)",
  "phone": "string (required, valid phone format)",
  "businessName": "string (required, 2-200 chars)",
  "serviceCategory": "string (required, must be in SERVICE_CATEGORIES)",
  "state": "string (required, must be in SUPPORTED_STATES)",
  "acceptedTerms": "boolean (required, must be true)",
  "acceptedProviderTerms": "boolean (required, must be true)"
}

// Implementation Logic:
1. Validate all input fields including provider-specific data
2. Check if email already exists
3. Hash password using bcrypt
4. Create user record with role='provider'
5. Create provider_profile record with business details
6. Generate email verification token
7. Send provider welcome email with verification
8. Return JWT token + combined user/provider data

// Success Response (201):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Jane Smith",
      "email": "jane@business.com",
      "role": "provider",
      "phone": "+1234567890",
      "state": "Texas",
      "isEmailVerified": false,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "providerProfile": {
      "businessName": "Smith Plumbing",
      "serviceCategories": ["Plumbers"],
      "isVerified": false
    },
    "token": "jwt-token-here",
    "expiresIn": "24h"
  },
  "message": "Provider registered successfully. Please verify your email and complete profile setup."
}
```

**POST /api/auth/login/user**
```javascript
// Request Body
{
  "email": "string (required)",
  "password": "string (required)"
}

// Implementation Logic:
1. Find user by email with role='user'
2. Compare password using bcrypt
3. Check if account is not deleted/suspended
4. Update last_login_at timestamp
5. Generate JWT token with user claims
6. Return user data + token

// Success Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "+1234567890",
      "state": "California",
      "avatar": "https://...",
      "isEmailVerified": true,
      "lastLoginAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt-token-here",
    "expiresIn": "24h"
  },
  "message": "Login successful"
}

// Error Response (401):
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

**POST /api/auth/login/provider**
```javascript
// Same structure as user login but:
1. Find user by email with role='provider'
2. Include provider profile data in response
3. Return combined user + provider profile data

// Success Response includes providerProfile:
{
  "success": true,
  "data": {
    "user": { /* user data */ },
    "providerProfile": {
      "businessName": "Smith Plumbing",
      "description": "Professional plumbing services...",
      "serviceCategories": ["Plumbers"],
      "yearsExperience": 10,
      "hourlyRate": 75.00,
      "city": "Houston",
      "isVerified": true,
      "rating": 4.8,
      "completedJobs": 156
    },
    "token": "jwt-token-here",
    "expiresIn": "24h"
  }
}
```

**POST /api/auth/forgot-password**
```javascript
// Request Body
{
  "email": "string (required)",
  "role": "string (required, 'user' or 'provider')"
}

// Implementation Logic:
1. Find user by email and role
2. Generate secure reset token (crypto.randomBytes(32))
3. Set token expiration (1 hour from now)
4. Save token and expiration to database
5. Send password reset email with token link
6. Return success message (don't reveal if email exists)

// Success Response (200):
{
  "success": true,
  "message": "If an account with this email exists, you will receive password reset instructions."
}

// Email Template:
Subject: Reset Your GetEasy Password
Body: Click this link to reset your password: 
      https://app.geteasy.com/reset-password?token={reset_token}&role={role}
      This link expires in 1 hour.
```

**POST /api/auth/reset-password**
```javascript
// Request Body
{
  "token": "string (required)",
  "newPassword": "string (required, min 6 chars)",
  "role": "string (required, 'user' or 'provider')"
}

// Implementation Logic:
1. Find user by reset token and role
2. Check if token is not expired
3. Validate new password strength
4. Hash new password
5. Update user password and clear reset token
6. Invalidate all existing JWT tokens (optional)
7. Return success message

// Success Response (200):
{
  "success": true,
  "message": "Password reset successfully. Please login with your new password."
}
```

**GET /api/auth/me**
```javascript
// Headers: Authorization: Bearer {jwt-token}

// Implementation Logic:
1. Verify JWT token
2. Extract user ID from token
3. Fetch current user data from database
4. If provider, include provider profile
5. Return user data

// Success Response (200):
{
  "success": true,
  "data": {
    "user": { /* current user data */ },
    "providerProfile": { /* if user is provider */ }
  }
}
```

### 1.4 JWT Token Structure
```javascript
// JWT Payload
{
  "sub": "user-uuid",           // Subject (user ID)
  "email": "user@example.com",  // User email
  "role": "user",               // User role
  "iat": 1640995200,            // Issued at
  "exp": 1641081600             // Expires at (24h later)
}

// JWT Generation Function
function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      issuer: 'geteasy-api',
      audience: 'geteasy-app'
    }
  );
}
```

### 1.5 Middleware Implementation
```javascript
// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_TOKEN_MISSING',
        message: 'Access token is required'
      }
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'AUTH_TOKEN_INVALID',
          message: 'Invalid or expired token'
        }
      });
    }
    
    req.user = decoded;
    next();
  });
}

// Role-based Authorization Middleware
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required'
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PERMISSION_DENIED',
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
}

// Usage Examples:
app.get('/api/users/profile', authenticateToken, requireRole(['user']), getUserProfile);
app.get('/api/providers/dashboard', authenticateToken, requireRole(['provider']), getProviderDashboard);
app.get('/api/admin/users', authenticateToken, requireRole(['admin']), getAllUsers);
```

## 2. COMPLETE DATABASE SCHEMA & DATA MODELS

### 2.1 Database Setup & Configuration

**PostgreSQL Database Creation:**
```sql
-- Create database
CREATE DATABASE geteasy_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For location features (optional)

-- Create enums
CREATE TYPE user_role AS ENUM ('user', 'provider', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'declined', 'completed', 'rescheduled', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE service_category AS ENUM ('Electricians', 'Plumbers', 'Cleaners', 'Tutors', 'Mechanics');
```

### 2.2 Complete Table Schemas

**Users Table (Complete Schema):**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'user',
    state VARCHAR(50),
    avatar_url TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login_at TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^\+?[1-9]\d{1,14}$'),
    CONSTRAINT valid_state CHECK (state IN (
        'California', 'Texas', 'Florida', 'New York', 'Illinois',
        'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'
    ))
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_state ON users(state);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**TypeScript Interface:**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'provider' | 'admin';
  state?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// For API responses (exclude sensitive fields)
interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'provider';
  state?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
}
```

**Services Table (Complete Schema):**
```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category service_category NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    state VARCHAR(50) NOT NULL,
    city VARCHAR(100),
    image_urls TEXT[], -- Array of image URLs
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    tags TEXT[], -- Searchable tags
    duration_hours DECIMAL(4,2), -- Estimated duration
    materials_included BOOLEAN DEFAULT FALSE,
    emergency_service BOOLEAN DEFAULT FALSE,
    
    -- SEO and search
    slug VARCHAR(255) UNIQUE,
    meta_description TEXT,
    
    -- Calculated fields (updated by triggers)
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    completed_jobs INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Constraints
    CONSTRAINT valid_state CHECK (state IN (
        'California', 'Texas', 'Florida', 'New York', 'Illinois',
        'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'
    )),
    CONSTRAINT valid_title_length CHECK (char_length(title) BETWEEN 10 AND 255),
    CONSTRAINT valid_description_length CHECK (char_length(description) BETWEEN 50 AND 2000)
);

-- Indexes for performance and search
CREATE INDEX idx_services_provider_id ON services(provider_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_state ON services(state);
CREATE INDEX idx_services_city ON services(city);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_services_featured ON services(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_services_rating ON services(rating DESC);
CREATE INDEX idx_services_price ON services(price);
CREATE INDEX idx_services_created_at ON services(created_at DESC);
CREATE INDEX idx_services_search ON services USING GIN(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_services_tags ON services USING GIN(tags);

-- Trigger for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate slug
CREATE OR REPLACE FUNCTION generate_service_slug()
RETURNS TRIGGER AS $$
BEGIN
    NEW.slug = lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug = trim(both '-' from NEW.slug);
    NEW.slug = NEW.slug || '-' || substring(NEW.id::text, 1, 8);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_service_slug_trigger
    BEFORE INSERT ON services
    FOR EACH ROW EXECUTE FUNCTION generate_service_slug();
```

**TypeScript Interface:**
```typescript
interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: 'Electricians' | 'Plumbers' | 'Cleaners' | 'Tutors' | 'Mechanics';
  price: number;
  state: string;
  city?: string;
  imageUrls: string[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  durationHours?: number;
  materialsIncluded: boolean;
  emergencyService: boolean;
  slug: string;
  metaDescription?: string;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// For API responses with provider info
interface ServiceWithProvider extends Service {
  provider: {
    id: string;
    name: string;
    avatarUrl?: string;
    businessName?: string;
    rating: number;
    completedJobs: number;
    responseTime: string;
    isVerified: boolean;
  };
}

// For service creation/update
interface CreateServiceRequest {
  title: string;
  description: string;
  category: string;
  price: number;
  state: string;
  city?: string;
  tags?: string[];
  durationHours?: number;
  materialsIncluded?: boolean;
  emergencyService?: boolean;
  metaDescription?: string;
}
```

**Bookings Table (Complete Schema):**
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    
    -- Booking details
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    scheduled_datetime TIMESTAMP GENERATED ALWAYS AS (scheduled_date + scheduled_time) STORED,
    duration_hours DECIMAL(4,2) DEFAULT 1.0,
    
    -- Location
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Booking information
    status booking_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    special_instructions TEXT,
    estimated_price DECIMAL(10,2) NOT NULL,
    final_price DECIMAL(10,2),
    
    -- Contact information (cached for performance)
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    
    -- Service information (cached)
    service_title VARCHAR(255) NOT NULL,
    service_category service_category NOT NULL,
    
    -- Status tracking
    accepted_at TIMESTAMP,
    declined_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    -- Review tracking
    is_reviewed BOOLEAN DEFAULT FALSE,
    review_reminder_sent BOOLEAN DEFAULT FALSE,
    
    -- Rescheduling
    original_booking_id UUID REFERENCES bookings(id),
    reschedule_count INTEGER DEFAULT 0,
    reschedule_reason TEXT,
    
    -- Metadata
    booking_source VARCHAR(50) DEFAULT 'mobile_app', -- mobile_app, web, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_scheduled_datetime CHECK (scheduled_datetime > CURRENT_TIMESTAMP),
    CONSTRAINT valid_duration CHECK (duration_hours > 0 AND duration_hours <= 24),
    CONSTRAINT valid_price CHECK (estimated_price > 0),
    CONSTRAINT valid_reschedule_count CHECK (reschedule_count >= 0 AND reschedule_count <= 3),
    CONSTRAINT no_self_booking CHECK (user_id != provider_id)
);

-- Indexes for performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_datetime ON bookings(scheduled_datetime);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_state_city ON bookings(state, city);
CREATE INDEX idx_bookings_provider_status_date ON bookings(provider_id, status, scheduled_date);

-- Composite index for provider dashboard queries
CREATE INDEX idx_bookings_provider_dashboard ON bookings(provider_id, status, scheduled_date DESC)
    WHERE status IN ('pending', 'accepted');

-- Trigger for updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update status timestamps
CREATE OR REPLACE FUNCTION update_booking_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Update timestamp based on status change
    IF NEW.status != OLD.status THEN
        CASE NEW.status
            WHEN 'accepted' THEN NEW.accepted_at = CURRENT_TIMESTAMP;
            WHEN 'declined' THEN NEW.declined_at = CURRENT_TIMESTAMP;
            WHEN 'completed' THEN NEW.completed_at = CURRENT_TIMESTAMP;
            WHEN 'cancelled' THEN NEW.cancelled_at = CURRENT_TIMESTAMP;
        END CASE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_booking_status_timestamp_trigger
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_booking_status_timestamp();
```

**TypeScript Interface:**
```typescript
interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  
  // Scheduling
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  scheduledDatetime: Date;
  durationHours: number;
  
  // Location
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  
  // Booking details
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'rescheduled' | 'cancelled';
  notes?: string;
  specialInstructions?: string;
  estimatedPrice: number;
  finalPrice?: number;
  
  // Cached contact info
  userName: string;
  userPhone: string;
  userEmail: string;
  
  // Cached service info
  serviceTitle: string;
  serviceCategory: string;
  
  // Status timestamps
  acceptedAt?: Date;
  declinedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  
  // Review tracking
  isReviewed: boolean;
  reviewReminderSent: boolean;
  
  // Rescheduling
  originalBookingId?: string;
  rescheduleCount: number;
  rescheduleReason?: string;
  
  // Metadata
  bookingSource: string;
  createdAt: Date;
  updatedAt: Date;
}

// For API responses with related data
interface BookingWithDetails extends Booking {
  service: {
    id: string;
    title: string;
    category: string;
    price: number;
    imageUrls: string[];
  };
  provider: {
    id: string;
    name: string;
    businessName?: string;
    phone: string;
    avatarUrl?: string;
    rating: number;
  };
  user?: {
    id: string;
    name: string;
    phone: string;
    avatarUrl?: string;
  };
}

// For booking creation
interface CreateBookingRequest {
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  notes?: string;
  specialInstructions?: string;
}

// For booking updates
interface UpdateBookingRequest {
  status?: 'accepted' | 'declined' | 'completed' | 'cancelled';
  scheduledDate?: string;
  scheduledTime?: string;
  finalPrice?: number;
  cancellationReason?: string;
  rescheduleReason?: string;
}
```

**Review Model:**
```typescript
interface Review {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}
```

**Payment Model:**
```typescript
interface Payment {
  id: string;
  bookingId: string;
  providerId: string;
  userId: string;
  amount: number;
  commission: number; // Platform fee (10%)
  providerEarnings: number;
  paymentMethod?: string;
  transactionId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: Date;
}
```

## 3. COMPLETE API ENDPOINTS IMPLEMENTATION

### 3.1 API Structure & Standards

**Base URL:** `https://api.geteasy.com/v1`

**Response Format Standards:**
```javascript
// Success Response Format
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message",
  "meta": { /* pagination, counts, etc */ },
  "timestamp": "2024-01-01T00:00:00Z"
}

// Error Response Format
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { /* additional error details */ },
    "field": "fieldName" // for validation errors
  },
  "timestamp": "2024-01-01T00:00:00Z"
}

// Pagination Meta Format
{
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**HTTP Status Codes:**
- `200` - Success (GET, PUT, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (business logic error)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

### 3.2 Authentication Endpoints (Detailed)

### 3.3 Service Management Endpoints (Detailed)

**GET /api/services**
```javascript
// Query Parameters
{
  "page": "number (default: 1)",
  "limit": "number (default: 20, max: 100)",
  "category": "string (optional, filter by category)",
  "state": "string (optional, filter by state)",
  "city": "string (optional, filter by city)",
  "minPrice": "number (optional)",
  "maxPrice": "number (optional)",
  "minRating": "number (optional, 1-5)",
  "search": "string (optional, text search)",
  "sortBy": "string (price|rating|created_at|completed_jobs)",
  "sortOrder": "string (asc|desc, default: desc)",
  "featured": "boolean (optional, show only featured)",
  "emergency": "boolean (optional, emergency services only)"
}

// Implementation Logic:
1. Build dynamic query based on filters
2. Apply text search using PostgreSQL full-text search
3. Join with users table to get provider info
4. Calculate average rating from reviews
5. Apply pagination
6. Return services with provider details

// Success Response (200):
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "uuid",
        "title": "Emergency Electrical Repair",
        "description": "24/7 electrical repair services...",
        "category": "Electricians",
        "price": 85.00,
        "state": "California",
        "city": "Los Angeles",
        "imageUrls": ["https://..."],
        "rating": 4.8,
        "totalReviews": 127,
        "completedJobs": 156,
        "emergencyService": true,
        "provider": {
          "id": "uuid",
          "name": "John Electric",
          "businessName": "John's Electrical Services",
          "avatarUrl": "https://...",
          "rating": 4.9,
          "completedJobs": 200,
          "responseTime": "< 2 hours",
          "isVerified": true
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false,
    "filters": {
      "category": "Electricians",
      "state": "California"
    }
  }
}
```

**GET /api/services/:id**
```javascript
// Path Parameters: id (service UUID)

// Implementation Logic:
1. Find service by ID with provider details
2. Include recent reviews (last 5)
3. Calculate availability based on provider schedule
4. Return detailed service information

// Success Response (200):
{
  "success": true,
  "data": {
    "service": {
      "id": "uuid",
      "title": "Emergency Electrical Repair",
      "description": "Detailed description...",
      "category": "Electricians",
      "price": 85.00,
      "state": "California",
      "city": "Los Angeles",
      "imageUrls": ["https://..."],
      "rating": 4.8,
      "totalReviews": 127,
      "completedJobs": 156,
      "tags": ["emergency", "24/7", "licensed"],
      "durationHours": 2.0,
      "materialsIncluded": false,
      "emergencyService": true,
      "provider": {
        "id": "uuid",
        "name": "John Electric",
        "businessName": "John's Electrical Services",
        "description": "Professional electrician with 15+ years...",
        "phone": "+1234567890",
        "avatarUrl": "https://...",
        "rating": 4.9,
        "completedJobs": 200,
        "responseTime": "< 2 hours",
        "isVerified": true,
        "yearsExperience": 15,
        "serviceCategories": ["Electricians"]
      },
      "recentReviews": [
        {
          "id": "uuid",
          "rating": 5,
          "comment": "Excellent service!",
          "userName": "Jane D.",
          "createdAt": "2024-01-01T00:00:00Z"
        }
      ],
      "availability": {
        "nextAvailable": "2024-01-02T09:00:00Z",
        "responseTime": "< 2 hours"
      }
    }
  }
}

// Error Response (404):
{
  "success": false,
  "error": {
    "code": "SERVICE_NOT_FOUND",
    "message": "Service not found or has been removed"
  }
}
```

**POST /api/services** (Provider Only)
```javascript
// Headers: Authorization: Bearer {jwt-token}
// Required Role: provider

// Request Body:
{
  "title": "string (required, 10-255 chars)",
  "description": "string (required, 50-2000 chars)",
  "category": "string (required, must be valid category)",
  "price": "number (required, > 0)",
  "state": "string (required, must be supported state)",
  "city": "string (optional, 2-100 chars)",
  "tags": "array of strings (optional, max 10 tags)",
  "durationHours": "number (optional, 0.5-24)",
  "materialsIncluded": "boolean (optional, default false)",
  "emergencyService": "boolean (optional, default false)",
  "metaDescription": "string (optional, SEO description)"
}

// Implementation Logic:
1. Validate all input fields
2. Check if provider exists and is verified
3. Validate category against enum
4. Generate unique slug for SEO
5. Create service record
6. Return created service with provider info

// Success Response (201):
{
  "success": true,
  "data": {
    "service": {
      "id": "uuid",
      "title": "New Electrical Service",
      "slug": "new-electrical-service-abc12345",
      /* ... other service fields ... */
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  },
  "message": "Service created successfully"
}

// Error Response (400):
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "title": "Title must be between 10 and 255 characters",
      "price": "Price must be greater than 0"
    }
  }
}
```

**PUT /api/services/:id** (Provider Only)
```javascript
// Headers: Authorization: Bearer {jwt-token}
// Required Role: provider
// Path Parameters: id (service UUID)

// Request Body: Same as POST but all fields optional

// Implementation Logic:
1. Find service by ID
2. Verify service belongs to authenticated provider
3. Validate updated fields
4. Update service record
5. Return updated service

// Success Response (200):
{
  "success": true,
  "data": {
    "service": { /* updated service data */ }
  },
  "message": "Service updated successfully"
}

// Error Response (403):
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You can only edit your own services"
  }
}
```

**DELETE /api/services/:id** (Provider Only)
```javascript
// Headers: Authorization: Bearer {jwt-token}
// Required Role: provider
// Path Parameters: id (service UUID)

// Implementation Logic:
1. Find service by ID
2. Verify service belongs to authenticated provider
3. Check for active bookings (prevent deletion if exists)
4. Soft delete service (set deleted_at timestamp)
5. Return success confirmation

// Success Response (204): No content

// Error Response (422):
{
  "success": false,
  "error": {
    "code": "SERVICE_HAS_ACTIVE_BOOKINGS",
    "message": "Cannot delete service with active bookings"
  }
}
```

**GET /api/services/search**
```javascript
// Query Parameters:
{
  "q": "string (required, search query)",
  "location": "string (optional, 'city, state' format)",
  "category": "string (optional)",
  "radius": "number (optional, miles from location)",
  "page": "number (default: 1)",
  "limit": "number (default: 20)"
}

// Implementation Logic:
1. Parse search query for keywords
2. Use PostgreSQL full-text search on title/description
3. Apply location filtering if provided
4. Rank results by relevance and rating
5. Return paginated results

// Success Response (200):
{
  "success": true,
  "data": {
    "services": [ /* search results */ ],
    "suggestions": ["electrical repair", "emergency electrician"],
    "totalResults": 45
  },
  "meta": { /* pagination info */ }
}
```

**User Management:**
```
GET /api/users/profile
PUT /api/users/profile
DELETE /api/users/account
```

**Provider Management:**
```
GET /api/providers/profile
PUT /api/providers/profile
GET /api/providers/:id/public
GET /api/providers/dashboard/stats
```

**Services:**
```
GET /api/services - Get all services (with filters)
GET /api/services/:id - Get service details
POST /api/services - Create service (provider only)
PUT /api/services/:id - Update service (provider only)
DELETE /api/services/:id - Delete service (provider only)
GET /api/services/search - Search services by location/category
GET /api/providers/:id/services - Get provider's services
```

### 3.4 Booking Management Endpoints (Detailed)

**POST /api/bookings** (User Only)
```javascript
// Headers: Authorization: Bearer {jwt-token}
// Required Role: user

// Request Body:
{
  "serviceId": "string (required, UUID)",
  "scheduledDate": "string (required, YYYY-MM-DD format)",
  "scheduledTime": "string (required, HH:MM format)",
  "address": "string (required, full address)",
  "city": "string (required)",
  "state": "string (required)",
  "zipCode": "string (optional)",
  "notes": "string (optional, max 500 chars)",
  "specialInstructions": "string (optional, max 1000 chars)"
}

// Implementation Logic:
1. Validate all input fields
2. Check if service exists and is active
3. Verify scheduled datetime is in future (at least 2 hours)
4. Check provider availability (no conflicting bookings)
5. Calculate estimated price from service
6. Cache user and service information
7. Create booking record with 'pending' status
8. Send notification to provider
9. Send confirmation to user
10. Return booking details

// Success Response (201):
{
  "success": true,
  "data": {
    "booking": {
      "id": "uuid",
      "userId": "uuid",
      "providerId": "uuid",
      "serviceId": "uuid",
      "scheduledDate": "2024-01-15",
      "scheduledTime": "10:00",
      "scheduledDatetime": "2024-01-15T10:00:00Z",
      "address": "123 Main St, Los Angeles, CA 90210",
      "city": "Los Angeles",
      "state": "California",
      "status": "pending",
      "estimatedPrice": 85.00,
      "notes": "Kitchen outlet not working",
      "service": {
        "title": "Electrical Repair",
        "category": "Electricians",
        "price": 85.00
      },
      "provider": {
        "name": "John Electric",
        "businessName": "John's Electrical",
        "phone": "+1234567890",
        "responseTime": "< 2 hours"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  },
  "message": "Booking created successfully. The provider will respond within 2 hours."
}

// Error Response (422):
{
  "success": false,
  "error": {
    "code": "BOOKING_TIME_CONFLICT",
    "message": "Provider is not available at the requested time",
    "details": {
      "suggestedTimes": [
        "2024-01-15T14:00:00Z",
        "2024-01-16T10:00:00Z"
      ]
    }
  }
}
```

**GET /api/bookings/user** (User Only)
```javascript
// Headers: Authorization: Bearer {jwt-token}
// Required Role: user

// Query Parameters:
{
  "status": "string (optional, filter by status)",
  "page": "number (default: 1)",
  "limit": "number (default: 20)",
  "sortBy": "string (created_at|scheduled_datetime)",
  "sortOrder": "string (asc|desc, default: desc)"
}

// Implementation Logic:
1. Get user ID from JWT token
2. Query bookings for user with filters
3. Include service and provider details
4. Apply pagination and sorting
5. Return bookings with related data

// Success Response (200):
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "status": "completed",
        "scheduledDate": "2024-01-10",
        "scheduledTime": "14:00",
        "address": "123 Main St, Los Angeles, CA",
        "estimatedPrice": 85.00,
        "finalPrice": 90.00,
        "isReviewed": true,
        "service": {
          "id": "uuid",
          "title": "Electrical Repair",
          "category": "Electricians",
          "imageUrls": ["https://..."]
        },
        "provider": {
          "id": "uuid",
          "name": "John Electric",
          "businessName": "John's Electrical",
          "avatarUrl": "https://...",
          "phone": "+1234567890",
          "rating": 4.9
        },
        "completedAt": "2024-01-10T16:00:00Z",
        "createdAt": "2024-01-08T10:00:00Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1,
    "statusCounts": {
      "pending": 2,
      "accepted": 1,
      "completed": 10,
      "declined": 2
    }
  }
}
```

**GET /api/bookings/provider** (Provider Only)
```javascript
// Headers: Authorization: Bearer {jwt-token}
// Required Role: provider

// Query Parameters: Same as user bookings plus:
{
  "date": "string (optional, YYYY-MM-DD, filter by date)",
  "dateRange": "string (optional, 'today'|'week'|'month')",
  "includeCompleted": "boolean (default: true)"
}

// Implementation Logic:
1. Get provider ID from JWT token
2. Query bookings for provider with filters
3. Include user and service details
4. Calculate earnings for completed bookings
5. Apply pagination and sorting

// Success Response (200):
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "status": "pending",
        "scheduledDate": "2024-01-15",
        "scheduledTime": "10:00",
        "address": "123 Main St, Los Angeles, CA",
        "estimatedPrice": 85.00,
        "notes": "Kitchen outlet issue",
        "user": {
          "id": "uuid",
          "name": "Jane Smith",
          "phone": "+1987654321",
          "avatarUrl": "https://..."
        },
        "service": {
          "id": "uuid",
          "title": "Electrical Repair",
          "category": "Electricians"
        },
        "createdAt": "2024-01-12T08:00:00Z"
      }
    ],
    "earnings": {
      "thisMonth": 1250.00,
      "pending": 340.00,
      "totalCompleted": 45
    }
  },
  "meta": { /* pagination info */ }
}
```

**PUT /api/bookings/:id/status** (Provider Only)
```javascript
// Headers: Authorization: Bearer {jwt-token}
// Required Role: provider
// Path Parameters: id (booking UUID)

// Request Body:
{
  "status": "string (required, 'accepted'|'declined'|'completed'|'cancelled')",
  "finalPrice": "number (optional, for completed status)",
  "cancellationReason": "string (optional, for cancelled/declined)",
  "completionNotes": "string (optional, for completed status)"
}

// Implementation Logic:
1. Find booking by ID
2. Verify booking belongs to authenticated provider
3. Validate status transition (pending->accepted, accepted->completed, etc.)
4. Update booking status and related timestamps
5. If completed, create payment record and update provider stats
6. Send notification to user about status change
7. Return updated booking

// Success Response (200):
{
  "success": true,
  "data": {
    "booking": {
      "id": "uuid",
      "status": "accepted",
      "acceptedAt": "2024-01-12T10:30:00Z",
      /* ... other booking fields ... */
    }
  },
  "message": "Booking accepted successfully"
}

// Error Response (422):
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Cannot change status from 'completed' to 'accepted'"
  }
}
```

**PUT /api/bookings/:id/reschedule**
```javascript
// Headers: Authorization: Bearer {jwt-token}
// Required Roles: user, provider
// Path Parameters: id (booking UUID)

// Request Body:
{
  "newDate": "string (required, YYYY-MM-DD)",
  "newTime": "string (required, HH:MM)",
  "reason": "string (optional, reschedule reason)"
}

// Implementation Logic:
1. Find booking by ID
2. Verify user owns booking OR provider owns booking
3. Check if booking can be rescheduled (not completed/cancelled)
4. Validate new datetime is in future
5. Check provider availability for new time
6. Update booking with new schedule
7. Increment reschedule count (max 3 times)
8. Send notification to other party
9. Return updated booking

// Success Response (200):
{
  "success": true,
  "data": {
    "booking": {
      "id": "uuid",
      "scheduledDate": "2024-01-16",
      "scheduledTime": "14:00",
      "status": "rescheduled",
      "rescheduleCount": 1,
      "rescheduleReason": "Provider requested different time",
      /* ... other fields ... */
    }
  },
  "message": "Booking rescheduled successfully"
}
```

**GET /api/bookings/:id**
```javascript
// Headers: Authorization: Bearer {jwt-token}
// Path Parameters: id (booking UUID)

// Implementation Logic:
1. Find booking by ID with all related data
2. Verify user owns booking OR provider owns booking
3. Include payment information if completed
4. Include review if exists
5. Return complete booking details

// Success Response (200):
{
  "success": true,
  "data": {
    "booking": {
      "id": "uuid",
      "status": "completed",
      "scheduledDate": "2024-01-10",
      "scheduledTime": "14:00",
      "scheduledDatetime": "2024-01-10T14:00:00Z",
      "address": "123 Main St, Los Angeles, CA 90210",
      "estimatedPrice": 85.00,
      "finalPrice": 90.00,
      "notes": "Kitchen outlet not working",
      "completedAt": "2024-01-10T16:00:00Z",
      "user": {
        "id": "uuid",
        "name": "Jane Smith",
        "phone": "+1987654321",
        "email": "jane@example.com"
      },
      "provider": {
        "id": "uuid",
        "name": "John Electric",
        "businessName": "John's Electrical Services",
        "phone": "+1234567890",
        "rating": 4.9
      },
      "service": {
        "id": "uuid",
        "title": "Electrical Repair",
        "category": "Electricians",
        "description": "Professional electrical repair...",
        "imageUrls": ["https://..."]
      },
      "payment": {
        "id": "uuid",
        "amount": 90.00,
        "commission": 9.00,
        "providerEarnings": 81.00,
        "status": "completed",
        "createdAt": "2024-01-10T16:05:00Z"
      },
      "review": {
        "id": "uuid",
        "rating": 5,
        "comment": "Excellent service!",
        "createdAt": "2024-01-10T18:00:00Z"
      },
      "createdAt": "2024-01-08T10:00:00Z"
    }
  }
}
```

**Reviews:**
```
POST /api/reviews - Create review (user only, after completed booking)
GET /api/reviews/provider/:id - Get provider reviews
GET /api/reviews/user - Get user's reviews
```

**Payments:**
```
POST /api/payments/process - Process payment (after booking completion)
GET /api/payments/provider - Get provider earnings
GET /api/payments/user - Get user payment history
```

## 4. BUSINESS LOGIC & VALIDATION RULES

### 4.1 Authentication Business Rules

**Password Security:**
```javascript
// Password validation function
function validatePassword(password) {
  const rules = {
    minLength: 6,
    maxLength: 128,
    requireLetter: true,
    requireNumber: true,
    requireSpecialChar: false // Optional for better UX
  };
  
  const errors = [];
  
  if (password.length < rules.minLength) {
    errors.push(`Password must be at least ${rules.minLength} characters`);
  }
  
  if (password.length > rules.maxLength) {
    errors.push(`Password must be less than ${rules.maxLength} characters`);
  }
  
  if (rules.requireLetter && !/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }
  
  if (rules.requireNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Account lockout logic
async function handleFailedLogin(email) {
  const user = await User.findOne({ email });
  if (!user) return;
  
  user.loginAttempts += 1;
  
  // Lock account after 5 failed attempts for 30 minutes
  if (user.loginAttempts >= 5) {
    user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await sendAccountLockedEmail(user.email);
  }
  
  await user.save();
}

// Reset login attempts on successful login
async function handleSuccessfulLogin(userId) {
  await User.updateOne(
    { _id: userId },
    { 
      $unset: { loginAttempts: 1, lockedUntil: 1 },
      $set: { lastLoginAt: new Date() }
    }
  );
}
```

**Email Verification:**
```javascript
// Generate verification token
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Email verification endpoint
app.post('/api/auth/verify-email', async (req, res) => {
  const { token } = req.body;
  
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() }
  });
  
  if (!user) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_VERIFICATION_TOKEN',
        message: 'Invalid or expired verification token'
      }
    });
  }
  
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  
  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});
```

### 4.2 Service Management Business Rules

**Service Validation:**
```javascript
// Service creation validation
function validateServiceData(data, userRole) {
  const errors = {};
  
  // Title validation
  if (!data.title || data.title.length < 10 || data.title.length > 255) {
    errors.title = 'Title must be between 10 and 255 characters';
  }
  
  // Description validation
  if (!data.description || data.description.length < 50 || data.description.length > 2000) {
    errors.description = 'Description must be between 50 and 2000 characters';
  }
  
  // Category validation
  const validCategories = ['Electricians', 'Plumbers', 'Cleaners', 'Tutors', 'Mechanics'];
  if (!validCategories.includes(data.category)) {
    errors.category = 'Invalid service category';
  }
  
  // Price validation
  if (!data.price || data.price <= 0 || data.price > 10000) {
    errors.price = 'Price must be between $1 and $10,000';
  }
  
  // State validation
  const validStates = [
    'California', 'Texas', 'Florida', 'New York', 'Illinois',
    'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'
  ];
  if (!validStates.includes(data.state)) {
    errors.state = 'Service state is not supported';
  }
  
  // Provider-only validation
  if (userRole !== 'provider') {
    errors.permission = 'Only providers can create services';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
}

// Service search and filtering
async function searchServices(filters) {
  let query = Service.find({ isActive: true, deletedAt: null });
  
  // Text search
  if (filters.search) {
    query = query.find({
      $text: { $search: filters.search }
    });
  }
  
  // Category filter
  if (filters.category) {
    query = query.where('category').equals(filters.category);
  }
  
  // Location filters
  if (filters.state) {
    query = query.where('state').equals(filters.state);
  }
  if (filters.city) {
    query = query.where('city').equals(filters.city);
  }
  
  // Price range
  if (filters.minPrice || filters.maxPrice) {
    const priceFilter = {};
    if (filters.minPrice) priceFilter.$gte = filters.minPrice;
    if (filters.maxPrice) priceFilter.$lte = filters.maxPrice;
    query = query.where('price', priceFilter);
  }
  
  // Rating filter
  if (filters.minRating) {
    query = query.where('rating').gte(filters.minRating);
  }
  
  // Featured services
  if (filters.featured) {
    query = query.where('isFeatured').equals(true);
  }
  
  // Emergency services
  if (filters.emergency) {
    query = query.where('emergencyService').equals(true);
  }
  
  // Sorting
  const sortOptions = {
    'price': { price: 1 },
    '-price': { price: -1 },
    'rating': { rating: -1 },
    'created_at': { createdAt: -1 },
    'completed_jobs': { completedJobs: -1 }
  };
  
  const sortKey = filters.sortOrder === 'asc' ? filters.sortBy : `-${filters.sortBy}`;
  if (sortOptions[sortKey]) {
    query = query.sort(sortOptions[sortKey]);
  }
  
  // Pagination
  const page = parseInt(filters.page) || 1;
  const limit = Math.min(parseInt(filters.limit) || 20, 100);
  const skip = (page - 1) * limit;
  
  query = query.skip(skip).limit(limit);
  
  // Populate provider information
  query = query.populate('providerId', 'name businessName avatarUrl rating completedJobs');
  
  return await query.exec();
}
```

### 4.3 Booking System Business Rules

**Booking Validation & Conflict Detection:**
```javascript
// Check provider availability
async function checkProviderAvailability(providerId, scheduledDatetime, durationHours = 1) {
  const startTime = new Date(scheduledDatetime);
  const endTime = new Date(startTime.getTime() + (durationHours * 60 * 60 * 1000));
  
  // Check for conflicting bookings
  const conflictingBookings = await Booking.find({
    providerId: providerId,
    status: { $in: ['pending', 'accepted'] },
    $or: [
      {
        // New booking starts during existing booking
        scheduledDatetime: { $lte: startTime },
        $expr: {
          $gte: [
            { $add: ['$scheduledDatetime', { $multiply: ['$durationHours', 3600000] }] },
            startTime
          ]
        }
      },
      {
        // New booking ends during existing booking
        scheduledDatetime: { $gte: startTime, $lt: endTime }
      }
    ]
  });
  
  if (conflictingBookings.length > 0) {
    // Suggest alternative times
    const suggestedTimes = await getSuggestedTimes(providerId, startTime, durationHours);
    return {
      available: false,
      conflictingBookings: conflictingBookings,
      suggestedTimes: suggestedTimes
    };
  }
  
  return { available: true };
}

// Generate suggested alternative times
async function getSuggestedTimes(providerId, requestedTime, durationHours) {
  const suggestions = [];
  const baseDate = new Date(requestedTime);
  
  // Check next 7 days for availability
  for (let day = 0; day < 7; day++) {
    const checkDate = new Date(baseDate);
    checkDate.setDate(checkDate.getDate() + day);
    
    // Check common time slots (9 AM to 5 PM)
    for (let hour = 9; hour <= 17; hour++) {
      checkDate.setHours(hour, 0, 0, 0);
      
      const availability = await checkProviderAvailability(
        providerId, 
        checkDate, 
        durationHours
      );
      
      if (availability.available) {
        suggestions.push(checkDate.toISOString());
        if (suggestions.length >= 5) break;
      }
    }
    
    if (suggestions.length >= 5) break;
  }
  
  return suggestions;
}

// Booking status transition validation
function validateStatusTransition(currentStatus, newStatus, userRole) {
  const validTransitions = {
    'pending': {
      'accepted': ['provider'],
      'declined': ['provider'],
      'cancelled': ['user', 'provider']
    },
    'accepted': {
      'completed': ['provider'],
      'rescheduled': ['user', 'provider'],
      'cancelled': ['user', 'provider']
    },
    'rescheduled': {
      'accepted': ['provider'],
      'declined': ['provider'],
      'cancelled': ['user', 'provider']
    }
  };
  
  const allowedStatuses = validTransitions[currentStatus];
  if (!allowedStatuses || !allowedStatuses[newStatus]) {
    return {
      valid: false,
      error: `Cannot transition from ${currentStatus} to ${newStatus}`
    };
  }
  
  if (!allowedStatuses[newStatus].includes(userRole)) {
    return {
      valid: false,
      error: `${userRole} cannot change status to ${newStatus}`
    };
  }
  
  return { valid: true };
}
```

### 4.4 Payment Processing Business Rules

**Commission Calculation:**
```javascript
// Platform commission configuration
const COMMISSION_CONFIG = {
  rate: 0.10, // 10%
  minimumFee: 1.00, // Minimum $1 fee
  maximumFee: 50.00, // Maximum $50 fee per booking
  processingFee: 0.30 // Fixed processing fee
};

// Calculate commission and provider earnings
function calculatePaymentBreakdown(bookingAmount) {
  const commission = Math.max(
    COMMISSION_CONFIG.minimumFee,
    Math.min(
      bookingAmount * COMMISSION_CONFIG.rate,
      COMMISSION_CONFIG.maximumFee
    )
  );
  
  const processingFee = COMMISSION_CONFIG.processingFee;
  const providerEarnings = bookingAmount - commission - processingFee;
  
  return {
    bookingAmount: parseFloat(bookingAmount.toFixed(2)),
    commission: parseFloat(commission.toFixed(2)),
    processingFee: parseFloat(processingFee.toFixed(2)),
    providerEarnings: parseFloat(providerEarnings.toFixed(2))
  };
}

// Process payment on booking completion
async function processBookingPayment(bookingId) {
  const booking = await Booking.findById(bookingId)
    .populate('userId')
    .populate('providerId');
  
  if (booking.status !== 'completed') {
    throw new Error('Can only process payment for completed bookings');
  }
  
  const paymentAmount = booking.finalPrice || booking.estimatedPrice;
  const breakdown = calculatePaymentBreakdown(paymentAmount);
  
  // Create payment record
  const payment = new Payment({
    bookingId: booking.id,
    userId: booking.userId._id,
    providerId: booking.providerId._id,
    amount: breakdown.bookingAmount,
    commission: breakdown.commission,
    processingFee: breakdown.processingFee,
    providerEarnings: breakdown.providerEarnings,
    status: 'processing'
  });
  
  try {
    // Process payment with Stripe
    const stripePayment = await stripe.paymentIntents.create({
      amount: Math.round(breakdown.bookingAmount * 100), // Convert to cents
      currency: 'usd',
      customer: booking.userId.stripeCustomerId,
      metadata: {
        bookingId: booking.id,
        paymentId: payment.id
      }
    });
    
    payment.stripePaymentIntentId = stripePayment.id;
    payment.status = 'completed';
    await payment.save();
    
    // Update provider earnings
    await updateProviderEarnings(booking.providerId._id, breakdown.providerEarnings);
    
    return payment;
    
  } catch (error) {
    payment.status = 'failed';
    payment.errorMessage = error.message;
    await payment.save();
    throw error;
  }
}
```

### 4.5 Review System Business Rules

**Review Validation:**
```javascript
// Review eligibility check
async function canUserReviewBooking(userId, bookingId) {
  const booking = await Booking.findOne({
    _id: bookingId,
    userId: userId,
    status: 'completed'
  });
  
  if (!booking) {
    return {
      canReview: false,
      reason: 'Booking not found or not completed'
    };
  }
  
  // Check if already reviewed
  const existingReview = await Review.findOne({ bookingId: bookingId });
  if (existingReview) {
    return {
      canReview: false,
      reason: 'Booking already reviewed'
    };
  }
  
  // Check if booking was completed within review window (30 days)
  const completedAt = new Date(booking.completedAt);
  const reviewDeadline = new Date(completedAt.getTime() + (30 * 24 * 60 * 60 * 1000));
  
  if (new Date() > reviewDeadline) {
    return {
      canReview: false,
      reason: 'Review period has expired (30 days after completion)'
    };
  }
  
  return { canReview: true };
}

// Update provider rating after new review
async function updateProviderRating(providerId) {
  const reviews = await Review.find({ providerId: providerId });
  
  if (reviews.length === 0) {
    await User.updateOne(
      { _id: providerId },
      { $set: { rating: 0, totalReviews: 0 } }
    );
    return;
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  await User.updateOne(
    { _id: providerId },
    { 
      $set: { 
        rating: parseFloat(averageRating.toFixed(2)),
        totalReviews: reviews.length
      }
    }
  );
  
  // Update service ratings for this provider
  await Service.updateMany(
    { providerId: providerId },
    { 
      $set: { 
        rating: parseFloat(averageRating.toFixed(2)),
        totalReviews: reviews.length
      }
    }
  );
}
```

**Authentication:**
- Email validation and uniqueness
- Password hashing (bcrypt)
- JWT token generation with role claims
- Password reset via email with secure tokens
- Rate limiting on auth endpoints

**Service Management:**
- Providers can create/edit/delete their services
- Services must have valid categories
- Price validation (minimum $1)
- Location-based service filtering
- Service rating calculation from reviews

**Booking System:**
- Users can book available services
- Providers can accept/decline bookings
- Automatic status updates
- Booking conflicts prevention
- Notification system for status changes

**Payment Processing:**
- 10% platform commission calculation
- Payment processing integration (Stripe recommended)
- Automatic payment on booking completion
- Provider earnings tracking
- Refund handling for cancelled bookings

**Review System:**
- Only completed bookings can be reviewed
- One review per booking
- Rating affects provider's overall rating
- Review moderation capabilities

### 5. Database Schema Considerations

**Indexes Required:**
- Users: email (unique), role
- Services: providerId, category, state, city
- Bookings: userId, providerId, status, date
- Reviews: providerId, bookingId (unique)
- Payments: providerId, userId, status

**Relationships:**
- User (1) → Bookings (many)
- Provider (1) → Services (many)
- Provider (1) → Bookings (many)
- Service (1) → Bookings (many)
- Booking (1) → Review (1)
- Booking (1) → Payment (1)

### 6. Security Requirements

**Authentication Security:**
- JWT tokens with expiration
- Refresh token mechanism
- Role-based route protection
- Password strength validation
- Account lockout after failed attempts

**Data Protection:**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting on all endpoints
- CORS configuration for mobile app

**Privacy:**
- User data encryption at rest
- PII data handling compliance
- Secure password reset flows
- Audit logging for sensitive operations

### 7. Validation Rules

**Email Validation:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Password Requirements:**
- Minimum 6 characters
- Must contain letters and numbers (recommended)

**Service Categories (Enum):**
```javascript
const SERVICE_CATEGORIES = [
  "Electricians",
  "Plumbers", 
  "Cleaners",
  "Tutors",
  "Mechanics"
];
```

**Booking Status Flow:**
```
Pending → Accepted → Completed
Pending → Declined (end)
Accepted → Rescheduled → Accepted
```

**US States Support:**
```javascript
const SUPPORTED_STATES = [
  "California", "Texas", "Florida", "New York", "Illinois",
  "Pennsylvania", "Ohio", "Georgia", "North Carolina", "Michigan"
];
```

### 8. Error Handling

**Standard Error Responses:**
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

**Common Error Codes:**
- `AUTH_INVALID_CREDENTIALS` - Invalid login
- `AUTH_EMAIL_EXISTS` - Email already registered
- `AUTH_TOKEN_EXPIRED` - JWT token expired
- `VALIDATION_ERROR` - Input validation failed
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `PERMISSION_DENIED` - Insufficient permissions
- `BOOKING_CONFLICT` - Booking time conflict

### 9. Success Response Format

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}
```

### 10. Environment Configuration

**Required Environment Variables:**
```
# Database
DATABASE_URL=postgresql://...
DATABASE_NAME=geteasy

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Processing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:19006
COMMISSION_RATE=0.10
```

### 11. Additional Features to Implement

**Notifications:**
- Email notifications for booking updates
- Push notifications (Firebase)
- SMS notifications for urgent updates

**File Upload:**
- Profile picture upload
- Service image upload
- Document verification for providers

**Search & Filtering:**
- Location-based service search
- Category filtering
- Price range filtering
- Rating-based sorting
- Availability filtering

**Analytics:**
- Provider dashboard statistics
- Booking analytics
- Revenue tracking
- User engagement metrics

### 12. Technology Stack Recommendations

**Backend Framework:**
- Node.js with Express.js or Fastify
- TypeScript for type safety
- PostgreSQL or MongoDB for database
- Redis for caching and sessions

**Authentication:**
- JWT for stateless authentication
- bcrypt for password hashing
- nodemailer for email services

**Payment Processing:**
- Stripe for payment processing
- Webhook handling for payment events

**File Storage:**
- AWS S3 or Cloudinary for image storage
- Multer for file upload handling

**Deployment:**
- Docker containerization
- AWS/Heroku/DigitalOcean hosting
- Environment-based configuration

## 5. NOTIFICATION SYSTEM IMPLEMENTATION

### 5.1 Email Notification Templates

**Email Service Configuration:**
```javascript
// Email service setup (using nodemailer)
const nodemailer = require('nodemailer');

const emailTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email template system
const emailTemplates = {
  userRegistration: {
    subject: 'Welcome to GetEasy - Verify Your Email',
    template: `
      <h2>Welcome to GetEasy!</h2>
      <p>Hi {{name}},</p>
      <p>Thank you for joining GetEasy. Please verify your email address by clicking the link below:</p>
      <a href="{{verificationLink}}" style="background: #0a8a60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `
  },
  
  providerRegistration: {
    subject: 'Welcome to GetEasy - Provider Account Created',
    template: `
      <h2>Welcome to GetEasy Provider Network!</h2>
      <p>Hi {{name}},</p>
      <p>Your provider account has been created successfully. Please verify your email and complete your profile setup:</p>
      <a href="{{verificationLink}}">Verify Email & Complete Setup</a>
      <p>Next steps:</p>
      <ul>
        <li>Verify your email address</li>
        <li>Complete your business profile</li>
        <li>Add your first service</li>
        <li>Upload verification documents</li>
      </ul>
    `
  },
  
  bookingCreated: {
    subject: 'New Booking Request - {{serviceTitle}}',
    template: `
      <h2>New Booking Request</h2>
      <p>Hi {{providerName}},</p>
      <p>You have a new booking request for {{serviceTitle}}:</p>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Customer:</strong> {{customerName}}</p>
        <p><strong>Date & Time:</strong> {{scheduledDateTime}}</p>
        <p><strong>Location:</strong> {{address}}</p>
        <p><strong>Estimated Price:</strong> ${{estimatedPrice}}</p>
        <p><strong>Notes:</strong> {{notes}}</p>
      </div>
      <p>Please respond within 2 hours:</p>
      <a href="{{acceptLink}}" style="background: #0a8a60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 12px;">Accept</a>
      <a href="{{declineLink}}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Decline</a>
    `
  },
  
  bookingAccepted: {
    subject: 'Booking Confirmed - {{serviceTitle}}',
    template: `
      <h2>Your Booking is Confirmed!</h2>
      <p>Hi {{customerName}},</p>
      <p>Great news! {{providerName}} has accepted your booking request.</p>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Service:</strong> {{serviceTitle}}</p>
        <p><strong>Provider:</strong> {{providerName}} ({{businessName}})</p>
        <p><strong>Date & Time:</strong> {{scheduledDateTime}}</p>
        <p><strong>Location:</strong> {{address}}</p>
        <p><strong>Provider Phone:</strong> {{providerPhone}}</p>
      </div>
      <p>The provider will contact you if needed. You can also message them through the app.</p>
    `
  },
  
  passwordReset: {
    subject: 'Reset Your GetEasy Password',
    template: `
      <h2>Password Reset Request</h2>
      <p>Hi {{name}},</p>
      <p>You requested to reset your password. Click the link below to create a new password:</p>
      <a href="{{resetLink}}" style="background: #0a8a60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
      <p>This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
    `
  }
};

// Send email function
async function sendEmail(templateName, recipientEmail, templateData) {
  const template = emailTemplates[templateName];
  if (!template) {
    throw new Error(`Email template '${templateName}' not found`);
  }
  
  let htmlContent = template.template;
  let subject = template.subject;
  
  // Replace template variables
  Object.keys(templateData).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    htmlContent = htmlContent.replace(regex, templateData[key]);
    subject = subject.replace(regex, templateData[key]);
  });
  
  const mailOptions = {
    from: `"GetEasy" <${process.env.SMTP_USER}>`,
    to: recipientEmail,
    subject: subject,
    html: htmlContent
  };
  
  try {
    await emailTransporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${recipientEmail}`);
  } catch (error) {
    console.error(`Failed to send email to ${recipientEmail}:`, error);
    throw error;
  }
}
```

### 5.2 Push Notification System

**Firebase Cloud Messaging Setup:**
```javascript
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

// Send push notification
async function sendPushNotification(userToken, notification) {
  const message = {
    token: userToken,
    notification: {
      title: notification.title,
      body: notification.body
    },
    data: notification.data || {},
    android: {
      notification: {
        icon: 'ic_notification',
        color: '#0a8a60',
        sound: 'default'
      }
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
          sound: 'default'
        }
      }
    }
  };
  
  try {
    const response = await admin.messaging().send(message);
    console.log('Push notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

// Notification triggers
const notificationTriggers = {
  bookingCreated: async (booking) => {
    const provider = await User.findById(booking.providerId);
    
    // Email notification
    await sendEmail('bookingCreated', provider.email, {
      providerName: provider.name,
      serviceTitle: booking.serviceTitle,
      customerName: booking.userName,
      scheduledDateTime: formatDateTime(booking.scheduledDatetime),
      address: booking.address,
      estimatedPrice: booking.estimatedPrice,
      notes: booking.notes || 'No special notes',
      acceptLink: `${process.env.APP_URL}/bookings/${booking.id}/accept`,
      declineLink: `${process.env.APP_URL}/bookings/${booking.id}/decline`
    });
    
    // Push notification
    if (provider.fcmToken) {
      await sendPushNotification(provider.fcmToken, {
        title: 'New Booking Request',
        body: `${booking.userName} wants to book ${booking.serviceTitle}`,
        data: {
          type: 'booking_request',
          bookingId: booking.id
        }
      });
    }
  },
  
  bookingAccepted: async (booking) => {
    const user = await User.findById(booking.userId);
    const provider = await User.findById(booking.providerId);
    
    await sendEmail('bookingAccepted', user.email, {
      customerName: user.name,
      providerName: provider.name,
      businessName: provider.businessName || provider.name,
      serviceTitle: booking.serviceTitle,
      scheduledDateTime: formatDateTime(booking.scheduledDatetime),
      address: booking.address,
      providerPhone: provider.phone
    });
    
    if (user.fcmToken) {
      await sendPushNotification(user.fcmToken, {
        title: 'Booking Confirmed!',
        body: `${provider.name} accepted your booking for ${booking.serviceTitle}`,
        data: {
          type: 'booking_accepted',
          bookingId: booking.id
        }
      });
    }
  }
};
```

## 6. COMPREHENSIVE ERROR HANDLING

### 6.1 Error Classes and Codes

```javascript
// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.field = field;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

class BusinessLogicError extends AppError {
  constructor(message) {
    super(message, 422, 'BUSINESS_LOGIC_ERROR');
  }
}

// Global error handler middleware
function globalErrorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;
  
  // Log error
  console.error(err);
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    error = new ValidationError(message);
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new ConflictError(message);
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ValidationError(message);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token');
  }
  
  if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired');
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.errorCode || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Something went wrong',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString()
  });
}

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

## 7. IMPLEMENTATION ROADMAP & TESTING

### 7.1 Development Phases (Detailed)

**Phase 1: Foundation & Authentication (Week 1-2)**
```javascript
// Tasks:
1. Set up project structure and dependencies
2. Configure database (PostgreSQL) with migrations
3. Implement user registration/login endpoints
4. Set up JWT authentication middleware
5. Create email service for verification
6. Implement password reset functionality
7. Add input validation and error handling
8. Write unit tests for auth functions

// Deliverables:
- Working authentication system
- Email verification flow
- Password reset functionality
- Basic error handling
- 90%+ test coverage for auth
```

**Phase 2: Service Management (Week 3-4)**
```javascript
// Tasks:
1. Create service CRUD endpoints
2. Implement service search and filtering
3. Add image upload functionality (AWS S3)
4. Create provider profile management
5. Implement service validation rules
6. Add text search capabilities
7. Create service analytics endpoints
8. Write integration tests

// Deliverables:
- Complete service management API
- Image upload system
- Advanced search functionality
- Provider dashboard basics
```

**Phase 3: Booking System (Week 5-6)**
```javascript
// Tasks:
1. Implement booking creation and validation
2. Add availability checking logic
3. Create booking status management
4. Implement rescheduling functionality
5. Add booking conflict detection
6. Create booking analytics
7. Implement notification triggers
8. Add booking history endpoints

// Deliverables:
- Complete booking workflow
- Conflict detection system
- Status management
- Basic notifications
```

**Phase 4: Payment & Reviews (Week 7-8)**
```javascript
// Tasks:
1. Integrate Stripe payment processing
2. Implement commission calculation
3. Create payment tracking system
4. Add review and rating functionality
5. Implement provider earnings tracking
6. Create payment analytics
7. Add refund handling
8. Comprehensive testing

// Deliverables:
- Payment processing system
- Review and rating system
- Provider earnings dashboard
- Financial reporting
```

### 7.2 Testing Strategy

**Unit Testing (Jest + Supertest):**
```javascript
// Example test structure
describe('Authentication', () => {
  describe('POST /api/auth/register/user', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+1234567890',
        acceptedTerms: true
      };
      
      const response = await request(app)
        .post('/api/auth/register/user')
        .send(userData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });
    
    it('should reject registration with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
        acceptedTerms: true
      };
      
      const response = await request(app)
        .post('/api/auth/register/user')
        .send(userData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});

// Property-based testing example
describe('Service Search', () => {
  it('should return valid services for any search query', async () => {
    await fc.assert(fc.asyncProperty(
      fc.string({ minLength: 1, maxLength: 50 }),
      async (searchQuery) => {
        const response = await request(app)
          .get('/api/services/search')
          .query({ q: searchQuery })
          .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.services)).toBe(true);
        
        // All returned services should match search criteria
        response.body.data.services.forEach(service => {
          expect(service.isActive).toBe(true);
          expect(service.deletedAt).toBeNull();
        });
      }
    ));
  });
});
```

**Integration Testing:**
```javascript
// Test complete workflows
describe('Booking Workflow Integration', () => {
  let userToken, providerToken, serviceId;
  
  beforeAll(async () => {
    // Set up test data
    const user = await createTestUser();
    const provider = await createTestProvider();
    const service = await createTestService(provider.id);
    
    userToken = generateToken(user);
    providerToken = generateToken(provider);
    serviceId = service.id;
  });
  
  it('should complete full booking workflow', async () => {
    // 1. User creates booking
    const bookingResponse = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        serviceId: serviceId,
        scheduledDate: '2024-02-01',
        scheduledTime: '10:00',
        address: '123 Test St, Test City, CA'
      })
      .expect(201);
    
    const bookingId = bookingResponse.body.data.booking.id;
    
    // 2. Provider accepts booking
    await request(app)
      .put(`/api/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${providerToken}`)
      .send({ status: 'accepted' })
      .expect(200);
    
    // 3. Provider completes booking
    await request(app)
      .put(`/api/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${providerToken}`)
      .send({ 
        status: 'completed',
        finalPrice: 85.00
      })
      .expect(200);
    
    // 4. Verify payment was created
    const paymentsResponse = await request(app)
      .get('/api/payments/provider')
      .set('Authorization', `Bearer ${providerToken}`)
      .expect(200);
    
    const payment = paymentsResponse.body.data.payments
      .find(p => p.bookingId === bookingId);
    
    expect(payment).toBeDefined();
    expect(payment.amount).toBe(85.00);
    expect(payment.commission).toBe(8.50);
    expect(payment.providerEarnings).toBe(76.20);
  });
});
```

**Load Testing (Artillery.js):**
```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100

scenarios:
  - name: "Service Search Load Test"
    weight: 70
    flow:
      - get:
          url: "/api/services"
          qs:
            page: "{{ $randomInt(1, 10) }}"
            category: "{{ $randomString() }}"
      - think: 2
      
  - name: "Authentication Load Test"
    weight: 30
    flow:
      - post:
          url: "/api/auth/login/user"
          json:
            email: "test{{ $randomInt(1, 1000) }}@example.com"
            password: "password123"
```

This comprehensive backend development prompt provides everything needed to build a production-ready API for the GetEasy mobile application, including detailed implementation examples, business logic, error handling, testing strategies, and deployment considerations.