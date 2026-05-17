import { useState, useRef, useEffect } from 'react';
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
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  UserCircleIcon,
  StarIcon,
  LightBulbIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';

// Inline chevron for the user dropdown trigger
const ChevronDownIcon = ({ open }) => (
  <svg
    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);   // mobile overlay
  const [collapsed, setCollapsed]     = useState(false);   // desktop collapse
  const [userMenuOpen, setUserMenuOpen] = useState(false); // user account dropdown

  const userMenuRef = useRef(null);
  const location    = useLocation();
  const navigate    = useNavigate();
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Dashboard',       path: '/admin',           icon: <HomeIcon className="w-5 h-5" /> },
    { name: 'Manage Banners',  path: '/admin/banners',   icon: <PhotoIcon className="w-5 h-5" /> },
    { name: 'Manage Treks',    path: '/admin/treks',     icon: <MapIcon className="w-5 h-5" /> },
    { name: 'Pending Trails',  path: '/admin/trails',    icon: <UserCircleIcon className="w-5 h-5" /> },
    { name: 'Manage Users',    path: '/admin/users',     icon: <UsersIcon className="w-5 h-5" /> },
    { name: 'Reviews',         path: '/admin/reviews',      icon: <StarIcon className="w-5 h-5" /> },
    { name: 'Suggestions',     path: '/admin/suggestions',  icon: <LightBulbIcon className="w-5 h-5" /> },
    { name: 'Photos',          path: '/admin/photos',       icon: <CameraIcon className="w-5 h-5" /> },
    { name: 'Analytics',      path: '/admin/analytics', icon: <ChartBarIcon className="w-5 h-5" /> },
    { name: 'Settings',       path: '/admin/settings',  icon: <Cog6ToothIcon className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // swallow — redirect regardless
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() ?? 'A';

  return (
    <div className="flex h-screen bg-gray-100">

      {/* ── Mobile sidebar overlay ────────────────────────────────────────── */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-64 flex flex-col bg-linear-to-b from-blue-700 to-blue-900 text-white">
          <div className="h-16 flex items-center justify-between px-4 border-b border-blue-600/40 shrink-0">
            <span className="text-xl font-bold">Trek Admin</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isActive(item.path) ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ease-in-out bg-linear-to-b from-blue-700 to-blue-900 text-white ${collapsed ? 'w-16' : 'w-64'}`}>
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-blue-600/40 shrink-0">
          {!collapsed && (
            <span className="text-xl font-bold truncate pl-1">Trek Admin</span>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`text-blue-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0 ${collapsed ? 'mx-auto' : ''}`}
          >
            {collapsed
              ? <ChevronRightIcon className="h-5 w-5" />
              : <ChevronLeftIcon className="h-5 w-5" />
            }
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.name : undefined}
              className={`flex items-center px-3 py-3 mb-1 rounded-lg transition-colors ${
                collapsed ? 'justify-center' : ''
              } ${isActive(item.path) ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10'}`}
            >
              <span className={collapsed ? '' : 'mr-3'}>{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div className={`flex flex-col grow transition-all duration-300 ease-in-out ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>

        {/* Header */}
        <header className="bg-white shadow-sm z-10 h-16 shrink-0">
          <div className="px-4 h-full flex items-center justify-between">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Spacer so dropdown stays right-aligned on desktop */}
            <div className="hidden lg:block flex-1" />

            {/* User account dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                  {userInitial}
                </span>
                <span className="hidden sm:block text-sm text-gray-700 max-w-40 truncate">
                  {user?.email ?? 'Admin User'}
                </span>
                <ChevronDownIcon open={userMenuOpen} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user?.email ?? 'Admin User'}
                    </p>
                  </div>
                  <NavLink
                    to="/admin/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircleIcon className="h-4 w-4 text-gray-400" />
                    Account Settings
                  </NavLink>
                  <button
                    onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;