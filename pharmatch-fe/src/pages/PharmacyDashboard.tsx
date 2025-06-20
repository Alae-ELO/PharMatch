import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt, FaStore, FaDoorOpen, FaDoorClosed, FaChevronDown, FaChevronUp, FaEdit, FaSave, FaTimes, FaPills, FaPrescriptionBottleAlt } from 'react-icons/fa';
import useStore from '../store';
import { Medication, Pharmacy } from '../types';
import MedicationModal from './MedicationModal';

interface PharmacyStats {
  totalMedications: number;
  prescriptionMedications: number;
  nonPrescriptionMedications: number;
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

const PharmacyDashboard: React.FC = () => {
  const { token, medications, fetchMedications, currentUser } = useStore();
  const [stats, setStats] = useState<PharmacyStats>({
    totalMedications: 0,
    prescriptionMedications: 0,
    nonPrescriptionMedications: 0,
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
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMed, setEditMed] = useState<Medication | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notif, setNotif] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch des médicaments quand l'utilisateur change
  useEffect(() => {
    if (currentUser?.id) {
      fetchMedications(`pharmacy=${currentUser.id}`);
    }
  }, [token, currentUser?.id, fetchMedications]);

  // Calcul des stats à chaque changement de medications
  useEffect(() => {
    const prescriptionMeds = medications.filter(med => med.prescription);
    const nonPrescriptionMeds = medications.filter(med => !med.prescription);
    setStats(stats => ({
      ...stats,
      totalMedications: medications.length,
      prescriptionMedications: prescriptionMeds.length,
      nonPrescriptionMedications: nonPrescriptionMeds.length,
      activePrescriptions: prescriptionMeds.length,
    }));
  }, [medications]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch pharmacy profile
        const response = await axios.get(`http://localhost:5000/api/pharmacies/${currentUser?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const pharmacyData = response.data.data;
        setPharmacyProfile({
          name: pharmacyData.name,
          address: pharmacyData.address,
          phone: pharmacyData.phone,
          email: pharmacyData.email,
          openingHours: pharmacyData.hours || {},
          description: pharmacyData.description || '',
          licenseNumber: pharmacyData.licenseNumber || '',
          ownerName: pharmacyData.ownerName || '',
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchDashboardData();
    }
  }, [token, currentUser?.id, fetchMedications, medications]);

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

  // Ajout ou modification d'un médicament
  const handleSaveMedication = async (med: Partial<Medication>) => {
    try {
      if (editMed) {
        // Modification
        const res = await axios.put(`http://localhost:5000/api/medications/${editMed.id}`, med, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Modification médicament:', res.data);
        setNotif({ type: 'success', message: 'Médicament modifié avec succès.' });
      } else {
        // Ajout
        const res = await axios.post(`http://localhost:5000/api/medications`, { ...med, pharmacy: currentUser?.id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Ajout médicament:', res.data);
        setNotif({ type: 'success', message: 'Médicament ajouté avec succès.' });
      }
      setModalOpen(false);
      setEditMed(null);
      await fetchMedications(`pharmacy=${currentUser?.id}`);
    } catch (e: any) {
      console.error('Erreur ajout/modification:', e?.response || e);
      throw new Error(e?.response?.data?.message || 'Erreur lors de l\'enregistrement.');
    }
  };

  // Suppression d'un médicament
  const handleDeleteMedication = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/medications/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Suppression médicament:', res.data);
      setNotif({ type: 'success', message: 'Médicament supprimé.' });
      setDeleteId(null);
      setConfirmDelete(false);
      await fetchMedications(`pharmacy=${currentUser?.id}`);
    } catch (e: any) {
      console.error('Erreur suppression:', e?.response || e);
      setNotif({ type: 'error', message: e?.response?.data?.message || 'Erreur lors de la suppression.' });
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
      {/* Notification */}
      {notif && (
        <div className={`mb-4 p-3 rounded ${notif.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{notif.message}</div>
      )}
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
              <p className="text-sm font-medium text-gray-500">Total Médicaments</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalMedications}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaPills className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-blue-500 font-medium">Total</span>
              <span className="text-gray-500 ml-2">des médicaments en stock</span>
            </div>
          </div>
        </div>

        {/* Prescription Medications Card */}
        <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Médicaments sur Ordonnance</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.prescriptionMedications}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaPrescriptionBottleAlt className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-yellow-500 font-medium">Sur ordonnance</span>
              <span className="text-gray-500 ml-2">nécessitant une prescription</span>
            </div>
          </div>
        </div>

        {/* Non-Prescription Medications Card */}
        <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Médicaments sans Ordonnance</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.nonPrescriptionMedications}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaStore className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium">Sans ordonnance</span>
              <span className="text-gray-500 ml-2">disponibles en libre-service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medications List Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Liste des Médicaments</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" onClick={() => { setEditMed(null); setModalOpen(true); }}>
              Ajouter un médicament
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medications.map((medication) => (
                <tr key={medication.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {typeof medication.name === 'string' ? medication.name : medication.name?.fr}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{typeof medication.description === 'string' ? medication.description : medication.description?.fr}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{typeof medication.category === 'string' ? medication.category : medication.category?.fr}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      medication.prescription 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {medication.prescription ? 'Sur ordonnance' : 'Sans ordonnance'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => { setEditMed(medication); setModalOpen(true); }}>Modifier</button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => { setDeleteId(medication.id); setConfirmDelete(true); }}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal pour ajout/modification */}
      <MedicationModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditMed(null); }}
        onSave={handleSaveMedication}
        initialData={editMed || undefined}
        isEdit={!!editMed}
      />
      {/* Confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">Voulez-vous vraiment supprimer ce médicament ?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => { setConfirmDelete(false); setDeleteId(null); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Annuler</button>
              <button onClick={handleDeleteMedication} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}
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
