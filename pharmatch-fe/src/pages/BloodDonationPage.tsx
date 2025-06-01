import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, PlusCircle, Clock, AlertCircle, MapPin, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useStore from '../store';
import { motion } from 'framer-motion';
import { BloodDonationRequest } from '../types';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BloodDonationPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    bloodDonationRequests, 
    createBloodDonationRequest,
    currentUser,
    registerAsBloodDonor,
    fetchBloodDonationRequests
  } = useStore();
  const navigate = useNavigate();

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
    contactInfo: '',
    expiresAt: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBloodDonationRequests();
  }, [fetchBloodDonationRequests]);

  const handleRegisterDonor = async () => {
    if (!bloodType) return;
    setIsRegistering(true);
    await registerAsBloodDonor(bloodType);
    setIsRegistering(false);
    setShowDonorForm(false);
  };

  const handleCreateRequest = async () => {
    if (!newRequest.bloodType || !newRequest.hospital || !newRequest.contactInfo) return;
    if (!newRequest.expiresAt) {
      toast.error(t('bloodDonation.errorExpiresAtRequired') || 'Veuillez choisir une date de fin.');
      return;
    }
    const expiresAtDate = new Date(newRequest.expiresAt);
    if (expiresAtDate <= new Date()) {
      toast.error(t('bloodDonation.errorExpiresAtPast') || 'La date de fin doit être dans le futur.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createBloodDonationRequest(newRequest);
      toast.success(t('bloodDonation.successRequest') || 'Merci, votre demande de don de sang a bien été enregistrée !');
      setShowRequestForm(false);
      setNewRequest({
        bloodType: '',
        hospital: '',
        urgency: 'medium',
        contactInfo: '',
        expiresAt: ''
      });
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de la demande. Veuillez réessayer.');
    }
    setIsSubmitting(false);
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

  const now = new Date();
  const activeRequests = bloodDonationRequests.filter(
    req => !req.expiresAt || new Date(req.expiresAt) > now
  );

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
      {currentUser && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          {currentUser.role === 'user' && (!currentUser.bloodDonor || !currentUser.bloodDonor.bloodType) && (
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
      )}
      {!currentUser && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <Button 
            variant="secondary" 
            size="lg" 
            icon={<Heart className="h-5 w-5" />}
            onClick={() => {
              navigate('/login');
            }}
          >
            {t('bloodDonation.register')}
          </Button>
          <Button 
            size="lg" 
            icon={<PlusCircle className="h-5 w-5" />}
            onClick={() => {
              navigate('/login');
            }}
          >
            {t('bloodDonation.createRequest')}
          </Button>
        </div>
      )}

      {/* Formulaire de création de demande (au-dessus de la liste) */}
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
              <Input
                label={t('bloodDonation.expiresAt') || 'End Date/Time'}
                name="expiresAt"
                type="datetime-local"
                value={newRequest.expiresAt || ''}
                onChange={handleRequestChange}
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

      {/* Liste des demandes de don de sang */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">{t('bloodDonation.requestsList') || 'Blood Donation Requests'}</h2>
        {activeRequests.length === 0 ? (
          <p>{t('bloodDonation.noRequests') || 'No requests found.'}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-start border border-gray-100 hover:shadow-2xl transition"
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold text-red-600 mr-2">{req.bloodType}</span>
                  <span
                    className={
                      "px-2 py-1 rounded text-xs font-semibold " +
                      (req.urgency === "high"
                        ? "bg-red-100 text-red-700"
                        : req.urgency === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700")
                    }
                  >
                    {t(`bloodDonation.urgency${req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}`) || req.urgency}
                  </span>
                </div>
                <div className="mb-1">
                  <span className="font-semibold">{t('bloodDonation.hospital') || 'Hospital'}:</span> {req.hospital}
                </div>
                <div className="mb-1">
                  <span className="font-semibold">{t('bloodDonation.contactInfo') || 'Contact'}:</span> {req.contactInfo}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {t('bloodDonation.createdAt') || 'Requested on'} : {new Date(req.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {t('bloodDonation.expiresAt') || 'Expires at'} : {req.expiresAt ? new Date(req.expiresAt).toLocaleString() : t('bloodDonation.noExpiry') || 'No expiry'}
                </div>
              </div>
            ))}
          </div>
        )}
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

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default BloodDonationPage;
