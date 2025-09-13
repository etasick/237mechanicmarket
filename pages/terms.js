"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function Terms() {
  const t = useTranslations("Terms");

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
        <p className="mb-4 text-gray-700">
          {t.rich("agreement", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>{t("listings_approved")}</li>
          <li>{t("not_responsible")}</li>
          <li>{t("accurate_information")}</li>
          <li>{t("fraudulent_activity")}</li>
          <li>{t("right_to_update")}</li>
        </ul>
      </div>
      <Footer />
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default,
      locale,
    },
  };
}