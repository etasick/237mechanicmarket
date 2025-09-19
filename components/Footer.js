import React from "react";
import Link from "next/link";
import SubscribeForm from "./NewsLetterSubscriptionForm";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="mb-10">
          <SubscribeForm />
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("marketplace.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create-listing" className="hover:text-white">
                  {t("marketplace.postListing")}
                </Link>
              </li>
              <li>
                <Link href="/cars-for-sale" className="hover:text-white">
                  {t("marketplace.carsForSale")}
                </Link>
              </li>
              <li>
                <Link
                  href="/motorcycles-for-sale"
                  className="hover:text-white"
                >
                  {t("marketplace.motorcyclesForSale")}
                </Link>
              </li>
              <li>
                <Link href="/spare-parts-for-sale" className="hover:text-white">
                  {t("marketplace.sparePartsForSale")}
                </Link>
              </li>
              <li>
                <Link href="/cars-for-sale/used" className="hover:text-white">
                  {t("marketplace.usedCars")}
                </Link>
              </li>
              <li>
                <Link href="/cars-for-sale/new" className="hover:text-white">
                  {t("marketplace.newCars")}
                </Link>
              </li>
              <li>
                <Link href="/sell-my-car" className="hover:text-white">
                  {t("marketplace.sellVehicle")}
                </Link>
              </li>
              <li>
                <Link href="/sell-my-car" className="hover:text-white">
                  {t("marketplace.sellMyCar")}
                </Link>
              </li>
              <li>
                <Link href="/sell-motorcycle" className="hover:text-white">
                  {t("marketplace.sellMotorcycle")}
                </Link>
              </li>
              <li>
                <Link href="/sell-spare-part" className="hover:text-white">
                  {t("marketplace.sellSparePart")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  {t("marketplace.contactUs")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  {t("marketplace.terms")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  {t("marketplace.aboutUs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("manufacturers.title")}
            </h3>
            <ul className="space-y-2">
              {[
                "Toyota",
                "Mercedes-benz",
                "Nissan",
                "Mazda",
                "Lexus",
                "Kia",
                "Honda",
                "Hyundai",
                "BMW",
                "Peugeot",
              ].map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/cars-for-sale/manufacturer/${brand.toLowerCase()}`}
                    className="hover:text-white"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("models.title")}
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Toyota Auris", slug: "auris" },
                { label: "Toyota Yaris", slug: "yaris" },
                { label: "Kia Optima", slug: "optima" },
                { label: "ML350 4matic", slug: "ml3504matic" },
                { label: "Toyota Corolla", slug: "toyota-corolla" },
                { label: "Toyota Hilux", slug: "toyota-hilux" },
                { label: "Lexus Rx350", slug: "rx350" },
                { label: "Nissan Navara", slug: "nissan-navara" },
                { label: "Mercedes C-Class", slug: "mercedes-c-class" },
                { label: "Honda Civic", slug: "honda-civic" },
                { label: "Kia Sportage", slug: "kia-sportage" },
                { label: "Hyundai Tucson", slug: "hyundai-tucson" },
              ].map((model) => (
                <li key={model.slug}>
                  <Link
                    href={`/cars-for-sale/model/${model.slug}`}
                    className="hover:text-white"
                  >
                    {model.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("others.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/cars-for-sale-by-region"
                  className="hover:text-white"
                >
                  {t("others.allRegions")}
                </Link>
              </li>
              <li>
                <Link href="/cars-for-sale-by-city" className="hover:text-white">
                  {t("others.allCities")}
                </Link>
              </li>
              <li>
                <Link href="/listings/featured" className="hover:text-white">
                  {t("others.featuredListings")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  {t("others.faqs")}
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white">
                  {t("others.support")}
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {t("copyright")}
          </p>

          {/* Social Links */}
          <div className="flex space-x-6 text-lg">
            <a
              href="https://facebook.com/237mechanicmarketplace"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com/237mechanicmarketplace"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com/237mechanicmarketplace"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
