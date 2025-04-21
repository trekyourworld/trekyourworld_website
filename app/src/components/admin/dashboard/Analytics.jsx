import { useState } from 'react';
import { 
  ChartBarIcon, 
  ChartPieIcon, 
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('month');
  
  // Dummy analytics data
  const analyticsData = {
    totalBookings: { count: 258, change: 12.5 },
    totalRevenue: { count: 128750, change: 15.2 },
    averageRating: { count: 4.8, change: 0.2 },
    newUsers: { count: 156, change: -3.8 },
  };

  // Dummy popular treks data
  const popularTreks = [
    { id: 1, name: "Everest Base Camp", bookings: 24, revenue: 59976, change: 8.5 },
    { id: 2, name: "Annapurna Circuit", bookings: 18, revenue: 39582, change: 12.3 },
    { id: 3, name: "Inca Trail", bookings: 31, revenue: 58869, change: 15.7 },
    { id: 4, name: "Kilimanjaro", bookings: 12, revenue: 33588, change: -2.1 },
    { id: 5, name: "Torres del Paine", bookings: 15, revenue: 25485, change: 5.9 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-600">View insights and performance metrics for your treks</p>
      </div>

      {/* Time Period Selector */}
      <div className="mb-6">
        <div className="bg-white shadow-sm rounded-lg p-1 inline-flex">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeframe === 'week' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeframe === 'month' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe('quarter')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeframe === 'quarter' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Quarter
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeframe === 'year' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Bookings Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="mt-2 text-3xl font-semibold">{analyticsData.totalBookings.count}</p>
              <div className={`mt-1 flex items-center ${analyticsData.totalBookings.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData.totalBookings.change > 0 ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(analyticsData.totalBookings.change)}%</span>
                <span className="text-xs text-gray-500 ml-2">vs. last {timeframe}</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="mt-2 text-3xl font-semibold">${analyticsData.totalRevenue.count.toLocaleString()}</p>
              <div className={`mt-1 flex items-center ${analyticsData.totalRevenue.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData.totalRevenue.change > 0 ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(analyticsData.totalRevenue.change)}%</span>
                <span className="text-xs text-gray-500 ml-2">vs. last {timeframe}</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Average Rating Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="mt-2 text-3xl font-semibold">{analyticsData.averageRating.count}</p>
              <div className={`mt-1 flex items-center ${analyticsData.averageRating.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData.averageRating.change > 0 ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(analyticsData.averageRating.change)}</span>
                <span className="text-xs text-gray-500 ml-2">vs. last {timeframe}</span>
              </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>

        {/* New Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">New Users</p>
              <p className="mt-2 text-3xl font-semibold">{analyticsData.newUsers.count}</p>
              <div className={`mt-1 flex items-center ${analyticsData.newUsers.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData.newUsers.change > 0 ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(analyticsData.newUsers.change)}%</span>
                <span className="text-xs text-gray-500 ml-2">vs. last {timeframe}</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center text-gray-500">
              <ChartBarIcon className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2">Revenue chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Bookings Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Bookings Distribution</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center text-gray-500">
              <ChartPieIcon className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2">Bookings distribution chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Treks Table */}
      <div className="bg-white rounded-lg shadow-md mt-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Popular Treks</h2>
          <p className="text-sm text-gray-500">Top performing treks for this {timeframe}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trek Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {popularTreks.map((trek) => (
                <tr key={trek.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{trek.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{trek.bookings}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${trek.revenue.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center ${trek.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trek.change > 0 ? (
                        <ArrowUpIcon className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 mr-1" />
                      )}
                      <span className="text-sm font-medium">{Math.abs(trek.change)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;