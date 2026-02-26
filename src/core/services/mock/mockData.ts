import { Booking } from "../../../features/booking/types/booking";
import { calculateCommission, generateId } from "../../../shared/utils/helpers";
import { Payment } from "../../types/payment";
import { Review } from "../../types/review";
import { Service } from "../../types/service";
import { User } from "../../types/user";

// ====================================================
// SIMULATED NETWORK LATENCY
// ====================================================
const delay = (ms: number = 500) => new Promise((res) => setTimeout(res, ms));

// ====================================================
// MOCK DATA ARRAYS
// ====================================================

export const MOCK_USERS: User[] = [
  {
    id: "user_001",
    name: "John Smith",
    email: "john@example.com",
    role: "user",
    state: "Lagos",
    lga: "Ikeja",
    city: "Ikeja GRA",
    phone: "+234-555-0101",
  },
  {
    id: "user_002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "user",
    state: "Abuja FCT",
    lga: "Abuja Municipal",
    city: "Wuse",
    phone: "+234-555-0102",
  },
  {
    id: "user_003",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "user",
    state: "Rivers",
    lga: "Port Harcourt",
    city: "GRA Phase 2",
    phone: "+234-555-0103",
  },
  {
    id: "user_004",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "user",
    state: "Kano",
    lga: "Kano Municipal",
    city: "Sabon Gari",
    phone: "+234-555-0104",
  },
  {
    id: "user_005",
    name: "David Wilson",
    email: "david@example.com",
    role: "user",
    state: "Oyo",
    lga: "Ibadan North",
    city: "Bodija",
    phone: "+234-555-0105",
  },
];

export const MOCK_PROVIDERS: User[] = [
  {
    id: "provider_001",
    name: "Tom Electric",
    email: "tom@electric.com",
    role: "provider",
    avatar: "https://i.pravatar.cc/150?img=12",
    state: "Lagos",
    lga: "Ikeja",
    city: "Ikeja GRA",
    phone: "+234-555-1001",
  },
  {
    id: "provider_002",
    name: "Lisa Plumbing",
    email: "lisa@plumbing.com",
    role: "provider",
    avatar: "https://i.pravatar.cc/150?img=45",
    state: "Abuja FCT",
    lga: "Abuja Municipal",
    city: "Wuse",
    phone: "+234-555-1002",
  },
  {
    id: "provider_003",
    name: "Mark Clean",
    email: "mark@clean.com",
    role: "provider",
    avatar: "https://i.pravatar.cc/150?img=33",
    state: "Rivers",
    lga: "Port Harcourt",
    city: "GRA Phase 2",
    phone: "+234-555-1003",
  },
  {
    id: "provider_004",
    name: "Anna Tutor",
    email: "anna@tutor.com",
    role: "provider",
    avatar: "https://i.pravatar.cc/150?img=20",
    state: "Kano",
    lga: "Kano Municipal",
    city: "Sabon Gari",
    phone: "+234-555-1004",
  },
  {
    id: "provider_005",
    name: "Carlos Mechanic",
    email: "carlos@mechanic.com",
    role: "provider",
    avatar: "https://i.pravatar.cc/150?img=68",
    state: "Oyo",
    lga: "Ibadan North",
    city: "Bodija",
    phone: "+234-555-1005",
  },
];

export const MOCK_SERVICES: Service[] = [
  {
    id: "service_001",
    providerId: "provider_001",
    title: "Home Electrical Repair",
    description: "Professional electrical repair and installation services for your home.",
    category: "Electricians",
    price: 85,
    state: "Lagos",
    city: "Ikeja",
    rating: 4.8,
    completedJobs: 127,
  },
  {
    id: "service_002",
    providerId: "provider_001",
    title: "Electrical Panel Upgrade",
    description: "Upgrade your electrical panel to meet modern safety standards.",
    category: "Electricians",
    price: 350,
    state: "Lagos",
    city: "Victoria Island",
    rating: 4.9,
    completedJobs: 45,
  },
  {
    id: "service_003",
    providerId: "provider_002",
    title: "Emergency Plumbing",
    description: "24/7 emergency plumbing services for leaks, clogs, and repairs.",
    category: "Plumbers",
    price: 120,
    state: "FCT",
    city: "Abuja",
    rating: 4.7,
    completedJobs: 203,
  },
  {
    id: "service_004",
    providerId: "provider_002",
    title: "Bathroom Renovation",
    description: "Complete bathroom plumbing installation and renovation.",
    category: "Plumbers",
    price: 450,
    state: "FCT",
    city: "Gwagwalada",
    rating: 4.6,
    completedJobs: 38,
  },
  {
    id: "service_005",
    providerId: "provider_003",
    title: "Deep House Cleaning",
    description: "Thorough deep cleaning service for your entire home.",
    category: "Cleaners",
    price: 150,
    state: "Rivers",
    city: "Port Harcourt",
    rating: 4.9,
    completedJobs: 312,
  },
  {
    id: "service_006",
    providerId: "provider_003",
    title: "Move-In/Move-Out Cleaning",
    description: "Professional cleaning for moving in or out of a property.",
    category: "Cleaners",
    price: 200,
    state: "Rivers",
    city: "Obio-Akpor",
    rating: 4.8,
    completedJobs: 156,
  },
  {
    id: "service_007",
    providerId: "provider_004",
    title: "Math Tutoring",
    description: "One-on-one math tutoring for high school and college students.",
    category: "Tutors",
    price: 60,
    state: "Kano",
    city: "Kano",
    rating: 5.0,
    completedJobs: 89,
  },
  {
    id: "service_008",
    providerId: "provider_004",
    title: "SAT Prep Tutoring",
    description: "Comprehensive SAT preparation and test-taking strategies.",
    category: "Tutors",
    price: 75,
    state: "Kano",
    city: "Wudil",
    rating: 4.9,
    completedJobs: 67,
  },
  {
    id: "service_009",
    providerId: "provider_005",
    title: "Car Oil Change",
    description: "Quick and professional oil change service for all vehicle types.",
    category: "Mechanics",
    price: 45,
    state: "Oyo",
    city: "Ibadan",
    rating: 4.7,
    completedJobs: 421,
  },
  {
    id: "service_010",
    providerId: "provider_005",
    title: "Brake Repair",
    description: "Expert brake inspection, repair, and replacement services.",
    category: "Mechanics",
    price: 180,
    state: "Oyo",
    city: "Ogbomosho",
    rating: 4.8,
    completedJobs: 198,
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "booking_001",
    userId: "user_001",
    providerId: "provider_001",
    serviceId: "service_001",
    date: "2024-12-15",
    time: "10:00 AM",
    address: "123 Main St",
    state: "Lagos",
    lga: "Ikeja",
    city: "Ikeja GRA",
    status: "Completed",
    reviewed: true,
    userName: "John Smith",
    userPhone: "+234-555-0101",
    serviceTitle: "Home Electrical Repair",
    servicePrice: 85,
    notes: "Need to fix kitchen outlet",
    createdAt: "2024-12-10T08:00:00Z",
    updatedAt: "2024-12-15T14:00:00Z",
  },
  {
    id: "booking_002",
    userId: "user_002",
    providerId: "provider_002",
    serviceId: "service_003",
    date: "2024-12-20",
    time: "2:00 PM",
    address: "456 Oak Ave",
    state: "Abuja FCT",
    lga: "Abuja Municipal",
    city: "Wuse",
    status: "Accepted",
    reviewed: false,
    userName: "Sarah Johnson",
    userPhone: "+234-555-0102",
    serviceTitle: "Emergency Plumbing",
    servicePrice: 120,
    notes: "Leaking pipe in bathroom",
    createdAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "booking_003",
    userId: "user_003",
    providerId: "provider_003",
    serviceId: "service_005",
    date: "2024-12-18",
    time: "9:00 AM",
    address: "789 Beach Blvd",
    state: "Rivers",
    lga: "Port Harcourt",
    city: "GRA Phase 2",
    status: "Pending",
    reviewed: false,
    userName: "Michael Brown",
    userPhone: "+234-555-0103",
    serviceTitle: "Deep House Cleaning",
    servicePrice: 150,
    notes: "3 bedroom house",
    createdAt: "2024-12-16T14:00:00Z",
  },
  {
    id: "booking_004",
    userId: "user_004",
    providerId: "provider_004",
    serviceId: "service_007",
    date: "2024-12-10",
    time: "4:00 PM",
    address: "321 Park Ave",
    state: "Kano",
    lga: "Kano Municipal",
    city: "Sabon Gari",
    status: "Completed",
    reviewed: true,
    userName: "Emily Davis",
    userPhone: "+234-555-0104",
    serviceTitle: "Math Tutoring",
    servicePrice: 60,
    notes: "Algebra help needed",
    createdAt: "2024-12-05T09:00:00Z",
    updatedAt: "2024-12-10T18:00:00Z",
  },
  {
    id: "booking_005",
    userId: "user_005",
    providerId: "provider_005",
    serviceId: "service_009",
    date: "2024-12-22",
    time: "11:00 AM",
    address: "654 Lake St",
    state: "Oyo",
    lga: "Ibadan North",
    city: "Bodija",
    status: "Pending",
    reviewed: false,
    userName: "David Wilson",
    userPhone: "+234-555-0105",
    serviceTitle: "Car Oil Change",
    servicePrice: 45,
    notes: "Honda Civic 2020",
    createdAt: "2024-12-19T16:00:00Z",
  },
  {
    id: "booking_006",
    userId: "user_001",
    providerId: "provider_001",
    serviceId: "service_002",
    date: "2024-12-25",
    time: "1:00 PM",
    address: "123 Main St",
    state: "Lagos",
    lga: "Lagos Island",
    city: "Victoria Island",
    status: "Accepted",
    reviewed: false,
    userName: "John Smith",
    userPhone: "+234-555-0101",
    serviceTitle: "Electrical Panel Upgrade",
    servicePrice: 350,
    notes: "Old panel needs replacement",
    createdAt: "2024-12-20T11:00:00Z",
  },
  {
    id: "booking_007",
    userId: "user_002",
    providerId: "provider_002",
    serviceId: "service_004",
    date: "2024-12-08",
    time: "10:00 AM",
    address: "456 Oak Ave",
    state: "Abuja FCT",
    lga: "Gwagwalada",
    city: "Gwagwalada Town",
    status: "Completed",
    reviewed: false,
    userName: "Sarah Johnson",
    userPhone: "+234-555-0102",
    serviceTitle: "Bathroom Renovation",
    servicePrice: 450,
    notes: "Complete bathroom plumbing",
    createdAt: "2024-11-30T09:00:00Z",
    updatedAt: "2024-12-08T16:00:00Z",
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "review_001",
    bookingId: "booking_001",
    userId: "user_001",
    providerId: "provider_001",
    rating: 5,
    comment: "Excellent service! Very professional and fixed the issue quickly.",
    createdAt: "2024-12-15T14:30:00Z",
  },
  {
    id: "review_002",
    bookingId: "booking_004",
    userId: "user_004",
    providerId: "provider_004",
    rating: 5,
    comment: "Anna is an amazing tutor! My grades improved significantly.",
    createdAt: "2024-12-10T18:00:00Z",
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "payment_001",
    bookingId: "booking_001",
    providerId: "provider_001",
    userId: "user_001",
    amount: 85,
    commission: 8.5,
    providerEarnings: 76.5,
    createdAt: "2024-12-15T14:00:00Z",
  },
  {
    id: "payment_002",
    bookingId: "booking_004",
    providerId: "provider_004",
    userId: "user_004",
    amount: 60,
    commission: 6,
    providerEarnings: 54,
    createdAt: "2024-12-10T17:30:00Z",
  },
];

// ====================================================
// SERVICES CRUD
// ====================================================

export const getAllServices = async (): Promise<Service[]> => {
  await delay();
  return [...MOCK_SERVICES];
};

export const getServicesByState = async (state: string): Promise<Service[]> => {
  await delay();
  return MOCK_SERVICES.filter((service) => service.state === state);
};

export const getServiceById = async (id: string): Promise<Service | undefined> => {
  await delay();
  return MOCK_SERVICES.find((service) => service.id === id);
};

export const createService = async (
  serviceData: Omit<Service, "id">
): Promise<Service> => {
  await delay();
  const newService: Service = {
    ...serviceData,
    id: generateId("service"),
    rating: 0,
    completedJobs: 0,
  };
  MOCK_SERVICES.push(newService);
  return newService;
};

export const updateService = async (
  id: string,
  data: Partial<Service>
): Promise<Service | undefined> => {
  await delay();
  const index = MOCK_SERVICES.findIndex((service) => service.id === id);
  if (index !== -1) {
    MOCK_SERVICES[index] = { ...MOCK_SERVICES[index], ...data };
    return MOCK_SERVICES[index];
  }
  return undefined;
};

export const deleteService = async (id: string): Promise<boolean> => {
  await delay();
  const index = MOCK_SERVICES.findIndex((service) => service.id === id);
  if (index !== -1) {
    MOCK_SERVICES.splice(index, 1);
    return true;
  }
  return false;
};

// ====================================================
// BOOKINGS CRUD
// ====================================================

export const createBooking = async (
  bookingData: Omit<Booking, "id" | "status">
): Promise<Booking> => {
  await delay();
  const newBooking: Booking = {
    ...bookingData,
    id: generateId("booking"),
    status: "Pending",
    reviewed: false,
  };
  MOCK_BOOKINGS.push(newBooking);
  return newBooking;
};

export const getBookingsForUser = async (userId: string): Promise<Booking[]> => {
  await delay();
  return MOCK_BOOKINGS.filter((booking) => booking.userId === userId);
};

export const getBookingsForProvider = async (
  providerId: string
): Promise<Booking[]> => {
  await delay();
  return MOCK_BOOKINGS.filter((booking) => booking.providerId === providerId);
};

export const updateBookingStatus = async (
  id: string,
  status: Booking["status"]
): Promise<Booking | undefined> => {
  await delay();
  const index = MOCK_BOOKINGS.findIndex((booking) => booking.id === id);
  if (index !== -1) {
    MOCK_BOOKINGS[index].status = status;
    MOCK_BOOKINGS[index].updatedAt = new Date().toISOString();

    // Auto-create payment when booking is completed
    if (status === "Completed") {
      const booking = MOCK_BOOKINGS[index];
      const service = MOCK_SERVICES.find((s) => s.id === booking.serviceId);
      if (service) {
        const amount = service.price;
        const commission = calculateCommission(amount);
        const providerEarnings = amount - commission;

        const payment: Payment = {
          id: generateId("payment"),
          bookingId: booking.id,
          providerId: booking.providerId,
          userId: booking.userId,
          amount,
          commission,
          providerEarnings,
          createdAt: new Date().toISOString(),
        };
        MOCK_PAYMENTS.push(payment);
      }
    }

    return MOCK_BOOKINGS[index];
  }
  return undefined;
};

export const rescheduleBooking = async (
  id: string,
  newDate: string,
  newTime: string
): Promise<Booking | undefined> => {
  await delay();
  const index = MOCK_BOOKINGS.findIndex((booking) => booking.id === id);
  if (index !== -1) {
    MOCK_BOOKINGS[index].date = newDate;
    MOCK_BOOKINGS[index].time = newTime;
    MOCK_BOOKINGS[index].status = "Rescheduled";
    MOCK_BOOKINGS[index].updatedAt = new Date().toISOString();
    return MOCK_BOOKINGS[index];
  }
  return undefined;
};

// ====================================================
// REVIEWS CRUD
// ====================================================

export const addReview = async (
  reviewData: Omit<Review, "id" | "createdAt">
): Promise<Review> => {
  await delay();
  const newReview: Review = {
    ...reviewData,
    id: generateId("review"),
    createdAt: new Date().toISOString(),
  };
  MOCK_REVIEWS.push(newReview);

  // Mark booking as reviewed
  const bookingIndex = MOCK_BOOKINGS.findIndex(
    (b) => b.id === reviewData.bookingId
  );
  if (bookingIndex !== -1) {
    MOCK_BOOKINGS[bookingIndex].reviewed = true;
  }

  return newReview;
};

export const getReviewsForProvider = async (
  providerId: string
): Promise<Review[]> => {
  await delay();
  return MOCK_REVIEWS.filter((review) => review.providerId === providerId);
};

export const calculateProviderRating = async (
  providerId: string
): Promise<number> => {
  await delay();
  const reviews = MOCK_REVIEWS.filter((review) => review.providerId === providerId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

// ====================================================
// PAYMENTS CRUD
// ====================================================

export const createPayment = async (
  paymentData: Omit<Payment, "id" | "createdAt">
): Promise<Payment> => {
  await delay();
  const newPayment: Payment = {
    ...paymentData,
    id: generateId("payment"),
    createdAt: new Date().toISOString(),
  };
  MOCK_PAYMENTS.push(newPayment);
  return newPayment;
};

export const getPaymentsForProvider = async (
  providerId: string
): Promise<Payment[]> => {
  await delay();
  return MOCK_PAYMENTS.filter((payment) => payment.providerId === providerId);
};
