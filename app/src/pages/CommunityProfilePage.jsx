import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { communityService } from '../services/api/communityService';
import TrekCard from '../components/ui/TrekCard';
import { ACTIVITY_TYPE_LABELS } from '../constants/activityTypes';

const TRAILS_LIMIT = 12;

const SOCIAL_ICONS = {
    instagram: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    ),
    strava: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
        </svg>
    ),
};

function SocialLink({ platform, url }) {
    const icon = SOCIAL_ICONS[platform.toLowerCase()];
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors capitalize"
        >
            {icon || (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            )}
            {platform}
        </a>
    );
}

function GuideCard({ guide }) {
    const initials = guide.name
        ? guide.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4">
            {guide.picture ? (
                <img src={guide.picture} alt={guide.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
            ) : (
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                    {initials}
                </div>
            )}
            <div className="min-w-0">
                <p className="font-semibold text-gray-900">{guide.name}</p>
                {guide.bio && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{guide.bio}</p>}
                {guide.specializations?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {guide.specializations.map((s, i) => (
                            <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                    </div>
                )}
                {guide.socialLinks && Object.keys(guide.socialLinks).length > 0 && (
                    <div className="flex gap-3 mt-2">
                        {Object.entries(guide.socialLinks).map(([platform, url]) => (
                            <SocialLink key={platform} platform={platform} url={url} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const CommunityProfilePage = () => {
    const { slug } = useParams();
    const [community, setCommunity] = useState(null);
    const [trails, setTrails] = useState([]);
    const [trailsTotal, setTrailsTotal] = useState(0);
    const [trailsPage, setTrailsPage] = useState(1);
    const [trailsLoading, setTrailsLoading] = useState(false);
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activityFilter, setActivityFilter] = useState('');

    // Fetch community detail
    useEffect(() => {
        (async () => {
            setLoading(true);
            setError('');
            try {
                const [commRes, guidesRes] = await Promise.all([
                    communityService.getCommunityBySlug(slug),
                    communityService.getCommunityGuides(slug),
                ]);
                setCommunity(commRes?.data?.data || null);
                setGuides(guidesRes?.data?.data || []);
            } catch (e) {
                console.error(e);
                setError('Community not found or failed to load.');
            } finally {
                setLoading(false);
            }
        })();
    }, [slug]);

    // Fetch trails
    const fetchTrails = useCallback(async (p = 1, replace = false) => {
        setTrailsLoading(true);
        try {
            const params = { page: p, limit: TRAILS_LIMIT };
            if (activityFilter) params.activityType = activityFilter;
            const res = await communityService.getCommunityTrails(slug, params);
            const payload = res?.data?.data || {};
            const items = payload.data || [];
            setTrailsTotal(payload.totalItems || 0);
            setTrails(prev => replace ? items : [...prev, ...items]);
        } catch (e) {
            console.error(e);
        } finally {
            setTrailsLoading(false);
        }
    }, [slug, activityFilter]);

    useEffect(() => {
        if (community) {
            fetchTrails(1, true);
            setTrailsPage(1);
        }
    }, [community, fetchTrails]);

    const handleLoadMoreTrails = () => {
        const next = trailsPage + 1;
        setTrailsPage(next);
        fetchTrails(next);
    };

    const activityTypes = Object.entries(ACTIVITY_TYPE_LABELS || {});
    const hasMoreTrails = trails.length < trailsTotal;

    // Map mountain doc to TrekCard expected shape
    const toTrekCard = (m) => ({
        id: m.uuid,
        name: m.title,
        location: m.location || '',
        difficulty: Array.isArray(m.difficulty) ? m.difficulty[0] : (m.difficulty || 'moderate'),
        duration: m.duration ? `${m.duration} days` : '',
        rating: m.rating || null,
        elevation: m.elevation,
        activityType: m.activityType || m.activity_type || '',
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (error || !community) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p className="text-gray-500 mb-4">{error || 'Community not found.'}</p>
                <Link to="/communities" className="text-blue-600 hover:underline">← Back to Communities</Link>
            </div>
        );
    }

    const initials = community.name
        ? community.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    return (
        <>
            <Helmet>
                <title>{community.name} | TrekYourWorld</title>
                <meta name="description" content={community.description || `Trek trails and guides from ${community.name}.`} />
            </Helmet>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="min-h-screen bg-gray-50"
            >
                {/* Hero */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-10 max-w-5xl">
                        <Link to="/communities" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
                            ← All Communities
                        </Link>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                            {community.logo_url ? (
                                <img
                                    src={community.logo_url}
                                    alt={community.name}
                                    className="w-20 h-20 rounded-full object-cover flex-shrink-0 border border-gray-200"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                                    {initials}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-bold text-gray-900">{community.name}</h1>
                                {community.shortName && community.shortName !== community.name && (
                                    <p className="text-sm text-gray-400">{community.shortName}</p>
                                )}
                                {community.description && (
                                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">{community.description}</p>
                                )}
                                {/* Links row */}
                                <div className="flex flex-wrap gap-4 mt-3 items-center">
                                    {community.website && (
                                        <a
                                            href={community.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                            Website
                                        </a>
                                    )}
                                    {community.socialLinks && Object.entries(community.socialLinks).map(([platform, url]) => (
                                        <SocialLink key={platform} platform={platform} url={url} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stats bar */}
                        <div className="flex gap-6 mt-6 pt-5 border-t border-gray-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{community.trailCount ?? 0}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Trails</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{community.guideCount ?? 0}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Guides</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-10 max-w-5xl space-y-12">
                    {/* Trails section */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Trails</h2>

                        {/* Activity type filter */}
                        {activityTypes.length > 0 && (
                            <div className="flex gap-2 flex-wrap mb-5">
                                <button
                                    onClick={() => setActivityFilter('')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activityFilter === '' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                >
                                    All
                                </button>
                                {activityTypes.map(([value, label]) => (
                                    <button
                                        key={value}
                                        onClick={() => setActivityFilter(value)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activityFilter === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {trailsLoading && trails.length === 0 && (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
                            </div>
                        )}

                        {!trailsLoading && trails.length === 0 && (
                            <p className="text-gray-400 text-sm">No trails listed for this community yet.</p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {trails.map(m => (
                                <TrekCard key={m.uuid} trek={toTrekCard(m)} />
                            ))}
                        </div>

                        {hasMoreTrails && !trailsLoading && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleLoadMoreTrails}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Load more trails
                                </button>
                            </div>
                        )}
                        {trailsLoading && trails.length > 0 && (
                            <div className="flex justify-center mt-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600" />
                            </div>
                        )}
                    </section>

                    {/* Guides section */}
                    {guides.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Meet Our Guides</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {guides.map((g, i) => (
                                    <GuideCard key={i} guide={g} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default CommunityProfilePage;
