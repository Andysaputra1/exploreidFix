import React, { Suspense } from 'react';
import fs from 'fs/promises';
import path from 'path';

import ExploreClient from '@/components/Explore/ExploreClient';
import ExploreSkeleton from '@/components/Explore/ExploreSkeleton'; 
// Pastikan semua tipe data di-export dari ExploreClient
import type { Destination, Review, Hotel, DetailPageData } from '@/components/Explore/ExploreClient';

export const dynamic = 'force-dynamic';

// --- Interface (tetap sama) ---
interface DestinationReview {
  place: string;
  reviews: Review[];
}
interface ExplorePageData {
  allDestinations: Destination[]; 
  initialTopRecommendations: Destination[];
}

// ----- FUNGSI getDetailPageData (tetap sama) -----
// (Fungsi ini masih dibutuhkan untuk halaman detail)
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
    
    return {
      destination,
      reviews,
      hotels: nearbyHotels,
    };
  } catch (err) {
    console.error(`Failed to load detail data for ${placeName}:`, err);
    return null;
  }
}

// ----- FUNGSI getExplorePageData (Disederhanakan) -----
// Tugasnya sekarang HANYA mengambil SEMUA data, BUKAN memfilter.
async function getExplorePageData(): Promise<ExplorePageData> {
  try {
    const destPath = path.join(process.cwd(), 'public/dataset/destinationBali.json');
    const reviewPath = path.join(process.cwd(), 'public/dataset/destinationReview.json');

    const [destFile, reviewFile] = await Promise.all([
      fs.readFile(destPath, 'utf-8'),
      fs.readFile(reviewPath, 'utf-8'),
    ]);

    const allDestinations: Destination[] = JSON.parse(destFile);
    const reviewData: DestinationReview[] = JSON.parse(reviewFile);

    // Logika Top Recommendations tetap di server
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
    
    // HAPUS LOGIKA FILTERING
    // const filteredDestinations = applyFilters(allDestinations, searchParams);

    return {
      allDestinations, // Kirim list LENGKAP
      initialTopRecommendations: topRecommendations,
    };
  } catch (err) {
    console.error('Failed to load explore data from server:', err);
    return { allDestinations: [], initialTopRecommendations: [] };
  }
}


// ----- FUNGSI 'getPageData' (Disederhanakan) -----
async function getPageData(searchParams: { [key: string]: string | undefined }) {
  
  const placeName = searchParams.place;
  
  let detailPageData: DetailPageData | null = null;
  let explorePageData: ExplorePageData | null = null;
  let allDestinationsForFavorites: Destination[] = []; 

  try {
    if (placeName) {
      // Logika halaman detail (tetap sama)
      detailPageData = await getDetailPageData(placeName);
      const destPath = path.join(process.cwd(), 'public/dataset/destinationBali.json');
      const destFile = await fs.readFile(destPath, 'utf-8');
      allDestinationsForFavorites = JSON.parse(destFile);
    } 
    else {
      // Logika halaman explore (sekarang HANYA memuat data)
      explorePageData = await getExplorePageData();
      allDestinationsForFavorites = explorePageData.allDestinations;
    }
  } catch (error) {
    console.error("Error reading data files in getPageData:", error);
    allDestinationsForFavorites = [];
    explorePageData = { allDestinations: [], initialTopRecommendations: [] };
    detailPageData = null;
  }

  // Hapus semua logika 'hasFilters' dan 'showAllDestinations' dari server
  return {
    allDestinations: allDestinationsForFavorites,
    explorePageData: explorePageData,
    detailPageData: detailPageData,
    showDetailPage: !!placeName && !!detailPageData
  };
}


// ----- KOMPONEN Page (Disederhanakan) -----
export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  
  const data = await getPageData(searchParams);

  return (
    <Suspense fallback={<ExploreSkeleton />}>
      <ExploreClient
        // Ini adalah props yang dibutuhkan klien
        allDestinations={data.allDestinations} // List LENGKAP
        initialTopRecommendations={data.explorePageData?.initialTopRecommendations}
        detailPageData={data.detailPageData}
        showDetailPage={data.showDetailPage}
        
        // Hapus props yang tidak perlu lagi
        // filteredDestinations={...} 
        // showAllDestinations={...}
      />
    </Suspense>
  );
}