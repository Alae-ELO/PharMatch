import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Card, Badge, Modal, message } from 'antd';
import { PlusOutlined, HeartOutlined, PhoneOutlined, HospitalOutlined, AlertOutlined } from '@ant-design/icons';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { BloodDonationRequest } from '../types';
import '../bloodDonation.css';

const BloodDonationPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    user, 
    bloodDonationRequests, 
    fetchBloodDonationRequests, 
    registerAsBloodDonor, 
    createBloodDonationRequest,
    respondToBloodDonationRequest
  } = useStore();

  const [showDonorForm, setShowDonorForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodDonationRequest | null>(null);
  const [bloodType, setBloodType] = useState('');
  const [hospital, setHospital] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [contactInfo, setContactInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBloodDonationRequests();
  }, [fetchBloodDonationRequests]);

  const handleRegisterAsDonor = async () => {
    if (!bloodType) {
      message.error(t('validation.required', { field: t('bloodDonation.yourBloodType') }));
      return;
    }

    setSubmitting(true);
    try {
      await registerAsBloodDonor(bloodType);
      message.success(t('success.registered'));
      setShowDonorForm(false);
      setBloodType('');
    } catch (error) {
      message.error(t('error.generic'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!bloodType || !hospital || !contactInfo) {
      message.error(t('validation.allFieldsRequired'));
      return;
    }

    setSubmitting(true);
    try {
      await createBloodDonationRequest({
        bloodType,
        hospital,
        urgency,
        contactInfo,
      });
      message.success(t('success.created'));
      setShowRequestForm(false);
      resetForm();
    } catch (error) {
      message.error(t('error.generic'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespondToDonation = async (requestId: string) => {
    try {
      await respondToBloodDonationRequest(requestId);
      message.success(t('bloodDonation.requestSentSuccess'));
    } catch (error) {
      message.error(t('bloodDonation.requestSentError'));
    }
  };

  const showContactInfo = (request: BloodDonationRequest) => {
    setSelectedRequest(request);
    setShowContactModal(true);
  };

  const handleBloodTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBloodType(e.target.value);
  };

  const resetForm = () => {
    setBloodType('');
    setHospital('');
    setUrgency('medium');
    setContactInfo('');
  };

  // Sort requests by urgency and creation date
  const sortedRequests = [...bloodDonationRequests].sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    const urgencyComparison = urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder];
    if (urgencyComparison !== 0) return urgencyComparison;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Contact Modal Component
  const ContactModal = () => (
    <Modal
      title={t('bloodDonation.contactInfo')}
      open={showContactModal}
      onCancel={() => setShowContactModal(false)}
      footer={null}
    >
      {selectedRequest && (
        <div>
          <p>
            <HospitalOutlined /> {t('bloodDonation.hospital')}: {selectedRequest.hospital}
          </p>
          <p>
            <HeartOutlined /> {t('bloodDonation.bloodTypeNeeded')}: {selectedRequest.bloodType}
          </p>
          <p>
            <PhoneOutlined /> {t('bloodDonation.contactInfo')}: {selectedRequest.contactInfo}
          </p>
        </div>
      )}
    </Modal>
  );

  return (
    <div className="blood-donation-page">
      <div className="page-header">
        <h1>{t('bloodDonation.title')}</h1>
        <p>{t('bloodDonation.subtitle')}</p>
        
        {/* Action buttons based on user role */}
        <div className="action-buttons">
          {!user && (
            <Button 
              type="primary" 
              icon={<HeartOutlined />} 
              onClick={() => setShowDonorForm(true)}
            >
              {t('bloodDonation.becomePermanentDonor')}
            </Button>
          )}
          
          {user?.role === 'admin' && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setShowRequestForm(true)}
            >
              {t('bloodDonation.createRequest')}
            </Button>
          )}
        </div>
      </div>

      {/* Donor Registration Form */}
      {showDonorForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="form-container"
        >
          <Card title={t('bloodDonation.registerTitle')}>
            <div className="form-group">
              <label>{t('bloodDonation.yourBloodType')}</label>
              <select value={bloodType} onChange={handleBloodTypeChange}>
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
              <p className="form-info">{t('bloodDonation.registerInfo')}</p>
            </div>
            <div className="form-actions">
              <Button onClick={() => setShowDonorForm(false)}>{t('common.cancel')}</Button>
              <Button type="primary" onClick={handleRegisterAsDonor} loading={submitting}>
                {t('bloodDonation.register')}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Create Request Form */}
      {showRequestForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="form-container"
        >
          <Card title={t('bloodDonation.createRequestTitle')}>
            <div className="form-group">
              <label>{t('bloodDonation.bloodTypeNeeded')}</label>
              <select value={bloodType} onChange={handleBloodTypeChange}>
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
            <div className="form-group">
              <label>{t('bloodDonation.hospital')}</label>
              <Input
                placeholder={t('bloodDonation.hospitalPlaceholder')}
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('bloodDonation.urgency')}</label>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                <option value="low">{t('bloodDonation.urgencyLow')}</option>
                <option value="medium">{t('bloodDonation.urgencyMedium')}</option>
                <option value="high">{t('bloodDonation.urgencyHigh')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('bloodDonation.contactInfo')}</label>
              <Input
                placeholder={t('bloodDonation.contactPlaceholder')}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <Button onClick={() => setShowRequestForm(false)}>{t('common.cancel')}</Button>
              <Button type="primary" onClick={handleCreateRequest} loading={submitting}>
                {t('bloodDonation.create')}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Blood Donation Requests List */}
      <div className="blood-donation-list">
        <h2>{t('bloodDonation.availableRequests')}</h2>
        
        {sortedRequests.length === 0 ? (
          <p className="no-requests">{t('bloodDonation.noRequests')}</p>
        ) : (
          <div className="request-cards">
            {sortedRequests.map((request) => (
              <Card key={request._id} className="request-card">
                <div className="request-header">
                  <h3>{request.bloodType}</h3>
                  <Badge 
                    color={
                      request.urgency === 'high' ? 'red' : 
                      request.urgency === 'medium' ? 'orange' : 'green'
                    } 
                    text={t(`bloodDonation.urgency${request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}`)}
                  />
                </div>
                <div className="request-details">
                  <p><HospitalOutlined /> {request.hospital}</p>
                  <p><AlertOutlined /> {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="request-actions">
                  <Button 
                    onClick={() => showContactInfo(request)}
                  >
                    {t('bloodDonation.viewContactInfo')}
                  </Button>
                  
                  {user && user.role !== 'admin' && (
                    <Button 
                      type="primary" 
                      onClick={() => handleRespondToDonation(request._id)}
                    >
                      {t('bloodDonation.sendDonationRequest')}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ContactModal />
    </div>
  );
};

export default BloodDonationPage;
