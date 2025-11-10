import React from 'react';

// Ini adalah satu kartu skeleton
const SkeletonCard = () => (
  <div className="h-[250px] rounded-3xl bg-white/10 animate-pulse"></div>
);

// Ini adalah layout halaman explore yang di-skeleton
export default function ExploreSkeleton() {
  return (
    <div className="min-h-screen bg-[#060c20] text-white overflow-x-hidden relative">
      <main className="flex-1 py-6 max-w-7xl mx-auto px-4">
        {/* Skeleton untuk Navbar */}
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#2d2e31]/50 py-4 px-6 rounded-3xl w-[95%] max-w-screen-lg h-[68px] animate-pulse"></div>
        
        {/* Skeleton untuk Konten */}
        <div className="pt-32">
          {/* Skeleton untuk Judul "Favorite" */}
          <div className="h-8 w-64 bg-white/10 rounded-lg animate-pulse mb-6"></div>
          
          {/* Skeleton untuk Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>

          {/* Skeleton untuk Judul "Top Recs" */}
          <div className="h-8 w-80 bg-white/10 rounded-lg animate-pulse mb-6 mt-10"></div>
          
          {/* Skeleton untuk Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </main>
    </div>
  );
}