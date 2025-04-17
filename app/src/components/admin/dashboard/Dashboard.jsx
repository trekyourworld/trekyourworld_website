import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  MapIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTreks: 0,
    totalRevenue: 0,
    totalBookings: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setStats({
          totalUsers: 2457,
          totalTreks: 128,
          totalBookings: 876,
          totalRevenue: 285690
        });
        setIsLoading(false);
      }, 800);
    };
    
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <UsersIcon className="h-8 w-8 text-blue-500" />,
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Treks',
      value: stats.totalTreks,
      icon: <MapIcon className="h-8 w-8 text-green-500" />,
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Bookings',
      value: stats.totalBookings,
      icon: <ChartBarIcon className="h-8 w-8 text-purple-500" />,
      change: '+18%',
      changeType: 'increase'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />,
      change: '+8%',
      changeType: 'increase'
    }
  ];

  const recentBookings = [
    { id: 'B2304', user: 'Jennifer Brown', trek: 'Everest Base Camp', date: '2025-04-10', amount: '$1,299' },
    { id: 'B2303', user: 'Michael Smith', trek: 'Annapurna Circuit', date: '2025-04-08', amount: '$1,499' },
    { id: 'B2302', user: 'Sarah Johnson', trek: 'Inca Trail', date: '2025-04-05', amount: '$999' },
    { id: 'B2301', user: 'David Wilson', trek: 'Mont Blanc', date: '2025-04-02', amount: '$1,099' },
    { id: 'B2300', user: 'Emma Davis', trek: 'Torres del Paine', date: '2025-03-30', amount: '$1,199' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:transform hover:scale-105"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
                    <p className={`text-sm mt-2 ${card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {card.change} from last month
                    </p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trek</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{booking.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{booking.user}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{booking.trek}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{booking.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors">
                Add New Trek
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors">
                View All Bookings
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition-colors">
                Generate Reports
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;