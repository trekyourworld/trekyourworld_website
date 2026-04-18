import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    UsersIcon,
    MapIcon,
    CurrencyDollarIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { analyticsService } from '../../../services/api/analytics';
import { adminService } from '../../../services/api/admin';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTreks: 0,
        totalGuides: 0
    });
    const [dailyVisits, setDailyVisits] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call to fetch dashboard data
        const fetchDashboardData = async () => {
            const response = await adminService.dashboardInfo();
            console.log(response)
            if (response.data.code == 200) {
                setStats({
                    totalUsers: response.data.data.totalUsers,
                    totalTreks: response.data.data.totalTreks,
                    totalGuides: response.data.data.totalGuides
                })
                setIsLoading(false);
            }
        };

        const fetchDailyVisits = async () => {
            analyticsService.dailyVisits()
                .then((response) => {
                    if (response.status === 200) {
                        setDailyVisits(response.data.count);
                    } else {
                        console.error('Error fetching daily visits:', response.statusText);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching daily visits:', error);
                });
        }

        fetchDailyVisits()
        fetchDashboardData();
    }, []);

    const statCards = [
        {
            title: 'Daily Visits',
            value: dailyVisits,
            icon: <UsersIcon className="h-8 w-8 text-red-500" />,
            iconBg: 'bg-red-50',
            change: '',
            changeType: ''
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: <UsersIcon className="h-8 w-8 text-blue-500" />,
            iconBg: 'bg-blue-50',
            change: '',
            changeType: ''
        },
        {
            title: 'Total Treks',
            value: stats.totalTreks,
            icon: <MapIcon className="h-8 w-8 text-green-500" />,
            iconBg: 'bg-green-50',
            change: '',
            changeType: ''
        },
        {
            title: 'Total Guides',
            value: stats.totalGuides,
            icon: <ChartBarIcon className="h-8 w-8 text-purple-500" />,
            iconBg: 'bg-purple-50',
            change: '',
            changeType: ''
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3">
                                    <div className="h-3 w-24 bg-gray-200 rounded-full" />
                                    <div className="h-7 w-16 bg-gray-200 rounded-full" />
                                </div>
                                <div className="h-14 w-14 bg-gray-200 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((card, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-xl shadow-lg p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
                                    </div>
                                    <div className={`p-3 ${card.iconBg} rounded-xl`}>
                                        {card.icon}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
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
                    <div className="bg-white rounded-xl shadow-lg p-6">
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