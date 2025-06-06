import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../auth/AuthContext';
import SignInModal from '../auth/SignInModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const userMenuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle main mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Toggle user dropdown menu
  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Event listener for custom sign-in modal opening events
  useEffect(() => {
    const openSignInModal = () => {
      setIsSignInModalOpen(true);
    };

    window.addEventListener('open-signin-modal', openSignInModal);

    return () => {
      window.removeEventListener('open-signin-modal', openSignInModal);
    };
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/treks?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Treks', path: '/treks' },
    { label: 'Guides', path: '/guides' },
    { label: 'Gallery', path: '/gallery' },
    // { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  // Check if the path matches exactly or if it's a sub-path (except for home)
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignIn = () => {
    setIsSignInModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50 w-full">
      <div className="w-full px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">Trekyourworld</Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <ul className="flex items-center space-x-8">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`font-medium transition-colors ${
                      isActive(item.path) 
                        ? "text-blue-600 border-b-2 border-blue-600" 
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Search and Auth - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search treks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
            
            {isAuthenticated ? (
              <div className="relative text-left" ref={userMenuRef}>
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors"
                >
                  <UserCircleIcon className="h-6 w-6 text-gray-600" />
                  <span className="font-medium text-gray-700">{user?.name || 'User'}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    {isAdmin() && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-500" onClick={toggleMenu}>
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t w-full">
          <nav className="w-full px-4">
            <ul className="py-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`block py-2 transition-colors ${
                      isActive(item.path) 
                        ? "text-blue-600 font-medium" 
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="py-3 border-t">
              <form onSubmit={handleSearch} className="relative mt-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search treks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button type="submit" className="sr-only">Search</button>
              </form>
              
              {isAuthenticated ? (
                <div className="mt-3 mb-3 space-y-2 text-left">
                  <div className="py-2 px-4 bg-gray-100 rounded-lg">
                    <p className="font-medium">Signed in as: {user?.name || 'User'}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    onClick={toggleMenu}
                  >
                    My Profile
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                      onClick={toggleMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      try {
                        await handleLogout();
                        toggleMenu();
                        // Add a small delay to ensure state changes are processed
                        setTimeout(() => {
                          window.location.href = '/';
                        }, 100);
                      } catch (error) {
                        console.error('Logout error:', error);
                        // If logout fails, still close menu and redirect to home
                        toggleMenu();
                        window.location.href = '/';
                      }
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleSignIn();
                    toggleMenu();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-3 mb-3 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Sign In Modal */}
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
    </header>
  );
};

export default Header;