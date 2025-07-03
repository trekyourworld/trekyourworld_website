import { useState, useEffect, useRef } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import treksService from '../../../services/api/treksService';

const ManageTreks = () => {
    // State for editing trek
    // State for adding trek
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', location: '', difficulty: [], duration: '', status: 'Active' });
    const [isAddLoading, setIsAddLoading] = useState(false);

    // Open add modal
    const handleAddClick = () => {
        setAddForm({ name: '', location: '', difficulty: '', duration: '', status: 'Active' });
        setIsAddModalOpen(true);
    };

    // Close add modal
    const handleAddModalClose = () => {
        setIsAddModalOpen(false);
    };

    // Handle add form change
    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddForm((prev) => ({ ...prev, [name]: value }));
    };

    // --- Custom Multi-Select Dropdown State for Add Modal ---
    const [showAddDifficultyDropdown, setShowAddDifficultyDropdown] = useState(false);
    const addDifficultyDropdownRef = useRef(null);

    // Close dropdown on outside click (add modal)
    useEffect(() => {
        if (!showAddDifficultyDropdown) return;
        function handleClick(e) {
            if (addDifficultyDropdownRef.current && !addDifficultyDropdownRef.current.contains(e.target)) {
                setShowAddDifficultyDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [showAddDifficultyDropdown]);

    // Submit add form
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsAddLoading(true);
        try {
            // Assume createTrek takes (data)
            await treksService.createTrek({
                name: addForm.name,
                location: addForm.location,
                difficulty: addForm.difficulty,
                duration: addForm.duration,
                status: addForm.status,
            });
            setIsAddModalOpen(false);
            fetchTreks(pagination.currentPage, searchTerm);
        } catch (err) {
            console.error('Error adding trek:', err);
            setError('Failed to add trek. Please try again.');
        } finally {
            setIsAddLoading(false);
        }
    };
    // State for deleting trek
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTrek, setDeleteTrek] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    // Open delete modal
    const handleDeleteClick = (trek) => {
        setDeleteTrek(trek);
        setIsDeleteModalOpen(true);
    };

    // Close delete modal
    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
        setDeleteTrek(null);
    };

    // Confirm delete
    const handleDeleteConfirm = async () => {
        if (!deleteTrek) return;
        setIsDeleteLoading(true);
        try {
            // Assume deleteTrek takes (id)
            await treksService.deleteTrek(deleteTrek.id || deleteTrek.uuid);
            setIsDeleteModalOpen(false);
            setDeleteTrek(null);
            fetchTreks(pagination.currentPage, searchTerm);
        } catch (err) {
            console.error('Error deleting trek:', err);
            setError('Failed to delete trek. Please try again.');
        } finally {
            setIsDeleteLoading(false);
        }
    };
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTrek, setEditTrek] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', location: '', difficulty: '', duration: '', status: '' });
    const [isEditLoading, setIsEditLoading] = useState(false);
    // State for custom multi-select dropdown (edit modal)
    // --- Custom Multi-Select Dropdown State for Edit Modal ---
    const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
    const difficultyDropdownRef = useRef(null);

    // Close dropdown on outside click (edit modal)
    useEffect(() => {
        if (!showDifficultyDropdown) return;
        
        function handleClick(e) {
            if (difficultyDropdownRef.current && !difficultyDropdownRef.current.contains(e.target)) {
                setShowDifficultyDropdown(false);
            }
        }
        
        // Use mousedown to ensure it fires before any onClick handlers
        document.addEventListener('mousedown', handleClick);
        
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [showDifficultyDropdown]);

    // Open edit modal and set form data
    const handleEditClick = (trek) => {
        setEditTrek(trek);
        setEditForm({
            name: trek.name || trek.title || '',
            location: trek.location || '',
            difficulty: Array.isArray(trek.difficulty) ? trek.difficulty : trek.difficulty ? [trek.difficulty] : [],
            duration: trek.duration || '',
            status: trek.status || '',
        });
        setIsEditModalOpen(true);
        setShowDifficultyDropdown(false);
    };
    // We already have a useEffect for closing the dropdown above (using difficultyDropdownRef)
    // This duplicate effect is removed to prevent conflicts

    // Handle edit form change
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // Submit edit form
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editTrek) return;
        setIsEditLoading(true);
        try {
            // Assume updateTrek takes (id, data)
            await treksService.updateTrek(editTrek.id || editTrek.uuid, {
                name: editForm.name,
                location: editForm.location,
                difficulty: editForm.difficulty,
                duration: editForm.duration,
                status: editForm.status,
            });
            setIsEditModalOpen(false);
            setEditTrek(null);
            fetchTreks(pagination.currentPage, searchTerm);
        } catch (err) {
            console.error('Error updating trek:', err);
            setError('Failed to update trek. Please try again.');
        } finally {
            setIsEditLoading(false);
        }
    };

    // Close modal
    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setEditTrek(null);
        setShowDifficultyDropdown(false);
    };
    const [treks, setTreks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 10
    });

    const [filters, setFilters] = useState({
        difficulty: '',
        status: ''
    });

    // State for filter options
    const [difficultyOptions, setDifficultyOptions] = useState([]);

    // Fetch filter options on mount (new structure)
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await treksService.fetchFilterOptions();
                // Find the Difficulty filter in response.data.data
                const difficultyFilter = Array.isArray(response.data.data)
                    ? response.data.data.find(f => f.name === 'Difficulty')
                    : null;
                console.log(difficultyFilter)
                setDifficultyOptions(difficultyFilter ? difficultyFilter.options : []);
            } catch (err) {
                console.error('Error fetching filter options:', err);
                setDifficultyOptions([]);
            }
        };
        fetchOptions();
    }, []);

    const fetchTreks = async (page = 1, searchQuery = '') => {
        try {
            setIsLoading(true);

            // Create parameters object for the API call
            const params = {
                page,
                limit: pagination.pageSize,
                search: searchQuery || undefined
            };

            // Add difficulty filter if selected
            if (filters.difficulty) {
                params.difficulty = filters.difficulty;
            }

            // Add status filter if selected
            if (filters.status) {
                params.status = filters.status;
            }

            // Use fetchTreksFromV1 which calls the /v1/treks/search endpoint
            const response = await treksService.fetchTreksFromV1(params);
            const responseData = response.data;

            // Set treks from API response
            setTreks(responseData.data.data || []);

            // Update pagination information
            setPagination({
                currentPage: responseData.data.currentPage || page,
                totalPages: responseData.data.totalPages || Math.ceil((responseData.data.totalPages || 0) / pagination.data.limit),
                totalItems: responseData.data.totalItems || responseData.data.data?.length || 0,
                pageSize: responseData.data.limit
            });

            setError(null);
        } catch (err) {
            console.error('Error fetching treks:', err);
            setError('Failed to load treks. Please try again later.');
            setTreks([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load and when page changes
    useEffect(() => {
        fetchTreks(pagination.currentPage, searchTerm);
    }, [pagination.currentPage, filters]);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            // If already on page 1, fetch with search term
            if (pagination.currentPage === 1) {
                fetchTreks(1, searchTerm);
            } else {
                // Reset to page 1 when searching, which will trigger fetchTreks via the other useEffect
                setPagination(prev => ({ ...prev, currentPage: 1 }));
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        // Reset to page 1 when filters change
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    // Generate pagination numbers
    const paginationNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const halfVisiblePages = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, pagination.currentPage - halfVisiblePages);
        let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Treks</h1>
                <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors" onClick={handleAddClick}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Trek
                </button>
                {/* Add Trek Modal (rendered once at root) */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-20">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={handleAddModalClose}>&times;</button>
                            <h2 className="text-xl font-semibold mb-4">Add New Trek</h2>
                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input type="text" name="name" value={addForm.name} onChange={handleAddFormChange} className="w-full px-3 py-2 border rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Location</label>
                                    <input type="text" name="location" value={addForm.location} onChange={handleAddFormChange} className="w-full px-3 py-2 border rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Difficulty</label>
                                    <div className="relative" ref={addDifficultyDropdownRef}>
                                        <div
                                            className="w-full px-3 py-2 border rounded-lg min-h-[44px] flex flex-wrap gap-1 cursor-pointer bg-white"
                                            onClick={e => {
                                                e.preventDefault();
                                                setShowAddDifficultyDropdown(!showAddDifficultyDropdown);
                                            }}
                                        >
                                            {Array.isArray(addForm.difficulty) && addForm.difficulty.length > 0 ? (
                                                addForm.difficulty.map((val) => {
                                                    const option = difficultyOptions.find(opt => opt.value === val);
                                                    return (
                                                        <span
                                                            key={val}
                                                            className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold mr-1 mb-1 border border-blue-300"
                                                        >
                                                            {option ? option.label : val}
                                                            <button
                                                                type="button"
                                                                className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    setAddForm(prev => {
                                                                        const arr = Array.isArray(prev.difficulty) ? [...prev.difficulty] : [];
                                                                        return { ...prev, difficulty: arr.filter(d => d !== val) };
                                                                    });
                                                                }}
                                                            >
                                                                &times;
                                                            </button>
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-gray-400">Select difficulty...</span>
                                            )}
                                            <span className="ml-auto text-gray-400">
                                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            </span>
                                        </div>
                                        {showAddDifficultyDropdown && (
                                            <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                                {difficultyOptions.map((option) => {
                                                    const isSelected = Array.isArray(addForm.difficulty) && addForm.difficulty.includes(option.value);
                                                    return (
                                                        <div
                                                            key={option.value}
                                                            className={`px-4 py-2 cursor-pointer hover:bg-blue-100 flex items-center ${isSelected ? 'bg-blue-50 font-semibold' : ''}`}
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                setAddForm(prev => {
                                                                    let arr = Array.isArray(prev.difficulty) ? [...prev.difficulty] : [];
                                                                    if (arr.includes(option.value)) {
                                                                        arr = arr.filter(d => d !== option.value);
                                                                    } else {
                                                                        arr.push(option.value);
                                                                    }
                                                                    setTimeout(() => setShowAddDifficultyDropdown(true), 0);
                                                                    return { ...prev, difficulty: arr };
                                                                });
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                readOnly
                                                                className="mr-2"
                                                            />
                                                            {option.label}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration (days)</label>
                                    <input type="number" name="duration" value={addForm.duration} onChange={handleAddFormChange} className="w-full px-3 py-2 border rounded-lg" min="1" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select name="status" value={addForm.status} onChange={handleAddFormChange} className="w-full px-3 py-2 border rounded-lg" required>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" className="mr-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handleAddModalClose}>Cancel</button>
                                    <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={isAddLoading}>{isAddLoading ? 'Adding...' : 'Add Trek'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <input
                            type="text"
                            placeholder="Search treks by name or location..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.difficulty}
                            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        >
                            <option value="">All Difficulties</option>
                            {difficultyOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <select
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {/* Treks Table */}
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trek Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {treks.map((trek) => (
                                    <tr key={trek.id || trek.uuid} className="hover:bg-gray-50 text-left">
                                        <td className="px-4 py-4 text-sm text-gray-900">{trek.id || trek.uuid}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{trek.name || trek.title}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{trek.location}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {Array.isArray(trek.difficulty) && trek.difficulty.length > 0 ? (
                                                trek.difficulty.map((level, idx) => {
                                                    let pillColor = '';
                                                    switch (level.toLowerCase()) {
                                                        case 'easy':
                                                            pillColor = 'bg-green-100 text-green-800 border-green-300';
                                                            break;
                                                        case 'moderate':
                                                            pillColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
                                                            break;
                                                        case 'difficult':
                                                            pillColor = 'bg-red-100 text-red-800 border-red-300';
                                                            break;
                                                        default:
                                                            pillColor = 'bg-gray-100 text-gray-800 border-gray-300';
                                                    }
                                                    return (
                                                        <span
                                                            key={level + idx}
                                                            className={`inline-block px-2 py-1 mr-1 mb-1 rounded-full text-xs font-semibold border ${pillColor}`}
                                                        >
                                                            {level}
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-300">
                                                    {trek.difficulty || 'Unknown'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{trek.duration} days</td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{trek.bookings || '0'}</td>
                                        <td className="px-4 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${trek.status === 'Active' || trek.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {trek.status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            <div className="flex space-x-2">
                                                <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEditClick(trek)}>
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteClick(trek)}>
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                                {/* Delete Trek Modal (rendered once at root) */}
                                                {isDeleteModalOpen && (
                                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-20">
                                                        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                                                            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={handleDeleteModalClose}>&times;</button>
                                                            <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Trek</h2>
                                                            <p className="mb-6">Are you sure you want to delete <span className="font-semibold">{deleteTrek?.name || deleteTrek?.title}</span>? This action cannot be undone.</p>
                                                            <div className="flex justify-end space-x-2">
                                                                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handleDeleteModalClose} disabled={isDeleteLoading}>Cancel</button>
                                                                <button type="button" className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteConfirm} disabled={isDeleteLoading}>{isDeleteLoading ? 'Deleting...' : 'Delete'}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Edit Trek Modal (rendered once at root) */}
                                            {isEditModalOpen && (
                                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-20">
                                                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                                                        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={handleEditModalClose}>&times;</button>
                                                        <h2 className="text-xl font-semibold mb-4">Edit Trek</h2>
                                                        <form onSubmit={handleEditSubmit} className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1">Name</label>
                                                                <input type="text" name="name" value={editForm.name} onChange={handleEditFormChange} className="w-full px-3 py-2 border rounded-lg" required />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1">Location</label>
                                                                <input type="text" name="location" value={editForm.location} onChange={handleEditFormChange} className="w-full px-3 py-2 border rounded-lg" required />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1">Difficulty</label>
                                                                <div className="relative" ref={difficultyDropdownRef}>
                                                                    <div
                                                                        className="w-full px-3 py-2 border rounded-lg min-h-[44px] flex flex-wrap gap-1 cursor-pointer bg-white"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setShowDifficultyDropdown(!showDifficultyDropdown);
                                                                        }}
                                                                    >
                                                                        {Array.isArray(editForm.difficulty) && editForm.difficulty.length > 0 ? (
                                                                            editForm.difficulty.map((val) => {
                                                                                const option = difficultyOptions.find(opt => opt.value === val);
                                                                                return (
                                                                                    <span
                                                                                        key={val}
                                                                                        className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold mr-1 mb-1 border border-blue-300"
                                                                                    >
                                                                                        {option ? option.label : val}
                                                                                        <button
                                                                                            type="button"
                                                                                            className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                                                                                            onClick={e => {
                                                                                                e.preventDefault();
                                                                                                e.stopPropagation();
                                                                                                setEditForm(prev => {
                                                                                                    const arr = Array.isArray(prev.difficulty) ? [...prev.difficulty] : [];
                                                                                                    return { ...prev, difficulty: arr.filter(d => d !== val) };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            &times;
                                                                                        </button>
                                                                                    </span>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <span className="text-gray-400">Select difficulty...</span>
                                                                        )}
                                                                        <span className="ml-auto text-gray-400">
                                                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                                        </span>
                                                                    </div>
                                                                    {showDifficultyDropdown && (
                                                                        <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                                                            {difficultyOptions.map((option) => {
                                                                                const isSelected = Array.isArray(editForm.difficulty) && editForm.difficulty.includes(option.value);
                                                                                return (
                                                                                    <div
                                                                                        key={option.value}
                                                                                        className={`px-4 py-2 cursor-pointer hover:bg-blue-100 flex items-center ${isSelected ? 'bg-blue-50 font-semibold' : ''}`}
                                                                                        onClick={e => {
                                                                                            e.preventDefault(); // Prevent event bubbling
                                                                                            setEditForm(prev => {
                                                                                                let arr = Array.isArray(prev.difficulty) ? [...prev.difficulty] : [];
                                                                                                if (arr.includes(option.value)) {
                                                                                                    arr = arr.filter(d => d !== option.value);
                                                                                                } else {
                                                                                                    arr.push(option.value);
                                                                                                }
                                                                                                // Keep dropdown open
                                                                                                setTimeout(() => setShowDifficultyDropdown(true), 0);
                                                                                                return { ...prev, difficulty: arr };
                                                                                            });
                                                                                        }}
                                                                                    >
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={isSelected}
                                                                                            readOnly
                                                                                            className="mr-2"
                                                                                        />
                                                                                        {option.label}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {/* End of Difficulty Multi-Select */}
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1">Duration (days)</label>
                                                                <input type="number" name="duration" value={editForm.duration} onChange={handleEditFormChange} className="w-full px-3 py-2 border rounded-lg" min="1" required />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1">Status</label>
                                                                <select name="status" value={editForm.status} onChange={handleEditFormChange} className="w-full px-3 py-2 border rounded-lg" required>
                                                                    <option value="Active">Active</option>
                                                                    <option value="Inactive">Inactive</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex justify-end">
                                                                <button type="button" className="mr-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handleEditModalClose}>Cancel</button>
                                                                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={isEditLoading}>{isEditLoading ? 'Saving...' : 'Save Changes'}</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {treks.length === 0 && !isLoading && !error && (
                        <div className="text-center py-8 text-gray-500">
                            No treks found matching your search criteria.
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 0 && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
                                </span> of{' '}
                                <span className="font-medium">{pagination.totalItems}</span> treks
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="px-2 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </button>

                                {paginationNumbers().map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 border rounded-md text-sm ${pagination.currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage >= pagination.totalPages}
                                    className="px-2 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRightIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageTreks;