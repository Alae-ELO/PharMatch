import { create } from 'zustand';
import { 
  User, 
  Pharmacy, 
  Medication, 
  BloodDonationRequest, 
  Notification, 
  Message 
} from '../types';
import { 
  pharmacies as mockPharmacies, 
  medications as mockMedications, 
  users as mockUsers,
  bloodDonationRequests as mockBloodRequests,
  notifications as mockNotifications,
  sampleMessages as mockMessages
} from '../data/mockData';

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
  fetchMedications: () => Promise<void>;
  searchMedications: (query: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  registerAsBloodDonor: (bloodType: string) => Promise<void>;
  createBloodDonationRequest: (request: Omit<BloodDonationRequest, 'id' | 'createdAt' | 'expiresAt'>) => Promise<void>;
}

const useStore = create<PharMatchState>((set, get) => ({
  // Initial state
  pharmacies: mockPharmacies,
  medications: mockMedications,
  users: mockUsers,
  bloodDonationRequests: mockBloodRequests,
  notifications: mockNotifications,
  messages: mockMessages,
  currentUser: null,
  token: localStorage.getItem('token'),
  user: null, // Add this line to initialize the user property
  cityFilter: null,
  medicationFilter: null,
  
  // Auth actions
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
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
      
      // Store the token
      localStorage.setItem('token', data.token);
      
      // Get user data from the token or make another request to get user details
      const userData = data.user || { email }; // Adjust based on your API response
      
      set({ 
        currentUser: userData as User,
        token: data.token,
        user: userData as User // Also set the user property
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
    // In a real app, this would be an API call
    set({ pharmacies: mockPharmacies, cityFilter: null });
  },
  
  fetchPharmaciesByCity: async (city: string) => {
    // In a real app, this would be an API call with filtering
    const filteredPharmacies = mockPharmacies.filter(
      p => p.city.toLowerCase() === city.toLowerCase()
    );
    
    set({ pharmacies: filteredPharmacies, cityFilter: city });
  },
  
  fetchMedications: async () => {
    // In a real app, this would be an API call
    set({ medications: mockMedications, medicationFilter: null });
  },
  
  searchMedications: async (query: string) => {
    // In a real app, this would be an API call with filtering
    const filteredMedications = mockMedications.filter(
      m => m.name.toLowerCase().includes(query.toLowerCase()) || 
           m.description.toLowerCase().includes(query.toLowerCase()) ||
           m.category.toLowerCase().includes(query.toLowerCase())
    );
    
    set({ medications: filteredMedications, medicationFilter: query });
  },
  
  fetchNotifications: async () => {
    // In a real app, this would be an API call
    set({ notifications: mockNotifications });
  },
  
  markNotificationAsRead: (id: string) => {
    set(state => ({
      notifications: state.notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    }));
  },
  
  sendMessage: async (content: string) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    // Add user message
    set(state => ({
      messages: [...state.messages, newMessage]
    }));
    
    // In a real app, this would be an API call to get a response
    // Simulate AI response (with a delay)
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: `This is a simulated response to your question: "${content}". In the full implementation, this would be connected to the Gemini API or another AI service to provide accurate health information.`,
        timestamp: new Date().toISOString()
      };
      
      set(state => ({
        messages: [...state.messages, aiResponse]
      }));
    }, 1000);
  },
  
  registerAsBloodDonor: async (bloodType: string) => {
    if (!get().currentUser) return;
    
    const updatedUser = {
      ...get().currentUser!,
      bloodDonor: {
        bloodType,
        lastDonation: undefined,
        eligibleToDonateSince: new Date().toISOString()
      }
    };
    
    // Update the current user
    set({ currentUser: updatedUser });
    
    // Update the user in the users array
    set(state => ({
      users: state.users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    }));
  },
  
  createBloodDonationRequest: async (request) => {
    const newRequest: BloodDonationRequest = {
      ...request,
      id: `request-${Date.now()}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };
    
    set(state => ({
      bloodDonationRequests: [...state.bloodDonationRequests, newRequest]
    }));
    
    // Create a notification for this request
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'blood',
      title: `${request.urgency === 'high' ? 'URGENT: ' : ''}${request.bloodType} Blood Needed`,
      message: `${request.hospital} needs ${request.bloodType} blood donations. Please contact ${request.contactInfo} if you can help.`,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    set(state => ({
      notifications: [...state.notifications, newNotification]
    }));
  }
}));

export default useStore;