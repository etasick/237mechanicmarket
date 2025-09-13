// components/LanguageSwitcher.js
"use client";

import { useRouter } from "next/router";
import Link from "next/link";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, locales, asPath } = router;

  return (
    <div className="flex items-center gap-2">
      {locales.map((lng) => (
        <Link
          key={lng}
          href={asPath}
          locale={lng}
          className={`px-3 py-1 rounded ${
            locale === lng
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {lng.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
