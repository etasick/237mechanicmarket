"use client";
import { useRouter } from "next/navigation";
import { Car, Bike, Wrench } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from 'next-intl';

export default function CreateListingPage() {
  const t = useTranslations('CreateListingPage');
  const router = useRouter();

  const listingTypes = [
    {
      label: t('cards.sellCar.title'),
      description: t('cards.sellCar.description'),
      icon: Car,
      href: "/sell-my-car",
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: t('cards.sellMotorcycle.title'),
      description: t('cards.sellMotorcycle.description'),
      icon: Bike,
      href: "/sell-motorcycle",
      color: "bg-green-100 text-green-600",
    },
    {
      label: t('cards.sellSparePart.title'),
      description: t('cards.sellSparePart.description'),
      icon: Wrench,
      href: "/sell-spare-part",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          {t('title')}
        </h1>
        <p className="text-gray-600 mb-10 text-center max-w-xl">
          {t('description')}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {listingTypes.map((type) => (
            <button
              key={type.label}
              onClick={() => router.push(type.href)}
              className="flex flex-col items-center justify-center p-6 bg-white shadow-md hover:shadow-lg rounded-2xl transition transform hover:-translate-y-1"
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${type.color}`}
              >
                <type.icon size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {type.label}
              </h2>
              <p className="text-gray-600 text-sm text-center">
                {type.description}
              </p>
            </button>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}
export async function getStaticProps({locale}) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default,
      locale
    }
  };
}