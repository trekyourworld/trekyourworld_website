import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ChartPieIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { adminService } from '../../../services/api/admin';

const PERIODS = ['week', 'month', 'quarter', 'year'];

// ── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>
      <div className="h-12 w-12 bg-gray-200 rounded-full" />
    </div>
  </div>
);

// ── Change badge ─────────────────────────────────────────────────────────────
const ChangeBadge = ({ change, suffix = '%', timeframe }) => {
  const up = change >= 0;
  return (
    <div className={`mt-1 flex items-center ${up ? 'text-green-600' : 'text-red-600'}`}>
      {up ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
      <span className="text-sm font-medium">{Math.abs(change)}{suffix}</span>
      <span className="text-xs text-gray-500 ml-2">vs. last {timeframe}</span>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const Analytics = () => {
  const [timeframe, setTimeframe]         = useState('month');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading]         = useState(true);
  const [error, setError]                 = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    adminService.getAnalytics(timeframe)
      .then(({ data }) => {
        if (!cancelled) setAnalyticsData(data?.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load analytics data.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [timeframe]);

  const stats        = analyticsData;
  const popularTreks = stats?.popularTreks ?? [];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">View insights and performance metrics for your treks.</p>
      </div>

      {/* Time Period Selector */}
      <div className="mb-6">
        <div className="bg-white shadow-lg rounded-xl p-1 inline-flex">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setTimeframe(p)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                timeframe === p
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
      )}

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Bookings */}
        {isLoading ? <SkeletonCard /> : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                {stats ? (
                  <>
                    <p className="mt-2 text-3xl font-semibold">{stats.totalBookings.count}</p>
                    <ChangeBadge change={stats.totalBookings.change} timeframe={timeframe} />
                  </>
                ) : (
                  <p className="mt-2 text-gray-400 text-sm">Data unavailable</p>
                )}
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {/* Total Revenue */}
        {isLoading ? <SkeletonCard /> : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                {stats ? (
                  <>
                    <p className="mt-2 text-3xl font-semibold">
                      ₹{Math.round(stats.totalRevenue.count / 100).toLocaleString()}
                    </p>
                    <ChangeBadge change={stats.totalRevenue.change} timeframe={timeframe} />
                  </>
                ) : (
                  <p className="mt-2 text-gray-400 text-sm">Data unavailable</p>
                )}
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        )}

        {/* Average Rating */}
        {isLoading ? <SkeletonCard /> : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                {stats ? (
                  <>
                    <p className="mt-2 text-3xl font-semibold">
                      {stats.averageRating.count > 0 ? stats.averageRating.count.toFixed(1) : '—'}
                    </p>
                    <ChangeBadge change={stats.averageRating.change} suffix="" timeframe={timeframe} />
                  </>
                ) : (
                  <p className="mt-2 text-gray-400 text-sm">Data unavailable</p>
                )}
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* New Users */}
        {isLoading ? <SkeletonCard /> : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">New Users</p>
                {stats ? (
                  <>
                    <p className="mt-2 text-3xl font-semibold">{stats.newUsers.count}</p>
                    <ChangeBadge change={stats.newUsers.change} timeframe={timeframe} />
                  </>
                ) : (
                  <p className="mt-2 text-gray-400 text-sm">Data unavailable</p>
                )}
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center text-gray-500">
              <ChartBarIcon className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm">Revenue chart will be displayed here</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Bookings Distribution</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center text-gray-500">
              <ChartPieIcon className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm">Bookings distribution chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Treks Table */}
      <div className="bg-white rounded-xl shadow-lg mt-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Popular Treks</h2>
          <p className="text-sm text-gray-500">Top performing treks for this {timeframe}</p>
        </div>

        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Trek Name', 'Bookings', 'Revenue', 'Change'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 w-36 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-10 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-12 bg-gray-200 rounded" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : popularTreks.length === 0 ? (
          <div className="text-center py-16">
            <ChartPieIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No trek data yet.</p>
            <p className="text-gray-400 text-sm mt-1">Bookings will appear here once they are created.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trek Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {popularTreks.map((trek, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{trek.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{trek.bookings}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ₹{Math.round(trek.revenue / 100).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className={`inline-flex items-center ${trek.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trek.change >= 0
                          ? <ArrowUpIcon className="w-4 h-4 mr-1" />
                          : <ArrowDownIcon className="w-4 h-4 mr-1" />}
                        <span className="text-sm font-medium">{Math.abs(trek.change)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;