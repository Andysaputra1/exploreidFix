'use client';

import React, { useState, useCallback, useMemo } from 'react'; // Tambahkan useMemo
import { useRouter, useSearchParams } from 'next/navigation'; 
import Header from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import TourGuideList from '@/components/TourGuides/TourGuideList';
import ApplyGuideModal from '@/components/TourGuides/ApplyGuide';
import { motion, AnimatePresence } from 'framer-motion';

// Pastikan tipe ini di-export
export interface TourGuide {
  id: string;
  name: string;
  language: string;
  price: string;
  description: string;
  picture: string;
  email?: string;
  phone?: string;
}

interface GuideFormData {
  name: string;
  contact: string; 
  language: string;
  price: string;
  description: string;
  picture: string;
  cvFile: File | null;
}

interface TourGuidesClientProps {
  initialGuides: TourGuide[]; // Ini adalah list LENGKAP
}

const fadeInPage = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const TourGuidesClient: React.FC<TourGuidesClientProps> = ({ initialGuides }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get('q') || '';

  // State untuk data LENGKAP (dari props)
  const [guides, setGuides] = useState<TourGuide[]>(initialGuides);
  
  // State untuk search (dari Navbar)
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  
  // ----- LOGIKA FILTER LIVE DENGAN useMemo -----
  const filteredGuides = useMemo(() => {
    if (!searchQuery) {
      return guides; // Jika search kosong, tampilkan semua
    }
    const query = searchQuery.toLowerCase();
    return guides.filter(guide =>
      guide.name.toLowerCase().includes(query) ||
      guide.language.toLowerCase().includes(query) ||
      guide.description.toLowerCase().includes(query)
    );
  }, [guides, searchQuery]); // Filter akan jalan ulang HANYA jika 'guides' atau 'searchQuery' berubah
  // ------------------------------------------

  // ... (Semua state & handler modal tetap sama) ...
  const [showForm, setShowForm] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<GuideFormData>({
    name: '', contact: '', language: '', price: '',
    description: '', picture: '', cvFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState(""); 
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormError(""); 
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  }, []);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(""); 
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevData) => ({ ...prevData, cvFile: file }));
  }, []);
  const handleSubmit = useCallback(async () => {
    setFormError(""); 
    if (!formData.name || !formData.contact || !formData.cvFile) {
      setFormError('Please complete all required fields (Name, Contact, CV).');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true); 
    }, 1500);
  }, [formData]);
  const openForm = useCallback(() => {
    setShowForm(true);
    setTimeout(() => setFormVisible(true), 10);
  }, []);
  const closeForm = useCallback(() => {
    setFormVisible(false);
    setTimeout(() => {
      setShowForm(false);
      setFormData({
        name: '', contact: '', language: '', price: '',
        description: '', picture: '', cvFile: null,
      });
      setIsLoading(false);
      setIsSuccess(false);
      setFormError("");
    }, 300); 
  }, []);
  // ... (Akhir dari handler modal) ...

  // ----- Logika Search (Diubah) -----
  // Handler ini HANYA update state & URL (tanpa reload)
  const handleSearchChange = (value: string) => {
    setSearchQuery(value); // Ini akan memicu useMemo
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('q', value);
    else params.delete('q');
    router.replace(`/tour-guides?${params.toString()}`, { scroll: false });
  };

  // Handler ini tidak melakukan apa-apa, tapi dibutuhkan Navbar
  const handleSearchSubmit = () => {
    // Tidak perlu reload, 'live search' sudah selesai
  };
  
  return (
    <div className="min-h-screen bg-[#060c20] text-white overflow-x-hidden transition-all duration-500">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange} // Ini 'live'
        onSearchSubmit={handleSearchSubmit} 
      />

      <motion.main
        className="mt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10"
        variants={fadeInPage}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-white">Meet Your Tour Guides</h2>
          <button
            onClick={openForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl font-medium transition-colors duration-300"
          >
            Apply as Tour Guide
          </button>
        </motion.div>

        {/* Kirim data yang sudah difilter oleh 'useMemo' */}
        <TourGuideList guides={filteredGuides} />

        {showForm && (
          <ApplyGuideModal
            isVisible={formVisible}
            formData={formData}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            onClose={closeForm}
            errorMessage={formError} 
            isLoading={isLoading}   
            isSuccess={isSuccess}   
          />
        )}
      </motion.main>

      <Footer />
    </div>
  );
};

export default TourGuidesClient;