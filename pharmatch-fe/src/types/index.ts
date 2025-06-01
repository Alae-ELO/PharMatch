export interface Pharmacy {
  id: string;
  name: string;
  name_ar: string;
  address: string;
  city: string;
  region: string;
  region_ar: string;
  phone: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  medications: Array<{
    id: string;
    name: string;
    prescription: boolean;
    inStock: boolean;
    price?: number;
  }>;
}

export interface Medication {
  id: string;
  name: {
    en: string;
    ar: string;
    fr: string;
  };
  description: {
    en: string;
    ar: string;
    fr: string;
  };
  category: {
    en: string;
    ar: string;
    fr: string;
  };
  prescription: boolean;
  image_url?: string;
  pharmacies: Pharmacy[];
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