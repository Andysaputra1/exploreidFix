import React from 'react';
import TourGuideCard from './TourGuideCard';
// Impor tipe-nya
import type { TourGuide } from './TourGuidesClient';

interface TourGuideListProps {
  // Komponen ini sekarang HANYA menerima props
  guides: TourGuide[];
}

const TourGuideList: React.FC<TourGuideListProps> = ({ guides }) => {
  
  // ----- SEMUA 'useEffect', 'useState', 'fetch' DIHAPUS -----
  
  // Langsung cek props 'guides'
  if (!guides || guides.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-xl">No tour guides found matching your search.</p>
        <p className="mt-2">Try searching for something else or apply to be a guide!</p>
      </div>
    );
  }

  // Langsung render list
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16">
      {guides.map((guide) => (
        <TourGuideCard key={guide.id} guide={guide} />
      ))}
    </div>
  );
};

export default TourGuideList;