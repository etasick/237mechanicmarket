"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Auth } from "aws-amplify";
import { fetchAuthSession,signOut} from "aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const t = useTranslations("header"); // ✅ namespace "header"

  useEffect(() => {
    const loadUser = async () => {
      try {
        const session = await fetchAuthSession();
        if (session?.tokens?.idToken) {
          const claims = session.tokens.idToken.payload;
          setUser({
            name: claims.name || claims.given_name || null,
            email: claims.email || null,
            username: claims["cognito:username"],
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    loadUser();

    const listener = (data) => {
      switch (data.payload.event) {
        case "signIn":
        case "tokenRefresh":
          loadUser();
          break;
        case "signOut":
          setUser(null);
          break;
      }
    };

    const unsubscribe = Hub.listen("auth", listener);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setMenuOpen(false);
  };

  const handleLocaleChange = (e) => {
    const newLocale = e.target.value;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <header className="bg-black text-white flex justify-between items-center px-4 py-3 shadow-md relative">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Link href="/" locale={locale}>
          <span className="font-bold text-xl cursor-pointer hover:text-blue-400">
            {t("logo")}
          </span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4 relative">
        {/* Language Selector */}
        <select
          onChange={handleLocaleChange}
          value={locale}
          className="bg-black border border-white text-white px-2 py-1 rounded"
        >
          <option value="en">🇬🇧 EN</option>
          <option value="fr">🇫🇷 FR</option>
        </select>

        {/* If logged in → account dropdown */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:underline flex items-center space-x-1"
            >
              <span>
                {user.name || user.email || user.username || t("account")}
              </span>
              <span>▼</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg overflow-hidden z-20">
                <Link
                  href="/account"
                  locale={locale}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("dashboard")}
                </Link>
                <Link
                  href="/account"
                  locale={locale}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("listings")}
                </Link>
                <Link
                  href="/account"
                  locale={locale}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("settings")}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/auth/signin" locale={locale}>
              <button className="hover:underline">{t("login")}</button>
            </Link>
            <Link href="/auth/signup" locale={locale}>
              <button className="hover:underline">{t("signup")}</button>
            </Link>
          </>
        )}

        {/* CTA always visible */}
        <Link href="/create-listing" locale={locale}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
            {t("sell")}
          </button>
        </Link>
      </div>
    </header>
  );
}
