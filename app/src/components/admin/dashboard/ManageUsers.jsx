import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Simulate API call to fetch users data
    const fetchUsers = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setUsers([
          {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            role: "Customer",
            joinDate: "2024-10-15",
            treks: 3,
            status: "Active"
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            role: "Customer",
            joinDate: "2024-11-22",
            treks: 1,
            status: "Active"
          },
          {
            id: 3,
            name: "Robert Johnson",
            email: "robert.johnson@example.com",
            role: "Guide",
            joinDate: "2024-08-05",
            treks: 8,
            status: "Active"
          },
          {
            id: 4,
            name: "Emily Brown",
            email: "emily.brown@example.com",
            role: "Customer",
            joinDate: "2025-01-10",
            treks: 0,
            status: "Inactive"
          },
          {
            id: 5,
            name: "Michael Wilson",
            email: "michael.wilson@example.com",
            role: "Admin",
            joinDate: "2024-06-18",
            treks: 5,
            status: "Active"
          },
          {
            id: 6,
            name: "Sarah Taylor",
            email: "sarah.taylor@example.com",
            role: "Guide",
            joinDate: "2024-09-30",
            treks: 12,
            status: "Active"
          },
          {
            id: 7,
            name: "David Martinez",
            email: "david.martinez@example.com",
            role: "Customer",
            joinDate: "2025-02-14",
            treks: 2,
            status: "Active"
          },
          {
            id: 8,
            name: "Lisa Anderson",
            email: "lisa.anderson@example.com",
            role: "Customer",
            joinDate: "2025-03-01",
            treks: 1,
            status: "Active"
          }
        ]);
        setIsLoading(false);
      }, 800);
    };
    
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Users</h1>
        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New User
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Guide">Guide</option>
              <option value="Customer">Customer</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treks</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">{user.id}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'Admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'Guide'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{user.joinDate}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{user.treks}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div className="flex space-x-2">
                        <button className="text-gray-600 hover:text-gray-800">
                          <EyeIcon className="h-5 w-5" />
                        </button>
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your search criteria.
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{" "}
              <span className="font-medium">{filteredUsers.length}</span> users
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

export default ManageUsers;