// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { communityService } from '../../services/api/communityService';

const TopTreks = lazy(() => import('./TopTreks'));
const Statistics = lazy(() => import('./Statistics'));
const PhotoGallery = lazy(() => import('./PhotoGallery'));

const HomePage = () => {
  const [featuredCommunities, setFeaturedCommunities] = useState([]);

  useEffect(() => {
    communityService.getCommunities({ page: 1, limit: 6 })
      .then(res => {
        const items = res?.data?.data?.data || [];
        setFeaturedCommunities(items);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>TrekYourWorld | Plan Your Next Trek with Confidence</title>
        <meta name="description" content="TrekYourWorld is your one-stop destination for unbiased trek and mountain information, community price comparisons, and direct guide contacts—empowering every trekker to explore smarter." />
        {/* Resource Hints for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* Add more resource hints for other third-party origins as needed */}
      </Helmet>
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-blue-700 text-white h-[70vh] min-h-[500px] flex items-center overflow-hidden w-full">
        {/* Funky SVG Mountain Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <svg viewBox="0 0 1440 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path d="M0,400 L300,250 L500,400 L700,200 L900,400 L1100,300 L1440,400 L1440,500 L0,500 Z" fill="url(#mountainGradient)" opacity="0.7" />
            <path d="M0,450 L200,350 L400,450 L600,300 L800,450 L1000,350 L1200,450 L1440,400 L1440,500 L0,500 Z" fill="#fff" opacity="0.15" />
            <path d="M0,480 L180,420 L360,480 L540,420 L720,480 L900,420 L1080,480 L1260,420 L1440,480 L1440,500 L0,500 Z" fill="#fff" opacity="0.08" />
          </svg>
        </div>
        
        <div className="w-full px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="w-full text-4xl md:text-6xl text-center font-bold mb-4">
              Plan Your Next Trek with Confidence
            </h1>

            <p className="text-xl text-center md:text-2xl mb-8">
              TrekYourWorld is your one-stop destination for unbiased trek and mountain information, community price comparisons, and direct guide contacts—empowering every trekker to explore smarter.
            </p>

            <div className="flex flex-col justify-center sm:flex-row gap-4">
              <Link
                to="/explore"
                className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-block text-center"
              >
                Explore
              </Link>
              <Link
                to="/guides"
                className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-block text-center"
              >
                Guides
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Top Treks Section */}
      <Suspense fallback={<div className="w-full text-center py-8">Loading top treks...</div>}>
        <TopTreks />
      </Suspense>

      {/* Statistics Section */}
      <Suspense fallback={<div className="w-full text-center py-8">Loading statistics...</div>}>
        <Statistics />
      </Suspense>

      {/* Photo Gallery Section */}
      <Suspense fallback={<div className="w-full text-center py-8">Loading gallery...</div>}>
        <PhotoGallery />
      </Suspense>

      {/* Partner Communities Section */}
      {featuredCommunities.length > 0 && (
        <section className="py-14 bg-white w-full">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Our Partner Communities</h2>
              <Link to="/communities" className="text-sm text-blue-600 hover:underline font-medium">
                View All →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
              {featuredCommunities.map(c => {
                const initials = c.name ? c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
                return (
                  <Link
                    key={c.id}
                    to={c.slug ? `/communities/${c.slug}` : '/communities'}
                    className="flex-shrink-0 flex flex-col items-center gap-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 w-32 transition-colors"
                  >
                    {c.logo_url ? (
                      <img src={c.logo_url} alt={c.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                        {initials}
                      </div>
                    )}
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight line-clamp-2">{c.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="bg-blue-700 text-white py-16 w-full">
        <div className="w-full px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Ahead of the Trail</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get the latest trek updates, community deals, and expert tips—straight to your inbox.
          </p>

          <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email to subscribe"
              className="flex-grow px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </div>
    </>
  );
};

export default HomePage;