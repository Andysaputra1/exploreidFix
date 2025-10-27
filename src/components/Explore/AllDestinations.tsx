'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// SidebarFilter tidak lagi diimpor di sini
// Header juga tidak perlu diimpor di sini karena page.tsx sudah menanganinya

export interface Destination {
  Place: string;
  Picture: string;
  Location: string;
  'Google Maps Rating': number;
  'Google Reviews (Count)': number;
  Source: string;
  Description: string;
  'Tourism/Visitor Fee (approx in USD)': string;
}

interface AllDestinationsProps {
  initialQuery?: string;
  selectedExperience: string;
  selectedActivity: string;
  selectedCrowdness: string;
}

const AllDestinations: React.FC<AllDestinationsProps> = ({
  initialQuery = '',
  selectedExperience,
  selectedActivity,
  selectedCrowdness,
}) => {
  const router = useRouter();
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [filteredAndSearchedDestinations, setFilteredAndSearchedDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dataset/destinationBali.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Destination[] = await response.json();
        setAllDestinations(data);
      } catch (error) {
        console.error("Failed to fetch destination data:", error);
        setAllDestinations([]);
      }
    };
    fetchData();
  }, []);

  const applyFiltersAndSearch = useCallback(() => {
    let currentFilteredData = allDestinations;

    if (selectedExperience) {
      currentFilteredData = currentFilteredData.filter(destination => {
        const description = destination.Description.toLowerCase();
        if (selectedExperience === 'Nature' && (description.includes('nature') || description.includes('mountain') || description.includes('rice fields') || description.includes('valley') || description.includes('waterfall') || description.includes('garden') || description.includes('forest') || description.includes('park'))) {
          return true;
        }
        if (selectedExperience === 'Beach' && (description.includes('beach') || description.includes('coast'))) {
          return true;
        }
        if (selectedExperience === 'Cultural & Temple Visits' && (description.includes('temple') || description.includes('cultural') || description.includes('hindu'))) {
          return true;
        }
        if (selectedExperience === 'Adventure' && (description.includes('volcano') || description.includes('trek') || description.includes('swing') || description.includes('rafting') || description.includes('safari') || description.includes('water park') || description.includes('zoo'))) {
          return true;
        }
        if (selectedExperience === 'Wildlife' && (description.includes('monkey') || description.includes('zoo') || description.includes('bird') || description.includes('reptile') || description.includes('animal'))) {
          return true;
        }
        if (selectedExperience === 'Relaxation & Scenic Views' && (description.includes('scenic') || description.includes('gardens') || description.includes('ridge walk') || description.includes('retreat') || description.includes('hot spring'))) {
          return true;
        }
        if (selectedExperience === 'Historical Sites' && (description.includes('ancient') || description.includes('historical') || description.includes('monument') || description.includes('palace') || description.includes('sanctuary'))) {
          return true;
        }
        return false;
      });
    }

    if (selectedActivity) {
      currentFilteredData = currentFilteredData.filter(destination => {
        const description = destination.Description.toLowerCase();
        const place = destination.Place.toLowerCase();
        if (selectedActivity === 'Sightseeing' && (description.includes('tourist') || description.includes('icon') || description.includes('destination') || description.includes('cultural park') || description.includes('landmark') || description.includes('village') || description.includes('scenic'))) {
          return true;
        }
        if (selectedActivity === 'Hiking & Trekking' && (description.includes('trek') || description.includes('hiking') || place.includes('mount'))) {
          return true;
        }
        if (selectedActivity === 'Swimming & Snorkeling' && (description.includes('bathing') || description.includes('swimming') || description.includes('water park') || place.includes('beach') || place.includes('waterboom'))) {
          return true;
        }
        if (selectedActivity === 'Photography' && (description.includes('photography') || description.includes('scenic') || description.includes('views') || description.includes('gardens'))) {
          return true;
        }
        if (selectedActivity === 'Spiritual & Religious' && (description.includes('temple') || description.includes('hindu') || description.includes('pilgrimage') || description.includes('spiritual') || description.includes('holy spring'))) {
          return true;
        }
        if (selectedActivity === 'Shopping & Local Markets' && (description.includes('market') || description.includes('souvenirs') || description.includes('handicrafts') || description.includes('produce'))) {
          return true;
        }
        return false;
      });
    }

    if (selectedCrowdness) {
      currentFilteredData = currentFilteredData.filter(destination => {
        const googleReviewsCount = destination["Google Reviews (Count)"];
        if (selectedCrowdness === 'Popular & Crowded') {
          return googleReviewsCount > 10000;
        }
        if (selectedCrowdness === 'Quiet & Less Touristy') {
          return googleReviewsCount <= 5000;
        }
        if (selectedCrowdness === "Doesn't Matter") {
          return true;
        }
        return false;
      });
    }

    if (initialQuery) {
      currentFilteredData = currentFilteredData.filter((destination) =>
        destination.Place.toLowerCase().includes(initialQuery.toLowerCase())
      );
    }

    setFilteredAndSearchedDestinations(currentFilteredData);
  }, [allDestinations, selectedExperience, selectedActivity, selectedCrowdness, initialQuery]);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [selectedExperience, selectedActivity, selectedCrowdness, initialQuery, allDestinations, applyFiltersAndSearch]);

  const handleCardClick = (place: string) => {
    router.push(`/explore?place=${encodeURIComponent(place)}`);
  };

  return (
    <div className="min-h-screen bg-[#060c20] text-white overflow-x-hidden max-w-7xl mx-auto">

      <div className="flex justify-between items-center px-2 md:px-0 mt-15 mb-10"></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-0">
        {filteredAndSearchedDestinations.length > 0 ? (
          filteredAndSearchedDestinations.map((item) => (
            <div
              key={item.Place}
              onClick={() => handleCardClick(item.Place)}
              className="cursor-pointer relative h-[250px] rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-500"
            >
              <img
                src={item.Picture.replace('./public', '')}
                alt={item.Place}
                className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-white z-10">
                <p className="text-xl font-bold drop-shadow">{item.Place}</p>
                <p className="text-sm text-gray-200">{item.Location}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 text-lg">No destinations found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default AllDestinations;