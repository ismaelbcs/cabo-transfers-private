'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X, Phone, Check } from 'lucide-react';
import {
  COUNTRIES,
  POPULAR_COUNTRY_CODES,
  DEFAULT_COUNTRY_EN,
  DEFAULT_COUNTRY_ES,
} from '../data/countryCallingCodes';

export default function PhoneInputWithCountry({
  value = '',
  onChange,
  selectedCountry = null,
  onCountryChange,
  isEs = false,
  required = false,
  name = 'telefono',
  id = 'telefono',
  placeholder,
  variant = 'default', // 'default' | 'underline'
  className = '',
  inputClassName = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  // Active country resolution
  const activeCountry = useMemo(() => {
    if (selectedCountry) {
      if (typeof selectedCountry === 'string') {
        const found = COUNTRIES.find(
          c =>
            c.code.toUpperCase() === selectedCountry.toUpperCase() ||
            c.dialCode === selectedCountry ||
            c.dialCode.replace(/\D/g, '') === selectedCountry.replace(/\D/g, '')
        );
        if (found) return found;
      } else if (selectedCountry.code || selectedCountry.dialCode) {
        const found = COUNTRIES.find(
          c =>
            c.code.toUpperCase() === (selectedCountry.code || '').toUpperCase() ||
            c.dialCode === selectedCountry.dialCode
        );
        if (found) return found;
      }
    }
    return isEs ? DEFAULT_COUNTRY_ES : DEFAULT_COUNTRY_EN;
  }, [selectedCountry, isEs]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;

    const cleanQ = q.startsWith('+') ? q.slice(1) : q;

    return COUNTRIES.filter(c => {
      const nameMatch = c.name.toLowerCase().includes(q);
      const nameEsMatch = c.nameEs.toLowerCase().includes(q);
      const codeMatch = c.code.toLowerCase().includes(q);
      const dialCodeClean = c.dialCode.replace(/\D/g, '');
      const dialMatch =
        c.dialCode.toLowerCase().includes(q) || dialCodeClean.includes(cleanQ);

      return nameMatch || nameEsMatch || codeMatch || dialMatch;
    });
  }, [searchQuery]);

  // Popular countries
  const popularCountries = useMemo(() => {
    return POPULAR_COUNTRY_CODES.map(code =>
      COUNTRIES.find(c => c.code === code)
    ).filter(Boolean);
  }, []);

  const handleSelectCountry = (country) => {
    if (onCountryChange) {
      onCountryChange(country);
    }
    setIsOpen(false);
    setSearchQuery('');
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 60);
  };

  const handlePhoneInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const defaultPlaceholder = isEs ? '624 123 4567' : '555 123 4567';

  // Underline variant for wedding form
  if (variant === 'underline') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <div className="flex items-center border-b-2 border-stone-200 focus-within:border-rose-400 py-1 transition-colors">
          {/* Country Selector Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            aria-label={isEs ? "Seleccionar código de país (LADA)" : "Select country calling code"}
            className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-stone-100 rounded-lg transition-colors shrink-0 group mr-2"
          >
            <span className="text-xl leading-none select-none">{activeCountry.flag}</span>
            <span className="text-xs font-bold text-stone-800 tracking-tight">
              {activeCountry.dialCode}
            </span>
            <ChevronDown
              size={13}
              className={`text-stone-400 group-hover:text-stone-700 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Phone Input */}
          <input
            ref={phoneInputRef}
            type="tel"
            id={id}
            name={name}
            required={required}
            value={value}
            onChange={handlePhoneInputChange}
            placeholder={placeholder || defaultPlaceholder}
            className={`w-full bg-transparent py-2 outline-none text-stone-800 placeholder-stone-300 font-medium text-sm ${inputClassName}`}
          />
        </div>

        {/* Dropdown Popover */}
        {renderDropdown()}
      </div>
    );
  }

  // Default variant for Checkout & Cart
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        {/* Country Selector Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label={isEs ? "Seleccionar código de país (LADA)" : "Select country calling code"}
          className="flex items-center gap-1.5 pl-3.5 pr-2.5 py-4 hover:bg-slate-100/80 rounded-l-xl transition-colors shrink-0 group border-r border-slate-200 cursor-pointer"
        >
          <span className="text-xl leading-none select-none">{activeCountry.flag}</span>
          <span className="text-xs font-black text-slate-800 tracking-tight">
            {activeCountry.dialCode}
          </span>
          <ChevronDown
            size={14}
            className={`text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Phone Input with Icon */}
        <div className="relative flex-1 flex items-center">
          <Phone className="absolute left-3.5 text-slate-400 pointer-events-none" size={17} />
          <input
            ref={phoneInputRef}
            type="tel"
            id={id}
            name={name}
            required={required}
            value={value}
            onChange={handlePhoneInputChange}
            placeholder={placeholder || defaultPlaceholder}
            className={`w-full pl-10 pr-4 py-4 bg-transparent outline-none text-slate-900 font-bold text-sm placeholder-slate-400 ${inputClassName}`}
          />
        </div>
      </div>

      {/* Dropdown Popover */}
      {renderDropdown()}
    </div>
  );

  function renderDropdown() {
    if (!isOpen) return null;

    return (
      <div className="absolute left-0 top-[calc(100%+6px)] z-[100] w-full sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/80">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                isEs
                  ? 'Buscar país o lada (ej. México, +52)...'
                  : 'Search country or code (e.g. USA, +1)...'
              }
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Countries List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 text-left">
          {/* Show Popular section if not searching */}
          {!searchQuery && popularCountries.length > 0 && (
            <div>
              <div className="px-3.5 py-1.5 bg-slate-100/60 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                {isEs ? 'Países Populares' : 'Popular Countries'}
              </div>
              {popularCountries.map(country => {
                const isSelected = activeCountry.code === country.code;
                return (
                  <button
                    key={`pop-${country.code}`}
                    type="button"
                    onClick={() => handleSelectCountry(country)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 text-blue-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl leading-none shrink-0">{country.flag}</span>
                      <div className="truncate">
                        <span className="font-semibold text-slate-900">
                          {isEs ? country.nameEs : country.name}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1.5 font-normal">
                          ({country.code})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="font-mono font-bold text-slate-900">
                        {country.dialCode}
                      </span>
                      {isSelected && <Check size={14} className="text-blue-600 shrink-0" />}
                    </div>
                  </button>
                );
              })}
              <div className="px-3.5 py-1.5 bg-slate-100/60 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                {isEs ? 'Todos los Países' : 'All Countries'}
              </div>
            </div>
          )}

          {/* Filtered / Full Countries */}
          {filteredCountries.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              {isEs ? 'No se encontraron países' : 'No countries found'}
            </div>
          ) : (
            filteredCountries.map(country => {
              const isSelected = activeCountry.code === country.code;
              const displayName = isEs ? country.nameEs : country.name;
              const altName = isEs ? country.name : country.nameEs;

              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelectCountry(country)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 text-blue-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl leading-none shrink-0">{country.flag}</span>
                    <div className="truncate">
                      <span className="font-semibold text-slate-900">{displayName}</span>
                      {searchQuery && altName !== displayName && (
                        <span className="text-[10px] text-slate-400 ml-1.5 font-normal">
                          ({altName})
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 ml-1 font-normal">
                        [{country.code}]
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="font-mono font-bold text-slate-900">
                      {country.dialCode}
                    </span>
                    {isSelected && <Check size={14} className="text-blue-600 shrink-0" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }
}
