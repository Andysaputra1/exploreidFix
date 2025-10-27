'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Filter, Search } from 'lucide-react';
import SidebarFilter from './SidebarFilter';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
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

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        setUser(authData.user);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', authData.user.id)
          .single();

        if (profileData) {
          setUsername(profileData.username);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
    router.push(`/explore?show=all&q=${encodeURIComponent(searchQuery.trim())}&filterOpen=false&animateFilter=false`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#2d2e31] py-4 px-6 rounded-3xl shadow-xl w-[95%] max-w-screen-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
          </div>

          <nav className="flex gap-6 text-white font-medium">
            <Link href="/" className="hover:text-blue-300 transition">Home</Link>
            <Link href="/explore" className="hover:text-blue-300 transition">Explore</Link>
            <Link href="/tour-guides" className="hover:text-blue-300 transition">Tour Guide</Link>
          </nav>
        </div>

        <div className="flex items-center gap-6 justify-end">
          <div className="flex items-center bg-white/90 px-4 py-2 rounded-full shadow-lg w-[400px]" suppressHydrationWarning>
            <Search className="text-gray-500 mr-2" size={16} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent w-full text-sm text-black placeholder-gray-500 focus:outline-none"
              suppressHydrationWarning
            />
            <button
              onClick={handleSearchSubmitManual}
              className="ml-2 px-3 py-1 bg-blue-300 text-black text-sm font-semibold rounded-full hover:bg-blue-400 transition"
              suppressHydrationWarning
            >
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

          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                >
                  {username ?? user?.email?.split('@')[0] ?? 'User'}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-xl z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                    >
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
  );
};

export default Header;
