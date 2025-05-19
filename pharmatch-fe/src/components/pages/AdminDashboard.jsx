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
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import useStore from '../store';

const AdminDashboard = () => {
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
    // In a real app, this would make an API call
    alert('In a real app, this would add the medication to the database:\n' + JSON.stringify(newMedication, null, 2));
    setNewMedication({
      name: '',
      description: '',
      category: '',
      prescription: false
    });
    setShowAddMedicationForm(false);
  };

  const handleAddPharmacy = () => {
    // In a real app, this would make an API call
    alert('In a real app, this would add the pharmacy to the database:\n' + JSON.stringify(newPharmacy, null, 2));
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, pharmacies, medications, and blood donation requests</p>
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
                <p className="text-sm font-medium text-gray-500">Total Users</p>
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
                <p className="text-sm font-medium text-gray-500">Pharmacies</p>
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
                <p className="text-sm font-medium text-gray-500">Medications</p>
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
                <p className="text-sm font-medium text-gray-500">Blood Requests</p>
                <p className="text-2xl font-bold">{bloodDonationRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <input
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          className="input"
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
      </div>
      
      {/* Add Medication Form */}
      {showAddMedicationForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Add New Medication</CardTitle>
              <button
                variant="ghost"
                className="btn btn-primary"
                size="sm"
                onClick={() => setShowAddMedicationForm(false)}
                icon={<X className="h-4 w-4" />}
              >
                Close
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                label="Medication Name"
                className="input"
                value={newMedication.name}
                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                placeholder="Enter medication name"
              />
              <input
                label="Category"
                className="input"
                value={newMedication.category}
                onChange={(e) => setNewMedication({ ...newMedication, category: e.target.value })}
                placeholder="e.g., Antibiotics, Pain Relief"
              />
              <div className="md:col-span-2">
                <input
                  label="Description"
                  className="input"
                  value={newMedication.description}
                  onChange={(e) => setNewMedication({ ...newMedication, description: e.target.value })}
                  placeholder="Enter medication description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={newMedication.prescription}
                    onChange={(e) => setNewMedication({ ...newMedication, prescription: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-gray-700">Requires Prescription</span>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <button className="btn btn-primary" onClick={handleAddMedication} fullWidth>
              Add Medication
            </button>
          </CardFooter>
        </Card>
      )}

      {/* Add Pharmacy Form */}
      {showAddPharmacyForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Add New Pharmacy</CardTitle>
              <button className="btn btn-primary"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddPharmacyForm(false)}
                icon={<X className="h-4 w-4" />}
              >
                Close
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                label="Pharmacy Name"
                value={newPharmacy.name}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, name: e.target.value })}
                placeholder="Enter pharmacy name"
              />
              <input
                label="Email"
                type="email"
                value={newPharmacy.email}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, email: e.target.value })}
                placeholder="Enter email address"
              />
              <input
                label="Phone"
                value={newPharmacy.phone}
                className="input"
                onChange={(e) => setNewPharmacy({ ...newPharmacy, phone: e.target.value })}
                placeholder="Enter phone number"
              />
              <input
                label="City"
                value={newPharmacy.city}
                className="input"
                onChange={(e) => setNewPharmacy({ ...newPharmacy, city: e.target.value })}
                placeholder="Enter city"
              />
              <div className="md:col-span-2">
                <input
                  label="Address"
                  value={newPharmacy.address}
                  className="input"
                  onChange={(e) => setNewPharmacy({ ...newPharmacy, address: e.target.value })}
                  placeholder="Enter full address"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  label="Business Hours"
                  className="input"
                  value={newPharmacy.hours}
                  onChange={(e) => setNewPharmacy({ ...newPharmacy, hours: e.target.value })}
                  placeholder="e.g., Mon-Fri: 9am-7pm, Sat: 10am-5pm"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <button className="btn btn-primary" onClick={handleAddPharmacy} fullWidth>
              Add Pharmacy
            </button>
          </CardFooter>
        </Card>
      )}
      
      {/* Content Area */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'pharmacies' && 'Pharmacy Management'}
              {activeTab === 'medications' && 'Medication Management'}
              {activeTab === 'blood' && 'Blood Donation Requests'}
            </CardTitle>
            <button className="btn btn-primary" 
              size="sm" 
              onClick={() => {
                if (activeTab === 'medications') {
                  setShowAddMedicationForm(true);
                } else if (activeTab === 'pharmacies') {
                  setShowAddPharmacyForm(true);
                } else {
                  alert(`This would open a form to add a new ${activeTab.slice(0, -1)}`);
                }
              }}
            >
              Add {activeTab === 'users' ? 'User' : 
                   activeTab === 'pharmacies' ? 'Pharmacy' : 
                   activeTab === 'medications' ? 'Medication' : 
                   'Blood Request'}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-sm font-medium text-gray-500">Name</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Email</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Role</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Blood Donor</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Actions</th>
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
                      <div className="div div-soft div-info" 
                      variant={
                        user.role === 'admin' 
                          ? 'primary' 
                          : user.role === 'pharmacy' 
                            ? 'secondary' 
                            : 'default'
                      }>{user.role}
                      </div>
              
                      </td>
                      <td className="py-4">
                        {user.bloodDonor ? (
                          <div className="div div-soft div-success"
                           variant="success">{user.bloodDonor.bloodType}</div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="btn btn-primary" 
                            variant="ghost" 
                            size="sm" 
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => {
                              alert(`This would open a form to edit ${user.name}`);
                            }}
                          >
                            Edit
                          </button>
                          <button className="btn btn-primary" 
                            variant="danger" 
                            size="sm" 
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => {
                              alert(`This would delete ${user.name}`);
                            }}
                          >
                            Delete
                          </button>
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
                    <th className="pb-3 text-sm font-medium text-gray-500">Name</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Location</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Contact</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Medications</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Actions</th>
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
                          <button className="btn btn-primary" 
                            variant="ghost" 
                            size="sm" 
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => {
                              alert(`This would open a form to edit ${pharmacy.name}`);
                            }}
                          >
                            Edit
                          </button>
                          <button className="btn btn-primary" 
                            variant="danger" 
                            size="sm" 
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => {
                              alert(`This would delete ${pharmacy.name}`);
                            }}
                          >
                            Delete
                          </button>
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
                    <th className="pb-3 text-sm font-medium text-gray-500">Name</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Category</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Prescription</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Available At</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedications.map(medication => (
                    <tr key={medication.id} className="border-b">
                      <td className="py-4">{medication.name}</td>
                      <td className="py-4">
                        <div className="badge badge-soft badge-accent" variant="secondary">{medication.category}</div>
                      </td>
                      <td className="py-4">
                        {medication.prescription ? (
                          <div className="badge badge-soft badge-warning" variant="warning">Yes</div>
                        ) : (
                          <div class="badge badge-soft badge-success" variant="success">No</div>
                        )}
                      </td>
                      <td className="py-4">
                        {medication.pharmacies.filter(p => p.inStock).length} of {medication.pharmacies.length} pharmacies
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="btn btn-primary" 
                            variant="ghost" 
                            size="sm" 
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => {
                              alert(`This would open a form to edit ${medication.name}`);
                            }}
                          >
                            Edit
                          </button>
                          <button className="btn btn-primary" 
                            variant="danger" 
                            size="sm" 
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => {
                              alert(`This would delete ${medication.name}`);
                            }}
                          >
                            Delete
                          </button>
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
                    <th className="pb-3 text-sm font-medium text-gray-500">Blood Type</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Hospital</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Urgency</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Created</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Expires</th>
                    <th className="pb-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBloodRequests.map(request => (
                    <tr key={request.id} className="border-b">
                      <td className="py-4 font-medium">{request.bloodType}</td>
                      <td className="py-4">{request.hospital}</td>
                      <td className="py-4">
                        <div 
                          variant={
                            request.urgency === 'high' 
                              ? 'danger' 
                              : request.urgency === 'medium' 
                                ? 'warning' 
                                : 'info'
                          }
                          className={
                            request.urgency === 'high' 
                              ? "badge badge-soft badge-error" 
                              : request.urgency === 'medium' 
                                ? "badge badge-soft badge-warning" 
                                : "badge badge-soft badge-info"
                          }
                        >
                          {request.urgency === 'high' ? 'URGENT' : request.urgency}
                        </div>
                      </td>
                      <td className="py-4">{new Date(request.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">{new Date(request.expiresAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button className="btn btn-primary" 
                            variant="ghost" 
                            size="sm" 
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => {
                              alert(`This would open a form to edit the ${request.bloodType} request`);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            variant="danger" 
                            size="sm" 
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => {
                              alert(`This would delete the ${request.bloodType} request`);
                            }}
                          >
                            Delete
                          </button>
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