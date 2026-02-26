export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  date: string;
  time: string;
  address: string;
  state?: string;
  lga?: string;
  city?: string;
  status: "Pending" | "Accepted" | "Declined" | "Completed" | "Rescheduled";
  reviewed?: boolean;
  userName?: string;
  userPhone?: string;
  providerName?: string;
  serviceTitle?: string;
  servicePrice?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentReminder {
  id: string;
  bookingId: string;
  type: "push" | "sms" | "email";
  scheduledFor: string;
  sent: boolean;
  sentAt?: string;
}

export interface CalendarSync {
  id: string;
  bookingId: string;
  provider: "google" | "outlook";
  eventId: string;
  synced: boolean;
  syncedAt?: string;
}
