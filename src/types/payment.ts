export interface Payment {
  id: string;
  bookingId: string;
  providerId: string;
  userId: string;
  amount: number;
  commission: number;
  providerEarnings: number;
  createdAt: string;
}
