"use client";
import { useState } from "react";
import { addSubscriber } from "@/src/firebaseService";
import { useTranslations } from 'next-intl';

export default function SubscribeForm() {
  const t = useTranslations('SubscribeForm');
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addSubscriber(email);
    setMsg(success ? t('successMessage') : t('errorMessage'));
    setEmail("");
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 border-b border-gray-700 pb-8">
      <div className="mb-6 md:mb-0">
        <h2 className="text-xl font-semibold text-white">
          {t('title')}
        </h2>
        <p className="text-sm text-gray-400">
          {t('description')}
        </p>
      </div>
      <form className="flex w-full md:w-auto" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          required
          className="w-full md:w-64 px-4 py-2 rounded-l-md focus:outline-none text-gray-900"
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-r-md text-white font-semibold"
        >
          {t('buttonText')}
        </button>
        {msg && <p className="text-sm text-green-600">{msg}</p>}
      </form>
    </div>
  );
}
