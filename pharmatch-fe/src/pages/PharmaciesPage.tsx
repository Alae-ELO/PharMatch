import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Clock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import useStore from '../store';
import { Pharmacy } from '../types'; // Assuming Pharmacy type is available
import PharmacyMapView from './PharmacyMapView';
import { motion } from 'framer-motion';

const PharmaciesPage: React.FC = () => {
  const { pharmacies, setPharmacies, fetchPharmacies, fetchPharmaciesByCity, allPharmacies } = useStore();
  const [searchCity, setSearchCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [showCityOptions, setShowCityOptions] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  // Store all pharmacies to filter from
  const { pharmacies: allPharmaciesFromStore } = useStore(); // Access all pharmacies

  const navigate = useNavigate();

  // Haversine formula to calculate distance between two lat/lng points in kilometers
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Simulate getting unique cities from the pharmacy data

  const handleSearch = () => {
    if (searchCity.trim()) {
      setIsSearching(true);
      fetchPharmaciesByCity(searchCity.trim())
        .finally(() => setIsSearching(false));
    } else {
      setIsSearching(true);
      fetchPharmacies()
        .finally(() => setIsSearching(false));
    }
    setShowCityOptions(false);
  };

  const handleCitySelect = (city: string) => {
    setSearchCity(city);
    setShowCityOptions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewMap = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowMapModal(true);
  };

  const handleUseMyLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User location:", { latitude, longitude });

          // Filter pharmacies based on proximity (within 10km radius)
          const nearbyPharmacies = allPharmaciesFromStore.filter(pharmacy => {
            if (pharmacy.coordinates) {
              const distance = getDistance(latitude, longitude, pharmacy.coordinates.lat, pharmacy.coordinates.lng);
              return distance <= 10; // 10 km radius
            }
            return false;
          });
          setPharmacies(nearbyPharmacies);
          setSearchCity('Pharmacies near your location');
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCity(e.target.value);
    if (e.target.value.trim().length > 0) {
      setShowCityOptions(true);
    } else {
      setShowCityOptions(false);
    }
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false);
  };

  // Simulate getting unique cities from the pharmacy data
  // This effect should ideally run when allPharmaciesFromStore changes
  useEffect(() => {
    if (allPharmaciesFromStore.length > 0) {
      const uniqueCities = Array.from(new Set(allPharmaciesFromStore.map(p => p.city)));
      setCityOptions(uniqueCities);
    }
  }, [allPharmaciesFromStore]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Pharmacies Near You</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Search for pharmacies by city or use your current location to find pharmacies nearby.
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Enter city name..."
              value={searchCity}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              icon={<MapPin className="h-5 w-5" />}
              className="w-full"
              aria-label="Search by city"
            />
            {showCityOptions && cityOptions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
                  {cityOptions
                    .filter(city => city.toLowerCase().includes(searchCity.toLowerCase()))
                    .map((city) => (
                      <li
                        key={city}
                        className="cursor-pointer select-none px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
          <Button
            onClick={handleSearch}
            isLoading={isSearching}
            icon={<Search className="h-5 w-5" />}
            className="md:w-auto"
          >
            Search
          </Button>
          <Button
            variant="secondary"
            onClick={handleUseMyLocation}
            icon={<MapPin className="h-5 w-5" />}
            className="md:w-auto"
          >
            Use My Location
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <div>
        {searchCity && (
          <h2 className="text-xl font-semibold mb-4">
            Pharmacies in {searchCity}
          </h2>
        )}

        {pharmacies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No pharmacies found in this location.</p>
            <Button onClick={() => fetchPharmacies()} variant="outline">
              View All Pharmacies
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pharmacies.map((pharmacy, index) => (
              <motion.div
                key={pharmacy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card hoverable>
                  <CardHeader>
                    <CardTitle>{pharmacy.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{pharmacy.address}, {pharmacy.city}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                      <p className="text-gray-700">{pharmacy.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                      <p className="text-gray-700">{pharmacy.email}</p>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{pharmacy.hours}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleViewMap(pharmacy);
                      }}
                      size="sm"
                    >
                      View on Map
                    </Button>
 <Button
 onClick={() => navigate(`/pharmacies/${pharmacy.id}`)}
                      size="sm"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Map Modal */}
      {showMapModal && selectedPharmacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full relative">
            <h2 className="text-xl font-bold mb-4">{selectedPharmacy.name} Location</h2>
            {/* You'll need to adjust the height/styling of this container for the map */}
            <div style={{ height: '400px', width: '100%' }}>
              {/* Pass latitude and longitude to the map view component */}
              <PharmacyMapView latitude={selectedPharmacy.coordinates.lat} longitude={selectedPharmacy.coordinates.lng} />
            </div>
            <Button onClick={handleCloseMapModal} className="absolute top-4 right-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmaciesPage;