import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import {Phone, ArrowLeft, ExternalLink, Navigation } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import useStore from '../store';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const PharmacyDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { pharmacies, fetchPharmacyById } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBDt3UnJnGJvg5le_9lh5pc133kXgJI7hc',
  });

  useEffect(() => {
    const loadPharmacy = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          await fetchPharmacyById(id);
        } catch (err) {
          console.error('Error loading pharmacy:', err);
          setError(t('pharmacyDetails.error.loading'));
        } finally {
          setLoading(false);
        }
      }
    };

    loadPharmacy();
  }, [id, fetchPharmacyById, t]);

  const pharmacy = pharmacies.find(p => p.id === id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          {error || t('pharmacyDetails.error.notFound')}
        </h1>
        <Link to="/pharmacies">
          <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
            {t('pharmacyDetails.back')}
          </Button>
        </Link>
      </div>
    );
  }

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${pharmacy.coordinates.lat},${pharmacy.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coordinates.lat},${pharmacy.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/pharmacies">
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />}>
            {t('pharmacyDetails.back')}
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Map Section */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">
              <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                {i18n.language === 'ar' ? (pharmacy.name_ar || pharmacy.name) : pharmacy.name}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] w-full">
              {isLoaded && !loadError ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={{ lat: pharmacy.coordinates.lat, lng: pharmacy.coordinates.lng }}
                  zoom={15}
                >
                  <Marker position={{ lat: pharmacy.coordinates.lat, lng: pharmacy.coordinates.lng }} />
                </GoogleMap>
              ) : (
                <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">{t('pharmacyMapView.loading')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <a href={`tel:${pharmacy.phone}`} className="text-primary hover:text-primary-dark">
                  {pharmacy.phone}
                </a>
              </div>
            </div>
            <div className="flex space-x-4 pt-4 gap-2">
              <Button onClick={openInMaps} icon={<ExternalLink className="h-4 w-4" />}>
                {t('pharmacyDetails.actions.openInMaps')}
              </Button>
              <Button onClick={getDirections} icon={<Navigation className="h-4 w-4" />}>
                {t('pharmacyDetails.actions.getDirections')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyDetailsPage;
