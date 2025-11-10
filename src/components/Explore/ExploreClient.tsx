'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Navbar/Navbar';
import DetailDestination from '@/components/Explore/DetailDestination';
import AllDestinations from '@/components/Explore/AllDestinations';
import Itinerary from '@/components/Explore/Itinerary';
import Footer from '@/components/Footer/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';

// ----- SEMUA INTERFACE (PASTIKAN ADA 'export') -----
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

// ----- PROPS BARU DARI SERVER (LEBIH SEDERHANA) -----
interface ExploreClientProps {
  allDestinations: Destination[]; // List lengkap
  initialTopRecommendations?: Destination[];
  detailPageData?: DetailPageData | null; 
  showDetailPage: boolean; 
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
// ... (sisa variants Anda) ...
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};
const cardVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

// ----- FUNGSI FILTER (PINDAH DARI SERVER KE SINI) -----
function applyFilters(
  allDestinations: Destination[],
  query: string,
  experience: string,
  activity: string,
  crowdness: string
): Destination[] {
  let currentFilteredData = [...allDestinations]; 

  if (experience) {
    currentFilteredData = currentFilteredData.filter(destination => {
      const description = destination.Description.toLowerCase();
      if (experience === 'Nature' && (description.includes('nature') || description.includes('mountain') || description.includes('rice fields') || description.includes('valley') || description.includes('waterfall') || description.includes('garden') || description.includes('forest') || description.includes('park'))) return true;
      if (experience === 'Beach' && (description.includes('beach') || description.includes('coast'))) return true;
      if (experience === 'Cultural & Temple Visits' && (description.includes('temple') || description.includes('cultural') || description.includes('hindu'))) return true;
      if (experience === 'Adventure' && (description.includes('volcano') || description.includes('trek') || description.includes('swing') || description.includes('rafting') || description.includes('safari') || description.includes('water park') || description.includes('zoo'))) return true;
      if (experience === 'Wildlife' && (description.includes('monkey') || description.includes('zoo') || description.includes('bird') || description.includes('reptile') || description.includes('animal'))) return true;
      if (experience === 'Relaxation & Scenic Views' && (description.includes('scenic') || description.includes('gardens') || description.includes('ridge walk') || description.includes('retreat') || description.includes('hot spring'))) return true;
      if (experience === 'Historical Sites' && (description.includes('ancient') || description.includes('historical') || description.includes('monument') || description.includes('palace') || description.includes('sanctuary'))) return true;
      return false;
    });
  }
  if (activity) {
    currentFilteredData = currentFilteredData.filter(destination => {
      const description = destination.Description.toLowerCase();
      const place = destination.Place.toLowerCase();
      if (activity === 'Sightseeing' && (description.includes('tourist') || description.includes('icon') || description.includes('destination') || description.includes('cultural park') || description.includes('landmark') || description.includes('village') || description.includes('scenic'))) return true;
      if (activity === 'Hiking & Trekking' && (description.includes('trek') || description.includes('hiking') || place.includes('mount'))) return true;
      if (activity === 'Swimming & Snorkeling' && (description.includes('bathing') || description.includes('swimming') || description.includes('water park') || place.includes('beach') || place.includes('waterboom'))) return true;
      if (activity === 'Photography' && (description.includes('photography') || description.includes('scenic') || description.includes('views') || description.includes('gardens'))) return true;
      if (activity === 'Spiritual & Religious' && (description.includes('temple') || description.includes('hindu') || description.includes('pilgrimage') || description.includes('spiritual') || description.includes('holy spring'))) return true;
      if (activity === 'Shopping & Local Markets' && (description.includes('market') || description.includes('souvenirs') || description.includes('handicrafts') || description.includes('produce'))) return true;
      return false;
    });
  }
  if (crowdness) {
    currentFilteredData = currentFilteredData.filter(destination => {
      const googleReviewsCount = destination["Google Reviews (Count)"];
      if (crowdness === 'Popular & Crowded') return googleReviewsCount > 10000;
      if (crowdness === 'Quiet & Less Touristy') return googleReviewsCount <= 5000;
      if (crowdness === "Doesn't Matter") return true;
      return false;
    });
  }
  if (query) {
    const q = query.toLowerCase();
    currentFilteredData = currentFilteredData.filter((destination) =>
      destination.Place.toLowerCase().includes(q)
    );
  }
  return currentFilteredData;
}


export default function ExploreClient({
  allDestinations,
  initialTopRecommendations = [],
  detailPageData = null,
  showDetailPage,
}: ExploreClientProps) {
  
  // State untuk list LENGKAP (dari props)
  const [destinations, setDestinations] = useState<Destination[]>(allDestinations);
  const [favorites, setFavorites] = useState<Destination[]>([]);
  const [topRecommendations, setTopRecommendations] = useState<Destination[]>(initialTopRecommendations);

  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ----- STATE BARU UNTUK FILTERING -----
  // State untuk filter UI (diisi dari URL)
  const [searchInputValue, setSearchInputValue] = useState<string>(searchParams.get('q') || '');
  const [selectedExperience, setSelectedExperience] = useState<string>(searchParams.get('experience') || '');
  const [selectedActivity, setSelectedActivity] = useState<string>(searchParams.get('activity') || '');
  const [selectedCrowdness, setSelectedCrowdness] = useState<string>(searchParams.get('crowdness') || '');
  
  // State untuk list yang SUDAH DIFILTER
  // Kita gunakan 'useMemo' agar filter hanya jalan saat dependency berubah
  const filteredDestinations = useMemo(() => {
    return applyFilters(
      destinations, 
      searchInputValue, 
      selectedExperience, 
      selectedActivity, 
      selectedCrowdness
    );
  }, [destinations, searchInputValue, selectedExperience, selectedActivity, selectedCrowdness]);
  // ------------------------------------

  const [showFilter, setShowFilter] = useState<boolean>(searchParams.get('filterOpen') === 'true');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Hapus useEffect [searchParams] yang lama

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
    if (destinations.length > 0) { updateFavorites(); }
    window.addEventListener('myListUpdated', updateFavorites);
    return () => window.removeEventListener('myListUpdated', updateFavorites);
  }, [destinations]);


  // ----- FUNGSI HANDLER DISESUAIKAN UNTUK 'LIVE' SEARCH -----
  
  // Fungsi ini sekarang HANYA mengupdate URL, tanpa reload halaman
  const updateUrlParams = (params: URLSearchParams) => {
    router.replace(`/explore?${params.toString()}`, { scroll: false });
  };

  // Ini adalah 'LIVE' search. Langsung update state.
  const handleSearchInputChange = (value: string) => {
    setSearchInputValue(value);
    // Update URL juga
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('q', value);
    else params.delete('q');
    updateUrlParams(params);
  };
  
  // Submit sekarang tidak me-reload, hanya menutup search bar HP
  const handleSearchSubmit = () => {
    // Logic untuk menutup search bar HP ada di Navbar.tsx
    // Kita tidak perlu melakukan apa-apa di sini
  };

  // Fungsi filter sekarang HANYA update state
  const handleExperienceChange = useCallback((value: string) => {
    setSelectedExperience(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('experience', value);
    else params.delete('experience');
    updateUrlParams(params);
  }, [searchParams, router]);

  const handleActivityChange = useCallback((value: string) => {
    setSelectedActivity(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('activity', value);
    else params.delete('activity');
    updateUrlParams(params);
  }, [searchParams, router]);

  const handleCrowdnessChange = useCallback((value: string) => {
    setSelectedCrowdness(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('crowdness', value);
    else params.delete('crowdness');
    updateUrlParams(params);
  }, [searchParams, router]);

  // Apply/Reset hanya menutup modal (state sudah live)
  const handleApplyFilter = useCallback(() => {
    setShowFilter(false);
  }, []);

  const handleResetFilter = useCallback(() => {
    setSelectedExperience('');
    setSelectedActivity('');
    setSelectedCrowdness('');
    setShowFilter(false);
    // Hapus juga dari URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('experience');
    params.delete('activity');
    params.delete('crowdness');
    updateUrlParams(params);
  }, [searchParams, router]);

  const handleToggleFilter = useCallback(() => setShowFilter(!showFilter), [showFilter]);
  const handleCardClick = useCallback((p: string) => router.push(`/explore?place=${encodeURIComponent(p)}`),[router]);
  // ----------------------------------------------------


  // SCENARIO 1: Tampilkan Halaman Detail
  if (showDetailPage && detailPageData) {
    return (
      <DetailDestination
        destination={detailPageData.destination}
        reviews={detailPageData.reviews}
        hotels={detailPageData.hotels}
        allDestinationsForFavorites={allDestinations}
      />
    );
  }

  // SCENARIO 2: Tampilkan Halaman Explore
  // Cek apakah ada filter aktif atau search query
  const hasFilters = !!(searchInputValue || selectedExperience || selectedActivity || selectedCrowdness);
  // Cek apakah 'show=all' ada di URL
  const showAllQuery = searchParams.get('show') === 'all';
  
  const shouldShowAllDestinations = showAllQuery || hasFilters;

  return (
    <div className="min-h-screen bg-[#060c20] text-white overflow-x-hidden relative">
      <main className="flex-1 py-6 max-w-7xl mx-auto px-4 transition-all duration-500">
        <Header
          searchQuery={searchInputValue}
          onSearchChange={handleSearchInputChange} // Ini sekarang LIVE
          onSearchSubmit={handleSearchSubmit} // Ini hanya untuk UI
          
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
                {hasFilters ? 'Search/Filter Results' : 'All Destinations in Bali'}
              </motion.h2>
              
              {/* Kirim list yang SUDAH DIFILTER oleh 'useMemo' */}
              <AllDestinations destinations={filteredDestinations} />
              
            </motion.div>
          ) : (
            <motion.div key="default-explore-view" variants={containerVariants} initial="hidden" animate="visible">
              {/* Tampilan default (Favorites & Top Recs) */}
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

      <Itinerary place={detailPageData?.destination.Place || searchInputValue || 'your destination'} />
      <Footer />
    </div>
  );
}

// DestinationCard tetap sama
function DestinationCard({ dest, onClick }: { dest: Destination; onClick: (place: string) => void }) {
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