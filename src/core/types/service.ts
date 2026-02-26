export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  state: string;
  lga?: string;
  city?: string;
  image?: string;
  rating?: number;
  completedJobs?: number;
}

export interface ProviderProfile {
  id: string;
  businessName: string;
  description: string;
  phone: string;
  email: string;
  state: string;
  lga: string;
  city: string;
  categories: string[];
  yearsExperience: number;
  hourlyRate: number;
  rating: number;
  completedJobs: number;
  responseTime: string;
  avatar?: string;
}
