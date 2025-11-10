import React from 'react';

// Ini adalah satu kartu skeleton (kita buat mirip tinggi kartu guide)
const SkeletonCard = () => (
  <div className="h-[390px] rounded-3xl bg-white/10 animate-pulse"></div>
);

// Ini adalah layout halaman tour guides yang di-skeleton
export default function TourGuidesSkeleton() {
  return (
    <div className="min-h-screen bg-[#060c20] text-white overflow-x-hidden">
      {/* Skeleton untuk Navbar */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#2d2e31]/50 py-4 px-6 rounded-3xl w-[95%] max-w-screen-lg h-[68px] animate-pulse"></div>

      <main className="mt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10">
        
        {/* Skeleton untuk Header (Judul "Meet Your Guides" + Tombol "Apply") */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div className="h-8 w-72 bg-white/10 rounded-lg animate-pulse mb-4 sm:mb-0"></div>
          <div className="h-10 w-full sm:w-48 bg-blue-600/30 rounded-2xl animate-pulse"></div>
        </div>

        {/* Skeleton untuk Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </main>
    </div>
  );
}