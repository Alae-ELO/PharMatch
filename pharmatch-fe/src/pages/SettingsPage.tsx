import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useStore from '../store';
import Badge from '../components/ui/Badge';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!currentUser) {
    return null;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError(t('register.step1.errors.passwordsMismatch'));
      setIsLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError(t('register.step1.errors.passwordLength'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/updatepassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      // Clear form and show success message
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccess(t('settings.security.changePasswordSuccess'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('settings.header')}</h1>
        
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
               {t('settings.notifications.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{t('settings.notifications.emailNotifications')}</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                       {t('settings.notifications.bloodDonationRequests')}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {t('settings.notifications.medicationUpdates')}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                      {t('settings.notifications.systemAnnouncements')}
                      </span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{t('settings.notifications.pushNotifications')}</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {t('settings.notifications.enablePush')}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
               {t('settings.security.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {success}
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label={t('settings.security.currentPassword')}
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  icon={
                    showCurrentPassword ? (
                      <EyeOff
                        className="h-5 w-5 cursor-pointer"
                        onClick={() => setShowCurrentPassword(false)}
                      />
                    ) : (
                      <Eye
                        className="h-5 w-5 cursor-pointer"
                        onClick={() => setShowCurrentPassword(true)}
                      />
                    )
                  }
                />
                
                <Input
                  label={t('settings.security.newPassword')}
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  icon={
                    showNewPassword ? (
                      <EyeOff
                        className="h-5 w-5 cursor-pointer"
                        onClick={() => setShowNewPassword(false)}
                      />
                    ) : (
                      <Eye
                        className="h-5 w-5 cursor-pointer"
                        onClick={() => setShowNewPassword(true)}
                      />
                    )
                  }
                />
                
                <Input
                  label={t('settings.security.confirmNewPassword')}
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t('common.loading') : t('settings.security.changePassword')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
               {t('settings.privacy.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{t('settings.privacy.profileVisibility')}</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {t('settings.privacy.showBloodDonorStatus')}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                         {t('settings.privacy.allowPharmacyContact')}
                      </span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{t('settings.privacy.dataUsage')}</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                         {t('settings.privacy.allowLocationTracking')}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {t('settings.privacy.shareAnonymousData')}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.sessions.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{t('settings.sessions.currentSession')}</p>
                    <p className="text-sm text-gray-500">{t('settings.sessions.currentSessionDetails')}</p>
                  </div>
                  <Badge variant="success">{t('settings.sessions.active')}</Badge>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // This would log out other sessions in a real app
                    alert(t('settings.sessions.logoutOthersSuccess'));
                  }}
                >
                  {t('settings.sessions.logoutOthers')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;