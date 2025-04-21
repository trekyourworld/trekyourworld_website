import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Treks', path: '/treks' },
    { label: 'Guides', path: '/guides' },
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

          {/* Search and Sign In - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search treks..."
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Sign In
            </button>
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
              <div className="relative mt-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search treks..."
                  className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-3 mb-3 transition-colors">
                Sign In
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;