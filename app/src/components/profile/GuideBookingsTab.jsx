import { useState, useEffect, useCallback } from 'react';
import { guideService } from '../../services/api/guideService';

const STATUS_BADGE = {
  pending:   { label: 'Pending',   cls: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', cls: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', cls: 'bg-blue-100 text-blue-700' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-700' },
};

function formatAmount(minor, currency = 'INR') {
  const amount = minor / 100;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
}

export default function GuideBookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await guideService.getBookings();
      setBookings(res?.data?.data?.data || []);
    } catch {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Bookings</h3>

      {loading && <p className="text-gray-500 text-sm">Loading bookings…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p className="text-gray-500 text-sm">No bookings found for your community.</p>
      )}

      {bookings.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">Trek</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Participants</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => {
                const badge = STATUS_BADGE[b.status] || { label: b.status, cls: 'bg-gray-100 text-gray-600' };
                return (
                  <tr key={b.bookingId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.bookingId?.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-gray-800">{b.mountainId}</td>
                    <td className="px-4 py-3 text-gray-600">{b.trekDate ? new Date(b.trekDate).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{b.participants}</td>
                    <td className="px-4 py-3 text-gray-700">{formatAmount(b.amountMinorUnits, b.currency)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>{badge.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
