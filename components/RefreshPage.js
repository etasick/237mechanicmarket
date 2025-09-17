"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function RefreshPage() {
  const t = useTranslations("RefreshPage");
  const router = useRouter();

  const handleRefresh = () => {
    // More Next.js friendly than window.location.reload()
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
      <button
        onClick={handleRefresh}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t("button")}
      </button>
    </div>
  );
}
