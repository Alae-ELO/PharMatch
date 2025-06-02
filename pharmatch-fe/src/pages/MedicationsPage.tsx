import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useStore from '../store';
import { Medication, Pharmacy } from '../types';
import i18n from '../i18n';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { X, Eye, Pill, Search, Filter } from 'lucide-react';

const MedicationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { medications, fetchMedications, fetchPharmaciesByMedication } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoadingPharmacies, setIsLoadingPharmacies] = useState(false);
  const [pharmacyError, setPharmacyError] = useState<string | null>(null);

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

  const handleViewDetails = async (medication: Medication, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    setSelectedMedication(medication);
    setShowModal(true);
    setIsLoadingPharmacies(true);
    setPharmacyError(null);
    
    try {
      const pharmacies = await fetchPharmaciesByMedication(medication.id);
      setPharmacies(pharmacies || []);
    } catch (error) {
      setPharmacyError(t('medications.error.fetchingPharmacies'));
      console.error('Error fetching pharmacies:', error);
    } finally {
      setIsLoadingPharmacies(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMedication(null);
    setPharmacies([]);
    setPharmacyError(null);
  };

  const handlePharmacyClick = (id: string) => {
    navigate(`/pharmacies/${id}`);
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('medications.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('medications.description', 'Find and compare medications across pharmacies')}
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-cyan-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('medications.searchPlaceholder')}
                  className="w-full px-4 py-3 pl-12 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D72] focus:border-[#004D72] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#004D72] w-5 h-5" />
              </div>
            </div>
            <div className="w-full md:w-64">
              <div className="relative">
                <select
                  className="w-full px-4 py-3 pl-12 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D72] focus:border-transparent transition-all appearance-none bg-white"
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
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#004D72] w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Medications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedications.map((medication) => (
            <div
              key={medication.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 group border border-cyan-100"
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
                <div className="h-48 flex items-center justify-center">
                  <Pill className="w-16 h-16 text-[#004D72]" />
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#004D72] mb-2 group-hover:text-[#004D72] transition-colors duration-300">
                  {getLocalizedText(medication.name)}
                </h2>
                <p className="text-sm font-medium text-cyan-600 mb-3">
                  {getLocalizedText(medication.category)}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {getLocalizedText(medication.description)}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-cyan-100">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-[#004D72]"
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#004D72] hover:text-[#004D72] hover:bg-cyan-50 transition-colors p-2 rounded-full"
                    onClick={(e) => handleViewDetails(medication, e)}
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredMedications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-cyan-100">
            <Pill className="w-16 h-16 text-[#004D72] mx-auto mb-4" />
            <p className="text-xl text-[#004D72] mb-2">{t('medications.noResults')}</p>
            <p className="text-gray-500">
              {t('medications.tryDifferentSearch', 'Try adjusting your search or filter criteria')}
            </p>
          </div>
        )}

        {/* Pharmacy Details Modal */}
        {showModal && selectedMedication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden border border-cyan-100">
              <CardHeader className="flex flex-row items-center justify-between border-b border-cyan-100">
                <CardTitle className="text-xl font-semibold text-[#004D72]">
                  {t('medications.pharmacyDetails', 'Pharmacy Details')} - {getLocalizedText(selectedMedication.name)}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-cyan-50"
                  onClick={closeModal}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-6 overflow-y-auto">
                {isLoadingPharmacies ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004D72]"></div>
                  </div>
                ) : pharmacyError ? (
                  <div className="text-center py-8 text-red-600">
                    {pharmacyError}
                  </div>
                ) : pharmacies.length === 0 ? (
                  <div className="text-center py-8 text-[#004D72]">
                    {t('medications.noPharmaciesFound')}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pharmacies.map((pharmacy) => (
                      <div
                        key={pharmacy.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-cyan-100"
                        onClick={() => handlePharmacyClick(pharmacy.id)}
                      >
                        <div>
                          <h3 className="font-medium text-[#004D72]">{pharmacy.name}</h3>
                          <p className="text-sm text-gray-600">{pharmacy.address}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#004D72]">
                            {t('medications.price')}: ${selectedMedication.price?.toFixed(2) ?? '0'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsPage; 