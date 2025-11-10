'use client';

import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ItineraryProps {
  place: string;
}

// Data dummy yang akan kita tampilkan
const dummyItineraryString = `
Day 1: Cultural Immersion
  09:00 - 11:00: Ubud Monkey Forest
  11:30 - 13:00: Ubud Art Market (Shopping)
  13:00 - 14:00: Lunch at local Warung
  14:30 - 16:00: Goa Gajah (Elephant Cave)
  17:00 - 18:30: Tanah Lot Temple (Sunset)

Day 2: Nature & Adventure
  08:00 - 11:00: Mount Batur (Sunrise Trek)
  12:00 - 13:30: Tegalalang Rice Terrace
  14:00 - 15:30: Tirta Empul Temple
  16:00 - 17:00: Bali Swing

Day 3: Beach & Relaxation
  10:00 - 13:00: Kuta Beach (Surfing)
  13:00 - 14:30: Lunch at Seminyak
  15:00 - 17:00: Uluwatu Temple
  17:30 - 19:00: Jimbaran Bay (Seafood Dinner)
`.trim(); // .trim() untuk hapus spasi di awal/akhir

// Varian animasi untuk modal
const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } },
};

const Itinerary: React.FC<ItineraryProps> = ({ place }) => {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(3);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // State Error sudah tidak diperlukan

  // --- FUNGSI GENERATE DUMMY ---
  const generateItinerary = () => { 
    setLoading(true); // Mulai loading
    setItinerary(null); // Bersihkan itinerary lama

    // Simulasi panggilan API (1.5 detik)
    setTimeout(() => {
      // Sesuaikan data dummy berdasarkan jumlah hari
      let dayData = dummyItineraryString.split('\n\n'); // Pisah per hari
      if (days === 1) {
        setItinerary(dayData[0]);
      } else if (days === 2) {
        setItinerary(dayData[0] + '\n\n' + dayData[1]);
      } else {
        setItinerary(dummyItineraryString); // Tampilkan semua (3 hari)
      }
      
      setLoading(false); // Selesai loading
    }, 1500);
  };
  // --- AKHIR FUNGSI DUMMY ---

  return (
    <>
      {/* Tombol FAB (Floating Action Button) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-full shadow-lg flex items-center gap-2 font-bold transition-all duration-300 transform hover:scale-105 z-[20]"
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span className="hidden md:block">Create Itinerary</span>
        </button>
      )}

      {/* Modal Itinerary */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // ----- DESAIN BARU (Glass-morphism) -----
            className="fixed bottom-6 right-6 w-[350px] bg-[#060c20]/50 backdrop-blur-xl border-2 border-white/50 text-white p-6 rounded-3xl shadow-2xl z-[20]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-300">Itinerary Generator</h3>
              <button onClick={() => setOpen(false)}>
                <X className="text-gray-400 hover:text-red-500" />
              </button>
            </div>

            <p className="text-sm mb-3 text-gray-200">
              Plan your trip to <span className="font-semibold text-white">{place}</span> and customize your itinerary.
            </p>

            <label className="block mb-2 text-sm text-gray-200">Number of Days:</label>
            <input
              type="number"
              min={1}
              max={10}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              // Input style baru
              className="w-full bg-white/10 text-white p-2 rounded-md mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button
              onClick={generateItinerary}
              // Button style baru
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading} // Disable button saat loading
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
            
            {/* Hapus blok {error} */}

            {itinerary && (
              // Result box style baru
              <div className="mt-4 max-h-[200px] overflow-auto bg-black/30 shadow-inner p-4 rounded-lg">
                <h4 className="text-blue-300 text-sm font-semibold mb-2">Your Dummy Itinerary</h4>
                {/* Pastikan teksnya putih */}
                <pre className="text-sm whitespace-pre-wrap text-white">{itinerary}</pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Itinerary;