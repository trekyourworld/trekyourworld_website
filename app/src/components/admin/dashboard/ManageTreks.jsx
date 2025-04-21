import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const ManageTreks = () => {
  const [treks, setTreks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Simulate API call to fetch treks data
    const fetchTreks = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setTreks([
          {
            id: 1,
            name: "Everest Base Camp",
            location: "Nepal",
            difficulty: "Difficult",
            duration: "14 days",
            price: 1299,
            bookings: 48,
            status: "Active"
          },
          {
            id: 2,
            name: "Inca Trail to Machu Picchu",
            location: "Peru",
            difficulty: "Moderate",
            duration: "4 days",
            price: 999,
            bookings: 76,
            status: "Active"
          },
          {
            id: 3,
            name: "Annapurna Circuit",
            location: "Nepal",
            difficulty: "Difficult",
            duration: "21 days",
            price: 1499,
            bookings: 32,
            status: "Active"
          },
          {
            id: 4,
            name: "Tour du Mont Blanc",
            location: "France, Italy, Switzerland",
            difficulty: "Moderate",
            duration: "11 days",
            price: 1099,
            bookings: 54,
            status: "Active"
          },
          {
            id: 5,
            name: "Kilimanjaro - Machame Route",
            location: "Tanzania",
            difficulty: "Difficult",
            duration: "7 days",
            price: 1599,
            bookings: 28,
            status: "Active"
          },
          {
            id: 6,
            name: "Torres del Paine W Trek",
            location: "Chile",
            difficulty: "Moderate",
            duration: "5 days",
            price: 899,
            bookings: 41,
            status: "Inactive"
          },
          {
            id: 7,
            name: "Milford Track",
            location: "New Zealand",
            difficulty: "Moderate",
            duration: "4 days",
            price: 1199,
            bookings: 35,
            status: "Active"
          },
        ]);
        setIsLoading(false);
      }, 800);
    };
    
    fetchTreks();
  }, []);

  // Filter treks based on search term
  const filteredTreks = treks.filter(trek => 
    trek.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trek.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Treks</h1>
        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Trek
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search treks by name or location..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Difficult">Difficult</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Treks Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trek Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTreks.map((trek) => (
                  <tr key={trek.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">{trek.id}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{trek.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{trek.location}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{trek.difficulty}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{trek.duration}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">${trek.price}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{trek.bookings}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        trek.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {trek.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTreks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No treks found matching your search criteria.
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTreks.length}</span> of{" "}
              <span className="font-medium">{filteredTreks.length}</span> treks
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 border rounded-md bg-blue-600 text-white text-sm">1</button>
              <button className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTreks;