import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, Bell, AlertTriangle, Edit, Trash2, Check, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useStore from '../store';
import { Medication } from '../types';
import { useTranslation } from 'react-i18next';

const PharmacyDashboard: React.FC = () => {
  const { t } = useTranslation();
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('pharmacyDashboard.error.title')}</h2>
          <p className="text-gray-600 mb-6">{t('pharmacyDashboard.error.description')}</p>
          <Button onClick={() => navigate('/')}>{t('pharmacyDashboard.error.returnHome')}</Button>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pharmacyDashboard.header.title', { pharmacyName: pharmacyData.name })}</h1>
        <p className="text-gray-600">{t('pharmacyDashboard.header.description')}</p>
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
                <p className="text-sm font-medium text-gray-500">{t('pharmacyDashboard.stats.availableMedications')}</p>
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
                <p className="text-sm font-medium text-gray-500">{t('pharmacyDashboard.stats.customerInteractions')}</p>
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
                <p className="text-sm font-medium text-gray-500">{t('pharmacyDashboard.stats.pendingNotifications')}</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Medication Management */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('pharmacyDashboard.medication.title')}</CardTitle>
          <Button 
            size="sm" 
            icon={<Plus className="h-4 w-4" />}
            onClick={() => {
              alert(t('pharmacyDashboard.medication.add'));
            }}
          >
           {t('pharmacyDashboard.medication.add')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-sm font-medium text-gray-500">{t('pharmacyDashboard.medication.name')}</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">{t('pharmacyDashboard.medication.category')}</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">{t('pharmacyDashboard.medication.price')}</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">{t('pharmacyDashboard.medication.status')}</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">{t('pharmacyDashboard.medication.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {pharmacyMedications.map(med => {
                  const pharmacyInfo = med.pharmacies.find(p => p.id === pharmacyData.id);
                  return (
                    <tr key={med.id} className="border-b">
                      <td className="py-4">
                        <div className="font-medium">{med.name}</div>
                        <div className="text-sm text-gray-500">{med.prescription ?t('pharmacyDashboard.medication.prescription') : t('pharmacyDashboard.medication.otc')}</div>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{med.category}</Badge>
                      </td>
                      <td className="py-4">
                        ${pharmacyInfo?.price?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="py-4">
                        {pharmacyInfo?.inStock ? (
                          <Badge variant="success">{t('pharmacyDashboard.medication.inStock')}</Badge>
                        ) : (
                          <Badge variant="danger">{t('pharmacyDashboard.medication.outOfStock')}</Badge>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => {
                              alert((t('pharmacyDashboard.medication.edit') + ` ${med.name}`));
                            }}
                          >
                           {t('pharmacyDashboard.medication.edit')}
                          </Button>
                          {!pharmacyInfo?.inStock ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              icon={<Check className="h-4 w-4" />}
                              onClick={() => {
                                alert(t('pharmacyDashboard.medication.markInStock') + ` ${med.name}`);
                              }}
                            >
                             {t('pharmacyDashboard.medication.markInStock')}
                            </Button>
                          ) : (
                            <Button 
                              variant="danger" 
                              size="sm" 
                              icon={<Trash2 className="h-4 w-4" />}
                              onClick={() => {
                                alert(t('pharmacyDashboard.medication.remove') + ` ${med.name}`);
                              }}
                            >
                            {t('pharmacyDashboard.medication.remove')}
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
          <CardTitle>{t('pharmacyDashboard.info.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label={t('pharmacyDashboard.info.name')}
              value={pharmacyData.name}
              readOnly
            />
            <Input 
              label={t('pharmacyDashboard.info.email')}
              value={pharmacyData.email}
              readOnly
            />
            <Input 
              label={t('pharmacyDashboard.info.phone')}
              value={pharmacyData.phone}
              readOnly
            />
            <Input 
              label={t('pharmacyDashboard.info.address')}
              value={`${pharmacyData.address}, ${pharmacyData.city}`}
              readOnly
            />
            <div className="col-span-1 md:col-span-2">
              <Input 
                label={t('pharmacyDashboard.info.hours')}
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
              alert(t('pharmacyDashboard.info.edit'));
            }}
          >
          {t('pharmacyDashboard.info.edit')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PharmacyDashboard;