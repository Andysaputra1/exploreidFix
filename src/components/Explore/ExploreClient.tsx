'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Navbar/Navbar';
import DetailDestination from '@/components/Explore/DetailDestination';
import AllDestinations from '@/components/Explore/AllDestinations';
import Itinerary from '@/components/Explore/Itinerary';
import Footer from '@/components/Footer/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';

// ----- SEMUA INTERFACE -----
export interface Destination {
  Place: string;
  Picture: string;
  Location: string;
  Coordinate: string;
  'Google Maps Rating': number;
  'Google Reviews (Count)': number;
  Source: string;
  Description: string;
  'Tourism/Visitor Fee (approx in USD)': string;
}
export interface Review {
  review: string;
  rating: number;
}
export interface Hotel {
  Name: string;
  Picture: string;
  Category: string;
  Rating: number;
  Address: string;
  Contact: string;
  Price: string;
  Amenities: string;
}
export interface DetailPageData {
  destination: Destination;
  reviews: Review[];
  hotels: Hotel[];
}

// ----- PROPS BARU DARI SERVER -----
interface ExploreClientProps {
  allDestinations: Destination[]; // List lengkap untuk Detail & Favorites
  filteredDestinations?: Destination[]; // List sudah difilter
  initialTopRecommendations?: Destination[];
  detailPageData?: DetailPageData | null; // Data untuk halaman detail
  showAllDestinations: boolean; // boolean dari server
  showDetailPage: boolean; // boolean dari server
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};
const cardVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};


export default function ExploreClient({
  allDestinations, // Ini SELALU ada
  filteredDestinations = [], // Default array kosong
  initialTopRecommendations = [], // Default array kosong
  detailPageData = null, // Default null
  showAllDestinations,
  showDetailPage,
}: ExploreClientProps) {
  
  // State 'destinations' menggunakan list LENGKAP (untuk logic favorites)
  const [destinations, setDestinations] = useState<Destination[]>(allDestinations);
  const [favorites, setFavorites] = useState<Destination[]>([]);
  const [topRecommendations, setTopRecommendations] = useState<Destination[]>(initialTopRecommendations);

  const router = useRouter();
  const searchParams = useSearchParams();
  
  const urlQuery = searchParams.get('q') || '';
  const placeQuery = searchParams.get('place') || ''; // Dapatkan place dari URL

  // State ini hanya untuk UI filter
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedCrowdness, setSelectedCrowdness] = useState<string>('');
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [searchInputValue, setSearchInputValue] = useState<string>(urlQuery);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  useEffect(() => {
    // sinkronkan filter & search dari URL
    setSelectedExperience(searchParams.get('experience') || '');
    setSelectedActivity(searchParams.get('activity') || '');
    setSelectedCrowdness(searchParams.get('crowdness') || '');
    setShowFilter(searchParams.get('filterOpen') === 'true');
    setSearchInputValue(searchParams.get('q') || '');
  }, [searchParams]);

  // useEffect untuk favorites (localStorage) TETAP di sini
  useEffect(() => {
    const updateFavorites = () => {
      const stored = localStorage.getItem('myList');
      if (stored) {
        try {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            const favs = destinations.filter((d) => list.includes(d.Place));
            setFavorites(favs);
          } else { setFavorites([]); }
        } catch { setFavorites([]); }
      } else { setFavorites([]); }
    };
    if (destinations.length > 0) {
      updateFavorites();
    }
    window.addEventListener('myListUpdated', updateFavorites);
    return () => window.removeEventListener('myListUpdated', updateFavorites);
  }, [destinations]);

  // ----- SEMUA FUNGSI HANDLER TETAP SAMA (Hanya mengubah URL) -----
  const updateFilterParams = useCallback(
    (experience: string, activity: string, crowdness: string, filterOpen: boolean, currentQuery: string) => {
      const params = new URLSearchParams();
      if (experience) params.set('experience', experience);
      if (activity) params.set('activity', activity);
      if (crowdness) params.set('crowdness', crowdness);
      if (filterOpen) params.set('filterOpen', 'true');
      params.set('show', 'all');
      if (currentQuery) params.set('q', currentQuery);
      router.push(`/explore?${params.toString()}`); 
    },
    [router]
  );
  
  const handleSearch = useCallback(
    (query: string) => {
      updateFilterParams(selectedExperience, selectedActivity, selectedCrowdness, showFilter, query);
    },
    [selectedExperience, selectedActivity, selectedCrowdness, showFilter, updateFilterParams]
  );
  const handleSearchInputChange = (value: string) => setSearchInputValue(value);
  const handleSearchSubmit = () => handleSearch(searchInputValue);
  const handleExperienceChange = useCallback((value: string) => setSelectedExperience(value),[]);
  const handleActivityChange = useCallback((value: string) => setSelectedActivity(value),[]);
  const handleCrowdnessChange = useCallback((value: string) => setSelectedCrowdness(value),[]);

  const handleApplyFilter = useCallback(() => {
    setShowFilter(false);
    updateFilterParams(selectedExperience, selectedActivity, selectedCrowdness, false, searchInputValue);
  }, [selectedExperience, selectedActivity, selectedCrowdness, searchInputValue, updateFilterParams]);

  const handleResetFilter = useCallback(() => {
    setSelectedExperience('');
    setSelectedActivity('');
    setSelectedCrowdness('');
    setShowFilter(false);
    updateFilterParams('', '', '', false, searchInputValue);
  }, [searchInputValue, updateFilterParams]);

  const handleToggleFilter = useCallback(() => setShowFilter(!showFilter), [showFilter]);
  const handleCardClick = useCallback((p: string) => router.push(`/explore?place=${encodeURIComponent(p)}`),[router]);
  // ----- AKHIR DARI FUNGSI HANDLER -----
  

  // ----- LOGIKA RENDER UTAMA -----
  
  // SCENARIO 1: Tampilkan Halaman Detail
  // Kita gunakan 'showDetailPage' dan 'detailPageData' dari server
  if (showDetailPage && detailPageData) {
    return (
      <DetailDestination
        // Kirim data yang sudah siap dari server
        destination={detailPageData.destination}
        reviews={detailPageData.reviews}
        hotels={detailPageData.hotels}
        
        // Kirim list lengkap untuk logic 'AddToList'
        allDestinationsForFavorites={allDestinations}
      />
    );
  }

  // SCENARIO 2: Tampilkan Halaman Explore (Default atau Terfilter)
  const shouldShowAllDestinations = showAllDestinations;

  return (
    <div className="min-h-screen bg-[#060c20] text-white overflow-x-hidden relative">
      <main className="flex-1 py-6 max-w-7xl mx-auto px-4 transition-all duration-500">
        <Header
          searchQuery={searchInputValue}
          onSearchChange={handleSearchInputChange}
          onSearchSubmit={handleSearchSubmit}
          selectedExperience={selectedExperience}
          selectedActivity={selectedActivity}
          selectedCrowdness={selectedCrowdness}
          setSelectedExperience={handleExperienceChange}
          setSelectedActivity={handleActivityChange}
          setSelectedCrowdness={handleCrowdnessChange}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
          showFilter={showFilter}
          onToggleFilter={handleToggleFilter}
        />

        {isClient ? (
          shouldShowAllDestinations ? (
            <motion.div key="all-destinations-view" variants={containerVariants} initial="hidden" animate="visible">
              <motion.h2 variants={itemVariants} className="text-2xl font-semibold text-center w-full mb-10 mt-32">
                {urlQuery || selectedExperience || selectedActivity || selectedCrowdness
                  ? 'Search/Filter Results'
                  : 'All Destinations in Bali'}
              </motion.h2>
              {/* Kirim data yang SUDAH DIFILTER dari server */}
              <AllDestinations destinations={filteredDestinations} />
            </motion.div>
          ) : (
            <motion.div key="default-explore-view" variants={containerVariants} initial="hidden" animate="visible">
              {/* ... (JSX untuk 'Favorite Destination' tetap sama) ... */}
              <div className="mt-32 mb-6 transition-all duration-500">
                <motion.h2 variants={itemVariants} className="text-2xl font-semibold mb-4">
                  Favorite Destination
                </motion.h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {favorites.length > 0 ? (
                    favorites.map((dest) => <DestinationCard key={dest.Place} dest={dest} onClick={handleCardClick} />)
                  ) : (
                    <motion.div variants={itemVariants} className="col-span-4 text-center text-white transition-all duration-500">
                      <p className="text-xl">Oops! Your favorite destinations are empty.</p>
                      <p className="text-gray-400 mt-2">Start exploring and add your favorite destinations to this list!</p>
                      <p className="mt-4 text-blue-300 font-bold">Get started now!</p>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* ... (JSX untuk 'Top Recommendations' tetap sama) ... */}
              {topRecommendations.length > 0 && (
                <div className="mt-10 mb-6 transition-all duration-500">
                  <div className="flex justify-between items-center mb-4">
                    <motion.h2 variants={itemVariants} className="text-2xl font-semibold">
                      Top Recommendations
                    </motion.h2>
                    <motion.button variants={itemVariants} onClick={() => router.push('/explore?show=all')} className="text-blue-300 hover:underline">
                      Show All →
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {topRecommendations.map((dest) => (
                      <DestinationCard key={dest.Place} dest={dest} onClick={handleCardClick} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )
        ) : (
          <div className="mt-32 text-center text-gray-400">Loading content...</div>
        )}
      </main>

      <Itinerary place={placeQuery || urlQuery || 'your destination'} />
      <Footer />
    </div>
  );
}

// DestinationCard tetap sama
function DestinationCard({ dest, onClick }: { dest: Destination; onClick: (place: string) => void }) {
  // ... (JSX untuk DestinationCard) ...
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onClick={() => onClick(dest.Place)}
      className="cursor-pointer relative h-[250px] rounded-3xl overflow-hidden shadow-xl"
    >
      <motion.div transition={{ duration: 0.3 }} style={{ scale: 1.0 }} whileHover={{ scale: 1.1 }}>
        <div className="relative w-full h-[250px]">
          <Image
            src={dest.Picture.replace('./public', '')} 
            alt={dest.Place}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-5 left-5 text-white z-10">
        <p className="text-xl font-bold drop-shadow">{dest.Place}</p>
        <p className="text-sm text-gray-200">{dest.Location}</p>
      </div>
    </motion.div>
  );
}