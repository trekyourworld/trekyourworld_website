import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 bg-blue-600 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white text-xl font-bold">
              trekyourworld
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/explore" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md">
                Explore
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;