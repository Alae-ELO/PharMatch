import React, { useState } from 'react';
import { Search, Pill, CheckCircle, XCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useStore from '../store';
import { motion } from 'framer-motion';

const MedicationsPage = () => {
  const { medications, searchMedications, fetchMedications } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get all unique categories
  const categories = Array.from(new Set(medications.map(m => m.category)));

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      searchMedications(searchQuery.trim())
        .finally(() => setIsSearching(false));
      setActiveCategory(null);
    } else {
      setIsSearching(true);
      fetchMedications()
        .finally(() => setIsSearching(false));
      setActiveCategory(null);
    }
  };

  const handleCategoryFilter = (category) => {
    if (activeCategory === category) {
      // If clicking active category, clear filter
      setActiveCategory(null);
      fetchMedications();
    } else {
      setActiveCategory(category);
      searchMedications(category);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Medications</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find medications and check which pharmacies have them in stock.
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <Input
              type="text"
              placeholder="Search by medication name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              icon={<Search className="h-5 w-5" />}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleSearch}
            isLoading={isSearching}
            className="w-full sm:w-auto"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? 'primary' : 'default'}
              className={`cursor-pointer px-3 py-1 text-sm ${
                activeCategory === category 
                ? 'border border-cyan-600' 
                : 'border border-transparent'
              }`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </Badge>
          ))}
          {activeCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveCategory(null);
                fetchMedications();
              }}
              className="text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div>
        {medications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No medications found matching your search.</p>
            <Button onClick={() => fetchMedications()} variant="outline">
              View All Medications
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medications.map((medication, index) => (
              <motion.div 
                key={medication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card hoverable>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{medication.name}</CardTitle>
                      <Badge variant={medication.prescription ? 'warning' : 'success'}>
                        {medication.prescription ? 'Prescription' : 'OTC'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-700">{medication.description}</p>
                    <Badge variant="secondary">{medication.category}</Badge>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Available at:</h4>
                      <ul className="space-y-2">
                        {medication.pharmacies.map((pharmacy) => (
                          <li key={pharmacy.id} className="flex items-center justify-between border-b pb-2">
                            <span className="text-sm font-medium">{pharmacy.name}</span>
                            <div className="flex items-center">
                              {pharmacy.inStock ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                  <span className="text-sm text-green-600">In Stock</span>
                                  {pharmacy.price && (
                                    <span className="ml-2 text-sm font-medium">${pharmacy.price.toFixed(2)}</span>
                                  )}
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                                  <span className="text-sm text-red-600">Out of Stock</span>
                                </>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => {
                        // This would show more detailed information in a real app
                        alert(`This would show more details about ${medication.name}`);
                      }}
                      fullWidth
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

export default MedicationsPage;