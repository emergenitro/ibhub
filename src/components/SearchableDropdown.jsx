'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';

const ArrowDownIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.83331 7.5L9.99998 11.6667L14.1666 7.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrossIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 5L5 15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 5L15 15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getHighlightedText = (text, highlight) => {
  // If there's no query, no need to highlight
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  // Create a case-insensitive regex
  const regex = new RegExp(`(${highlight})`, 'gi');
  // Split the text by the regex, which will keep the delimiter (the match)
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((part, index) =>
        // Check if the part is the match (case-insensitive)
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="font-bold text-[#3a7eff]">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export default function SearchableDropdown({ label = "Select an option", options = [], onSelect, initiallyOpen = false }) {

    const [isOpen, setIsOpen] = useState(initiallyOpen);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(null);

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        // Add event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);
        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Empty dependency array means this effect runs only once

    const filteredOptions = useMemo(() => {

        if (!query) {
            return options;
        }

        return options.filter((opt) =>
            opt.label.toLowerCase().includes(query.toLowerCase()));
    }, [query, options]);

    const handleSelect = (opt) => {
        setSelected(opt);
        setQuery(opt.label);
        setIsOpen(false);
        if (onSelect) {
            onSelect(opt);
        }
    };

    const handleIconClick = (e) => {
        e.stopPropagation(); // Prevent the input's onFocus from firing
        if (isOpen) {
            // If open, the cross icon was clicked: clear everything
            setQuery('');
            setSelected(null);
            if (onSelect) {
                onSelect(null); // Notify parent component that selection is cleared
            }
            inputRef.current?.focus(); // Keep the dropdown open and focus the input
        } else {
            // If closed, the arrow was clicked: open it
            setIsOpen(true);
            inputRef.current?.focus();
        }
    };

    const showCrossIcon = isOpen && (query || selected);

    return (
        <div ref={dropdownRef} className="relative w-full max-w-sm mx-auto my-4">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full px-4 py-3 rounded-md 
                            bg-black text-white border-2 border-[#0f0fff]
                            shadow-[0_0_8px_#0f0fff,0_0_12px_#3a7eff]
                            placeholder-gray-400 focus:outline-none 
                            focus:ring-2 focus:ring-[#3a7eff]
                            "
                    placeholder={selected && query === selected.label ? selected.label : label}
                    value={query}
                    onFocus={() => {
                        setIsOpen(true)
                        // When focusing a selected item, allow user to search again
                        if (selected) {
                            setQuery('');
                        }
                    }}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelected(null); // Clear selection when user types
                        if (!isOpen) {
                            setIsOpen(true);
                        }
                    }}
                />

                <button
                    type="button"
                    onClick={handleIconClick}
                    className="absolute inset-y-0 right-0 flex items-center justify-center w-10 
                                text-gray-400 hover:text-white transition-colors duration-200 hover:cursor-pointer"
                    >
                    {showCrossIcon ? <CrossIcon /> : <ArrowDownIcon />}
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-md bg-[#111] border border-[#0f0fff]/40 shadow-[0_0_20px_rgba(15,15,255,0.3)] overflow-hidden transition-all duration-300 max-h-64 overflow-y-scroll">
                {filteredOptions.length > 0 ? (
                    <ul>
                    {filteredOptions.map((opt) => (
                        <li
                        key={opt.value}
                        className={`px-4 py-3 text-white cursor-pointer transition hover:bg-[#3a7eff]/40 ${
                            selected?.value === opt.value ? 'bg-[#3a7eff]/60' : 'hover:bg-[#222]'
                        }`}
                        onClick={() => handleSelect(opt)}
                        >
                        {/* --- CHANGE IS HERE: Use the helper function --- */}
                        {getHighlightedText(opt.label, query)}
                        </li>
                    ))}
                    </ul>
                ) : (
                    <div className="text-gray-400 px-4 py-3 text-sm">
                    No matches found for "{query}".
                    </div>
                )}
                </div>
            )}
        </div>
    );

};