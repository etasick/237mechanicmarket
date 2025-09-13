// components/AdminListingsTable.js
import { useState } from 'react';

export default function AdminListingsTable({ listings, onDelete }) {
  const [selected, setSelected] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  const toggle = (id) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const allSelectedIds = Object.keys(selected).filter(id => selected[id]);

  const bulkDelete = async () => {
    if (allSelectedIds.length === 0) return;
    if (!confirm(`Delete ${allSelectedIds.length} listing(s)?`)) return;

    setBulkBusy(true);
    for (const id of allSelectedIds) {
      setBusyId(id);
      try {
        // onDelete must be your handleDelete(listingId)
        await onDelete(id);
      } catch (e) {
        console.error('Bulk delete failed for', id, e);
        alert(`Failed to delete listing ${id}: ${e.message || 'Unknown error'}`);
      }
    }
    setBusyId(null);
    setBulkBusy(false);
    setSelected({});
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-50">
        <div className="text-sm text-gray-600">
          Selected: {allSelectedIds.length}
        </div>
        <button
          onClick={bulkDelete}
          disabled={bulkBusy || allSelectedIds.length === 0}
          className="px-3 py-1.5 rounded bg-red-600 text-white disabled:opacity-50"
        >
          {bulkBusy ? 'Deleting…' : 'Delete Selected'}
        </button>
      </div>
      <ul className="divide-y">
        {listings.map(l => (
          <li key={l.id} className="flex items-center gap-3 p-3">
            <input
              type="checkbox"
              checked={!!selected[l.id]}
              onChange={() => toggle(l.id)}
            />
            <img
              src={l.mainImageUrl}
              alt=""
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <div className="font-semibold">{l.title}</div>
              <div className="text-sm text-gray-500">{l.location} · {l.region} · {l.currency} {l.price}</div>
              <div className="text-xs text-gray-400">Status: {l.status}</div>
            </div>
            <button
              onClick={() => onDelete(l.id)}
              disabled={busyId === l.id || bulkBusy}
              className="px-3 py-1.5 rounded bg-gray-800 text-white disabled:opacity-50"
            >
              {busyId === l.id ? 'Deleting…' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
