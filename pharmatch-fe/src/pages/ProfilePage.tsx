import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building2, Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import useStore from '../store';

const ProfilePage: React.FC = () => {
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
    // This would update the user profile in a real app
    alert("In a real app, this would update your profile with the following data:\n" + JSON.stringify(formData, null, 2));
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
        
        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    icon={<User className="h-5 w-5" />}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    icon={<Mail className="h-5 w-5" />}
                  />
                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    icon={<Phone className="h-5 w-5" />}
                  />
                  <Input
                    label="Address"
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
                  <Button onClick={handleSubmit}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Role-specific Information */}
          {currentUser.role === 'pharmacy' && (
            <Card>
              <CardHeader>
                <CardTitle>Pharmacy Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <span>Pharmacy License: #12345678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>123 Health Street, Medical District</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>(555) 123-4567</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Blood Donor Information */}
          {currentUser.bloodDonor && (
            <Card>
              <CardHeader>
                <CardTitle>Blood Donor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Blood Type: {currentUser.bloodDonor.bloodType}</span>
                </div>
                {currentUser.bloodDonor.lastDonation && (
                  <div>
                    <p className="text-sm text-gray-500">Last Donation:</p>
                    <p>{new Date(currentUser.bloodDonor.lastDonation).toLocaleDateString()}</p>
                  </div>
                )}
                {currentUser.bloodDonor.eligibleToDonateSince && (
                  <div>
                    <p className="text-sm text-gray-500">Eligible to Donate Since:</p>
                    <p>{new Date(currentUser.bloodDonor.eligibleToDonateSince).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      Receive notifications about blood donation requests
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Receive updates about medication availability
                    </span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Privacy Settings</h3>
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button 
                variant="danger"
                onClick={() => {
                  // This would delete the account in a real app
                  alert("This would delete your account in a real application");
                }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;