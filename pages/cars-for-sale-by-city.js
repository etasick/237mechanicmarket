import Link from "next/link";
import Header from "@/components/Header";
import Head from 'next/head';
import Footer from "@/components/Footer";
import { useTranslations } from 'next-intl';

const cities = [
  'Douala',
  'Nkongsamba',
  'Loum',
  'Yaoundé',
  'Mbalmayo',
  'Obala',
  'Bafoussam',
  'Dschang',
  'Foumban',
  'Buea',
  'Limbe',
  'Kumba',
  'Bamenda',
  'Kumbo',
  'Ndop',
  'Garoua',
  'Guider',
  'Poli',
  'Maroua',
  'Kousséri',
  'Mora',
  'Bertoua',
  'Batouri',
  'Yokadouma',
  'Ngaoundéré',
  'Meiganga',
  'Tignère',
  'Ebolowa',
  'Sangmélima',
  'Kribi',
];

export default function CarsByCity() {
  const t = useTranslations('CarsByCity');

  return (
    <>
     <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          {t('title')}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/cars-for-sale?city=${encodeURIComponent(city)}`}
              className="group"
            >
              <div className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 text-center transition transform hover:-translate-y-1 cursor-pointer">
                <h2 className="text-lg font-semibold group-hover:text-red-600">
                  {city}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {t('viewCars', { city })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
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