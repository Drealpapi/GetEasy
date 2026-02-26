export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
