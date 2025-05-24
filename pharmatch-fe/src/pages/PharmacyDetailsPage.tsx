import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link} from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useStore from '../store';
import { useLoadScript } from '@react-google-maps/api';

const PharmacyDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  useLoadScript({ googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" }); // Replace with your API key

  const { id } = useParams<{ id: string }>();
  // TODO: Fetch pharmacy details and available medications based on the 'id' parameter
  // You might use a store, an API call, or filter from a local data source.
  const { pharmacies, medications } = useStore();
  
  const pharmacy = pharmacies.find(p => p.id === id);
  
  if (!pharmacy) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('pharmacyDetails.error.title')}</h1>
        <Link to="/pharmacies">
          <Button variant="outline">{t('pharmacyDetails.back')}</Button>
        </Link>
      </div>
    );
  }
  
  const pharmacyMedications = medications.filter(med => 
    med.pharmacies.some(p => p.id === pharmacy.id)
  );


  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${pharmacy.coordinates.lat},${pharmacy.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/pharmacies" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
       {t('pharmacyDetails.back')}
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{pharmacy.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">{pharmacy.address}</p>
                  <p className="text-gray-700">{pharmacy.city}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                <a href={`tel:${pharmacy.phone}`} className="text-cyan-600 hover:text-cyan-700">
                  {pharmacy.phone}
                </a>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                <a href={`mailto:${pharmacy.email}`} className="text-cyan-600 hover:text-cyan-700">
                  {pharmacy.email}
                </a>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{pharmacy.hours}</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button onClick={openInMaps} icon={<ExternalLink className="h-4 w-4" />}>
                  {t('pharmacyDetails.actions.openInMaps')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // This would get directions in a real app
                    alert(t('pharmacyDetails.actions.getDirections'));
                  }}
                >
                  {t('pharmacyDetails.actions.getDirections')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Medications */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t('pharmacyDetails.medications.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pharmacyMedications.map(med => {
                  const pharmacyInfo = med.pharmacies.find(p => p.id === pharmacy.id);
                  return (
                    <div key={med.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h3 className="font-medium">{med.name}</h3>
                        <p className="text-sm text-gray-500">{med.category}</p>
                        <div className="flex space-x-2 mt-1">
                          <Badge variant={med.prescription ? 'warning' : 'success'}>
                            {med.prescription ? t('pharmacyDetails.medications.prescription') : t('pharmacyDetails.medications.otc')}
                          </Badge>
                          <Badge variant={pharmacyInfo?.inStock ? 'success' : 'danger'}>
                            {pharmacyInfo?.inStock ?t('pharmacyDetails.medications.inStock') : t('pharmacyDetails.medications.outOfStock')}
                          </Badge>
                        </div>
                      </div>
                      {pharmacyInfo?.inStock && pharmacyInfo.price && (
                        <span className="text-lg font-medium">${pharmacyInfo.price.toFixed(2)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Map */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-square w-full bg-gray-100 relative">
                {/* TODO: Implement Google Map component here */}
                {/* Use the pharmacy.coordinates.lat and pharmacy.coordinates.lng to center the map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">
                    {t('pharmacyMapView.loading')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetailsPage;