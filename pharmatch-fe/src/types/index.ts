export interface Pharmacy {
  _id: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  name: string;
  name_ar: string;
  city: string;
  region: string;
  region_ar: string;
  phone: string;
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  permanence: {
    isOnDuty: boolean;
    days: string[];
  };
  status: 'open' | 'closed';
  owner: string | null;
  createdAt: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Medication {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  category: string;
  prescription: boolean;
  image_url?: string;
  pharmacies?: Array<{
    id: string;
    name: string;
    inStock: boolean;
    price?: number;
  }>;
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
  urgency: 'high' | 'medium' | 'low';
  status: 'active' | 'fulfilled' | 'expired';
  contactInfo: string;
  donors?: Array<{
    id: string;
    name: string;
    bloodType: string;
  }>;
  createdAt: string;
  expiresAt: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedItem?: any;
}