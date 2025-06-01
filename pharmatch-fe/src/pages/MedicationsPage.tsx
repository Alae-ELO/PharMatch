import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useStore from '../store';
import { Medication } from '../types';
import i18n from '../i18n';

const MedicationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { medications, fetchMedications } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  useEffect(() => {
    let filtered = medications;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(med => 
        med.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.name.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.name.fr.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(med => 
        med.category.en === categoryFilter ||
        med.category.ar === categoryFilter ||
        med.category.fr === categoryFilter
      );
    }
    
    setFilteredMedications(filtered);
  }, [medications, searchTerm, categoryFilter]);

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
  // Get unique categories for the dropdown
  const categories = Array.from(new Set(
    medications.map(med => med.category.en)
  ));

  const handleMedicationClick = (medicationId: string) => {
    navigate(`/medications/${medicationId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('medications.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('medications.description', 'Find and compare medications across pharmacies')}
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('medications.searchPlaceholder')}
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">{t('medications.allCategories')}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Medications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedications.map((medication) => (
            <div
              key={medication.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 group"
              onClick={() => handleMedicationClick(medication.id)}
            >
              {medication.image_url ? (
                <div className="relative h-48">
                  <img
                    src={medication.image_url}
                    alt={medication.name.en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                  {getLocalizedText(medication.name)}
                </h2>
                <p className="text-sm font-medium text-primary mb-3">
                  {getLocalizedText(medication.category)}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {getLocalizedText(medication.description)}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {medication.pharmacies.length} {t('medications.availablePharmacies')}
                    </span>
                  </div>
                  <div className="group/icon relative">
                    <svg
                      className="w-6 h-6 text-primary transform transition-all duration-300 group-hover/icon:translate-x-1 group-hover/icon:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    <div className="absolute -top-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {t('medications.viewDetails', 'View Details')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredMedications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl text-gray-600 mb-2">{t('medications.noResults')}</p>
            <p className="text-gray-500">
              {t('medications.tryDifferentSearch', 'Try adjusting your search or filter criteria')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsPage; 