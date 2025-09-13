"use client";

import { useEffect, useState } from "react";
import { getSubscribers, getContacts } from "@/src/firebaseService";
import { saveAs } from "file-saver";

export default function SuperadminDashboard() {
  const [subscribers, setSubscribers] = useState<any>([]);
  const [contacts, setContacts] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const subs = await getSubscribers();
      const cons = await getContacts();
      setSubscribers(subs);
      setContacts(cons);
      setLoading(false);
    };
    loadData();
  }, []);

  // Export to CSV
  const exportCSV = (data, filename) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${val}"`)
        .join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);
  };

  if (loading) return <p>Loading data...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Superadmin Dashboard</h1>

      {/* Subscribers Section */}
      <section className="border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-semibold">Subscribers</h2>
        <button
          onClick={() => exportCSV(subscribers, "subscribers")}
          className="mt-2 mb-4 bg-green-500 text-white px-3 py-1 rounded"
        >
          Export CSV
        </button>
        <ul className="space-y-1">
          {subscribers.map((s) => (
            <li key={s.id} className="text-sm">
              📧 {s.email} <span className="text-gray-500">({s.createdAt?.toDate?.().toLocaleString?.() || "N/A"})</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Contacts Section */}
      <section className="border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-semibold">Contacts</h2>
        <button
          onClick={() => exportCSV(contacts, "contacts")}
          className="mt-2 mb-4 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Export CSV
        </button>
        <ul className="space-y-1">
          {contacts.map((c) => (
            <li key={c.id} className="text-sm">
              👤 {c.name} ({c.email}) → "{c.message}"
              <span className="text-gray-500"> ({c.createdAt?.toDate?.().toLocaleString?.() || "N/A"})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
