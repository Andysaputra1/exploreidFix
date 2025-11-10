'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Destination } from './ExploreClient'; // Impor tipe dari ExploreClient
import Image from 'next/image'; // Impor Image

// Terima props baru: 'destinations' (yang sudah difilter)
interface AllDestinationsProps {
  destinations: Destination[];
}

const AllDestinations: React.FC<AllDestinationsProps> = ({
  destinations,
}) => {
  const router = useRouter();

  // ----- SEMUA LOGIKA 'useEffect' & 'applyFiltersAndSearch' DIHAPUS -----
  // Karena server sudah melakukannya

  const handleCardClick = (place: string) => {
    router.push(`/explore?place=${encodeURIComponent(place)}`);
  };

  return (
    <div className="min-h-screen bg-[#060c20] text-white overflow-x-hidden max-w-7xl mx-auto">
      <div className="flex justify-between items-center px-2 md:px-0 mt-15 mb-10"></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-0">
        {/* Gunakan 'destinations' dari props */}
        {destinations.length > 0 ? (
          destinations.map((item) => (
            <div
              key={item.Place}
              onClick={() => handleCardClick(item.Place)}
              className="cursor-pointer relative h-[250px] rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-500"
            >
              {/* Gunakan komponen Image untuk konsistensi */}
              <Image
                src={item.Picture.replace('./public', '')}
                alt={item.Place}
                fill
                className="object-cover transition-transform duration-500 transform hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-white z-10">
                <p className="text-xl font-bold drop-shadow">{item.Place}</p>
                <p className="text-sm text-gray-200">{item.Location}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 text-lg">
            No destinations found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllDestinations;