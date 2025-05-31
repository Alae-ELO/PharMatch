import { Pharmacy, Medication, User, BloodDonationRequest, Notification } from '../types';

export const pharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'MediCare Pharmacy',
    address: '123 Health St',
    city: 'New York',
    phone: '(212) 555-1234',
    email: 'contact@medicare.com',
    hours: 'Mon-Fri: 8am-8pm, Sat-Sun: 10am-6pm',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060,
    },
    medications: ['1', '2', '3', '5'],
  },
  {
    id: '2',
    name: 'Wellness Drugstore',
    address: '456 Wellness Ave',
    city: 'Los Angeles',
    phone: '(310) 555-6789',
    email: 'info@wellnessdrugstore.com',
    hours: 'Mon-Sun: 24 hours',
    coordinates: {
      lat: 34.0522,
      lng: -118.2437,
    },
    medications: ['1', '2', '4', '6'],
  },
  {
    id: '3',
    name: 'City Pharmaceuticals',
    address: '789 City Blvd',
    city: 'Chicago',
    phone: '(312) 555-9012',
    email: 'help@citypharma.com',
    hours: 'Mon-Sat: 9am-9pm, Sun: 10am-6pm',
    coordinates: {
      lat: 41.8781,
      lng: -87.6298,
    },
    medications: ['3', '4', '5', '6'],
  },
  {
    id: '4',
    name: 'Central Pharmacy',
    address: '101 Main St',
    city: 'Boston',
    phone: '(617) 555-3456',
    email: 'info@centralpharmacy.com',
    hours: 'Mon-Fri: 8am-10pm, Sat-Sun: 9am-7pm',
    coordinates: {
      lat: 42.3601,
      lng: -71.0589,
    },
    medications: ['1', '3', '5'],
  },
  {
    id: '5',
    name: 'Family Health Pharmacy',
    address: '202 Family Rd',
    city: 'Miami',
    phone: '(305) 555-7890',
    email: 'support@familyhealth.com',
    hours: 'Mon-Sun: 8am-8pm',
    coordinates: {
      lat: 25.7617,
      lng: -80.1918,
    },
    medications: ['2', '4', '6'],
  },
];

export const medications: Medication[] = [
  {
    id: '1',
    name: 'Amoxicillin',
    description: 'Antibiotic used to treat bacterial infections',
    category: 'Antibiotics',
    prescription: true,
    pharmacies: [
      { id: '1', name: 'MediCare Pharmacy', inStock: true, price: 15.99 },
      { id: '2', name: 'Wellness Drugstore', inStock: true, price: 14.50 },
      { id: '4', name: 'Central Pharmacy', inStock: true, price: 16.25 },
    ],
  },
  {
    id: '2',
    name: 'Ibuprofen',
    description: 'Pain reliever and fever reducer',
    category: 'Pain Relief',
    prescription: false,
    pharmacies: [
      { id: '1', name: 'MediCare Pharmacy', inStock: true, price: 7.99 },
      { id: '2', name: 'Wellness Drugstore', inStock: true, price: 6.95 },
      { id: '5', name: 'Family Health Pharmacy', inStock: true, price: 7.50 },
    ],
  },
  {
    id: '3',
    name: 'Lisinopril',
    description: 'Used to treat high blood pressure',
    category: 'Blood Pressure',
    prescription: true,
    pharmacies: [
      { id: '1', name: 'MediCare Pharmacy', inStock: true, price: 22.99 },
      { id: '3', name: 'City Pharmaceuticals', inStock: false },
      { id: '4', name: 'Central Pharmacy', inStock: true, price: 24.50 },
    ],
  },
  {
    id: '4',
    name: 'Cetirizine',
    description: 'Antihistamine for allergy relief',
    category: 'Allergy',
    prescription: false,
    pharmacies: [
      { id: '2', name: 'Wellness Drugstore', inStock: true, price: 12.99 },
      { id: '3', name: 'City Pharmaceuticals', inStock: true, price: 11.75 },
      { id: '5', name: 'Family Health Pharmacy', inStock: true, price: 13.25 },
    ],
  },
  {
    id: '5',
    name: 'Metformin',
    description: 'Used to treat type 2 diabetes',
    category: 'Diabetes',
    prescription: true,
    pharmacies: [
      { id: '1', name: 'MediCare Pharmacy', inStock: true, price: 18.50 },
      { id: '3', name: 'City Pharmaceuticals', inStock: true, price: 17.99 },
      { id: '4', name: 'Central Pharmacy', inStock: false },
    ],
  },
  {
    id: '6',
    name: 'Acetaminophen',
    description: 'Pain reliever and fever reducer',
    category: 'Pain Relief',
    prescription: false,
    pharmacies: [
      { id: '2', name: 'Wellness Drugstore', inStock: true, price: 5.99 },
      { id: '3', name: 'City Pharmaceuticals', inStock: true, price: 6.25 },
      { id: '5', name: 'Family Health Pharmacy', inStock: true, price: 5.75 },
    ],
  },
    {
    id: '7',
    name: 'Atorvastatin',
    description: 'Used to lower cholesterol levels',
    category: 'Cholesterol',
    prescription: true,
    pharmacies: [
      { id: '1', name: 'MediCare Pharmacy', inStock: true, price: 29.99 },
      { id: '3', name: 'City Pharmaceuticals', inStock: false },
      { id: '4', name: 'Central Pharmacy', inStock: true, price: 30.50 },
    ],
  },
  {
    id: '8',
    name: 'Omeprazole',
    description: 'Used to treat acid reflux and ulcers',
    category: 'Gastrointestinal',
    prescription: false,
    pharmacies: [
      { id: '2', name: 'Wellness Drugstore', inStock: true, price: 19.99 },
      { id: '3', name: 'City Pharmaceuticals', inStock: true, price: 18.75 },
      { id: '5', name: 'Family Health Pharmacy', inStock: true, price: 20.25 },
    ],
  },
  {
    id: '9',
    name: 'Amlodipine',
    description: 'Used to treat high blood pressure and chest pain',
    category: 'Blood Pressure',
    prescription: true,
    pharmacies: [
      { id: '1', name: 'MediCare Pharmacy', inStock: true, price: 23.50 },
      { id: '2', name: 'Wellness Drugstore', inStock: false },
      { id: '4', name: 'Central Pharmacy', inStock: true, price: 24.75 },
    ],
  },
  {
    id: '10',
    name: 'Hydrochlorothiazide',
    description: 'Diuretic used to treat high blood pressure and swelling',
    category: 'Blood Pressure',
    prescription: true,
    pharmacies: [
      { id: '3', name: 'City Pharmaceuticals', inStock: true, price: 15.99 },
      { id: '4', name: 'Central Pharmacy', inStock: true, price: 16.25 },
      { id: '5', name: 'Family Health Pharmacy', inStock: false },
    ],
  },
  {
    id: '11',
    name: 'Simvastatin',
    description: 'Used to lower cholesterol and triglyceride levels',
    category: 'Cholesterol',
    prescription: true,
    pharmacies: [
      { id: '1', name: 'MediCare Pharmacy', inStock: true, price: 28.50 },
      { id: '2', name: 'Wellness Drugstore', inStock: true, price: 27.95 },
      { id: '3', name: 'City Pharmaceuticals', inStock: false },
    ],
  },
  {
    id: '12',
    name: 'Albuterol',
    description: 'Inhaler used to treat asthma and breathing problems',
    category: 'Respiratory',
    prescription: true,
    pharmacies: [
      { id: '2', name: 'Wellness Drugstore', inStock: true, price: 32.99 },
      { id: '4', name: 'Central Pharmacy', inStock: true, price: 33.50 },
      { id: '5', name: 'Family Health Pharmacy', inStock: true, price: 31.75 },
    ],
  },

];

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    bloodDonor: {
      bloodType: 'O+',
      lastDonation: '2023-12-15',
      eligibleToDonateSince: '2024-03-15',
    },
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    bloodDonor: {
      bloodType: 'A-',
      lastDonation: '2023-10-20',
      eligibleToDonateSince: '2024-01-20',
    },
  },
  {
    id: '3',
    name: 'MediCare Pharmacy',
    email: 'admin@medicare.com',
    role: 'pharmacy',
  },
  {
    id: '4',
    name: 'System Admin',
    email: 'admin@pharmatch.com',
    role: 'admin',
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'user',
  },
];

export const bloodDonationRequests: BloodDonationRequest[] = [
  {
    id: '1',
    bloodType: 'O-',
    hospital: 'General Hospital',
    urgency: 'high',
    contactInfo: '(555) 123-4567',
    createdAt: '2024-05-01T08:30:00Z',
    expiresAt: '2024-05-03T08:30:00Z',
  },
  {
    id: '2',
    bloodType: 'A+',
    hospital: 'City Medical Center',
    urgency: 'medium',
    contactInfo: '(555) 987-6543',
    createdAt: '2024-05-02T14:45:00Z',
    expiresAt: '2024-05-05T14:45:00Z',
  },
  {
    id: '3',
    bloodType: 'B+',
    hospital: 'Memorial Hospital',
    urgency: 'low',
    contactInfo: '(555) 789-0123',
    createdAt: '2024-05-03T11:15:00Z',
    expiresAt: '2024-05-10T11:15:00Z',
  },
];

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'blood',
    title: 'Urgent: O- Blood Needed',
    message: 'General Hospital needs O- blood donations urgently.',
    read: false,
    createdAt: '2024-05-01T08:35:00Z',
  },
  {
    id: '2',
    type: 'medication',
    title: 'Medication Now Available',
    message: 'Lisinopril is now available at City Pharmaceuticals.',
    read: true,
    createdAt: '2024-05-02T15:20:00Z',
  },
  {
    id: '3',
    type: 'system',
    title: 'Account Update',
    message: 'Your account details have been successfully updated.',
    read: false,
    createdAt: '2024-05-03T09:45:00Z',
  },
];

export const sampleMessages: Message[] = [
  {
    id: '1',
    sender: 'user',
    content: 'What are the side effects of ibuprofen?',
    timestamp: '2024-05-01T10:30:00Z',
  },
  {
    id: '2',
    sender: 'ai',
    content: 'Common side effects of ibuprofen include upset stomach, mild heartburn, nausea, vomiting, bloating, gas, diarrhea, constipation, dizziness, headache, nervousness, and rash. More serious side effects that require immediate medical attention include signs of stomach bleeding, kidney problems, allergic reactions, liver problems, high blood pressure, or heart problems. Always consult with a healthcare professional for personalized advice.',
    timestamp: '2024-05-01T10:30:30Z',
  },
  {
    id: '3',
    sender: 'user',
    content: 'How often can I take acetaminophen?',
    timestamp: '2024-05-01T10:31:45Z',
  },
  {
    id: '4',
    sender: 'ai',
    content: 'For adults, the standard dose of acetaminophen is 650-1000 mg every 4-6 hours as needed, not exceeding 3000-4000 mg in 24 hours. It\'s important not to exceed the recommended dosage as acetaminophen can cause liver damage in high doses. Always follow the dosage instructions on the packaging or as prescribed by your healthcare provider, and consider your overall health and any other medications you may be taking.',
    timestamp: '2024-05-01T10:32:15Z',
  },
];