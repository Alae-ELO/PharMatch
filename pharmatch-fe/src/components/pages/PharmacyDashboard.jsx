import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, Bell, AlertTriangle, Edit, Trash2, Check, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useStore from '../store';
import { Medication } from '../types';

const PharmacyDashboard = () => {
  const { currentUser, medications, pharmacies } = useStore();
  const navigate = useNavigate();
  
  // Redirect if not logged in as pharmacy
  React.useEffect(() => {
    if (!currentUser || currentUser.role !== 'pharmacy') {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  if (!currentUser || currentUser.role !== 'pharmacy') {
    return null;
  }
  
  // Find the pharmacy data for the current user
  const pharmacyData = pharmacies.find(p => p.name === currentUser.name);
  
  if (!pharmacyData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pharmacy Profile Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your pharmacy profile. Please contact support.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }
  
  // Get medications for this pharmacy
  const pharmacyMedications = medications.filter(med => 
    med.pharmacies.some(p => p.id === pharmacyData.id)
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{pharmacyData.name} Dashboard</h1>
        <p className="text-gray-600">Manage your medications and view statistics</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-cyan-100 p-3 mr-4">
                <Package className="h-6 w-6 text-cyan-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Available Medications</p>
                <p className="text-2xl font-bold">{pharmacyMedications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-emerald-100 p-3 mr-4">
                <Users className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Customer Interactions</p>
                <p className="text-2xl font-bold">342</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-amber-100 p-3 mr-4">
                <Bell className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Notifications</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Medication Management */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Medication Inventory</CardTitle>
          <Button 
            size="sm" 
            icon={<Plus className="h-4 w-4" />}
            onClick={() => {
              alert("This would open a form to add a new medication to your inventory.");
            }}
          >
            Add Medication
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-sm font-medium text-gray-500">Name</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Category</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Price</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pharmacyMedications.map(med => {
                  const pharmacyInfo = med.pharmacies.find(p => p.id === pharmacyData.id);
                  return (
                    <tr key={med.id} className="border-b">
                      <td className="py-4">
                        <div className="font-medium">{med.name}</div>
                        <div className="text-sm text-gray-500">{med.prescription ? 'Prescription' : 'OTC'}</div>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{med.category}</Badge>
                      </td>
                      <td className="py-4">
                        ${pharmacyInfo?.price?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="py-4">
                        {pharmacyInfo?.inStock ? (
                          <Badge variant="success">In Stock</Badge>
                        ) : (
                          <Badge variant="danger">Out of Stock</Badge>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => {
                              alert(`This would open a form to edit ${med.name}`);
                            }}
                          >
                            Edit
                          </Button>
                          {!pharmacyInfo?.inStock ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              icon={<Check className="h-4 w-4" />}
                              onClick={() => {
                                alert(`This would mark ${med.name} as in stock`);
                              }}
                            >
                              Mark In Stock
                            </Button>
                          ) : (
                            <Button 
                              variant="danger" 
                              size="sm" 
                              icon={<Trash2 className="h-4 w-4" />}
                              onClick={() => {
                                alert(`This would remove ${med.name} from your inventory`);
                              }}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Pharmacy Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pharmacy Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Pharmacy Name"
              value={pharmacyData.name}
              readOnly
            />
            <Input 
              label="Email Address"
              value={pharmacyData.email}
              readOnly
            />
            <Input 
              label="Phone Number"
              value={pharmacyData.phone}
              readOnly
            />
            <Input 
              label="Address"
              value={`${pharmacyData.address}, ${pharmacyData.city}`}
              readOnly
            />
            <div className="col-span-1 md:col-span-2">
              <Input 
                label="Business Hours"
                value={pharmacyData.hours}
                readOnly
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline"
            onClick={() => {
              alert("This would open a form to update your pharmacy information.");
            }}
          >
            Edit Information
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PharmacyDashboard;