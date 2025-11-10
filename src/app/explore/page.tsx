import React, { Suspense } from 'react';
import fs from 'fs/promises';
import path from 'path';

// Kita akan impor Tipe-nya dari file Klien
import ExploreClient from '@/components/Explore/ExploreClient';
// Error Impor akan hilang setelah Langkah 1
import type { Destination, Review, Hotel, DetailPageData } from '@/components/Explore/ExploreClient';

export const dynamic = 'force-dynamic';

// Interface untuk data internal
interface DestinationReview {
  place: string;
  reviews: Review[];
}

// Tipe data untuk props halaman Explore (internal)
interface ExplorePageData {
  allDestinations: Destination[]; // List lengkap untuk favorites
  filteredDestinations: Destination[]; // List sudah difilter
  initialTopRecommendations: Destination[];
}

// ----- FUNGSI FILTER (Berjalan di Server) -----
function applyFilters(
  allDestinations: Destination[],
  searchParams: { [key: string]: string | undefined }
): Destination[] {
  
  const { q, experience, activity, crowdness } = searchParams;
  let currentFilteredData = [...allDestinations]; 

  // 1. Filter berdasarkan Kategori Experience
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

  // 2. Filter berdasarkan Kategori Activity
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

  // 3. Filter berdasarkan Crowdness
  if (crowdness) {
    currentFilteredData = currentFilteredData.filter(destination => {
      const googleReviewsCount = destination["Google Reviews (Count)"];
      if (crowdness === 'Popular & Crowded') return googleReviewsCount > 10000;
      if (crowdness === 'Quiet & Less Touristy') return googleReviewsCount <= 5000;
      if (crowdness === "Doesn't Matter") return true;
      return false;
    });
  }
  
  // 4. Filter berdasarkan Search Query (q)
  if (q) {
    currentFilteredData = currentFilteredData.filter((destination) =>
      destination.Place.toLowerCase().includes(q.toLowerCase())
    );
  }

  return currentFilteredData;
}


// ----- FUNGSI: Mengambil data Halaman Detail di Server -----
async function getDetailPageData(placeName: string): Promise<DetailPageData | null> {
  try {
    const destPath = path.join(process.cwd(), 'public/dataset/destinationBali.json');
    const reviewPath = path.join(process.cwd(), 'public/dataset/destinationReview.json');
    const hotelPath = path.join(process.cwd(), 'public/dataset/hotelsBali.json');

    const [destFile, reviewFile, hotelFile] = await Promise.all([
      fs.readFile(destPath, 'utf-8'),
      fs.readFile(reviewPath, 'utf-8'),
      fs.readFile(hotelPath, 'utf-8'),
    ]);

    const allDestinations: Destination[] = JSON.parse(destFile);
    const allReviews: DestinationReview[] = JSON.parse(reviewFile);
    const allHotels: Hotel[] = JSON.parse(hotelFile);

    const destination = allDestinations.find((d) => d.Place === placeName);
    if (!destination) return null;

    const matchedReviews = allReviews.find((r) => r.place === placeName);
    const reviews = matchedReviews ? matchedReviews.reviews : [];

    const destinationLocationKeywords = destination.Location.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    let nearbyHotels = allHotels.filter(hotel => {
      if (!hotel.Address) return false;
      const hotelAddressLower = hotel.Address.toLowerCase();
      return destinationLocationKeywords.some(keyword => hotelAddressLower.includes(keyword));
    });
    
    if (nearbyHotels.length === 0) {
      nearbyHotels = allHotels.sort((a, b) => (b.Rating || 0) - (a.Rating || 0)).slice(0, 8);
    } else {
      nearbyHotels = nearbyHotels.slice(0, 8);
    }
    
    // ----- PERBAIKAN ERROR 1 (Screenshot 1) -----
    // Variabelnya 'nearbyHotels', jadi kita return 'hotels: nearbyHotels'
    return {
      destination,
      reviews,
      hotels: nearbyHotels, // <--- INI PERBAIKANNYA
    };

  } catch (err) {
    console.error(`Failed to load detail data for ${placeName}:`, err);
    return null;
  }
}

// ----- FUNGSI: Mengambil data Halaman Explore di Server -----
async function getExplorePageData(searchParams: { [key: string]: string | undefined }): Promise<ExplorePageData> {
  try {
    const destPath = path.join(process.cwd(), 'public/dataset/destinationBali.json');
    const reviewPath = path.join(process.cwd(), 'public/dataset/destinationReview.json');

    const [destFile, reviewFile] = await Promise.all([
      fs.readFile(destPath, 'utf-8'),
      fs.readFile(reviewPath, 'utf-8'),
    ]);

    const allDestinations: Destination[] = JSON.parse(destFile);
    const reviewData: DestinationReview[] = JSON.parse(reviewFile);

    const placeRatings: { [key: string]: { total: number; count: number } } = {};
    reviewData.forEach((dr) => {
      if (dr.reviews && dr.reviews.length > 0) {
        const totalRating = dr.reviews.reduce((sum, r) => sum + r.rating, 0);
        placeRatings[dr.place] = { total: totalRating, count: dr.reviews.length };
      }
    });
    const sorted = [...allDestinations].sort((a, b) => {
      const ratingA = placeRatings[a.Place] ? placeRatings[a.Place].total / placeRatings[a.Place].count : 0;
      const ratingB = placeRatings[b.Place] ? placeRatings[b.Place].total / placeRatings[b.Place].count : 0;
      return ratingB - ratingA;
    });
    const topRecommendations = sorted.slice(0, 8);
    
    const filteredDestinations = applyFilters(allDestinations, searchParams);

    return {
      allDestinations,
      filteredDestinations,
      initialTopRecommendations: topRecommendations,
    };

  } catch (err) {
    console.error('Failed to load explore data from server:', err);
    return { allDestinations: [], filteredDestinations: [], initialTopRecommendations: [] };
  }
}


// ----- KOMPONEN Halaman (Page) -----
export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  
  const placeName = searchParams.place;
  const hasFilters = searchParams.q || searchParams.experience || searchParams.activity || searchParams.crowdness;

  let detailPageData: DetailPageData | null = null;
  let explorePageData: ExplorePageData | null = null;
  let allDestinationsForFavorites: Destination[] = []; 

  try {
    if (placeName) {
      detailPageData = await getDetailPageData(placeName);
      const destPath = path.join(process.cwd(), 'public/dataset/destinationBali.json');
      const destFile = await fs.readFile(destPath, 'utf-8');
      allDestinationsForFavorites = JSON.parse(destFile);
    } 
    else {
      explorePageData = await getExplorePageData(searchParams);
      allDestinationsForFavorites = explorePageData.allDestinations;
    }
  } catch (error) {
    console.error("Error reading data files in Page component:", error);
    allDestinationsForFavorites = [];
    explorePageData = { allDestinations: [], filteredDestinations: [], initialTopRecommendations: [] };
    detailPageData = null;
  }

  // ----- PERBAIKAN ERROR 2 (Screenshot 2) -----
  // Typo 'Suspdensa' diubah menjadi 'Suspense'
  return (
    <Suspense fallback={<div className="mt-32 text-center text-gray-400">Loading content...</div>}>
      <ExploreClient
        allDestinations={allDestinationsForFavorites} 
        filteredDestinations={explorePageData?.filteredDestinations} 
        initialTopRecommendations={explorePageData?.initialTopRecommendations}
        detailPageData={detailPageData}
        showAllDestinations={searchParams.show === 'all' || !!hasFilters}
        showDetailPage={!!placeName && !!detailPageData}
      />
    </Suspense> // <--- INI PERBAIKANNYA
  );
}