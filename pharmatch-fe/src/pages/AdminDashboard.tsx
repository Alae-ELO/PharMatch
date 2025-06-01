import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Building2,
  Pill,
  HeartPulse,
  Search,
  Plus,
  X,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useStore from '../store';
import { Pharmacy, Medication } from '../types';
 
const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    currentUser, 
    users, 
    medications: storeMedications, 
    bloodDonationRequests,
    fetchUsers,
    fetchMedications,
    fetchBloodDonationRequests
  } = useStore();
 
  // State for managing tabs and forms
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMedicationForm, setShowAddMedicationForm] = useState(false);
  const [showAddPharmacyForm, setShowAddPharmacyForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPharmacies, setTotalPharmacies] = useState(0);
  const pharmaciesPerPage = 10;
  const [localMedications, setLocalMedications] = useState<Medication[]>([]);
 
  // Form states
  const [newMedication, setNewMedication] = useState({
    name: {
      en: '',
      ar: '',
      fr: ''
    },
    description: {
      en: '',
      ar: '',
      fr: ''
    },
    category: {
      en: '',
      ar: '',
      fr: ''
    },
    prescription: false,
    image_url: '',
    pharmacies: []
  });
 
  const [newPharmacy, setNewPharmacy] = useState({
    name: {
      en: '',
      ar: ''
    },
    city: '',
    region: {
      en: '',
      ar: ''
    },
    phone: '',
    coordinates: {
      lat: 0,
      lng: 0
    },
    hours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '09:00', close: '18:00' }
    },
    permanence: {
      isOnDuty: false,
      days: []
    },
    status: 'closed'
  });

  // Fetch all data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await Promise.all([
          fetchUsers(),
          fetchPharmaciesData(currentPage),
          fetchMedications(),
          fetchBloodDonationRequests()
        ]);
        setLocalMedications(storeMedications);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchUsers, fetchMedications, fetchBloodDonationRequests, currentPage, storeMedications]);
 
  // Redirect if not logged in as admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);
 
  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }
 
  // Filter data based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.city.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const filteredMedications = localMedications.filter(medication =>
    medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medication.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const filteredBloodRequests = bloodDonationRequests.filter(request =>
    request.bloodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const handleAddMedication = async () => {
    try {
      setIsLoading(true);
      setError(null);
     
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/medications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newMedication)
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add medication');
      }
 
      await fetchMedications();
      setNewMedication({
        name: { en: '', ar: '', fr: '' },
        description: { en: '', ar: '', fr: '' },
        category: { en: '', ar: '', fr: '' },
        prescription: false,
        image_url: '',
        pharmacies: []
      });
      setShowAddMedicationForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add medication');
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleAddPharmacy = async () => {
    try {
      setIsLoading(true);
      setError(null);
     
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/pharmacies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newPharmacy)
      });

      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
 
      if (!response.ok) {
        throw new Error(errorData.message || 'Failed to add pharmacy');
      }
 
      await fetchPharmaciesData(currentPage);
      setNewPharmacy({
        name: { en: '', ar: '' },
        city: '',
        region: { en: '', ar: '' },
        phone: '',
        coordinates: { lat: 0, lng: 0 },
        hours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '09:00', close: '18:00' },
          sunday: { open: '09:00', close: '18:00' }
        },
        permanence: {
          isOnDuty: false,
          days: []
        },
        status: 'closed'
      });
      setShowAddPharmacyForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add pharmacy');
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleDeleteMedication = async (id: string | undefined) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
     
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/medications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete medication');
      }
 
      // Refresh the medications list
      await fetchMedications();
      // Update local state
      setLocalMedications(prev => prev.filter(med => med._id !== id && med.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete medication');
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleDeletePharmacy = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
     
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/pharmacies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete pharmacy');
      }
 
      await fetchPharmaciesData(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pharmacy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBloodRequest = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/blood-donation-requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete blood donation request');
      }

      await fetchBloodDonationRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blood donation request');
    } finally {
      setIsLoading(false);
    }
  };
 
  // Fetch pharmacies with pagination
  const fetchPharmaciesData = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/pharmacies?page=${page}&limit=${pharmaciesPerPage}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch pharmacies');
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      if (data.success) {
        setPharmacies(data.data);
        setTotalPages(data.pagination.pages);
        setTotalPharmacies(data.pagination.total);
        setCurrentPage(data.pagination.page);
      } else {
        throw new Error(data.message || 'Failed to fetch pharmacies');
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch pharmacies');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      await fetchPharmaciesData(newPage);
    }
  };
 
  return (
    <div className="container mx-auto px-4 py-8" dir="auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('Admin.title')}</h1>
        <p className="text-gray-600">{t('Admin.description')}</p>
      </div>
 
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {isLoading && (
        <div className="flex justify-center items-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      )}
     
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          className={`cursor-pointer ${activeTab === 'users' ? 'border-cyan-500 ring-1 ring-cyan-500' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-cyan-100 p-3 mr-4">
                <Users className="h-6 w-6 text-cyan-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('Admin.users.total')}</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
       
        <Card
          className={`cursor-pointer ${activeTab === 'pharmacies' ? 'border-cyan-500 ring-1 ring-cyan-500' : ''}`}
          onClick={() => setActiveTab('pharmacies')}
        >
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-emerald-100 p-3 mr-4">
                <Building2 className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('Admin.pharmacies.total')}</p>
                <p className="text-2xl font-bold">{totalPharmacies}</p>
              </div>
            </div>
          </CardContent>
        </Card>
       
        <Card
          className={`cursor-pointer ${activeTab === 'medications' ? 'border-cyan-500 ring-1 ring-cyan-500' : ''}`}
          onClick={() => setActiveTab('medications')}
        >
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Pill className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('Admin.medications.total')}</p>
                <p className="text-2xl font-bold">{localMedications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
       
        <Card
          className={`cursor-pointer ${activeTab === 'blood' ? 'border-cyan-500 ring-1 ring-cyan-500' : ''}`}
          onClick={() => setActiveTab('blood')}
        >
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <HeartPulse className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('Admin.blood.total')}</p>
                <p className="text-2xl font-bold">{bloodDonationRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
     
      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder={t(`Admin.${activeTab}.search_placeholder`)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
      </div>
 
      {/* Content based on active tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge variant={user.role === 'admin' ? 'primary' : user.role === 'pharmacy' ? 'secondary' : 'default'}>
                      {t(`Admin.users.role_${user.role}`)}
                    </Badge>
                    {user.bloodDonor && (
                      <Badge variant="info" className="ml-2">
                        {user.bloodDonor.bloodType}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
 
      {activeTab === 'pharmacies' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t('Admin.pharmacies.title')}</h2>
            <Button onClick={() => setShowAddPharmacyForm(true)}>
              {t('Admin.pharmacies.add')}
            </Button>
          </div>

          {showAddPharmacyForm && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{t('Admin.pharmacies.add_title')}</CardTitle>
                  <Button variant="ghost" onClick={() => setShowAddPharmacyForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label={t('Admin.pharmacies.name')}
                      value={newPharmacy.name.en}
                      onChange={(e) => setNewPharmacy({
                        ...newPharmacy,
                        name: { ...newPharmacy.name, en: e.target.value }
                      })}
                    />
                    <Input
                      label={t('Admin.pharmacies.name_ar')}
                      value={newPharmacy.name.ar}
                      onChange={(e) => setNewPharmacy({
                        ...newPharmacy,
                        name: { ...newPharmacy.name, ar: e.target.value }
                      })}
                    />
                  </div>
                  <Input
                    label={t('Admin.pharmacies.city')}
                    value={newPharmacy.city}
                    onChange={(e) => setNewPharmacy({
                      ...newPharmacy,
                      city: e.target.value
                    })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label={t('Admin.pharmacies.region')}
                      value={newPharmacy.region.en}
                      onChange={(e) => setNewPharmacy({
                        ...newPharmacy,
                        region: { ...newPharmacy.region, en: e.target.value }
                      })}
                    />
                    <Input
                      label={t('Admin.pharmacies.region_ar')}
                      value={newPharmacy.region.ar}
                      onChange={(e) => setNewPharmacy({
                        ...newPharmacy,
                        region: { ...newPharmacy.region, ar: e.target.value }
                      })}
                    />
                  </div>
                  <Input
                    label={t('Admin.pharmacies.phone')}
                    value={newPharmacy.phone}
                    onChange={(e) => setNewPharmacy({
                      ...newPharmacy,
                      phone: e.target.value
                    })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label={t('Admin.pharmacies.coordinates_lat')}
                      type="number"
                      value={newPharmacy.coordinates.lat}
                      onChange={(e) => setNewPharmacy({
                        ...newPharmacy,
                        coordinates: { ...newPharmacy.coordinates, lat: parseFloat(e.target.value) }
                      })}
                    />
                    <Input
                      label={t('Admin.pharmacies.coordinates_lng')}
                      type="number"
                      value={newPharmacy.coordinates.lng}
                      onChange={(e) => setNewPharmacy({
                        ...newPharmacy,
                        coordinates: { ...newPharmacy.coordinates, lng: parseFloat(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddPharmacy} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {t('Admin.pharmacies.add_button')}
                </Button>
              </CardFooter>
            </Card>
          )}
         
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pharmacies.map((pharmacy) => (
                  <Card key={pharmacy._id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{pharmacy.name}</h3>
                        <p className="text-gray-600">{pharmacy.name_ar}</p>
                      </div>
                      <Badge variant={pharmacy.status === 'open' ? 'success' : 'secondary'}>
                        {t(`Admin.pharmacies.status_${pharmacy.status}`)}
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p><strong>{t('Admin.pharmacies.city')}:</strong> {pharmacy.city}</p>
                      <p><strong>{t('Admin.pharmacies.region')}:</strong> {pharmacy.region}</p>
                      <p><strong>{t('Admin.pharmacies.phone')}:</strong> {pharmacy.phone}</p>
                      {pharmacy.coordinates && (
                        <p>
                          <strong>{t('Admin.pharmacies.coordinates_lat')}:</strong> {pharmacy.coordinates.lat},{' '}
                          <strong>{t('Admin.pharmacies.coordinates_lng')}:</strong> {pharmacy.coordinates.lng}
                        </p>
                      )}
                      <p>
                        <strong>{t('Admin.pharmacies.permanence')}:</strong>{' '}
                        {pharmacy.permanence ? t('Admin.pharmacies.is_on_duty') : t('Admin.pharmacies.status_closed')}
                      </p>
                      <p>
                        <strong>{t('Admin.pharmacies.working_hours')}:</strong>
                      </p>
                      {pharmacy.hours && (
                        <div className="mt-2">
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {Object.entries(pharmacy.hours).map(([day, hours]) => (
                              <div key={day} className="text-sm">
                                <span className="font-medium">{t(`Admin.pharmacies.hours.${day.toLowerCase()}`)}:</span>{' '}
                                {hours.open} - {hours.close}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="danger"
                        onClick={() => handleDeletePharmacy(pharmacy._id)}
                      >
                        {t('Admin.pharmacies.delete')}
                  </Button>
                </div>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  {t('Admin.showing')} {(currentPage - 1) * pharmaciesPerPage + 1} - {Math.min(currentPage * pharmaciesPerPage, totalPharmacies)} {t('Admin.of')} {totalPharmacies} {t('Admin.pharmacies')}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    {t('Admin.previous')}
                </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    {t('Admin.next')}
                    </Button>
                  </div>
                </div>
            </>
          )}
        </div>
      )}
 
      {activeTab === 'medications' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowAddMedicationForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('Admin.medications.add')}
            </Button>
          </div>
         
          {showAddMedicationForm && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{t('Admin.medications.add_title')}</CardTitle>
                  <Button variant="ghost" onClick={() => setShowAddMedicationForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label={t('Admin.medications.name_en')}
                      value={newMedication.name.en}
                      onChange={(e) => setNewMedication({
                        ...newMedication,
                        name: { ...newMedication.name, en: e.target.value }
                      })}
                      required
                    />
                    <Input
                      label={t('Admin.medications.name_ar')}
                      value={newMedication.name.ar}
                      onChange={(e) => setNewMedication({
                        ...newMedication,
                        name: { ...newMedication.name, ar: e.target.value }
                      })}
                      required
                    />
                    <Input
                      label={t('Admin.medications.name_fr')}
                      value={newMedication.name.fr}
                      onChange={(e) => setNewMedication({
                        ...newMedication,
                        name: { ...newMedication.name, fr: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label={t('Admin.medications.description_en')}
                      value={newMedication.description.en}
                      onChange={(e) => setNewMedication({
                        ...newMedication,
                        description: { ...newMedication.description, en: e.target.value }
                      })}
                      required
                    />
                    <Input
                      label={t('Admin.medications.description_ar')}
                      value={newMedication.description.ar}
                      onChange={(e) => setNewMedication({
                        ...newMedication,
                        description: { ...newMedication.description, ar: e.target.value }
                      })}
                      required
                    />
                    <Input
                      label={t('Admin.medications.description_fr')}
                      value={newMedication.description.fr}
                      onChange={(e) => setNewMedication({
                        ...newMedication,
                        description: { ...newMedication.description, fr: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                      label={t('Admin.medications.category_en')}
                      value={newMedication.category.en}
                      onChange={(e) => setNewMedication({
                        ...newMedication,
                        category: { ...newMedication.category, en: e.target.value }
                      })}
                      required
                  />
                  <Input
                      label={t('Admin.medications.category_ar')}
                      value={newMedication.category.ar}
                      onChange={(e) => setNewMedication({
                        ...newMedication,
                        category: { ...newMedication.category, ar: e.target.value }
                      })}
                      required
                  />
                  <Input
                      label={t('Admin.medications.category_fr')}
                      value={newMedication.category.fr}
                      onChange={(e) => setNewMedication({
                        ...newMedication,
                        category: { ...newMedication.category, fr: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="prescription"
                      checked={newMedication.prescription}
                      onChange={(e) => setNewMedication({
                        ...newMedication,
                        prescription: e.target.checked
                      })}
                      className="h-4 w-4"
                    />
                    <label htmlFor="prescription">{t('Admin.medications.prescription_required')}</label>
                  </div>
                  <Input
                    label={t('Admin.medications.image_url')}
                    value={newMedication.image_url}
                    onChange={(e) => setNewMedication({
                      ...newMedication,
                      image_url: e.target.value
                    })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddMedication} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {t('Admin.medications.add_button')}
                </Button>
              </CardFooter>
            </Card>
          )}
 
          {filteredMedications.map(medication => (
            <Card key={medication._id || medication.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{medication.name}</h3>
                    <p className="text-gray-600">{medication.description}</p>
                    <p className="text-gray-600">{medication.category}</p>
                      {medication.prescription && (
                        <Badge variant="warning">{t('Admin.medications.prescription_required')}</Badge>
                      )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="danger" onClick={() => handleDeleteMedication(medication._id || medication.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
 
      {activeTab === 'blood' && (
        <div className="space-y-4">
          {filteredBloodRequests.map(request => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{request.bloodType}</h3>
                    <p className="text-gray-600">{request.hospital}</p>
                    <p className="text-gray-600">{t(`Admin.blood.urgency_${request.urgency}`)}</p>
                    <Badge variant={request.status === 'active' ? 'success' : request.status === 'fulfilled' ? 'info' : 'warning'}>
                      {t(`Admin.blood.status_${request.status}`)}
                      </Badge>
                    </div>
                  <div className="flex space-x-2">
                    <Button variant="danger" onClick={() => handleDeleteBloodRequest(request.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default AdminDashboard;
 
