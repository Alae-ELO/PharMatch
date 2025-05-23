import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Pill, MessageCircle, Heart, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import useStore from '../store';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { bloodDonationRequests } = useStore();
  const urgentRequests = bloodDonationRequests.filter(req => req.urgency === 'high');

  const { t } = useTranslation();
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-700 to-cyan-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
 {t('home.hero.title1')} <br/>
 {t('home.hero.title2')}
              </h1>
              <p className="text-lg mb-8 text-cyan-100">
 {t('home.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/pharmacies">
                  <Button variant="secondary" size="lg" icon={<MapPin />} className="w-full sm:w-auto">
 {t('home.hero.findPharmaciesButton')}
                  </Button>
                </Link>
                <Link to="/medications">
 <Button variant="danger" size="lg" icon={<Search />} className="w-full sm:w-auto">
 {t('home.hero.searchMedicationsButton')}
 </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <img 
                src="https://images.pexels.com/photos/5699475/pexels-photo-5699475.jpeg" 
                alt="Pharmacy"
                className="rounded-lg shadow-xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.features.title')}</h2>
 <p className="text-lg text-gray-600 max-w-2xl mx-auto">
 {t('home.features.subtitle')}
 </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-cyan-100 p-3">
                    <MapPin className="h-6 w-6 text-cyan-700" />
                  </div>
                  <CardTitle>{t('home.features.findPharmacies.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-gray-600">
                    Locate pharmacies in your area based on your location or by searching city names.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-emerald-100 p-3">
                    <Pill className="h-6 w-6 text-emerald-700" />
                  </div>
                  <CardTitle>{t('home.features.medicationAvailability.title')}</CardTitle>
                </CardHeader>
                <CardContent>
 <p className="text-gray-600">
                    Search for medications and discover which pharmacies have them in stock.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-3">
                    <MessageCircle className="h-6 w-6 text-blue-700" />
                  </div>
                  <CardTitle>{t('home.features.healthAssistant.title')}</CardTitle>
                </CardHeader>
                <CardContent>
 <p className="text-gray-600">
                    Ask health-related questions and get reliable information from our AI assistant.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-red-100 p-3">
                    <Heart className="h-6 w-6 text-red-700" />
                  </div>
                  <CardTitle>{t('home.features.bloodDonation.title')}</CardTitle>
                </CardHeader>
                <CardContent>
 <p className="text-gray-600">
                    Register as a blood donor and receive alerts for urgent donation needs in your area.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Urgent Blood Needs Section */}
      {urgentRequests.length > 0 && (
        <section className="py-12 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
 <h2 className="text-2xl font-bold text-red-700 mb-2">{t('home.urgentNeeds.title')}</h2>
 <p className="text-gray-700">
 {t('home.urgentNeeds.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {urgentRequests.map((request) => (
                <Card key={request.id} className="border-red-200">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-red-700">
 {t('home.urgentNeeds.bloodType', { bloodType: request.bloodType })}
                      </CardTitle>
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
 {t('home.urgentNeeds.urgentLabel')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p><strong>Hospital:</strong> {request.hospital}</p>
                      <p><strong>Contact:</strong> {request.contactInfo}</p>
 <p className="text-sm text-gray-500">
 {t('home.urgentNeeds.postedOn', { date: new Date(request.createdAt).toLocaleDateString() })}
 </p>
                      <div className="pt-2">
 <Link to="/blood-donation">
                          <Button variant="danger" fullWidth>
                            I Want to Donate
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/blood-donation">
                <Button variant="outline" size="lg">
 {t('home.urgentNeeds.viewAllButton')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
 <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.testimonials.title')}</h2>
 <p className="text-lg text-gray-600 max-w-2xl mx-auto">
 {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <img 
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg" 
                    alt="User"
                    className="rounded-full w-16 h-16 object-cover mb-4"
                  />
                  <p className="text-gray-600 mb-4">
 {t('home.testimonials.sarah.quote')}
                  </p>
 <p className="font-semibold">{t('home.testimonials.sarah.name')}</p>
 <p className="text-sm text-gray-500">{t('home.testimonials.sarah.role')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <img 
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" 
                    alt="User"
                    className="rounded-full w-16 h-16 object-cover mb-4"
                  />
                  <p className="text-gray-600 mb-4">
 {t('home.testimonials.michael.quote')}
                  </p>
 <p className="font-semibold">{t('home.testimonials.michael.name')}</p>
 <p className="text-sm text-gray-500">{t('home.testimonials.michael.role')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <img 
                    src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg" 
                    alt="User"
                    className="rounded-full w-16 h-16 object-cover mb-4"
                  />
                  <p className="text-gray-600 mb-4">
 {t('home.testimonials.emily.quote')}
                  </p>
 <p className="font-semibold">{t('home.testimonials.emily.name')}</p>
 <p className="text-sm text-gray-500">{t('home.testimonials.emily.role')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-cyan-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Nearest Pharmacy?</h2>
 <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
 {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pharmacies">
              <Button variant="secondary" size="lg">
 {t('home.cta.findPharmaciesButton')}
              </Button>
            </Link>
            <Link to="/register">
 <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-cyan-800">
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;