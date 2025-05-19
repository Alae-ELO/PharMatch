import React, { useState } from 'react';
import { Heart, PlusCircle, Clock, AlertCircle, MapPin, Phone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import useStore from '../store';
import { motion } from 'framer-motion';

const BloodDonationPage = () => {
  const { 
    bloodDonationRequests, 
    createBloodDonationRequest,
    currentUser,
    registerAsBloodDonor
  } = useStore();
  
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [bloodType, setBloodType] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // New request form state
  const [newRequest, setNewRequest] = useState({
    bloodType: '',
    hospital: '',
    urgency: 'medium',
    contactInfo: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleRegisterDonor = async () => {
    if (!bloodType) return;
    
    setIsRegistering(true);
    await registerAsBloodDonor(bloodType);
    setIsRegistering(false);
    setShowDonorForm(false);
  };
  
  const handleCreateRequest = async () => {
    if (!newRequest.bloodType || !newRequest.hospital || !newRequest.contactInfo) return;
    
    setIsSubmitting(true);
    await createBloodDonationRequest(newRequest);
    setIsSubmitting(false);
    setShowRequestForm(false);
    
    // Reset form
    setNewRequest({
      bloodType: '',
      hospital: '',
      urgency: 'medium',
      contactInfo: ''
    });
  };
  
  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Sort by urgency and date
  const sortedRequests = [...bloodDonationRequests].sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    if (a.urgency !== b.urgency) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blood Donation</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Register as a blood donor or view current blood donation requests.
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
        {!currentUser?.bloodDonor && (
          <button 
            className="btn btn-success"
            variant="secondary" 
            size="lg" 
            icon={<Heart className="h-5 w-5" />}
            onClick={() => setShowDonorForm(true)}
          >
            Register as Blood Donor
          </button>
        )}
        
        <button 
          className="btn btn-info"
          size="lg" 
          icon={<PlusCircle className="h-5 w-5" />}
          onClick={() => setShowRequestForm(true)}
        >
          Create Donation Request
        </button>
      </div>
      
      {/* Donor Registration Form */}
      {showDonorForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-10"
        >
          <Card>
            <CardHeader>
              <CardTitle>Register as Blood Donor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Blood Type
                </label>
                <select
                  id="bloodType"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>By registering as a donor, you'll receive notifications when your blood type is needed in your area.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <button className="btn btn-dash btn-secondary" variant="ghost" onClick={() => setShowDonorForm(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-info"
                onClick={handleRegisterDonor} 
                disabled={!bloodType || isRegistering}
                isLoading={isRegistering}
              >
                Register
              </button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
      
      {/* Create Request Form */}
      {showRequestForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-10"
        >
          <Card>
            <CardHeader>
              <CardTitle>Create Blood Donation Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="requestBloodType" className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type Needed
                </label>
                <select
                  id="requestBloodType"
                  name="bloodType"
                  value={newRequest.bloodType}
                  onChange={handleRequestChange}
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              <input
                label="Hospital/Location"
                name="hospital"
                class="input"
                value={newRequest.hospital}
                onChange={handleRequestChange}
                placeholder="Enter hospital or donation center name"
              />
              
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={newRequest.urgency}
                  onChange={handleRequestChange}
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="low">Low - Within weeks</option>
                  <option value="medium">Medium - Within days</option>
                  <option value="high">High - URGENT (hours)</option>
                </select>
              </div>
              
              <input
                label="Contact Information"
                name="contactInfo"
                class="input"
                value={newRequest.contactInfo}
                onChange={handleRequestChange}
                placeholder="Phone number or email for contact"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <button
                className="btn btn-dash btn-secondary"
                variant="ghost" onClick={() => setShowRequestForm(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-info"
                onClick={handleCreateRequest} 
                disabled={!newRequest.bloodType || !newRequest.hospital || !newRequest.contactInfo || isSubmitting}
                isLoading={isSubmitting}
              >
                Create Request
              </button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
      
      {/* Current User Status */}
      {currentUser?.bloodDonor && (
        <div className="max-w-md mx-auto mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Your Donor Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium">Blood Type:</p>
                <div className="btn btn-primary" variant="primary" >
                  {currentUser.bloodDonor.bloodType}
                </div>
              </div>
              
              {currentUser.bloodDonor.lastDonation && (
                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium">Last Donation:</p>
                  <div className="btn btn-error" variant="default">
                    {new Date(currentUser.bloodDonor.lastDonation).toLocaleDateString()}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <p className="font-medium">Status:</p>
                <div className="btn btn-success" variant="success">
                  Eligible to Donate
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button 
                className="btn btn-dash btn-success"
                variant="outline" 
                fullWidth
                onClick={() => {
                  // This would record a donation in a real app
                  alert("In a real app, this would record your donation and update your eligibility status.");
                }}
              >
                Record a Donation
              </button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Blood Requests Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Blood Donation Requests</h2>
        
        {sortedRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No blood donation requests at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={request.urgency === 'high' ? 'border-red-400' : ''}>
                  <CardHeader className={request.urgency === 'high' ? 'bg-red-50' : ''}>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        <Heart className={`h-5 w-5 mr-2 ${request.urgency === 'high' ? 'text-red-600' : 'text-red-500'}`} />
                        {request.bloodType}
                      </CardTitle>
                      <div 
                        className={
                          request.urgency === 'high' 
                            ? "btn btn-error" 
                            : request.urgency === 'medium' 
                              ? "btn btn-warning"
                              : "btn btn-info"
                        }
                        variant={
                          request.urgency === 'high' 
                            ? 'danger' 
                            : request.urgency === 'medium' 
                              ? 'warning' 
                              : 'info'
                        }
                      >
                        {request.urgency === 'high' 
                          ? 'URGENT' 
                          : request.urgency === 'medium' 
                            ? 'Medium' 
                            : 'Low'
                        }
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{request.hospital}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                      <p className="text-gray-700">{request.contactInfo}</p>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-600">Posted {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    {request.urgency === 'high' && (
                      <div className="flex items-start mt-2 bg-red-50 p-2 rounded-md">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700">Urgent need! Please contact immediately if you can donate.</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <button 
                      className={request.urgency === 'high' ? "btn btn-error" : "btn btn-primary"}
                      variant={request.urgency === 'high' ? 'danger' : 'primary'}
                      fullWidth
                      onClick={() => {
                        // This would initiate contact in a real app
                        alert(`Contact ${request.hospital} at ${request.contactInfo} to donate blood type ${request.bloodType}`);
                      }}
                    >
                      I Want to Donate
                    </button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Information Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Blood Donation Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• Be at least 17 years old (16 with parental consent)</li>
                <li>• Weigh at least 110 pounds</li>
                <li>• Be in good general health</li>
                <li>• Wait at least 8 weeks between whole blood donations</li>
                <li>• No fever or illness at time of donation</li>
                <li>• Maintain adequate iron levels</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Blood Type Compatibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-700">
                <p><strong>Type O-:</strong> Universal donor (can donate to all types)</p>
                <p><strong>Type O+:</strong> Can donate to O+, A+, B+, AB+</p>
                <p><strong>Type A-:</strong> Can donate to A-, A+, AB-, AB+</p>
                <p><strong>Type A+:</strong> Can donate to A+, AB+</p>
                <p><strong>Type B-:</strong> Can donate to B-, B+, AB-, AB+</p>
                <p><strong>Type B+:</strong> Can donate to B+, AB+</p>
                <p><strong>Type AB-:</strong> Can donate to AB-, AB+</p>
                <p><strong>Type AB+:</strong> Can donate to AB+ only</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BloodDonationPage;