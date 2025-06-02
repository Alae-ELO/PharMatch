import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Mail, Phone, MapPin} from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 border-t border-gray-300">
      <div className="container mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

          {/* Logo + Description */}
          <div>
            <Link to="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded">
               <img src="/Logo.png" alt="PharMatch Logo" className="h-24 w-24" />
            </Link>
            <p className="mt-3 text-xs text-gray-600">
              {t('footer.about_description')}
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label={t('footer.quick_links.title')}>
            <h3 className="mb-4 text-xs font-semibold uppercase text-gray-900 tracking-wider">
              {t('footer.quick_links.title')}
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: t('footer.quick_links.home') },
                { to: '/pharmacies', label: t('footer.quick_links.find_pharmacies') },
                { to: '/medications', label: t('footer.quick_links.medications') },
                { to: '/blood-donation', label: t('footer.quick_links.blood_donation') },
                { to: '/chat', label: t('footer.quick_links.health_assistant') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-xs text-gray-600 hover:text-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Information */}
          <section aria-label={t('footer.contact_info.title')}>
            <h3 className="mb-4 text-xs font-semibold uppercase text-gray-900 tracking-wider">
              {t('footer.contact_info.title')}
            </h3>
            <ul className="space-y-3 text-gray-600 text-xs">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 flex-shrink-0 text-cyan-600" aria-hidden="true" />
                <address className="not-italic">{t('footer.contact_info.address')}</address>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 flex-shrink-0 text-cyan-600" aria-hidden="true" />
                <a href={`tel:${t('footer.contact_info.phone')}`} className="hover:text-cyan-600">
                  {t('footer.contact_info.phone')}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 flex-shrink-0 text-cyan-600" aria-hidden="true" />
                <a href={`mailto:${t('footer.contact_info.email')}`} className="hover:text-cyan-600">
                  {t('footer.contact_info.email')}
                </a>
              </li>
            </ul>
          </section>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <p> {t('footer.bottom_section.copyright')}</p>
          <div className="mt-3 md:mt-0 flex items-center space-x-1 text-red-500 select-none">
            <span>{t('footer.bottom_section.made_with_love')}</span>
            <Heart className="h-4 w-4" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
