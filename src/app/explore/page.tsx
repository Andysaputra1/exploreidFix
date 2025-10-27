'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Navbar/Navbar';
import DetailDestination from '@/components/Explore/DetailDestination';
import AllDestinations from '@/components/Explore/AllDestinations';
import Itinerary from '@/components/Explore/Itinerary';
import Footer from '@/components/Footer/Footer';
import { motion, AnimatePresence } from 'framer-motion';

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

interface Review {
  review: string;
  rating: number;
}

interface DestinationReview {
  place: string;
  reviews: Review[];
}

const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};

// Varian untuk staggering anak-anak
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Jeda 0.1 detik antara animasi anak
    },
  },
};

// Varian untuk setiap item teks
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const Explore: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [favorites, setFavorites] = useState<Destination[]>([]);
  const [topRecommendations, setTopRecommendations] = useState<Destination[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const place = searchParams.get('place');
  const showAll = searchParams.get('show');
  const urlQuery = searchParams.get('q') || '';

  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedCrowdness, setSelectedCrowdness] = useState<string>('');
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    document.documentElement.style.scrollBehavior = 'smooth';

    const fetchAllData = async () => {
      try {
        const [destRes, reviewRes] = await Promise.all([
          fetch('/dataset/destinationBali.json'),
          fetch('/dataset/destinationReview.json')
        ]);

        if (!destRes.ok) throw new Error(`HTTP error! status: ${destRes.status}`);
        if (!reviewRes.ok) throw new Error(`HTTP error! status: ${reviewRes.status}`);
        
        const destData: Destination[] = await destRes.json();
        const reviewData: DestinationReview[] = await reviewRes.json();

        setDestinations(destData);

        const placeRatings: { [key: string]: { total: number; count: number } } = {};
        reviewData.forEach(dr => {
          if (dr.reviews && dr.reviews.length > 0) {
            const totalRating = dr.reviews.reduce((sum, r) => sum + r.rating, 0);
            placeRatings[dr.place] = {
              total: totalRating,
              count: dr.reviews.length
            };
          }
        });

        const sortedRecommendations = [...destData].sort((a, b) => {
          const ratingA = placeRatings[a.Place] ? placeRatings[a.Place].total / placeRatings[a.Place].count : 0;
          const ratingB = placeRatings[b.Place] ? placeRatings[b.Place].total / placeRatings[b.Place].count : 0;
          return ratingB - ratingA;
        });

        setTopRecommendations(sortedRecommendations.slice(0, 8));

      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    fetchAllData();

    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  useEffect(() => {
    if (isClient) {
      setSelectedExperience(searchParams.get('experience') || '');
      setSelectedActivity(searchParams.get('activity') || '');
      setSelectedCrowdness(searchParams.get('crowdness') || '');
      setShowFilter(searchParams.get('filterOpen') === 'true');
    }
  }, [searchParams, isClient]);

  useEffect(() => {
    const updateFavorites = () => {
      const storedFavorites = localStorage.getItem('myList');
      if (storedFavorites) {
        try {
          const list = JSON.parse(storedFavorites);
          if (Array.isArray(list)) {
            const favs = destinations.filter((dest) => list.includes(dest.Place));
            setFavorites(favs);
          } else {
            console.warn("localStorage 'myList' is not an array, resetting favorites.");
            setFavorites([]);
          }
        } catch (e) {
          console.error("Failed to parse 'myList' from localStorage:", e);
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    };

    updateFavorites();
    window.addEventListener('myListUpdated', updateFavorites);
    return () => {
      window.removeEventListener('myListUpdated', updateFavorites);
    };
  }, [destinations]);

  const updateFilterParams = useCallback((experience: string, activity: string, crowdness: string, filterOpen: boolean, currentQuery: string) => {
    const params = new URLSearchParams();
    if (experience) params.set('experience', experience);
    if (activity) params.set('activity', activity);
    if (crowdness) params.set('crowdness', crowdness);
    if (filterOpen) params.set('filterOpen', 'true');
    params.set('show', 'all');
    if (currentQuery) params.set('q', currentQuery);

    router.push(`/explore?${params.toString()}`);
  }, [router]);

  const handleSearch = useCallback((searchQuery: string) => {
    updateFilterParams(selectedExperience, selectedActivity, selectedCrowdness, showFilter, searchQuery);
  }, [selectedExperience, selectedActivity, selectedCrowdness, showFilter, updateFilterParams]);

  const handleExperienceChange = useCallback((value: string) => {
    setSelectedExperience(value);
    updateFilterParams(value, selectedActivity, selectedCrowdness, showFilter, urlQuery);
  }, [selectedActivity, selectedCrowdness, showFilter, urlQuery, updateFilterParams]);

  const handleActivityChange = useCallback((value: string) => {
    setSelectedActivity(value);
    updateFilterParams(selectedExperience, value, selectedCrowdness, showFilter, urlQuery);
  }, [selectedExperience, selectedCrowdness, showFilter, urlQuery, updateFilterParams]);

  const handleCrowdnessChange = useCallback((value: string) => {
    setSelectedCrowdness(value);
    updateFilterParams(selectedExperience, selectedActivity, value, showFilter, urlQuery);
  }, [selectedExperience, selectedActivity, showFilter, urlQuery, updateFilterParams]);

  const handleApplyFilter = useCallback(() => {
    setShowFilter(false);
    updateFilterParams(selectedExperience, selectedActivity, selectedCrowdness, false, urlQuery);
  }, [selectedExperience, selectedActivity, selectedCrowdness, urlQuery, updateFilterParams]);

  const handleResetFilter = useCallback(() => {
    setSelectedExperience('');
    setSelectedActivity('');
    setSelectedCrowdness('');
    setShowFilter(false);
    updateFilterParams('', '', '', false, urlQuery);
  }, [urlQuery, updateFilterParams]);

  const handleToggleFilter = useCallback(() => {
    setShowFilter(!showFilter);
    updateFilterParams(selectedExperience, selectedActivity, selectedCrowdness, !showFilter, urlQuery);
  }, [selectedExperience, selectedActivity, selectedCrowdness, showFilter, urlQuery, updateFilterParams]);

  const handleCardClick = useCallback((place: string) => {
    router.push(`/explore?place=${encodeURIComponent(place)}`);
  }, [router]);

  if (place && destinations.length > 0) {
    return <DetailDestination place={place} destinations={destinations} />;
  }

  const shouldShowAllDestinations = showAll === 'all' || urlQuery || selectedExperience || selectedActivity || selectedCrowdness;

  return (
    <div
      className="min-h-screen bg-[#060c20] text-white overflow-x-hidden relative"
    >
      <main className="flex-1 py-6 max-w-7xl mx-auto px-4 transition-all duration-500">
        <Header
          searchQuery={urlQuery}
          onSearchChange={handleSearch}
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
            <motion.div
              key="all-destinations-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-semibold text-center w-full mb-10 mt-32">
                {urlQuery || selectedExperience || selectedActivity || selectedCrowdness ? `Search/Filter Results` : 'All Destinations in Bali'}
              </motion.h2>
              <AllDestinations
                initialQuery={urlQuery}
                selectedExperience={selectedExperience}
                selectedActivity={selectedActivity}
                selectedCrowdness={selectedCrowdness}
              />
            </motion.div>
          ) : (
            <motion.div
              key="default-explore-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="mt-32 mb-6 transition-all duration-500">
                <motion.h2 variants={itemVariants} className="text-2xl font-semibold mb-4">Favorite Destination</motion.h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {favorites.length > 0 ? (
                    favorites.map((dest) => (
                      <DestinationCard key={dest.Place} dest={dest} onClick={handleCardClick} />
                    ))
                  ) : (
                    <motion.div variants={itemVariants} className="col-span-4 text-center text-white transition-all duration-500">
                      <p className="text-xl">Oops! Your favorite destinations are empty.</p>
                      <p className="text-gray-400 mt-2">
                        Start exploring and add your favorite destinations to this list!
                      </p>
                      <p className="mt-4 text-blue-300 font-bold">Get started now!</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {topRecommendations.length > 0 && (
                <div className="mt-10 mb-6 transition-all duration-500">
                  <div className="flex justify-between items-center mb-4">
                    <motion.h2 variants={itemVariants} className="text-2xl font-semibold">Top Recommendations</motion.h2>
                    <motion.button
                      variants={itemVariants}
                      onClick={() => router.push('/explore?show=all')}
                      className="text-blue-300 hover:underline"
                    >
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

      <Itinerary place={place || urlQuery || 'your destination'} />
      <Footer />
    </div>
  );
};

const cardVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } }
};

const DestinationCard: React.FC<{ dest: Destination; onClick: (place: string) => void }> = ({
  dest,
  onClick,
}) => (
  <motion.div
    variants={cardVariants}
    initial="initial"
    animate="animate"
    whileHover="hover"
    onClick={() => onClick(dest.Place)}
    className="cursor-pointer relative h-[250px] rounded-3xl overflow-hidden shadow-xl"
  >
    <motion.img
      src={dest.Picture.replace('./public', '')}
      alt={dest.Place}
      className="w-full h-full object-cover"
      transition={{ duration: 0.3 }}
      style={{ scale: 1.0 }}
      whileHover={{ scale: 1.1 }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    <div className="absolute bottom-5 left-5 text-white z-10">
      <p className="text-xl font-bold drop-shadow">{dest.Place}</p>
      <p className="text-sm text-gray-200">{dest.Location}</p>
    </div>
  </motion.div>
);

export default Explore;