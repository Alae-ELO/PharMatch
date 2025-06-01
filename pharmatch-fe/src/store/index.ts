import { create } from 'zustand';
import { 
  User,
  Pharmacy,
  Medication,
  BloodDonationRequest,
  Notification,
  Message
} from '../types';

interface PharMatchState {
  // Data
  pharmacies: Pharmacy[];
  medications: Medication[];
  users: User[];
  bloodDonationRequests: BloodDonationRequest[];
  notifications: Notification[];
  messages: Message[];
  
  // Authentication
  currentUser: User | null;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  
  // Filter states
  cityFilter: string | null;
  medicationFilter: string | null;
  
  // Actions
  fetchPharmacies: () => Promise<void>;
  fetchPharmaciesByLocation: (latitude: number, longitude: number) => Promise<void>;
  fetchPharmacyById: (id: string) => Promise<void>;
  fetchPharmaciesByCity: (city: string) => Promise<void>;
  fetchPharmaciesByMedication: (medicationId: string) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useStore = create<PharMatchState>((set, get) => ({
  // Initial state
  pharmacies: [],
  medications: [],
  users: [],
  bloodDonationRequests: [],
  notifications: [],
  messages: [],
  currentUser: null,
  token: localStorage.getItem('token'),
  user: null,
  cityFilter: null,
  medicationFilter: null,
  
  // Auth actions
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ currentUser: null, token: null, user: null });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const data = await response.json();
      set({ 
        currentUser: data.data,
        token: token,
        user: data.data
      });
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      set({ currentUser: null, token: null, user: null });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      
      set({ 
        currentUser: data.user,
        token: data.token,
        user: data.user
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ currentUser: null, token: null, user: null });
  },
  
  // Data fetching actions
  fetchPharmacies: async () => {
    try {
      const response = await fetch(`${API_URL}/pharmacies`, {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch pharmacies');
      }
      
      const data = await response.json();
      set({ pharmacies: data.data });
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      throw error;
    }
  },
  
  fetchPharmaciesByLocation: async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `${API_URL}/pharmacies/location?latitude=${latitude}&longitude=${longitude}`,
        {
          headers: {
            'Authorization': `Bearer ${get().token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch nearby pharmacies');
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (data.success && Array.isArray(data.data)) {
        // Transform the data if needed
        const transformedPharmacies = data.data.map((pharmacy: any) => ({
          id: pharmacy._id || pharmacy.id,
          name: pharmacy.name,
          name_ar: pharmacy.name_ar,
          address: pharmacy.address,
          city: pharmacy.city,
          region: pharmacy.region,
          region_ar: pharmacy.region_ar,
          phone: pharmacy.phone,
          email: pharmacy.email,
          hours: pharmacy.hours,
          coordinates: pharmacy.coordinates || {
            lat: pharmacy.location?.coordinates[1],
            lng: pharmacy.location?.coordinates[0]
          }
        }));
        
        console.log('Transformed pharmacies:', transformedPharmacies); // Debug log
        set({ pharmacies: transformedPharmacies });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching nearby pharmacies:', error);
      throw error;
    }
  },

  fetchPharmacyById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/pharmacies/${id}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch pharmacy details');
      }
      
      const data = await response.json();
      const transformedPharmacy = {
        id: data.data.id,
        name: data.data.name,
        name_ar: data.data.name_ar,
        address: data.data.address,
        city: data.data.city,
        region: data.data.region,
        region_ar: data.data.region_ar,
        phone: data.data.phone,
        hours: data.data.hours,
        coordinates: data.data.coordinates,
        medications: data.data.medications
      };
      
      set(state => ({
        pharmacies: state.pharmacies.map(p => 
          p.id === id ? transformedPharmacy : p
        )
      }));
    } catch (error) {
      console.error('Error fetching pharmacy details:', error);
      throw error;
    }
  },

  fetchPharmaciesByCity: async (city: string) => {
    try {
      const response = await fetch(`${API_URL}/pharmacies/search?city=${encodeURIComponent(city)}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch pharmacies by city');
      }
      
      const data = await response.json();
      set({ pharmacies: data.data, cityFilter: city });
    } catch (error) {
      console.error('Error fetching pharmacies by city:', error);
      throw error;
    }
  },

  fetchPharmaciesByMedication: async (medicationId: string) => {
    try {
      const response = await fetch(`${API_URL}/pharmacies/medication/${medicationId}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch pharmacies by medication');
      }
      
      const data = await response.json();
      set({ pharmacies: data.data });
    } catch (error) {
      console.error('Error fetching pharmacies by medication:', error);
      throw error;
    }
  },
  
}));

export default useStore;
