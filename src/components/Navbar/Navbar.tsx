'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Filter, Search, User, X } from 'lucide-react'; 
import SidebarFilter from './SidebarFilter';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion'; 

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  selectedExperience?: string;
  selectedActivity?: string;
  selectedCrowdness?: string;
  setSelectedExperience?: (value: string) => void;
  setSelectedActivity?: (value: string) => void;
  setSelectedCrowdness?: (value: string) => void;
  onApply?: () => void;
  onReset?: () => void;
  showFilter?: boolean;
  onToggleFilter?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedExperience = '',
  selectedActivity = '',
  selectedCrowdness = '',
  setSelectedExperience = () => {},
  setSelectedActivity = () => {},
  setSelectedCrowdness = () => {},
  onApply = () => {},
  onReset = () => {},
  showFilter = false,
  onToggleFilter,
}) => {
  const router = useRouter();
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  
  const pathname = usePathname(); 
  const isSearchPage = pathname.startsWith('/explore') || pathname.startsWith('/tour-guides');
  
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('dummyUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.username);
      } catch (e) { console.error(e); }
    }
  }, []); 
  
  const handleLogout = () => {
    localStorage.removeItem('dummyUser');
    setUsername(null);
    setDropdownOpen(false);
    window.location.reload(); 
  };
  
  useEffect(() => {
    const handleSidebarBlur = () => {
      if (showFilter && onToggleFilter) {
        onToggleFilter();
      }
    };
    window.addEventListener('blurFilter', handleSidebarBlur);
    return () => {
      window.removeEventListener('blurFilter', handleSidebarBlur);
    };
  }, [showFilter, onToggleFilter]);

  const handleSearchSubmitManual = () => {
    setMobileSearchOpen(false); 
    if (onSearchSubmit) {
      onSearchSubmit(); 
    } 
    else {
      router.push(`/explore?show=all&q=${encodeURIComponent(searchQuery.trim())}&filterOpen=false&animateFilter=false`);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange(e.currentTarget.value);
      handleSearchSubmitManual();
    }
  };
  
  const handleFilterButtonClick = () => {
    if (onToggleFilter) {
      onToggleFilter();
    } else {
      router.push('/explore?show=all&filterOpen=true&animateFilter=false');
    }
  };

  return (
    <>
      <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#2d2e31] py-4 px-6 rounded-3xl shadow-xl w-[95%] max-w-screen-lg">
        
        {/* ----- TAMPILAN DESKTOP (md:flex) ----- */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
            </Link>
            <nav className="flex gap-6 text-white font-medium">
              <Link href="/" className="hover:text-blue-300 transition">Home</Link>
              <Link href="/explore" className="hover:text-blue-300 transition">Explore</Link>
              <Link href="/tour-guides" className="hover:text-blue-300 transition">Tour Guide</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-6 justify-end">
            {isSearchPage ? (
              <>
                <div className="flex items-center bg-white/90 px-4 py-2 rounded-full shadow-lg w-full max-w-[400px]" suppressHydrationWarning>
                  <Search className="text-gray-500 mr-2" size={16} />
                  <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} onKeyDown={handleKeyDown} className="bg-transparent w-full text-sm text-black placeholder-gray-500 focus:outline-none" suppressHydrationWarning />
                  <button onClick={handleSearchSubmitManual} className="ml-2 px-3 py-1 bg-blue-300 text-black text-sm font-semibold rounded-full hover:bg-blue-400 transition" suppressHydrationWarning>
                    Search
                  </button>
                </div>
                <button
                  ref={filterButtonRef}
                  onClick={handleFilterButtonClick}
                  className="flex items-center gap-1 bg-blue-100 px-4 py-2 rounded-full shadow-lg text-black hover:bg-blue-200 transition"
                  suppressHydrationWarning
                >
                  <Filter size={16} />
                  Filter
                </button>
              </>
            ) : (
              <div className="w-[400px]"></div> 
            )}
            
            <div className="relative">
              {username ? (
                <>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">
                    {username}
                  </button>
                  {dropdownOpen && (
                    // ----- 1. PERBAIKAN UNTUK DESKTOP -----
                    <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-xl z-50 overflow-hidden">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">{username}</div>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600">
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login">
                  <button className="px-4 py-2 bg-blue-300 text-black rounded-full hover:bg-blue-400 transition">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* ----- TAMPILAN MOBILE (md:hidden) ----- */}
        <div className="flex md:hidden items-center justify-between h-[36px]">
          <AnimatePresence mode="wait">
            {isSearchPage && mobileSearchOpen ? (
              <motion.div
                key="search-view"
                className="flex items-center w-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-grow flex items-center bg-white/90 px-4 py-2 rounded-full shadow-lg" suppressHydrationWarning>
                  <Search className="text-gray-500 mr-2" size={20} />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent w-full text-sm text-black placeholder-gray-500 focus:outline-none"
                    suppressHydrationWarning
                    autoFocus 
                  />
                </div>
                <button
                  onClick={() => {
                    setMobileSearchOpen(false);
                    onSearchChange(''); 
                  }}
                  className="text-white ml-3 text-sm font-medium flex-shrink-0"
                >
                  Cancel
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="normal-view"
                className="flex items-center justify-between w-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/">
                  <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
                </Link>
                <div className="flex items-center gap-4 text-white">
                  {isSearchPage && (
                  <>
                    <button
                      onClick={() => setMobileSearchOpen(true)}
                      className="p-1"
                    >
                      <Search size={24} />
                    </button>
                    <button
                      ref={filterButtonRef}
                      onClick={handleFilterButtonClick}
                      className="p-1"
                    >
                      <Filter size={24} />
                    </button>
                  </>
                )}
                  
                  <div className="relative">
                    {username ? (
                      <>
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="bg-green-600 w-8 h-8 rounded-full flex items-center justify-center">
                          <User size={18} />
                        </button>
                        {dropdownOpen && (
                          // ----- 2. PERBAIKAN UNTUK MOBILE -----
                          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-xl z-50 overflow-hidden">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">{username}</div>
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600">
                              Logout
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <Link href="/login">
                        <button className="p-1">
                          <User size={24} />
                        </button>
                      </Link>
                    )} 
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Filter */}
        {showFilter && onToggleFilter && (
          <SidebarFilter
            selectedExperience={selectedExperience}
            selectedActivity={selectedActivity}
            selectedCrowdness={selectedCrowdness}
            setSelectedExperience={setSelectedExperience}
            setSelectedActivity={setSelectedActivity}
            setSelectedCrowdness={setSelectedCrowdness}
            onApply={onApply}
            onReset={onReset}
            showFilter={showFilter}
            filterRef={filterButtonRef}
          />
        )}
      </header>
    </>
  );
};

export default Header;