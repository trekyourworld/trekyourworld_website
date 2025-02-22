import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { MapPin, Star, Users, Mountain, Globe, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
    const platformStats = [
        { icon: <Users size={24} />, number: "50,000+", label: "Active Trekkers" },
        { icon: <Mountain size={24} />, number: "1,200+", label: "Curated Treks" },
        { icon: <Globe size={24} />, number: "45+", label: "Countries" }
    ];

    const topTreks = [
        {
            title: "Annapurna Circuit",
            location: "Nepal",
            rating: 4.9,
            reviews: 128,
            image: "/api/placeholder/400/300",
            price: "$1,299",
            provider: "Highland Adventures"
        },
        {
            title: "Tour du Mont Blanc",
            location: "France/Italy/Switzerland",
            rating: 4.8,
            reviews: 156,
            image: "/api/placeholder/400/300",
            price: "$2,199",
            provider: "Alpine Explorers"
        },
        {
            title: "Torres del Paine Circuit",
            location: "Chile",
            rating: 4.9,
            reviews: 142,
            image: "/api/placeholder/400/300",
            price: "$1,899",
            provider: "Patagonia Treks"
        }
    ];

    return (
        <Layout>
            <div className="py-5 bg-gray-50">
                {/* Hero Section with Video Background */}
                <section className="pt-16 relative bg-gradient-to-b from-blue-900 to-blue-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 py-20">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-1/2 z-10">
                                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                    Your Journey Begins Here
                                </h1>
                                <p className="text-xl mb-8 text-blue-100">
                                    Connect with expert trekking providers worldwide. Experience the world&apos;s most breathtaking trails with confidence.
                                </p>
                                <Link href="/explore" className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 text-lg font-medium">
                                    Explore Treks
                                </Link>
                            </div>
                            <div className="md:w-1/2 mt-8 md:mt-0">
                                <img
                                    src="/assets/poster_1.jpg"
                                    alt="Trekking Adventure"
                                    className="rounded-2xl shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Platform Statistics */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {platformStats.map((stat, index) => (
                                <div key={index} className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
                                    <div className="text-blue-600 mb-4">{stat.icon}</div>
                                    <h3 className="text-4xl font-bold mb-2">{stat.number}</h3>
                                    <p className="text-gray-600">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top Treks This Month */}
                    <section className="py-16 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">Top Treks This Month</h2>
                                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                                    View All <ChevronRight size={20} className="ml-1" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {topTreks.map((trek, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                        <div className="relative">
                                            <img src={trek.image} alt={trek.title} className="w-full h-48 object-cover" />
                                            <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-sm font-medium text-blue-600">
                                                {trek.price}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center mb-2">
                                                <MapPin className="text-blue-600 mr-2" size={16} />
                                                <span className="text-gray-600">{trek.location}</span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{trek.title}</h3>
                                            <p className="text-gray-600 mb-4">By {trek.provider}</p>
                                            <div className="flex items-center">
                                                <Star className="text-yellow-400 mr-1" size={16} fill="currentColor" />
                                                <span className="font-medium mr-2">{trek.rating}</span>
                                                <span className="text-gray-600">({trek.reviews} reviews)</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
                {/* Why Choose Us */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Why Choose trekyourworld</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="text-blue-600" size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Verified Providers</h3>
                                <p className="text-gray-600">All our trekking providers go through a strict verification process</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="text-blue-600" size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Quality Assurance</h3>
                                <p className="text-gray-600">Regular quality checks and authentic reviews from real trekkers</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="text-blue-600" size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
                                <p className="text-gray-600">Access to diverse trails and local expertise worldwide</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Home;