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
  user: User | null; // Add this line to fix the error
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Filter states
  cityFilter: string | null;
  medicationFilter: string | null;
  
  // Actions
  fetchPharmacies: () => Promise<void>;
  fetchPharmaciesByCity: (city: string) => Promise<void>;
  fetchMedications: (page?: number) => Promise<{ pagination?: { total: number; pages: number; page: number; limit: number } }>;
  fetchMedication: (id: string) => Promise<void>;
  searchMedications: (query: string) => Promise<{ pagination?: { total: number; pages: number; page: number; limit: number } }>;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  respondToNotification: (id: string, response: { inStock: boolean; price?: number }) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  registerAsBloodDonor: (bloodType: string) => Promise<void>;
  createBloodDonationRequest: (request: Omit<BloodDonationRequest, 'id' | 'createdAt' | 'expiresAt'>) => Promise<void>;
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
  user: null, // Add this line to initialize the user property
  cityFilter: null,
  medicationFilter: null,
  
  // Auth actions
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
        token: data.token
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ currentUser: null, token: null, user: null }); // Also clear the user property
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
      set({ pharmacies: data.data, cityFilter: null });
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      throw error;
    }
  },
  
  fetchPharmaciesByCity: async (city: string) => {
    try {
      const response = await fetch(`${API_URL}/pharmacies/city/${city}`, {
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
  
  fetchMedications: async (page = 1) => {
    try {
      const response = await fetch(`${API_URL}/medications?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch medications');
      }
      
      const data = await response.json();
      set({ medications: data.data, medicationFilter: null });
      return { pagination: data.pagination };
    } catch (error) {
      console.error('Error fetching medications:', error);
      throw error;
    }
  },
  
  fetchMedication: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/medications/${id}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch medication');
      }
      
      const data = await response.json();
      
      set(state => ({
        medications: state.medications.map(med => 
          med.id === id ? data.data : med
        )
      }));
    } catch (error) {
      console.error('Error fetching medication:', error);
      throw error;
    }
  },
  
  searchMedications: async (query: string) => {
    try {
      const response = await fetch(`${API_URL}/medications?search=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to search medications');
      }
      
      const data = await response.json();
      set({ medications: data.data, medicationFilter: query });
      return { pagination: data.pagination };
    } catch (error) {
      console.error('Error searching medications:', error);
      throw error;
    }
  },
  
  fetchNotifications: async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      set({ notifications: data.data });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },
  
  markNotificationAsRead: async (id: string) => {
    try {
      const notification = get().notifications.find(n => n.id === id);
      
      // If notification requires response, don't allow marking as read
      if (notification?.requiresResponse) {
        throw new Error('This notification requires a response before it can be marked as read');
      }

      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      set(state => ({
        notifications: state.notifications.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },
  
  respondToNotification: async (id: string, responseData: { inStock: boolean; price?: number }) => {
    try {
      const notification = get().notifications.find(n => n.id === id);
      
      if (!notification?.requiresResponse) {
        throw new Error('This notification does not require a response');
      }

      if (notification.type === 'medication') {
        const apiResponse = await fetch(`${API_URL}/medications/${notification.relatedItem?.itemId}/respond`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${get().token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(responseData)
        });

        if (!apiResponse.ok) {
          throw new Error('Failed to respond to medication notification');
        }

        // Remove the notification from the list since it's been responded to
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      }
    } catch (error) {
      console.error('Error responding to notification:', error);
      throw error;
    }
  },
  
  sendMessage: async (content: string) => {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().token}`
        },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      set(state => ({
        messages: [...state.messages, data.data]
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  registerAsBloodDonor: async (bloodType: string) => {
    try {
      const response = await fetch(`${API_URL}/users/blood-donor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().token}`
        },
        body: JSON.stringify({ bloodType })
      });
      
      if (!response.ok) {
        throw new Error('Failed to register as blood donor');
      }
      
      const data = await response.json();
      
      set({ currentUser: data.data });
    } catch (error) {
      console.error('Error registering as blood donor:', error);
      throw error;
    }
  },
  
  createBloodDonationRequest: async (request) => {
    try {
      const response = await fetch(`${API_URL}/blood-donation-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().token}`
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create blood donation request');
      }
      
      const data = await response.json();
      
      set(state => ({
        bloodDonationRequests: [...state.bloodDonationRequests, data.data]
      }));
    } catch (error) {
      console.error('Error creating blood donation request:', error);
      throw error;
    }
  },
  
  respondToBloodDonationRequest: async (requestId: string) => {
    try {
      const response = await api.post(`/api/blood-donations/${requestId}/respond`);
      
      // Update the blood donation request in the state
      set(state => {
        const updatedRequests = state.bloodDonationRequests.map(request => 
          request._id === requestId ? { ...request, donors: [...(request.donors || []), state.user?._id] } : request
        );
        
        return { ...state, bloodDonationRequests: updatedRequests };
      });
      
      return response.data;
    } catch (error) {
      console.error('Error responding to blood donation request:', error);
      throw error;
    }
  },
}));

export default useStore;
