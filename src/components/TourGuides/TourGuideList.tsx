import React, { useEffect, useState } from 'react';
import TourGuideCard from './TourGuideCard';

interface TourGuide {
  id: string;
  name: string;
  language: string;
  price: string;
  description: string;
  picture: string;
}

interface TourGuideListProps {
  /** Biar fleksibel: kalau tidak dipassing, komponen akan auto-fetch dari /dataset/tourGuides.json */
  guides?: TourGuide[];
}

const TourGuideList: React.FC<TourGuideListProps> = ({ guides }) => {
  const [data, setData] = useState<TourGuide[]>(guides ?? []);
  const [loading, setLoading] = useState<boolean>(!guides || guides.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch hanya kalau guides tidak diberikan atau kosong
  useEffect(() => {
    if (guides && guides.length > 0) return; // sudah ada data dari parent

    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/dataset/tourGuides.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const json: TourGuide[] = await res.json();

        // Normalisasi path gambar (buang prefix ./public kalau ada)
        const normalized = json.map(g => ({
          ...g,
          picture: (g.picture || '').replace(/^\.?\/?public\//, '/').replace(/^\/\//, '/'),
        }));

        if (isMounted) setData(normalized);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to load guides');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [guides]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-xl">Loading tour guides…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-400">
        <p className="text-xl">Error loading tour guides</p>
        <p className="mt-2 text-sm opacity-80">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-xl">No tour guides found at the moment.</p>
        <p className="mt-2">Please check back later or apply to be a guide!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16">
      {data.map((guide) => (
        <TourGuideCard key={guide.id} guide={guide} />
      ))}
    </div>
  );
};

export default TourGuideList;
 
 