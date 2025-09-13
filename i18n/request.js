import { notFound } from 'next/navigation';

const locales = ['en', 'fr'];
const defaultLocale = 'en';

// Helper to load messages for a given locale
export function getMessages(locale) {
  try {
    return require(`../messages/locales/${locale}.json`);
  } catch (error) {
    return require(`../messages/locales/${defaultLocale}.json`);
  }
}

// This function is used by next-intl to get locale data per request
export default function getRequestConfig({ locale }) {
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  return {
    messages: getMessages(locale),
    locale
  };
}