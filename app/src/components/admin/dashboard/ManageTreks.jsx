import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import treksService from '../../../services/api/treksService';

const ManageTreks = () => {
  const [treks, setTreks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const [filters, setFilters] = useState({
    difficulty: '',
    status: ''
  });
  
  const fetchTreks = async (page = 1, searchQuery = '') => {
    try {
      setIsLoading(true);
      
      // Create parameters object for the API call
      const params = {
        page,
        limit: pagination.pageSize,
        search: searchQuery || undefined
      };
      
      // Add difficulty filter if selected
      if (filters.difficulty) {
        params.difficulty = filters.difficulty;
      }
      
      // Add status filter if selected
      if (filters.status) {
        params.status = filters.status;
      }
      
      // Use fetchTreksFromV1 which calls the /v1/treks/search endpoint
      const response = await treksService.fetchTreksFromV1(params);
      const responseData = response.data;

      // Set treks from API response
      setTreks(responseData.data.data || []);
      
      // Update pagination information
      setPagination({
        currentPage: responseData.data.currentPage || page,
        totalPages: responseData.data.totalPages || Math.ceil((responseData.data.totalPages || 0) / pagination.data.limit),
        totalItems: responseData.data.totalItems || responseData.data.data?.length || 0,
        pageSize: responseData.data.limit
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching treks:', err);
      setError('Failed to load treks. Please try again later.');
      setTreks([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load and when page changes
  useEffect(() => {
    fetchTreks(pagination.currentPage, searchTerm);
  }, [pagination.currentPage, filters]);
  
  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.currentPage === 1) {
        fetchTreks(1, searchTerm);
      } else {
        // Reset to page 1 when searching
        setPagination(prev => ({ ...prev, currentPage: 1 }));
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };
  
  // Generate pagination numbers
  const paginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, pagination.currentPage - halfVisiblePages);
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

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
            <select 
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Difficult">Difficult</option>
            </select>
            <select 
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
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
                {treks.map((trek) => (
                  <tr key={trek.id || trek.uuid} className="hover:bg-gray-50 text-left">
                    <td className="px-4 py-4 text-sm text-gray-900">{trek.id || trek.uuid}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{trek.name || trek.title}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{trek.location}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{trek.difficulty}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{trek.duration}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">${trek.price}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{trek.bookings || '0'}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        trek.status === 'Active' || trek.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {trek.status || 'Unknown'}
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

          {treks.length === 0 && !isLoading && !error && (
            <div className="text-center py-8 text-gray-500">
              No treks found matching your search criteria.
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
                </span> of{' '}
                <span className="font-medium">{pagination.totalItems}</span> treks
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => handlePageChange(pagination.currentPage - 1)} 
                  disabled={pagination.currentPage === 1}
                  className="px-2 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                
                {paginationNumbers().map((page) => (
                  <button 
                    key={page}
                    onClick={() => handlePageChange(page)} 
                    className={`px-3 py-1 border rounded-md text-sm ${
                      pagination.currentPage === page 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => handlePageChange(pagination.currentPage + 1)} 
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="px-2 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageTreks;