import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('About');

  return (
    <>
      <Header/>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
        <p className="mb-4 text-gray-700">
          {t('paragraph1')} <strong>{t('marketplaceName')}</strong>{t('paragraph2')}
        </p>
        <p className="text-gray-700">
          {t('paragraph3')}
        </p>
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
