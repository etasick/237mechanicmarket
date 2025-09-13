import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from 'next-intl';

export default function FAQ() {
  const t = useTranslations('FAQ');

  const faqs = [
    {
      question: t('approval.question'),
      answer: t('approval.answer')
    },
    {
      question: t('responsibility.question'),
      answer: t('responsibility.answer')
    },
    {
      question: t('contact.question'),
      answer: t('contact.answer')
    }
  ];

  return (
    <>
      <Header/>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h2 className="font-semibold text-lg">{faq.question}</h2>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
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
