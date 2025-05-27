import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Building2, Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import useStore from '../store';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
  });

  if (!currentUser) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('actions.save') + "\n" + JSON.stringify(formData, null, 2));
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('profile.header')}</h1>
        
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.personalTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label={t('profile.fullName')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    icon={<User className="h-5 w-5" />}
                  />
                  <Input
                    label={t('profile.email')}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    icon={<Mail className="h-5 w-5" />}
                  />
                  <Input
                    label={t('profile.phone')}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    icon={<Phone className="h-5 w-5" />}
                  />
                  <Input
                    label={t('profile.address')}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    icon={<MapPin className="h-5 w-5" />}
                  />
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{currentUser.name}</span>
                    </div>
                    <Badge variant={
                      currentUser.role === 'admin' 
                        ? 'primary' 
                        : currentUser.role === 'pharmacy' 
                          ? 'secondary' 
                          : 'default'
                    }>
                      {currentUser.role}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{currentUser.email}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {isEditing ? (
                <div className="flex space-x-4">
                  <Button onClick={handleSubmit}>{t('actions.save')}</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t('actions.cancel')}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  {t('actions.edit')}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Pharmacy Information */}
          {currentUser.role === 'pharmacy' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.pharmacyTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <span>{t('profile.pharmacyLicense')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{t('profile.pharmacyAddress')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{t('profile.pharmacyPhone')}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Blood Donor Information */}
          {currentUser.bloodDonor && (
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.bloodDonorTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>{t('profile.bloodType', { bloodType: currentUser.bloodDonor.bloodType })}</span>
                </div>
                {currentUser.bloodDonor.lastDonation && (
                  <div>
                    <p className="text-sm text-gray-500">{t('profile.lastDonation')}</p>
                    <p>{new Date(currentUser.bloodDonor.lastDonation).toLocaleDateString()}</p>
                  </div>
                )}
                {currentUser.bloodDonor.eligibleToDonateSince && (
                  <div>
                    <p className="text-sm text-gray-500">{t('profile.eligibleSince')}</p>
                    <p>{new Date(currentUser.bloodDonor.eligibleToDonateSince).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.accountTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t('profile.emailNotifications')}</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {t('profile.bloodDonationRequests')}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {t('profile.medicationUpdates')}
                    </span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t('profile.privacySettings')}</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {t('profile.showBloodDonorStatus')}
                    </span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">{t('danger.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('danger.description')}
              </p>
              <Button 
                variant="danger"
                onClick={() => {
                  alert(t('danger.delete'));
                }}
              >
                {t('danger.delete')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
