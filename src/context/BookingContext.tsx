import React, { createContext, useContext, useState, useEffect } from "react";
import { Booking, AppointmentReminder } from "../types/booking";
import {
  getBookingsForProvider,
  updateBookingStatus,
  rescheduleBooking,
} from "../services/mock/mockData";
import { useDemoAuth } from "./DemoAuthContext";

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  refreshBookings: () => Promise<void>;
  acceptBooking: (bookingId: string) => Promise<void>;
  declineBooking: (bookingId: string) => Promise<void>;
  completeBooking: (bookingId: string) => Promise<void>;
  rescheduleBookingDate: (bookingId: string, newDate: string, newTime: string) => Promise<void>;
  scheduleReminder: (bookingId: string, type: "push" | "sms" | "email") => Promise<void>;
  syncToCalendar: (bookingId: string, provider: "google" | "outlook") => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useDemoAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshBookings = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await getBookingsForProvider(currentUser.id);
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBookings();
  }, [currentUser?.id]);

  const acceptBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "Accepted");
    await refreshBookings();
  };

  const declineBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "Declined");
    await refreshBookings();
  };

  const completeBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "Completed");
    await refreshBookings();
  };

  const rescheduleBookingDate = async (bookingId: string, newDate: string, newTime: string) => {
    await rescheduleBooking(bookingId, newDate, newTime);
    await refreshBookings();
  };

  const scheduleReminder = async (bookingId: string, type: "push" | "sms" | "email") => {
    // Simulate scheduling a reminder
    console.log(`Reminder scheduled for booking ${bookingId} via ${type}`);
    // In production, this would integrate with notification services
  };

  const syncToCalendar = async (bookingId: string, provider: "google" | "outlook") => {
    // Simulate calendar sync
    console.log(`Syncing booking ${bookingId} to ${provider} calendar`);
    // In production, this would integrate with Google Calendar API or Outlook API
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        refreshBookings,
        acceptBooking,
        declineBooking,
        completeBooking,
        rescheduleBookingDate,
        scheduleReminder,
        syncToCalendar,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookings must be used within BookingProvider");
  }
  return context;
};
