import React, { useState, useEffect, useRef } from "react";
import Flag from "react-world-flags";

export const CurrencySelector = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={selectRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex items-center space-x-2"
      >
        {value && (
          <>
            <Flag code={value.code} style={{ width: 20, height: 15 }} />
            <span>{value.label}</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className="cursor-pointer select-none px-4 py-2 text-sm hover:bg-indigo-100 hover:text-indigo-900 flex items-center space-x-2"
              >
                <Flag code={option.code} style={{ width: 20, height: 15 }} />
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
