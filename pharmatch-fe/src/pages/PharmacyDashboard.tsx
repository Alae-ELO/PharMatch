import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt, FaStore, FaDoorOpen, FaDoorClosed, FaChevronDown, FaChevronUp, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import useStore from '../store';

interface PharmacyStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  activePrescriptions: number;
  isOpen: boolean;
}

interface PharmacyProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  description: string;
  licenseNumber: string;
  ownerName: string;
}

interface RecentOrder {
  id: string;
  customerName: string;
  status: string;
  date: string;
  amount: number;
}

interface NewMedication {
  id: string;
  name: string;
  description: string;
  price: number;
  addedDate: string;
  stock: number;
  prescription: boolean;
}

const PharmacyDashboard: React.FC = () => {
  const { token } = useStore();
  const [stats, setStats] = useState<PharmacyStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    activePrescriptions: 0,
    isOpen: true,
  });
  const [pharmacyProfile, setPharmacyProfile] = useState<PharmacyProfile>({
    name: '',
    address: '',
    phone: '',
    email: '',
    openingHours: {},
    description: '',
    licenseNumber: '',
    ownerName: '',
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [newMedications, setNewMedications] = useState<NewMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pharmacy/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStats(response.data.stats);
        setPharmacyProfile(response.data.pharmacyProfile);
        setRecentOrders(response.data.recentOrders);
        setNewMedications(response.data.newMedications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const togglePharmacyStatus = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/pharmacy/dashboard/toggle-status', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(prev => ({ ...prev, isOpen: response.data.isOpen }));
    } catch (error) {
      console.error('Error toggling pharmacy status:', error);
    }
  };

  const updatePharmacyProfile = async (updatedProfile: Partial<PharmacyProfile>) => {
    try {
      const response = await axios.put('http://localhost:5000/api/pharmacy/dashboard/profile', updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPharmacyProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating pharmacy profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Pharmacy Status Control Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${
              stats.isOpen ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {stats.isOpen ? (
                <FaDoorOpen className="w-8 h-8 text-green-600" />
              ) : (
                <FaDoorClosed className="w-8 h-8 text-red-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Statut de la Pharmacie</h2>
              <p className={`text-sm font-medium ${
                stats.isOpen ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.isOpen ? 'Actuellement Ouverte' : 'Actuellement Fermée'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePharmacyStatus}
              className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 ${
                stats.isOpen 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {stats.isOpen ? (
                <>
                  <FaDoorClosed className="w-5 h-5" />
                  <span>Fermer la Pharmacie</span>
                </>
              ) : (
                <>
                  <FaDoorOpen className="w-5 h-5" />
                  <span>Ouvrir la Pharmacie</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Information */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaClock className="text-gray-400 text-xl" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Horaires d'ouverture actuels</h3>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => updatePharmacyProfile(pharmacyProfile)}
                    className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <FaSave className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          <OpeningHoursSection 
            openingHours={pharmacyProfile.openingHours} 
            isEditing={isEditing} 
            onChange={(updatedHours) => {
              setPharmacyProfile(prev => ({
                ...prev,
                openingHours: updatedHours
              }));
            }} 
          />
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Medications Card */}
        <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Médicaments Disponibles</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{newMedications.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaStore className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium">En stock</span>
              <span className="text-gray-500 ml-2">dans la pharmacie</span>
            </div>
          </div>
        </div>

        {/* Prescription Medications Card */}
        <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Médicaments sur Ordonnance</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {newMedications.filter(med => med.prescription).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaEnvelope className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-yellow-500 font-medium">Nécessitent</span>
              <span className="text-gray-500 ml-2">une ordonnance</span>
            </div>
          </div>
        </div>

        {/* Average Price Card */}
        <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Prix Moyen</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {newMedications.length > 0 ? (newMedications.reduce((acc, med) => acc + med.price, 0) / newMedications.length).toFixed(2) : 'N/A'} €
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaCalendarAlt className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium">Prix moyen</span>
              <span className="text-gray-500 ml-2">des médicaments</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Medications Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-gray-400 text-xl" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nouveaux Médicaments</h3>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          {newMedications.map((medication) => (
            <div key={medication.id} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <span className="text-gray-800 font-medium">{medication.name}</span>
                <span className="text-gray-500 text-sm">({medication.description})</span>
              </div>
              <div className="text-gray-500">{medication.addedDate}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component to display and edit opening hours
const OpeningHoursSection: React.FC<{
  openingHours: PharmacyProfile['openingHours'];
  isEditing: boolean;
  onChange: (hours: PharmacyProfile['openingHours']) => void;
}> = ({ openingHours, isEditing, onChange }) => {
  const [showAll, setShowAll] = useState(false);
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const englishDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayMapping: {[key: string]: string} = {};
  
  // Create mapping between English and French day names
  englishDays.forEach((day, index) => {
    dayMapping[day] = daysOfWeek[index];
  });
  
  const currentDay = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  const capitalizedCurrentDay = currentDay.charAt(0).toUpperCase() + currentDay.slice(1);
  
  // Convert English day keys to French for display
  const translatedOpeningHours: PharmacyProfile['openingHours'] = {};
  Object.entries(openingHours).forEach(([day, hours]) => {
    const frenchDay = dayMapping[day] || day;
    translatedOpeningHours[frenchDay] = hours;
  });
  
  // Get entries in the correct order of days
  const orderedEntries = daysOfWeek
    .filter(day => translatedOpeningHours[day])
    .map(day => [day, translatedOpeningHours[day]]);
  
  // Display only current day if not showing all
  const displayEntries = showAll ? orderedEntries : orderedEntries.filter(([day]) => day === capitalizedCurrentDay);
  
  // If current day is not in the opening hours, show the first day
  const entriesToShow = displayEntries.length > 0 ? displayEntries : (orderedEntries.length > 0 ? [orderedEntries[0]] : []);

  const handleTimeChange = (day: string, type: 'open' | 'close', value: string) => {
    const englishDay = englishDays[daysOfWeek.indexOf(day)];
    const updatedHours = {
      ...openingHours,
      [englishDay]: {
        ...openingHours[englishDay],
        [type]: value
      }
    };
    onChange(updatedHours);
  };

  return (
    <div className="mt-4">
      {Object.keys(openingHours).length === 0 ? (
        <div className="p-3 rounded-lg bg-gray-100 text-center">
          {isEditing ? (
            <div className="text-gray-600">
              Aucun horaire défini. Veuillez ajouter des horaires d'ouverture.
            </div>
          ) : (
            <div className="text-gray-600">
              Aucun horaire d'ouverture n'est défini pour cette pharmacie.
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {entriesToShow.map((entry: [string, { open: string; close: string; }], index: number) => {
              const [day, hours] = entry;
              return (
                <div key={index} className={`p-3 rounded-lg ${day === capitalizedCurrentDay ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{day}</span>
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                          className="border rounded px-2 py-1 text-sm w-24"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                          className="border rounded px-2 py-1 text-sm w-24"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-800">
                        <span className="font-medium">{hours.open}</span> - <span className="font-medium">{hours.close}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {orderedEntries.length > 1 && ( // Only show button if there's more than one day
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              {showAll ? (
                <>
                  <FaChevronUp className="mr-1" />
                  Voir moins
                </>
              ) : (
                <>
                  <FaChevronDown className="mr-1" />
                  Voir plus
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PharmacyDashboard;
