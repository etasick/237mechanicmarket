import React from "react";
import Link from "next/link";
import SubscribeForm from "./NewsLetterSubscriptionForm";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SubscribeForm/>
        
        {/* Top Section: Newsletter */}
        

        {/* Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('marketplace.title')}
            </h3>
            <ul className="space-y-2">
              <li><Link href="/create-listing" className="hover:text-white">{t('marketplace.postListing')}</Link></li>
              <li><Link href="/cars-for-sale" className="hover:text-white">{t('marketplace.carsForSale')}</Link></li>
              <li><Link href="/motorcycles-for-sale" className="hover:text-white">{t('marketplace.motorcyclesForSale')}</Link></li>
              <li><Link href="/spare-parts-for-sale" className="hover:text-white">{t('marketplace.sparePartsForSale')}</Link></li>
              <li><Link href="/cars-for-sale/used" className="hover:text-white">{t('marketplace.usedCars')}</Link></li>
              <li><Link href="/cars-for-sale/new" className="hover:text-white">{t('marketplace.newCars')}</Link></li>
              <li><Link href="/sell-my-car" className="hover:text-white">{t('marketplace.sellVehicle')}</Link></li>
              <li><Link href="/sell-my-car" className="hover:text-white">{t('marketplace.sellMyCar')}</Link></li>
              <li><Link href="/sell-motorcycle" className="hover:text-white">{t('marketplace.sellMotorcycle')}</Link></li>
              <li><Link href="/sell-spare-part" className="hover:text-white">{t('marketplace.sellSparePart')}</Link></li>
              <li><Link href="/contact" className="hover:text-white">{t('marketplace.contactUs')}</Link></li>
              <li><Link href="/terms" className="hover:text-white">{t('marketplace.terms')}</Link></li>
              <li><Link href="/about" className="hover:text-white">{t('marketplace.aboutUs')}</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('manufacturers.title')}
            </h3>
            <ul className="space-y-2">
              <li><Link href="/cars-for-sale/manufacturer/toyota" className="hover:text-white">Toyota</Link></li>
              <li><Link href="/cars-for-sale/manufacturer/mercedes-benz" className="hover:text-white">Mercedes-benz</Link></li>
              <li><Link href="/cars-for-sale/manufacturer/nissan" className="hover:text-white">Nissan</Link></li>
              <li><Link href="/cars-for-sale/manufacturer/mazda" className="hover:text-white">Mazda</Link></li>
              <li><Link href="/cars-for-sale/manufacturer/lexus" className="hover:text-white">Lexus</Link></li>
              <li><Link href="/cars-for-sale/manufacturer/kia" className="hover:text-white">Kia</Link></li>
              <li><Link href="/cars-for-sale/manufacturer/honda" className="hover:text-white">Honda</Link></li>
              <li><Link href="/cars-for-sale/manufacturer/hyundai" className="hover:text-white">Hyundai</Link></li>
              <li><Link href="/cars-for-sale/manufacturer/bmw" className="hover:text-white">BMW</Link></li>
              <li><Link href="/cars-for-sale/manufacturer/peugeot" className="hover:text-white">Peugeot</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('models.title')}
            </h3>
            <ul className="space-y-2">
              <li><Link href="/cars-for-sale/model/auris" className="hover:text-white">Toyota Auris</Link></li>
              <li><Link href="/cars-for-sale/model/yaris" className="hover:text-white">Toyota Yaris</Link></li>
              <li><Link href="/cars-for-sale/model/optima" className="hover:text-white">Kia optima</Link></li>
              <li><Link href="/cars-for-sale/model/ml3504matic" className="hover:text-white">ML350 4matic</Link></li>
              <li><Link href="/cars-for-sale/model/toyota-corolla" className="hover:text-white">Toyota Corolla</Link></li>
              <li><Link href="/cars-for-sale/model/toyota-hilux" className="hover:text-white">Toyota Hilux</Link></li>
              <li><Link href="/cars-for-sale/model/rx350" className="hover:text-white">Lexus Rx350</Link></li>
              <li><Link href="/cars-for-sale/model/nissan-navara" className="hover:text-white">Nissan Navara</Link></li>
              <li><Link href="/cars-for-sale/model/mercedes-c-class" className="hover:text-white">Mercedes C-Class</Link></li>
              <li><Link href="/cars-for-sale/model/honda-civic" className="hover:text-white">Honda Civic</Link></li>
              <li><Link href="/cars-for-sale/model/kia-sportage" className="hover:text-white">Kia Sportage</Link></li>
              <li><Link href="/cars-for-sale/model/hyundai-tucson" className="hover:text-white">Hyundai Tucson</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('others.title')}
            </h3>
            <ul className="space-y-2">
              <li><Link href="/cars-for-sale-by-region" className="hover:text-white">{t('others.allRegions')}</Link></li>
              <li><Link href="/cars-for-sale-by-city" className="hover:text-white">{t('others.allCities')}</Link></li>
              <li><Link href="/listings/featured" className="hover:text-white">{t('others.featuredListings')}</Link></li>
              <li><Link href="/faq" className="hover:text-white">{t('others.faqs')}</Link></li>
              <li><Link href="/support" className="hover:text-white">{t('others.support')}</Link></li>
            </ul>
            <LanguageSwitcher/>
          </div>
          
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {t('copyright')}</p>
          
          {/* Social Links */}
          <div className="flex space-x-4 mt-4 sm:mt-0 text-lg">
            <a href="https://facebook.com/237mechanicmarketplace" target="_blank" rel="noreferrer" className="hover:text-white">
              <FaFacebook />
            </a>
            <a href="https://twitter.com/237mechanicmarketplace" target="_blank" rel="noreferrer" className="hover:text-white">
              <FaTwitter />
            </a>
            <a href="https://instagram.com/237mechanicmarketplace" target="_blank" rel="noreferrer" className="hover:text-white">
              <FaInstagram />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}