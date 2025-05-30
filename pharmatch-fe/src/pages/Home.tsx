import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Pill, MessageCircle, Heart, MapPin } from 'lucide-react';
import  Button  from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import useStore from '../store';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { bloodDonationRequests } = useStore();
  const urgentRequests = bloodDonationRequests.filter(req => req.urgency === 'high');
  const { t } = useTranslation();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-800 to-cyan-950 text-white overflow-hidden rounded-2xl shadow-lg">
        <div className="container mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              {t('home.hero.title1')} <br /> <span className="text-cyan-300">{t('home.hero.title2')}</span>
            </h1>
            <p className="text-lg text-cyan-200 mb-8 max-w-lg">
              {t('home.hero.description')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/pharmacies">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                  <MapPin className="mr-2 h-5 w-5" /> {t('home.hero.findPharmaciesButton')}
                </Button>
              </Link>
              <Link to="/medications">
                <Button variant="destructive" size="lg">
                  <Search className="mr-2 h-5 w-5" /> {t('home.hero.searchMedicationsButton')}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden md:block">
            <img src="./image.jpg" alt={t('home.hero.imageAlt')} className="rounded-2xl shadow-xl" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16 bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50 rounded-3xl shadow-lg">
  <div className="text-center mb-14">
    <h2 className="text-4xl font-extrabold text-cyan-900 mb-3 tracking-wide">{t('home.features.title')}</h2>
    <p className="text-xl text-cyan-700 max-w-xl mx-auto leading-relaxed">{t('home.features.subtitle')}</p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
    {[
      { icon: <MapPin className="h-8 w-8 text-cyan-600" />, bg: 'bg-cyan-100', title: 'findPharmacies' },
      { icon: <Pill className="h-8 w-8 text-emerald-600" />, bg: 'bg-emerald-100', title: 'medicationAvailability' },
      { icon: <MessageCircle className="h-8 w-8 text-sky-600" />, bg: 'bg-sky-100', title: 'healthAssistant' },
      { icon: <Heart className="h-8 w-8 text-rose-600" />, bg: 'bg-rose-100', title: 'bloodDonation' }
    ].map((feature, index) => (
      <motion.div key={index} whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 300 }}>
        <Card className="rounded-2xl shadow-md hover:shadow-xl transition duration-500 bg-white border border-cyan-200 h-full">
          <CardHeader className="flex flex-col items-center text-center">
            <div className={`mb-4 p-4 rounded-full inline-flex items-center justify-center ${feature.bg}`}>
              {feature.icon}
            </div>
            <CardTitle className="text-lg font-semibold text-cyan-900">{t(`home.features.${feature.title}.title`)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-cyan-700 text-center">{t(`home.features.${feature.title}.description`)}</p>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
</section>


      {/* Urgent Blood Needs Section */}
      {urgentRequests.length > 0 && (
        <section className="bg-red-50 py-12 rounded-2xl container mx-auto px-6 shadow">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-red-700 mb-2">{t('home.urgentNeeds.title')}</h2>
            <p className="text-gray-700">{t('home.urgentNeeds.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {urgentRequests.map(request => (
              <Card key={request.id} className="border border-red-200 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-red-700">
                      {t('home.urgentNeeds.bloodType', { bloodType: request.bloodType })}
                    </CardTitle>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                      {t('home.urgentNeeds.urgentLabel')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>{t('home.urgentNeeds.hospital')}:</strong> {request.hospital}</p>
                    <p><strong>{t('home.urgentNeeds.contact')}:</strong> {request.contactInfo}</p>
                    <p className="text-gray-500">
                      {t('home.urgentNeeds.postedOn', { date: new Date(request.createdAt).toLocaleDateString() })}
                    </p>
                    <div className="pt-3">
                      <Link to="/blood-donation">
                        <Button variant="destructive" className="w-full">
                          {t('home.urgentNeeds.donateButton')}
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
              <Button variant="outline" size="lg" className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white">
                {t('home.urgentNeeds.viewAllButton')}
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
<section className="container mx-auto px-6 py-16 bg-gradient-to-r from-cyan-50 via-teal-50 to-green-50 rounded-3xl shadow-lg">
  <div className="text-center mb-14">
    <h2 className="text-4xl font-extrabold text-teal-900 mb-3 tracking-wide">{t('home.testimonials.title')}</h2>
    <p className="text-xl text-teal-700 max-w-xl mx-auto leading-relaxed">{t('home.testimonials.subtitle')}</p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
    {[ 'sarah', 'michael', 'emily' ].map(person => (
      <Card
        key={person}
        className="rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-500 bg-white border border-teal-200"
      >
        <CardContent className="pt-8 pb-10 px-8">
          <div className="flex flex-col items-center text-center">
            <img
              src={`https://images.pexels.com/photos/${person === 'sarah' ? '733872' : person === 'michael' ? '220453' : '1181686'}/pexels-photo-${person === 'sarah' ? '733872' : person === 'michael' ? '220453' : '1181686'}.jpeg`}
              alt={t(`home.testimonials.${person}.name`)}
              className="rounded-full w-24 h-24 object-cover mb-6 border-4 border-teal-400 shadow-sm"
            />
            <p className="text-teal-700 mb-5 italic text-lg leading-relaxed">“{t(`home.testimonials.${person}.quote`)}”</p>
            <p className="font-bold text-teal-900 text-xl">{t(`home.testimonials.${person}.name`)}</p>
            <p className="text-sm text-teal-600 uppercase tracking-widest">{t(`home.testimonials.${person}.role`)}</p>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
</section>



      {/* CTA Section */}
      <section className="bg-gradient-to-br from-cyan-700 to-cyan-900 text-white py-16 rounded-2xl shadow">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.cta.title')}</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">{t('home.cta.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/pharmacies">
              <Button size="lg" className="border-white bg-cyan text-cyan-800 ">
                {t('home.cta.findPharmaciesButton')}
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-cyan-800">
                {t('home.cta.createAccountButton')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
