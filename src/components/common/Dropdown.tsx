import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, X, Plus, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  category?: string;
  description?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  maxHeight?: string;
  groupByCategory?: boolean;
  allowCustom?: boolean;
  customPlaceholder?: string;
  error?: string;
  required?: boolean;
  label?: string;
  helperText?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  clearable = false,
  disabled = false,
  className = '',
  maxHeight = 'max-h-80',
  groupByCategory = false,
  allowCustom = false,
  customPlaceholder = "Enter custom value...",
  error,
  required = false,
  label,
  helperText
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedOptions = groupByCategory
    ? filteredOptions.reduce((groups, option) => {
        const category = option.category || 'Other';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(option);
        return groups;
      }, {} as Record<string, DropdownOption[]>)
    : { '': filteredOptions };

  const selectedOption = options.find(option => option.value === value);
  const isCustomValue = value && !selectedOption;

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setSearchTerm('');
      setShowCustomInput(false);
      setCustomValue('');
      setIsFocused(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [showCustomInput]);

  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setShowCustomInput(false);
    setCustomValue('');
    setIsFocused(false);
  }, [onChange]);

  const handleCustomSubmit = useCallback(() => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setIsOpen(false);
      setSearchTerm('');
      setShowCustomInput(false);
      setCustomValue('');
      setIsFocused(false);
    }
  }, [customValue, onChange]);

  const handleCustomKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomSubmit();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomValue('');
    }
  }, [handleCustomSubmit]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  }, [onChange]);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  }, [disabled, isOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      setIsFocused(false);
    }
  }, [handleToggle, isOpen]);

  const displayValue = selectedOption ? selectedOption.label : (isCustomValue ? value : '');
  const dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label 
          htmlFor={dropdownId}
          className={`block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ${required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}`}
        >
          {label}
        </label>
      )}
      
      <button
        id={dropdownId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${dropdownId}-error` : helperText ? `${dropdownId}-helper` : undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${dropdownId}-error` : helperText ? `${dropdownId}-helper` : undefined}
        className={`
          w-full flex items-center justify-between px-4 py-3 text-left
          border-2 rounded-xl transition-all duration-200 shadow-sm
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
            : isFocused || isOpen
              ? 'border-blue-500 focus:ring-blue-500/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
          }
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-4
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className={`block truncate font-medium ${!displayValue ? 'text-gray-500 dark:text-gray-400' : ''}`}>
          {displayValue || placeholder}
        </span>
        
        <div className="flex items-center gap-2">
          {clearable && value && !disabled && (
            <X
              size={18}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className={`
          absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 
          border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl 
          overflow-hidden
        `} 
        style={{ maxHeight: '600px' }} 
        role="listbox"
        aria-labelledby={dropdownId}>
          {(searchable || allowCustom) && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
              {!showCustomInput ? (
                <div className="space-y-3">
                  {searchable && (
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search options..."
                        className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                  
                  {allowCustom && (
                    <button
                      onClick={() => setShowCustomInput(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 
                               hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors font-medium"
                    >
                      <Plus size={16} />
                      Add custom option
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      ref={customInputRef}
                      type="text"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      onKeyDown={handleCustomKeyPress}
                      placeholder={customPlaceholder}
                      className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCustomSubmit}
                      disabled={!customValue.trim()}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomValue('');
                      }}
                      className="flex-1 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 
                               rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FIXED: Proper scrollable area with adequate height */}
          <div 
            className="overflow-y-auto"
            style={{ 
              maxHeight: (searchable || allowCustom) ? '400px' : '500px',
              minHeight: '100px'
            }}
          >
            {Object.keys(groupedOptions).length === 0 || filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                {searchTerm ? (
                  <div>
                    <p className="text-sm mb-2">No options found matching "{searchTerm}"</p>
                    {allowCustom && (
                      <button
                        onClick={() => {
                          setCustomValue(searchTerm);
                          setShowCustomInput(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                      >
                        Add "{searchTerm}" as custom option
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm">No options available</p>
                )}
              </div>
            ) : (
              Object.entries(groupedOptions).map(([category, categoryOptions]) => (
                <div key={category}>
                  {groupByCategory && category && (
                    <div className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 sticky top-0 border-b border-gray-200 dark:border-gray-600 z-10">
                      <div className="flex items-center justify-between">
                        <span>{category}</span>
                        <span className="text-gray-400 font-normal">({categoryOptions.length})</span>
                      </div>
                    </div>
                  )}
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      role="option"
                      aria-selected={option.value === value}
                      className={`
                        w-full px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700
                        transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0
                        ${option.value === value ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm ${option.value === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {option.label}
                          </div>
                          {option.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {option.description}
                            </div>
                          )}
                        </div>
                        {option.value === value && (
                          <Check size={16} className="text-blue-600 dark:text-blue-400 ml-3 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p id={`${dropdownId}-error`} className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium" role="alert">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={`${dropdownId}-helper`} className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Dropdown;