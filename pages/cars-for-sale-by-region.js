"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

// List of region keys (must match keys in translation files)
const regions = [
  "Adamawa",
  "Centre",
  "East",
  "Far North",
  "Littoral",
  "North",
  "North West",
  "South",
  "South West",
  "West",
] ;

export default function CarsByRegion() {
  const t = useTranslations("CarsByRegion");

  return (
    <>
    <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
      </Head>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          {t("title")}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {regions.map((region) => (
            <Link
              key={region}
              href={`/cars-for-sale?region=${encodeURIComponent(region)}`}
              className="group"
            >
              <div className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 text-center transition transform hover:-translate-y-1 cursor-pointer">
                <h2 className="text-lg font-semibold group-hover:text-red-600">
                  {t(`regions.${region}`)}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {t("view_cars", { region: t(`regions.${region}`) })}
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