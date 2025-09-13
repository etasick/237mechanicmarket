'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SignOutButton from './SignOutButton';
import LanguageSwitcher from './LanguageSwitcher';

const navLinks = [
  { nameKey: 'dashboard', href: '/account' },
  { nameKey: 'createListing', href: '/account/create-listing' },
  { nameKey: 'settings', href: '/account' },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const t = useTranslations('Dashboard');

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
            {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 border-r border-gray-700">
        <Link href="/">
          <span className="font-bold text-xl cursor-pointer hover:text-blue-400">
            {t('visitMarketplace')}
          </span>
        </Link>
        <LanguageSwitcher/>
        <nav className="space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
                pathname === link.href ? 'bg-gray-700' : ''
              }`}
            >
              {t(link.nameKey)}
            </Link>
          ))}
          <SignOutButton/>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}