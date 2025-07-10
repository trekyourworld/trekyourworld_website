import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ label, options, value, onChange, id, placeholder = 'All', className = '', buttonClass = '', optionClass = '' }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Multi-select: value is expected to be an array
    const selectedOptions = Array.isArray(value) ? value : value ? [value] : [];
    const selectedLabels = options.filter(opt => selectedOptions.includes(opt.value)).map(opt => opt.label);

    const handleOptionClick = (optionValue) => {
        let newSelected;
        if (selectedOptions.includes(optionValue)) {
            newSelected = selectedOptions.filter(v => v !== optionValue);
        } else {
            newSelected = [...selectedOptions, optionValue];
        }
        onChange(newSelected);
    };

    const handleClear = () => {
        onChange([]);
        setOpen(false);
    };

    return (
        <div className={`relative inline-block text-left ${className}`} ref={ref}>
            <div className="flex items-center gap-2">
                {label && (
                    <label htmlFor={id} className="font-medium text-gray-700 mr-0">{label}</label>
                )}
                <button
                    id={id}
                    type="button"
                    className={`border rounded-lg px-3 py-2 text-sm bg-white shadow-sm min-w-[140px] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between ${buttonClass}`}
                    onClick={() => setOpen((prev) => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    <span className="truncate max-w-[120px]">
                        {selectedLabels.length > 0 ? selectedLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ') : placeholder}
                    </span>
                    <svg className="ml-2 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
            </div>
            {open && (
                <ul
                    className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
                    role="listbox"
                >
                    <li
                        className={`px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 ${optionClass}`}
                        onClick={handleClear}
                        role="option"
                        aria-selected={selectedOptions.length === 0}
                    >
                        {placeholder}
                    </li>
                    {options.map(option => (
                        <li
                            key={option.value}
                            className={`px-4 py-2 text-sm text-gray-700 cursor-pointer flex items-center hover:bg-blue-100 ${selectedOptions.includes(option.value) ? 'bg-blue-50 font-semibold' : ''} ${optionClass}`}
                            onClick={() => handleOptionClick(option.value)}
                            role="option"
                            aria-selected={selectedOptions.includes(option.value)}
                        >
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(option.value)}
                                readOnly
                                className="mr-2 accent-blue-500"
                            />
                            {option.label.charAt(0).toUpperCase() + option.label.slice(1)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
