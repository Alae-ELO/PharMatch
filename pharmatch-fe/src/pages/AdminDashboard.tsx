import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  Pill,
  HeartPulse,
  User,
  Edit,
  Trash2,
  Search,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useStore from '../store';
 
const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, users, pharmacies, medications, bloodDonationRequests } = useStore();
  const navigate = useNavigate();
 
  // State for managing tabs and forms
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMedicationForm, setShowAddMedicationForm] = useState(false);
  const [showAddPharmacyForm, setShowAddPharmacyForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  // Form states
  const [newMedication, setNewMedication] = useState({
    name: '',
    description: '',
    category: '',
    prescription: false
  });
 
  const [newPharmacy, setNewPharmacy] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    hours: '',
    coordinates: {
      lat: 0,
      lng: 0
    }
  });
 
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
 
  const filteredMedications = medications.filter(medication =>
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
     
      const response = await fetch(`${import.meta.env.VITE_API_URL}/medications`, {
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
 
      // Refresh medications list
      await useStore.getState().fetchMedications();
     
      setNewMedication({
        name: '',
        description: '',
        category: '',
        prescription: false
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
     
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pharmacies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newPharmacy)
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add pharmacy');
      }
 
      // Refresh pharmacies list
      await useStore.getState().fetchPharmacies();
     
      setNewPharmacy({
        name: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        hours: '',
        coordinates: {
          lat: 0,
          lng: 0
        }
      });
      setShowAddPharmacyForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add pharmacy');
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleDeleteMedication = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
     
      const response = await fetch(`${import.meta.env.VITE_API_URL}/medications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete medication');
      }
 
      // Refresh medications list
      await useStore.getState().fetchMedications();
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
     
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pharmacies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete pharmacy');
      }
 
      // Refresh pharmacies list
      await useStore.getState().fetchPharmacies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pharmacy');
    } finally {
      setIsLoading(false);
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
                <p className="text-2xl font-bold">{pharmacies.length}</p>
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
                <p className="text-2xl font-bold">{medications.length}</p>
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
      {activeTab !== 'users' && (
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge variant={user.role === 'admin' ? 'primary' : user.role === 'pharmacy' ? 'secondary' : 'default'}>
                      {user.role}
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
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowAddPharmacyForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
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
                  <Input
                    label={t('Admin.pharmacies.name')}
                    value={newPharmacy.name}
                    onChange={(e) => setNewPharmacy({ ...newPharmacy, name: e.target.value })}
                  />
                  <Input
                    label={t('Admin.pharmacies.address')}
                    value={newPharmacy.address}
                    onChange={(e) => setNewPharmacy({ ...newPharmacy, address: e.target.value })}
                  />
                  <Input
                    label={t('Admin.pharmacies.city')}
                    value={newPharmacy.city}
                    onChange={(e) => setNewPharmacy({ ...newPharmacy, city: e.target.value })}
                  />
                  <Input
                    label={t('Admin.pharmacies.phone')}
                    value={newPharmacy.phone}
                    onChange={(e) => setNewPharmacy({ ...newPharmacy, phone: e.target.value })}
                  />
                  <Input
                    label={t('Admin.pharmacies.email')}
                    type="email"
                    value={newPharmacy.email}
                    onChange={(e) => setNewPharmacy({ ...newPharmacy, email: e.target.value })}
                  />
                  <Input
                    label={t('Admin.pharmacies.hours')}
                    value={newPharmacy.hours}
                    onChange={(e) => setNewPharmacy({ ...newPharmacy, hours: e.target.value })}
                  />
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
 
          {filteredPharmacies.map(pharmacy => (
            <Card key={pharmacy.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{pharmacy.name}</h3>
                    <p className="text-gray-600">{pharmacy.address}, {pharmacy.city}</p>
                    <p className="text-gray-600">{pharmacy.phone}</p>
                    <p className="text-gray-600">{pharmacy.email}</p>
                    <p className="text-gray-600">{pharmacy.hours}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="danger" onClick={() => handleDeletePharmacy(pharmacy.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                  <Input
                    label={t('Admin.medications.name')}
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  />
                  <Input
                    label={t('Admin.medications.description')}
                    value={newMedication.description}
                    onChange={(e) => setNewMedication({ ...newMedication, description: e.target.value })}
                  />
                  <Input
                    label={t('Admin.medications.category')}
                    value={newMedication.category}
                    onChange={(e) => setNewMedication({ ...newMedication, category: e.target.value })}
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="prescription"
                      checked={newMedication.prescription}
                      onChange={(e) => setNewMedication({ ...newMedication, prescription: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <label htmlFor="prescription">{t('Admin.medications.prescription')}</label>
                  </div>
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
            <Card key={medication.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{medication.name}</h3>
                    <p className="text-gray-600">{medication.description}</p>
                    <div className="flex space-x-2 mt-2">
                      <Badge>{medication.category}</Badge>
                      {medication.prescription && (
                        <Badge variant="warning">{t('Admin.medications.prescription_required')}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="danger" onClick={() => handleDeleteMedication(medication.id)}>
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
                    <h3 className="text-lg font-semibold">{request.hospital}</h3>
                    <p className="text-gray-600">{request.bloodType}</p>
                    <div className="flex space-x-2 mt-2">
                      <Badge variant={request.urgency === 'high' ? 'danger' : request.urgency === 'medium' ? 'warning' : 'info'}>
                        {request.urgency}
                      </Badge>
                      {request.status && (
                        <Badge variant="secondary">{request.status}</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{request.contactInfo}</p>
                    {request.donors && request.donors.length > 0 && (
                      <p className="text-gray-600 mt-2">
                        {t('Admin.blood.donors', { count: request.donors.length })}
                      </p>
                    )}
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
 
