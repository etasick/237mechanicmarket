// components/AccountSidebar.js
import Link from 'next/link';

export default function AccountSidebar() {
  return (
    <aside className="bg-gray-800 w-64 min-h-screen px-4 py-6 text-white">
      <h2 className="text-2xl font-bold mb-8">My Dashboard</h2>
      <nav className="space-y-4">
        <Link href="/account" className="block hover:text-blue-400">🏠 My Listings</Link>
        <Link href="/account/create-listing" className="block hover:text-blue-400">➕ Create Listing</Link>
        <Link href="/account/settings" className="block hover:text-blue-400">⚙️ Settings</Link>
        <Link href="/account/messages" className="block hover:text-blue-400">📨 Messages</Link>
      </nav>
    </aside>
  );
}
