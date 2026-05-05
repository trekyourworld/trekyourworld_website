import { useState, useEffect, useCallback } from 'react';
import { guideService } from '../../services/api/guideService';

function formatAmount(minor, currency = 'INR') {
  const amount = minor / 100;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
}

export default function GuideEarningsTab() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarnings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await guideService.getEarnings();
      setEarnings(res?.data?.data || null);
    } catch {
      setError('Failed to load earnings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEarnings(); }, [fetchEarnings]);

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Earnings</h3>

      {loading && <p className="text-gray-500 text-sm">Loading earnings…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && earnings && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-sm text-blue-600 font-medium mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-800">
                {formatAmount(earnings.totalRevenue, earnings.currency)}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-sm text-green-600 font-medium mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-green-800">{earnings.totalBookings}</p>
            </div>
          </div>

          {/* Per-trail breakdown */}
          {earnings.perTrail && earnings.perTrail.length > 0 && (
            <>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Revenue by Trail</h4>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Trail</th>
                      <th className="px-4 py-3">Bookings</th>
                      <th className="px-4 py-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {earnings.perTrail.map((t) => (
                      <tr key={t.mountainId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800">{t.trailTitle}</td>
                        <td className="px-4 py-3 text-gray-700">{t.bookings}</td>
                        <td className="px-4 py-3 text-gray-700">{formatAmount(t.revenue, earnings.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {(!earnings.perTrail || earnings.perTrail.length === 0) && (
            <p className="text-gray-500 text-sm">No revenue data available yet.</p>
          )}
        </>
      )}
    </div>
  );
}
