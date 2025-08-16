
import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  role: 'user' | 'vendor' | 'user_vendor';
  badges?: string[];
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    location: {
        city: string;
        state: string;
        country: string;
    };
  };
  vendorProfile?: {
    businessName: string;
    businessType: 'individual' | 'company';
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastActive?: Timestamp;
}
