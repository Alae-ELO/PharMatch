const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Import models
const User = require('./src/models/user.model');
const Pharmacy = require('./src/models/pharmacy.model');
const Medication = require('./src/models/medication.model');
const BloodDonation = require('./src/models/bloodDonation.model');
const Notification = require('./src/models/notification.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Load fake data from JSON file
const loadFakeData = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'src', 'data', 'fakeData.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading fake data:', error);
    process.exit(1);
  }
};

// Generate users with hashed passwords
const generateUsers = async (usersData) => {
  const users = await Promise.all(usersData.map(async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return {
      ...userData,
      password: hashedPassword
    };
  }));
  return User.insertMany(users);
};

// Generate pharmacies with owner references
const generatePharmacies = async (pharmaciesData, users) => {
  const pharmacyOwners = users.filter(user => user.role === 'pharmacy');
  const pharmacies = pharmaciesData.map((pharmacyData, index) => ({
    ...pharmacyData,
    owner: pharmacyOwners[index % pharmacyOwners.length]._id
  }));
  return Pharmacy.insertMany(pharmacies);
};

// Generate medications with pharmacy references
const generateMedications = async (medicationsData, pharmacies) => {
  const medications = medicationsData.map(medicationData => ({
    ...medicationData,
    pharmacies: medicationData.pharmacies.map((pharmacyData, index) => ({
      ...pharmacyData,
      pharmacy: pharmacies[index % pharmacies.length]._id
    }))
  }));
  return Medication.insertMany(medications);
};

// Generate blood donations with user references
const generateBloodDonations = async (bloodDonationsData, users) => {
  const bloodDonations = bloodDonationsData.map(donationData => ({
    ...donationData,
    createdBy: users[Math.floor(Math.random() * users.length)]._id,
    donors: donationData.donors.map(donorData => ({
      ...donorData,
      user: users[Math.floor(Math.random() * users.length)]._id
    }))
  }));
  return BloodDonation.insertMany(bloodDonations);
};

// Generate notifications with user and related item references
const generateNotifications = async (notificationsData, users, medications, bloodDonations) => {
  const notifications = notificationsData.map(notificationData => {
    const notification = {
      ...notificationData,
      user: users[Math.floor(Math.random() * users.length)]._id
    };

    if (notificationData.type === 'blood') {
      notification.relatedItem = {
        itemId: bloodDonations[Math.floor(Math.random() * bloodDonations.length)]._id,
        itemType: 'blood'
      };
    } else if (notificationData.type === 'medication') {
      notification.relatedItem = {
        itemId: medications[Math.floor(Math.random() * medications.length)]._id,
        itemType: 'medication'
      };
    }

    return notification;
  });
  return Notification.insertMany(notifications);
};

// Main seeding function
const seedDatabase = async () => {
  try {
    // Load fake data
    const fakeData = await loadFakeData();
    console.log('Loaded fake data');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Pharmacy.deleteMany({}),
      Medication.deleteMany({}),
      BloodDonation.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Generate and insert new data
    const users = await generateUsers(fakeData.users);
    console.log('Generated users');

    const pharmacies = await generatePharmacies(fakeData.pharmacies, users);
    console.log('Generated pharmacies');

    const medications = await generateMedications(fakeData.medications, pharmacies);
    console.log('Generated medications');

    const bloodDonations = await generateBloodDonations(fakeData.bloodDonations, users);
    console.log('Generated blood donations');

    const notifications = await generateNotifications(fakeData.notifications, users, medications, bloodDonations);
    console.log('Generated notifications');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase(); 