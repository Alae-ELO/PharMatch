import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  Pill,
  HeartPulse,

  
  Trash2,
  Search,
  Plus,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartData
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useStore from '../store';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);
 
const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, users, pharmacies, medications, bloodDonationRequests, fetchUsers, fetchPharmacies, fetchMedications, fetchBloodDonationRequests } = useStore();
  const navigate = useNavigate();
 
  // State for managing tabs and forms
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMedicationForm, setShowAddMedicationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chart data
  const userRoleData: ChartData<'pie'> = {
    labels: ['Admins', 'Pharmacies', 'Regular Users'],
    datasets: [
      {
        data: [
          users.filter(u => u.role === 'admin').length,
          users.filter(u => u.role === 'pharmacy').length,
          users.filter(u => u.role === 'user').length
        ],
        backgroundColor: [
          'rgba(4, 29, 38, 0.8)',    // #041D26
          'rgba(59, 119, 61, 0.8)',  // #3B773D
          'rgba(64, 180, 176, 0.8)'  // #40B4B0
        ],
        borderColor: [
          'rgba(4, 29, 38, 1)',
          'rgba(59, 119, 61, 1)',
          'rgba(64, 180, 176, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 15,
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const medicationTypeData: ChartData<'pie'> = {
    labels: ['Prescription', 'Non-Prescription'],
    datasets: [
      {
        data: [
          medications.filter(m => m.prescription).length,
          medications.filter(m => !m.prescription).length
        ],
        backgroundColor: [
          'rgba(74, 66, 244, 0.8)',  // #4A42F4
          'rgba(138, 118, 155, 0.8)' // #8A769B
        ],
        borderColor: [
          'rgba(74, 66, 244, 1)',
          'rgba(138, 118, 155, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 15,
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const bloodDonationStatusData: ChartData<'pie'> = {
    labels: ['Active', 'Fulfilled', 'Expired'],
    datasets: [
      {
        data: [
          bloodDonationRequests.filter(r => r.status === 'active').length,
          bloodDonationRequests.filter(r => r.status === 'fulfilled').length,
          bloodDonationRequests.filter(r => r.status === 'expired').length
        ],
        backgroundColor: [
          'rgba(4, 29, 38, 0.8)',    // #041D26
          'rgba(59, 119, 61, 0.8)',  // #3B773D
          'rgba(64, 180, 176, 0.8)'  // #40B4B0
        ],
        borderColor: [
          'rgba(4, 29, 38, 1)',
          'rgba(59, 119, 61, 1)',
          'rgba(64, 180, 176, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 15,
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const medicationCategoriesData: ChartData<'bar'> = {
    labels: Array.from(new Set(medications.map(m => m.category.en))),
    datasets: [
      {
        label: 'Medications per Category',
        data: Array.from(new Set(medications.map(m => m.category.en))).map(category =>
          medications.filter(m => m.category.en === category).length
        ),
        backgroundColor: 'rgba(74, 66, 244, 0.8)',  // #4A42F4
        borderColor: 'rgba(74, 66, 244, 1)',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 35,
        maxBarThickness: 50,
        minBarLength: 4,
      },
    ],
  };

  const pharmacyCitiesData: ChartData<'bar'> = {
    labels: Array.from(new Set(pharmacies.map(p => p.city))),
    datasets: [
      {
        label: 'Pharmacies per City',
        data: Array.from(new Set(pharmacies.map(p => p.city))).map(city =>
          pharmacies.filter(p => p.city === city).length
        ),
        backgroundColor: 'rgba(138, 118, 155, 0.8)',  // #8A769B
        borderColor: 'rgba(138, 118, 155, 1)',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 35,
        maxBarThickness: 50,
        minBarLength: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 13,
            weight: 'bold',
            family: "'Inter', sans-serif"
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
      easing: 'easeOutQuart'
    }
  } as const;

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 13,
            weight: 'bold',
            family: "'Inter', sans-serif"
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          padding: 8
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          padding: 8
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  } as const;
 
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
    prescription: false
  });
 
  // Redirect if not logged in as admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);
 
  // Fetch all data when component mounts
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await Promise.all([
          fetchUsers(),
          fetchPharmacies(),
          fetchMedications(),
          fetchBloodDonationRequests()
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.role === 'admin') {
      fetchAllData();
    }
  }, [currentUser, fetchUsers, fetchPharmacies, fetchMedications, fetchBloodDonationRequests]);
 
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
    medication.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medication.name.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medication.name.fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medication.category.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medication.category.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medication.category.fr.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const filteredBloodRequests = bloodDonationRequests.filter(request =>
    request.bloodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to format hours
  const formatHours = (hours: any) => {
    if (!hours || typeof hours !== 'object') return '';
    
    return Object.entries(hours)
      .filter(([day]) => day !== '_id') // Filter out _id if present
      .map(([day, schedule]: [string, any]) => {
        if (!schedule || typeof schedule !== 'object') return '';
        return `${day}: ${schedule.open || ''} - ${schedule.close || ''}`;
      })
      .filter(Boolean)
      .join(', ');
  };
 
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
        prescription: false
      });
      setShowAddMedicationForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add medication');
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

  const handleDeleteUser = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
     
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
 
      // Refresh users list
      await useStore.getState().fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
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
     
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('Admin.charts.user_roles')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie data={userRoleData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('Admin.charts.medication_types')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie data={medicationTypeData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('Admin.charts.blood_donation_status')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie data={bloodDonationStatusData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('Admin.charts.medication_categories')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={medicationCategoriesData} options={barChartOptions} />
            </div>
          </CardContent>
        </Card>
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
                <p className="text-sm font-medium text-gray-500">{t('Admin.users.title')}</p>
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
                <p className="text-sm font-medium text-gray-500">{t('Admin.pharmacies.title')}</p>
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
                <p className="text-sm font-medium text-gray-500">{t('Admin.medications.title')}</p>
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
                <p className="text-sm font-medium text-gray-500">{t('Admin.blood.title')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
     
      {/* Search and Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
        <Input
          placeholder={t(`Admin.${activeTab}.search_placeholder`)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
        </div>
        <div className="ml-4">
          {activeTab === 'medications' && (
            <Button onClick={() => setShowAddMedicationForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('Admin.medications.add')}
            </Button>
          )}
        </div>
      </div>
 
      {/* Content based on active tab */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.users.name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.users.email')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.users.role')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.users.blood_type')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.users.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.role === 'admin' ? 'primary' : user.role === 'pharmacy' ? 'secondary' : 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.bloodDonor && (
                      <Badge variant="info">
                        {user.bloodDonor.bloodType}
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="h-4 w-4" />
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
        <div className="grid grid-cols-1 gap-6">
          <Card>
              <CardHeader>
              <CardTitle>{t('Admin.pharmacies.distribution')}</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="h-96">
                <Bar data={pharmacyCitiesData} options={barChartOptions} />
                </div>
              </CardContent>
            </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Admin.pharmacies.list')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pharmacies.map(pharmacy => (
                  <div key={pharmacy.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{pharmacy.name}</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{t('Admin.pharmacies.city')}:</span> {pharmacy.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{t('Admin.pharmacies.phone')}:</span> {pharmacy.phone}
                      </p>
                      <div className="flex justify-end mt-4">
                        <Button variant="danger" size="sm" onClick={() => handleDeletePharmacy(pharmacy.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                    </div>
                  </div>
                ))}
                </div>
              </CardContent>
            </Card>
        </div>
      )}
 
      {activeTab === 'medications' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.medications.name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.medications.description')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.medications.category')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.medications.prescription')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.medications.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medications.map(medication => (
                <tr key={medication.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{t('medication.name', { defaultValue: medication.name.en })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{t('medication.description', { defaultValue: medication.description.en })}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <Badge>{t('medication.category', { defaultValue: medication.category.en })}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      {medication.prescription && (
                        <Badge variant="warning">{t('Admin.medications.prescription_required')}</Badge>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                      <Button variant="danger" size="sm" onClick={() => handleDeleteMedication(medication.id)}>
                      <Trash2 className="h-4 w-4" />
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.blood.hospital')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.blood.blood_type')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.blood.urgency')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.blood.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.blood.contact')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Admin.blood.donors')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bloodDonationRequests.map(request => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.hospital}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.bloodType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={request.urgency === 'high' ? 'danger' : request.urgency === 'medium' ? 'warning' : 'info'}>
                        {request.urgency}
                      </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary">{request.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.contactInfo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {request.donors ? request.donors.length : 0}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
 
export default AdminDashboard;
 
