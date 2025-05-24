import React from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface PharmacyMapViewProps {
  latitude: number;
  longitude: number;
}

const PharmacyMapView: React.FC<PharmacyMapViewProps> = (props) => {
  const { t } = useTranslation();
  // TODO: Implement the pop-up functionality (e.g., using InfoWindow)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your actual API key
  });

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const center = {
    lat: props.latitude,
    lng: props.longitude,
  };

  if (loadError) return <div>{t('pharmacyMapView.error')}</div>;
  if (!isLoaded) return <div>{t('pharmacyMapView.loading')}</div>;

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15}>
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default PharmacyMapView;