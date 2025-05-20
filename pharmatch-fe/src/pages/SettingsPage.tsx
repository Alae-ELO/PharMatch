import React, { useState } from 'react';
import { Bell, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useStore from '../store';
import Badge from '../components/ui/Badge';

const SettingsPage: React.FC = () => {
  const { currentUser } = useStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!currentUser) {
    return null;
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // This would update the password in a real app
    alert("In a real app, this would update your password");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Email Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Blood donation requests in your area
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Medication availability updates
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        System announcements
                      </span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Push Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Enable push notifications
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
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Current Password"
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
                  label="New Password"
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
                  label="Confirm New Password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
                
                <Button type="submit">
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Profile Visibility</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Show my blood donor status to others
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Allow pharmacies to contact me about medication availability
                      </span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Data Usage</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Allow location tracking for finding nearby pharmacies
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Share anonymous usage data to improve services
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
              <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-gray-500">Chrome on Windows • IP: 192.168.1.1</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // This would log out other sessions in a real app
                    alert("This would log out all other sessions");
                  }}
                >
                  Log Out All Other Sessions
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