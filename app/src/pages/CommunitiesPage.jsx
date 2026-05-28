import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { communityService } from '../services/api/communityService';
import { Helmet } from 'react-helmet-async';

const LIMIT = 18;

function CommunityCard({ community }) {
    const initials = community.name
        ? community.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
                {community.logo_url ? (
                    <img
                        src={community.logo_url}
                        alt={community.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {initials}
                    </div>
                )}
                <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{community.name}</p>
                    {community.shortName && community.shortName !== community.name && (
                        <p className="text-xs text-gray-400 truncate">{community.shortName}</p>
                    )}
                </div>
            </div>

            {community.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{community.description}</p>
            )}

            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    {community.trailCount != null && (
                        <span>{community.trailCount} Trail{community.trailCount !== 1 ? 's' : ''}</span>
                    )}
                    {community.guideCount != null && (
                        <span>{community.guideCount} Guide{community.guideCount !== 1 ? 's' : ''}</span>
                    )}
                    {community.website && (
                        <a
                            href={community.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                            onClick={e => e.stopPropagation()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                </div>
                {community.slug && (
                    <Link
                        to={`/communities/${community.slug}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        View →
                    </Link>
                )}
            </div>
        </div>
    );
}

const CommunitiesPage = () => {
    const [communities, setCommunities] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCommunities = useCallback(async (p = 1, q = '', replace = false) => {
        setLoading(true);
        setError('');
        try {
            const res = await communityService.getCommunities({ page: p, limit: LIMIT, search: q });
            const payload = res?.data?.data || {};
            const items = payload.data || [];
            setTotal(payload.totalItems || 0);
            setCommunities(prev => replace ? items : [...prev, ...items]);
        } catch (e) {
            console.error(e);
            setError('Failed to load communities.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCommunities(1, search, true);
        setPage(1);
    }, [search, fetchCommunities]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput.trim());
    };

    const handleLoadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchCommunities(next, search);
    };

    const hasMore = communities.length < total;

    return (
        <>
            <Helmet>
                <title>Partner Communities | TrekYourWorld</title>
                <meta name="description" content="Discover our partner trekking communities — expert organisers, certified guides, and local experts." />
            </Helmet>
            <div className="container mx-auto px-4 py-10 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Communities</h1>
                    <p className="text-gray-500">Explore our network of trusted trek organisers and communities.</p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-md">
                    <input
                        type="text"
                        placeholder="Search communities…"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Search
                    </button>
                    {search && (
                        <button
                            type="button"
                            onClick={() => { setSearchInput(''); setSearch(''); }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    )}
                </form>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {communities.length === 0 && !loading && (
                    <div className="text-center py-16 text-gray-500">
                        {search ? `No communities found for "${search}".` : 'No communities found.'}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {communities.map(c => (
                        <CommunityCard key={c.id} community={c} />
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
                    </div>
                )}

                {hasMore && !loading && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleLoadMore}
                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Load more
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CommunitiesPage;
