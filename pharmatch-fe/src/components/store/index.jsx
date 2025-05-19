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

/**
 * @typedef {Object} PharMatchStore
 * @property {Array} pharmacies - List of pharmacies
 * @property {Array} medications - List of medications
 * @property {Array} users - List of users
 * @property {Array} bloodDonationRequests - List of blood donation requests
 * @property {Array} notifications - List of notifications
 * @property {Array} messages - List of messages
 * @property {Object|null} currentUser - Currently logged in user
 * @property {string|null} cityFilter - Current city filter
 * @property {string|null} medicationFilter - Current medication filter
 */

const useStore = create((set, get) => ({
  // Initial state
  pharmacies: mockPharmacies,
  medications: mockMedications,
  users: mockUsers,
  bloodDonationRequests: mockBloodRequests,
  notifications: mockNotifications,
  messages: mockMessages,
  currentUser: null,
  cityFilter: null,
  medicationFilter: null,
  
  // Auth actions
  login: async (email, password) => {
    // In a real app, this would be an API call
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      set({ currentUser: user });
      return true;
    }
    
    return false;
  },
  
  logout: () => {
    set({ currentUser: null });
  },
  
  // Data fetching actions
  fetchPharmacies: async () => {
    // In a real app, this would be an API call
    set({ pharmacies: mockPharmacies, cityFilter: null });
  },
  
  fetchPharmaciesByCity: async (city) => {
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
  
  searchMedications: async (query) => {
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
  
  markNotificationAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    }));
  },
  
  sendMessage: async (content) => {
    const newMessage = {
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
      const aiResponse = {
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
  
  registerAsBloodDonor: async (bloodType) => {
    if (!get().currentUser) return;
    
    const updatedUser = {
      ...get().currentUser,
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
    const newRequest = {
      ...request,
      id: `request-${Date.now()}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };
    
    set(state => ({
      bloodDonationRequests: [...state.bloodDonationRequests, newRequest]
    }));
    
    // Create a notification for this request
    const newNotification = {
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