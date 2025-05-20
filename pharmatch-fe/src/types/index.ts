export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  medications: string[];
}

export interface Medication {
  id: string;
  name: string;
  description: string;
  category: string;
  prescription: boolean;
  pharmacies: {
    id: string;
    name: string;
    inStock: boolean;
    price?: number;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'pharmacy' | 'admin';
  bloodDonor?: {
    bloodType: string;
    lastDonation?: string;
    eligibleToDonateSince?: string;
  };
}

export interface BloodDonationRequest {
  id: string;
  bloodType: string;
  hospital: string;
  urgency: 'low' | 'medium' | 'high';
  contactInfo: string;
  createdAt: string;
  expiresAt: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'blood' | 'medication' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}