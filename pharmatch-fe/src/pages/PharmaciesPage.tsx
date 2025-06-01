import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Building2, Clock, CheckCircle2, AlertCircle, LayoutGrid, Table } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useStore from '../store';
import { motion } from 'framer-motion';

const PharmaciesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pharmacies, fetchPharmacies, fetchPharmaciesByLocation, fetchPharmaciesByCity } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const formatHours = (hours: any): string => {
    if (!hours || typeof hours !== 'object') return t('pharmacyDetails.hours.notAvailable');
    
    try {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      
      // Format a single day's hours
      const formatDayHours = (dayHours: any) => {
        if (!dayHours || !dayHours.open || !dayHours.close) return '';
        return `${dayHours.open} - ${dayHours.close}`;
      };

      // Get today's hours
      if (hours[today] && hours[today].open && hours[today].close) {
        return `${t('pharmacyDetails.hours.today')}: ${formatDayHours(hours[today])}`;
      }

      // If no hours for today, find the first day with hours
      const firstAvailableDay = days.find(day => 
        hours[day] && hours[day].open && hours[day].close
      );

      if (firstAvailableDay) {
        return `${firstAvailableDay}: ${formatDayHours(hours[firstAvailableDay])}`;
      }
    } catch (error) {
      console.error('Error formatting hours:', error);
    }
    
    return t('pharmacyDetails.hours.notAvailable');
  };

  const isPharmacyOpen = (hours: any): boolean => {
    if (!hours || typeof hours !== 'object') return false;
    
    try {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
      
      const todayHours = hours[currentDay];
      if (!todayHours || !todayHours.open || !todayHours.close) return false;

      // Convert current time to minutes since midnight for easier comparison
      const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      // Convert opening time to minutes
      const [openHours, openMinutes] = todayHours.open.split(':').map(Number);
      const openTimeInMinutes = openHours * 60 + openMinutes;

      // Convert closing time to minutes
      const [closeHours, closeMinutes] = todayHours.close.split(':').map(Number);
      const closeTimeInMinutes = closeHours * 60 + closeMinutes;

      return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
    } catch (error) {
      console.error('Error checking pharmacy status:', error);
      return false;
    }
  };

  const fetchNearbyPharmacies = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      await fetchPharmaciesByLocation(latitude, longitude);
      // Use a small timeout to ensure state is updated
      setTimeout(() => {
        console.log('Current pharmacies state:', pharmacies);
      }, 100);
    } catch (err) {
      console.error('Error in fetchNearbyPharmacies:', err);
      setError(t('pharmacies.locationError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          await fetchNearbyPharmacies(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(t('pharmacies.locationError'));
          fetchPharmacies();
        }
      );
    } else {
      setError(t('pharmacies.geolocationNotSupported'));
      fetchPharmacies();
    }
  }, [fetchPharmacies, fetchPharmaciesByLocation, t]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      setLoading(true);
      fetchPharmaciesByCity(value)
        .catch(()=> setError(t('pharmacies.searchError')))
        .finally(() => setLoading(false));
    } else if (userLocation) {
      // If search is cleared and we have user location, fetch nearby pharmacies
      fetchNearbyPharmacies(userLocation.latitude, userLocation.longitude);
    } else {
      // If no location available, fetch all pharmacies
      fetchPharmacies();
    }
  };

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('pharmacyDetails.pharmacy')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('pharmacyDetails.location')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('pharmacyDetails.hours')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('pharmacyDetails.status')}</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('pharmacies.viewDetails')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pharmacies.map((pharmacy) => (
            <tr 
              key={pharmacy.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate(`/pharmacies/${pharmacy.id}`)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                      {i18n.language === 'ar' ? (pharmacy.name_ar || pharmacy.name) : pharmacy.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-600" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                  <MapPin className="h-4 w-4 text-primary mr-2" />
                  {i18n.language === 'ar' 
                    ? `${pharmacy.region_ar || pharmacy.region}`
                    : `${pharmacy.region || ''}-${pharmacy.city || ''}`
                  }
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-primary mr-2" />
                  {formatHours(pharmacy.hours)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isPharmacyOpen(pharmacy.hours) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isPharmacyOpen(pharmacy.hours) ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      {t('pharmacyDetails.status.open')}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {t('pharmacyDetails.status.closed')}
                    </>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-primary-dark hover:bg-primary/5 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/pharmacies/${pharmacy.id}`);
                  }}
                >
                  {t('pharmacies.viewDetails')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pharmacies.map((pharmacy, index) => (
        <motion.div
          key={pharmacy.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
          onClick={() => navigate(`/pharmacies/${pharmacy.id}`)}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 bg-primary/10 p-2 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 truncate" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                  {i18n.language === 'ar' ? (pharmacy.name_ar || pharmacy.name) : pharmacy.name}
                </h2>
              </div>
              <div className="flex-shrink-0 ml-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isPharmacyOpen(pharmacy.hours) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isPharmacyOpen(pharmacy.hours) ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      {t('pharmacyDetails.status.open')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {t('pharmacyDetails.status.closed')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-sm truncate" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                  {i18n.language === 'ar' 
                    ? `${pharmacy.region_ar || pharmacy.region}`
                    : `${pharmacy.region || ''}-${pharmacy.city || ''}`
                  }
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-sm truncate">{formatHours(pharmacy.hours)}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                variant="ghost" 
                className="text-primary hover:text-primary-dark hover:bg-primary/5 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/pharmacies/${pharmacy.id}`);
                }}
              >
                {t('pharmacies.viewDetails')}
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">{t('pharmacies.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{t('pharmacies.description')}</p>
      </div>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder={t('pharmacies.searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
          <Button
            variant={viewMode === 'cards' ? 'primary' : 'ghost'}
            className="px-3 py-2 rounded-md"
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'ghost'}
            className="px-3 py-2 rounded-md"
            onClick={() => setViewMode('table')}
          >
            <Table className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      ) : (
        viewMode === 'cards' ? renderCardView() : renderTableView()
      )}
    </div>
  );
};

export default PharmaciesPage;
