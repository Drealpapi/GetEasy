export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "provider";
  avatar?: string;
  state?: string;
  lga?: string;
  city?: string;
  phone?: string;
}
