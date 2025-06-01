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
  registerAsBloodDonor: (bloodType: string) => Promise<void>;
  createBloodDonationRequest: (request: any) => Promise<void>;
  fetchBloodDonationRequests: () => Promise<void>;
  fetchMedications: (queryParams?: string) => Promise<void>;
  fetchMedicationById: (id: string) => Promise<Medication | null>;
  fetchPharmaciesByMedication: (medicationId: string) => Promise<Pharmacy[]>;

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
      set({ pharmacies: transformedPharmacies });
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
      console.log('Fetching pharmacy with ID:', id);
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
        id: data.data._id || data.data.id,
        name: data.data.name,
        name_ar: data.data.name_ar,
        address: data.data.address,
        city: data.data.city,
        region: data.data.region,
        region_ar: data.data.region_ar,
        phone: data.data.phone,
        hours: data.data.hours,
        coordinates: data.data.coordinates || {
          lat: data.data.location?.coordinates[1],
          lng: data.data.location?.coordinates[0]
        },
        medications: data.data.medications
      };
      
      set(state => {
        const existingPharmacyIndex = state.pharmacies.findIndex(p => p.id === id);
        if (existingPharmacyIndex >= 0) {
          // Update existing pharmacy
          const updatedPharmacies = [...state.pharmacies];
          updatedPharmacies[existingPharmacyIndex] = transformedPharmacy;
          return { pharmacies: updatedPharmacies };
        } else {
          // Add new pharmacy to the array
          return { pharmacies: [...state.pharmacies, transformedPharmacy] };
        }
      });
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
      set({ pharmacies: transformedPharmacies, cityFilter: city });
    } catch (error) {
      console.error('Error fetching pharmacies by city:', error);
      throw error;
    }
  },
  
  fetchMedications: async (queryParams?: string) => {
    try {
      const response = await fetch(`${API_URL}/medications${queryParams ? `?${queryParams}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medications');
      }
      const data = await response.json();
      set({ medications: data.data || [] });
    } catch (error) {
      console.error('Error fetching medications:', error);
      set({ medications: [] });
      throw error;
    }
  },

  fetchPharmaciesByMedication: async (medicationId: string) => {
    try {
      const response = await fetch(`${API_URL}/medications/${medicationId}/pharmacies`, {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch pharmacies for medication');
      }
      
      const data = await response.json();
      
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from server');
      }

      const transformedPharmacies = data.data.map((pharmacy: any) => ({
        id: pharmacy._id || pharmacy.id,
        name: pharmacy.name,
        name_ar: pharmacy.name_ar,
        address: pharmacy.address,
        city: pharmacy.city,
        region: pharmacy.region,
        region_ar: pharmacy.region_ar,
        phone: pharmacy.phone,
        hours: pharmacy.hours,
        coordinates: pharmacy.coordinates || {
          lat: pharmacy.location?.coordinates[1],
          lng: pharmacy.location?.coordinates[0]
        },
        price: pharmacy.price || null,
        inStock: pharmacy.inStock || false
      }));

      set({ pharmacies: transformedPharmacies });
      return transformedPharmacies;
    } catch (error) {
      console.error('Error fetching pharmacies for medication:', error);
      throw error;
    }
  },

  fetchMedicationById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/medications/${id}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch medication details');
      }
      
      const data = await response.json();
      
      // Check if we have valid data
      if (!data || !data.data) {
        throw new Error('Invalid medication data received');
      }

      const medicationData = data.data;
      
      // Safely transform the medication data
      const transformedMedication = {
        id: medicationData._id || medicationData.id || id,
        name: medicationData.name || { en: 'Unknown', ar: 'غير معروف' },
        description: medicationData.description || { en: '', ar: '' },
        category: medicationData.category || { en: 'Uncategorized', ar: 'غير مصنف' },
        prescription: medicationData.prescription || false,
        image_url: medicationData.image_url || null,
        pharmacies: medicationData.pharmacies || []
      };

      set(state => {
        const existingMedicationIndex = state.medications.findIndex(m => m.id === id);
        if (existingMedicationIndex >= 0) {
          const updatedMedications = [...state.medications];
          updatedMedications[existingMedicationIndex] = transformedMedication;
          return { medications: updatedMedications };
        } else {
          return { medications: [...state.medications, transformedMedication] };
        }
      });

      return transformedMedication;
    } catch (error) {
      console.error('Error fetching medication details:', error);
      throw error;
    }
  },
  registerAsBloodDonor: async (bloodType: string) => {
    const { currentUser, token } = get();
    if (!currentUser || !token) throw new Error('Not authenticated');
    const response = await fetch(`${API_URL}/users/${currentUser.id}/blood-donor`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bloodType })
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to register as blood donor');
    }
    const data = await response.json();
    set(state => ({
      currentUser: {
        ...state.currentUser!,
        bloodDonor: data.data
      }
    }));
  },

  createBloodDonationRequest: async (request: any) => {
    const { token } = get();
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_URL}/blood-donation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(request)
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to create blood donation request');
    }
    // Optionally: refresh bloodDonationRequests list here
  },

  fetchBloodDonationRequests: async () => {
    try {
      const response = await fetch(`${API_URL}/blood-donation`);
      if (!response.ok) throw new Error('Failed to fetch blood donation requests');
      const data = await response.json();
      set({ bloodDonationRequests: data.data });
    } catch (error) {
      console.error('Error fetching blood donation requests:', error);
    }
  },

}));

export default useStore;
