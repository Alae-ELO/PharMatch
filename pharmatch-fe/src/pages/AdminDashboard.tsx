import React, { useState } from 'react';
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
  X
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
    hours: ''
  });
  
  // Redirect if not logged in as admin
  React.useEffect(() => {
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

  const handleAddMedication = () => {
    alert(t('Admin.medications.add_alert', { medication: JSON.stringify(newMedication, null, 2) }));
    setNewMedication({
      name: '',
      description: '',
      category: '',
      prescription: false
    });
    setShowAddMedicationForm(false);
  };

  const handleAddPharmacy = () => {
    alert(t('Admin.pharmacies.add_alert', { pharmacy: JSON.stringify(newPharmacy, null, 2) }));
    setNewPharmacy({
      name: '',
      address: '',
      city: '',
      phone: '',
      email: '',
      hours: ''
    });
    setShowAddPharmacyForm(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8" dir="auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('Admin.title')}</h1>
        <p className="text-gray-600">{t('Admin.description')}</p>
      </div>
      
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
      
      {/* Add Medication Form */}
      {showAddMedicationForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t('Admin.medications.add_title')}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddMedicationForm(false)}
                icon={<X className="h-4 w-4" />}
              >
                {t('Admin.close')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('Admin.medications.name')}
                value={newMedication.name}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                placeholder={t('Admin.medications.name_placeholder')}
              />
              <Input
                label={t('Admin.medications.category')}
                value={newMedication.category}
                onChange={(e) => setNewMedication({ ...newMedication, category: e.target.value })}
                placeholder={t('Admin.medications.category_placeholder')}
              />
              <div className="md:col-span-2">
                <Input
                  label={t('Admin.medications.description')}
                  value={newMedication.description}
                  onChange={(e) => setNewMedication({ ...newMedication, description: e.target.value })}
                  placeholder={t('Admin.medications.description_placeholder')}
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newMedication.prescription}
                    onChange={(e) => setNewMedication({ ...newMedication, prescription: e.target.checked })}
                    className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{t('Admin.medications.prescription')}</span>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddMedication} fullWidth>
              {t('Admin.medications.add_button')}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Add Pharmacy Form */}
      {showAddPharmacyForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t('Admin.pharmacies.add_title')}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddPharmacyForm(false)}
                icon={<X className="h-4 w-4" />}
              >
                {t('Admin.close')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('Admin.pharmacies.name')}
                value={newPharmacy.name}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, name: e.target.value })}
                placeholder={t('Admin.pharmacies.name_placeholder')}
              />
              <Input
                label={t('Admin.pharmacies.email')}
                type="email"
                value={newPharmacy.email}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, email: e.target.value })}
                placeholder={t('Admin.pharmacies.email_placeholder')}
              />
              <Input
                label={t('Admin.pharmacies.phone')}
                value={newPharmacy.phone}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, phone: e.target.value })}
                placeholder={t('Admin.pharmacies.phone_placeholder')}
              />
              <Input
                label={t('Admin.pharmacies.city')}
                value={newPharmacy.city}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, city: e.target.value })}
                placeholder={t('Admin.pharmacies.city_placeholder')}
              />
              <div className="md:col-span-2">
                <Input
                  label={t('Admin.pharmacies.address')}
                  value={newPharmacy.address}
                  onChange={(e) => setNewPharmacy({ ...newPharmacy, address: e.target.value })}
                  placeholder={t('Admin.pharmacies.address_placeholder')}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label={t('Admin.pharmacies.hours')}
                  value={newPharmacy.hours}
                  onChange={(e) => setNewPharmacy({ ...newPharmacy, hours: e.target.value })}
                  placeholder={t('Admin.pharmacies.hours_placeholder')}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddPharmacy} fullWidth>
              {t('Admin.pharmacies.add_button')}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Content Area */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {t(`Admin.${activeTab}.title`)}
            </CardTitle>
            <Button 
              size="sm" 
              onClick={() => {
                if (activeTab === 'medications') {
                  setShowAddMedicationForm(true);
                } else if (activeTab === 'pharmacies') {
                  setShowAddPharmacyForm(true);
                } else {
                  alert(t('Admin.add_alert', { item: activeTab.slice(0, -1) }));
                }
              }}
            >
              {t(`Admin.${activeTab}.add_button`)}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.users.name')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.users.email')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.users.role')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.users.blood_donor')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.users.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b">
                      <td className="py-4 flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{user.name}</span>
                      </td>
                      <td className="py-4">{user.email}</td>
                      <td className="py-4">
                        <Badge 
                          variant={
                            user.role === 'admin' 
                              ? 'primary' 
                              : user.role === 'pharmacy' 
                                ? 'secondary' 
                                : 'default'
                          }
                        >
                          {t(`Admin.users.role_${user.role}`)}
                        </Badge>
                      </td>
                      <td className="py-4">
                        {user.bloodDonor ? (
                          <Badge variant="success">{user.bloodDonor.bloodType}</Badge>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => {
                              alert(t('Admin.users.edit_alert', { name: user.name }));
                            }}
                          >
                            {t('Admin.users.edit')}
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => {
                              alert(t('Admin.users.delete_alert', { name: user.name }));
                            }}
                          >
                            {t('Admin.users.delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'pharmacies' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.pharmacies.name')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.pharmacies.location')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.pharmacies.contact')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.pharmacies.medications')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.pharmacies.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPharmacies.map(pharmacy => (
                    <tr key={pharmacy.id} className="border-b">
                      <td className="py-4">{pharmacy.name}</td>
                      <td className="py-4">{pharmacy.city}</td>
                      <td className="py-4">{pharmacy.phone}</td>
                      <td className="py-4">{pharmacy.medications.length}</td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => {
                              alert(t('Admin.pharmacies.edit_alert', { name: pharmacy.name }));
                            }}
                          >
                            {t('Admin.pharmacies.edit')}
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => {
                              alert(t('Admin.pharmacies.delete_alert', { name: pharmacy.name }));
                            }}
                          >
                            {t('Admin.pharmacies.delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'medications' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.medications.name')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.medications.category')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.medications.prescription')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.medications.available_at')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.medications.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedications.map(medication => (
                    <tr key={medication.id} className="border-b">
                      <td className="py-4">{medication.name}</td>
                      <td className="py-4">
                        <Badge variant="secondary">{medication.category}</Badge>
                      </td>
                      <td className="py-4">
                        {medication.prescription ? (
                          <Badge variant="warning">{t('Admin.medications.prescription_yes')}</Badge>
                        ) : (
                          <Badge variant="success">{t('Admin.medications.prescription_no')}</Badge>
                        )}
                      </td>
                      <td className="py-4">
                        {t('Admin.medications.available_count', { 
                          inStock: medication.pharmacies.filter(p => p.inStock).length, 
                          total: medication.pharmacies.length 
                        })}
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => {
                              alert(t('Admin.medications.edit_alert', { name: medication.name }));
                            }}
                          >
                            {t('Admin.medications.edit')}
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => {
                              alert(t('Admin.medications.delete_alert', { name: medication.name }));
                            }}
                          >
                            {t('Admin.medications.delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'blood' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.blood.blood_type')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.blood.hospital')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.blood.urgency')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.blood.created')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.blood.expires')}</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">{t('Admin.blood.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBloodRequests.map(request => (
                    <tr key={request.id} className="border-b">
                      <td className="py-4 font-medium">{request.bloodType}</td>
                      <td className="py-4">{request.hospital}</td>
                      <td className="py-4">
                        <Badge 
                          variant={
                            request.urgency === 'high' 
                              ? 'danger' 
                              : request.urgency === 'medium' 
                                ? 'warning' 
                                : 'info'
                          }
                        >
                          {t(`Admin.blood.urgency_${request.urgency}`)}
                        </Badge>
                      </td>
                      <td className="py-4">{new Date(request.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">{new Date(request.expiresAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => {
                              alert(t('Admin.blood.edit_alert', { bloodType: request.bloodType }));
                            }}
                          >
                            {t('Admin.blood.edit')}
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => {
                              alert(t('Admin.blood.delete_alert', { bloodType: request.bloodType }));
                            }}
                          >
                            {t('Admin.blood.delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;