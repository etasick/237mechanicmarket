"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const t = useTranslations("header");

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
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileMenuOpen(false);
      }
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
    setMobileMenuOpen(false);
  };

  const handleLocaleChange = (e) => {
    const newLocale = e.target.value;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/cars-for-sale", label: t("cars") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" locale={locale}>
              <span className="font-bold text-xl cursor-pointer hover:text-blue-400 transition-colors">
                {t("logo")}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                locale={locale}
                className="hover:text-blue-400 transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <select
              onChange={handleLocaleChange}
              value={locale}
              className="bg-black border border-gray-600 text-white px-2 py-1 rounded text-sm"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="hover:text-blue-400 flex items-center space-x-1 py-2"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  <span className="max-w-[120px] truncate">
                    {user.name || user.email || user.username || t("account")}
                  </span>
                  <span>{menuOpen ? "▲" : "▼"}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg overflow-hidden z-20">
                    <Link
                      href="/account"
                      locale={locale}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("dashboard")}
                    </Link>
                    <Link
                      href="/account/listings"
                      locale={locale}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("listings")}
                    </Link>
                    <Link
                      href="/account/settings"
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
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin" locale={locale}>
                  <button className="hover:text-blue-400 transition-colors py-2">
                    {t("login")}
                  </button>
                </Link>
                <Link href="/auth/signup" locale={locale}>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                    {t("signup")}
                  </button>
                </Link>
              </div>
            )}

            {/* CTA Button */}
            <Link href="/create-listing" locale={locale}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors whitespace-nowrap">
                {t("sell")}
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-3 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  locale={locale}
                  className="hover:text-blue-400 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col space-y-4 pb-4">
              {/* Mobile Language Selector */}
              <div className="flex items-center justify-between">
                <span>{t("language")}:</span>
                <select
                  onChange={(e) => {
                    handleLocaleChange(e);
                    setMobileMenuOpen(false);
                  }}
                  value={locale}
                  className="bg-black border border-gray-600 text-white px-2 py-1 rounded"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              {/* Mobile User Actions */}
              {user ? (
                <div className="flex flex-col space-y-3">
                  <div className="pt-2 border-t border-gray-800">
                    <p className="truncate">
                      {t("signed_in_as")} {user.name || user.email || user.username}
                    </p>
                  </div>
                  <Link
                    href="/account"
                    locale={locale}
                    className="text-center bg-gray-800 hover:bg-gray-700 py-2 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("dashboard")}
                  </Link>
                  <Link
                    href="/account/listings"
                    locale={locale}
                    className="text-center bg-gray-800 hover:bg-gray-700 py-2 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("listings")}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-center bg-red-800 hover:bg-red-700 py-2 rounded"
                  >
                    {t("logout")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/auth/signin"
                    locale={locale}
                    className="text-center bg-gray-800 hover:bg-gray-700 py-2 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/auth/signup"
                    locale={locale}
                    className="text-center bg-blue-600 hover:bg-blue-700 py-2 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("signup")}
                  </Link>
                </div>
              )}

              {/* Mobile CTA */}
              <Link
                href="/create-listing"
                locale={locale}
                className="text-center bg-blue-600 hover:bg-blue-700 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("sell")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}