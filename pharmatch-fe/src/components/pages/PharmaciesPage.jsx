import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Clock, Mail } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import useStore from '../store';
import { motion } from 'framer-motion';

const PharmaciesPage = () => {
  const { pharmacies, fetchPharmacies, fetchPharmaciesByCity } = useStore();
  const [searchCity, setSearchCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [showCityOptions, setShowCityOptions] = useState(false);

  // Simulate getting unique cities from the pharmacy data
  useEffect(() => {
    const uniqueCities = Array.from(new Set(pharmacies.map(p => p.city)));
    setCityOptions(uniqueCities);
  }, [pharmacies]);

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

  const handleCitySelect = (city) => {
    setSearchCity(city);
    setShowCityOptions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchChange = (e) => {
    setSearchCity(e.target.value);
    if (e.target.value.trim().length > 0) {
      setShowCityOptions(true);
    } else {
      setShowCityOptions(false);
    }
  };

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
            onClick={() => {
              // This would use geolocation in a real implementation
              alert("In a real implementation, this would use the browser's geolocation API to find nearby pharmacies.");
            }}
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
                        // In a real app, this would show the pharmacy on a map
                        alert(`This would show ${pharmacy.name} on a map at coordinates: ${pharmacy.coordinates.lat}, ${pharmacy.coordinates.lng}`);
                      }}
                      size="sm"
                    >
                      View on Map
                    </Button>
                    <Button 
                      onClick={() => {
                        // In a real app, this would navigate to a detailed pharmacy page
                        alert(`This would navigate to a detailed page for ${pharmacy.name}`);
                      }}
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
    </div>
  );
};

export default PharmaciesPage;