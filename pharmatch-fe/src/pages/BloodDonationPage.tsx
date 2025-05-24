import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, PlusCircle, Clock, AlertCircle, MapPin, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useStore from '../store';
import { motion } from 'framer-motion';
import { BloodDonationRequest } from '../types';

const BloodDonationPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    bloodDonationRequests, 
    createBloodDonationRequest,
    currentUser,
    registerAsBloodDonor
  } = useStore();

  const [showDonorForm, setShowDonorForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodDonationRequest | null>(null);
  const [bloodType, setBloodType] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const [newRequest, setNewRequest] = useState({
    bloodType: '',
    hospital: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
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
    setNewRequest({
      bloodType: '',
      hospital: '',
      urgency: 'medium',
      contactInfo: ''
    });
  };

  const handleShowContactModal = (request: BloodDonationRequest) => {
    setSelectedRequest(request);
    setShowContactModal(true);
  };

  const handleRequestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sortedRequests = [...bloodDonationRequests].sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    if (a.urgency !== b.urgency) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('bloodDonation.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('bloodDonation.subtitle')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
        {!currentUser?.bloodDonor && (
          <Button 
            variant="secondary" 
            size="lg" 
            icon={<Heart className="h-5 w-5" />}
            onClick={() => {
              setShowRequestForm(false);
              setShowContactModal(false);
              setShowDonorForm(!showDonorForm);
            }}
          >
            {t('bloodDonation.register')}
          </Button>
        )}

        <Button 
          size="lg" 
          icon={<PlusCircle className="h-5 w-5" />}
          onClick={() => {
            setShowDonorForm(false);
            setShowContactModal(false);
            setShowRequestForm(!showRequestForm);
          }}
        >
          {t('bloodDonation.createRequest')}
        </Button>
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
              <CardTitle>{t('bloodDonation.registerTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('bloodDonation.yourBloodType')}
                </label>
                <select
                  id="bloodType"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="block w-full rounded-md border px-4 py-2"
                >
                  <option value="">{t('bloodDonation.selectBloodType')}</option>
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
              <p className="text-sm text-gray-600">
                {t('bloodDonation.registerInfo')}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setShowDonorForm(false)}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleRegisterDonor} 
                disabled={!bloodType || isRegistering}
                isLoading={isRegistering}
              >
                {t('common.register')}
              </Button>
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
              <CardTitle>{t('bloodDonation.createRequestTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="requestBloodType" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('bloodDonation.bloodTypeNeeded')}
                </label>
                <select
                  id="requestBloodType"
                  name="bloodType"
                  value={newRequest.bloodType}
                  onChange={handleRequestChange}
                  className="block w-full rounded-md border px-4 py-2"
                >
                  <option value="">{t('bloodDonation.selectBloodType')}</option>
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
              
              <Input
                label={t('bloodDonation.hospital')}
                name="hospital"
                value={newRequest.hospital}
                onChange={handleRequestChange}
                placeholder={t('bloodDonation.hospitalPlaceholder')}
              />
              
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('bloodDonation.urgency')}
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={newRequest.urgency}
                  onChange={handleRequestChange}
                  className="block w-full rounded-md border px-4 py-2"
                >
                  <option value="low">{t('bloodDonation.urgencyLow')}</option>
                  <option value="medium">{t('bloodDonation.urgencyMedium')}</option>
                  <option value="high">{t('bloodDonation.urgencyHigh')}</option>
                </select>
              </div>
              
              <Input
                label={t('bloodDonation.contactInfo')}
                name="contactInfo"
                value={newRequest.contactInfo}
                onChange={handleRequestChange}
                placeholder={t('bloodDonation.contactPlaceholder')}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setShowRequestForm(false)}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleCreateRequest} 
                disabled={!newRequest.bloodType || !newRequest.hospital || !newRequest.contactInfo || isSubmitting}
                isLoading={isSubmitting}
              >
                {t('bloodDonation.create')}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default BloodDonationPage;
