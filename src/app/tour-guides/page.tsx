import React, { Suspense } from 'react';
import fs from 'fs/promises';
import path from 'path';

import TourGuidesClient from '@/components/TourGuides/TourGuidesClient';
import TourGuidesSkeleton from '@/components/TourGuides/TourGuidesSkeleton'; // Pastikan file ini ada
import type { TourGuide } from '@/components/TourGuides/TourGuidesClient';

export const dynamic = 'force-dynamic';

// ----- FUNGSI: Mengambil SEMUA data Tour Guides -----
async function getTourGuides(): Promise<TourGuide[]> {
  try {
    const filePath = path.join(process.cwd(), 'public/dataset/tourGuides.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const guides: TourGuide[] = JSON.parse(jsonData);

    // HAPUS SEMUA LOGIKA FILTER DARI SINI
    
    return guides; // Kembalikan semua guide

  } catch (err) {
    console.error('Failed to load tour guides data:', err);
    return []; 
  }
}


// ----- KOMPONEN Halaman (Page) -----
export default async function Page() {
  
  // Panggil fungsi data fetching (tanpa search query)
  const guides = await getTourGuides(); 

  return (
    <Suspense fallback={<TourGuidesSkeleton />}>
      {/* Kirim SEMUA guide ke klien */}
      <TourGuidesClient initialGuides={guides} />
    </Suspense>
  );
}