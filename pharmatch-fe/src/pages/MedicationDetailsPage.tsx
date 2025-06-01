import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useStore from '../store';
import { Medication, Pharmacy } from '../types';
import { FaArrowLeft, FaBuilding, FaInfoCircle } from 'react-icons/fa';

const MedicationDetailsPage : React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { fetchMedicationById, fetchPharmaciesByMedication } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medication, setMedication] = useState<Medication | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

  useEffect(() => {
    const loadMedicationData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch medication details
        const medData = await fetchMedicationById(id);
        if (!medData) {
          setError(t('medications.notFound'));
          return;
        }
        setMedication(medData);

        // Fetch pharmacies for this medication
        const pharmData = await fetchPharmaciesByMedication(id);
        if (pharmData) {
          setPharmacies(pharmData);
        }
      } catch (err) {
        setError(t('medications.errorLoading'));
        console.error('Error loading medication:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMedicationData();
  }, [id, fetchMedicationById, fetchPharmaciesByMedication, t]);

  // Helper function to get localized text
  const getLocalizedText = (text: { en: string; ar: string; fr: string } | undefined) => {
    if (!text) return '';
    switch (i18n.language) {
      case 'ar':
        return text.ar;
      case 'fr':
        return text.fr;
      default:
        return text.en;
    }
  };


  // use the arb name for the pharmacy name we have in the interface we have name and name_ar
  // but we when add _ar we can get the arb name we should call the interface name_ar
  const transformPharmacyName = (pharmacy:Pharmacy) => {
    if (!pharmacy) return '';
    switch (i18n.language) {
      case 'ar':
        return pharmacy.name_ar;
      default:
        return pharmacy.name;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !medication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600 text-lg">{error || t('medications.notFound')}</p>
          <button
            onClick={() => navigate('/medications')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
          >
            {t('medications.backToMedications')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/medications')}
            className="flex items-center text-gray-600 hover:text-primary mb-8 transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" />
            {t('medications.backToMedications')}
          </button>

          {/* Medication Details */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Section */}
              <div className="relative">
                {medication.image_url ? (
                  <img
                    src={medication.image_url}
                    alt={getLocalizedText(medication.name)}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    medication.prescription 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {medication.prescription ? t('medications.prescription') : t('medications.otc')}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {getLocalizedText(medication.name)}
                  </h1>
                  <p className="text-primary font-medium">
                    {getLocalizedText(medication.category)}
                  </p>
                </div>

                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('medications.description')}
                  </h2>
                  <p className="text-gray-600">
                    {getLocalizedText(medication.description)}
                  </p>
                </div>
                <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('medications.availablePharmacies')}
            </h2>

            {pharmacies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full h-full">
                {pharmacies.map((pharmacy) => (
                  <div
                    key={pharmacy.id}
                    className="relative group bg-white rounded-xl shadow-sm p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/pharmacies/${pharmacy.id}`)}
                  >
                    {/* Decorative corner element */}
                    <div className="absolute top-0 left-0 w-30 h-30 bg-primary opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>

                    <div className="flex items-center space-x-4 relative z-10">
                      <div className="flex-shrink-0">
                        <FaBuilding className="w-8 h-8 text-primary group-hover:text-primary-dark transition-colors duration-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-dark transition-colors duration-300">
                          {transformPharmacyName(pharmacy)}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <FaInfoCircle className="w-32 h-32 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-2">
                  {t('medications.noPharmaciesAvailable')}
                </p>
                <p className="text-gray-500">
                  {t('medications.tryDifferentMedication')}
                </p>
              </div>
            )}
          </div>
              </div>
            </div>
          </div>

          {/* Available Pharmacies Section */}
          
        </div>
      </div>
    </div>
  );
};

export default MedicationDetailsPage ; 