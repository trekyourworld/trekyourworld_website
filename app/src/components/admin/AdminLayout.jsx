import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  MapIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Helper function to check if the current path matches a nav item
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };
  
  // Sidebar navigation items
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <HomeIcon className="w-6 h-6" /> 
    },
    { 
      name: 'Manage Treks', 
      path: '/admin/treks', 
      icon: <MapIcon className="w-6 h-6" /> 
    },
    { 
      name: 'Manage Users', 
      path: '/admin/users', 
      icon: <UsersIcon className="w-6 h-6" /> 
    },
    { 
      name: 'Analytics', 
      path: '/admin/analytics', 
      icon: <ChartBarIcon className="w-6 h-6" /> 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <Cog6ToothIcon className="w-6 h-6" /> 
    },
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        // Use navigate to redirect after logout
        navigate('/login', { replace: true });
      } else {
        // If server logout fails but client-side clean up worked,
        // still redirect to login page for security
        console.error('Server-side logout failed, but client state was cleared');
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, redirect to login page for security
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 flex flex-col bg-gray-800 text-white">
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
            <span className="text-xl font-bold">Trek Admin</span>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
            
            {/* Logout option in mobile menu */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-colors text-gray-300 hover:bg-gray-700"
            >
              <span className="mr-3">
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
              </span>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gray-800 text-white">
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <span className="text-xl font-bold">Trek Admin</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-3 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
          
          {/* Logout option in desktop menu */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 mb-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700"
          >
            <span className="mr-3">
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
            </span>
            <span>Logout</span>
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col flex-grow">
        {/* Header */}
        <header className="bg-white shadow-sm z-10 h-16">
          <div className="px-4 h-full flex items-center justify-between">
            <button 
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                {user?.email.charAt(0).toUpperCase() || 'A'}
              </span>
              <span className="ml-2 text-gray-700">{user?.email || 'Admin User'}</span>
              
              {/* Desktop logout button */}
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 text-sm text-gray-700 hover:text-gray-900 flex items-center"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;