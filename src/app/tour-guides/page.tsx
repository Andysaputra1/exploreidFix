'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import TourGuideList from '@/components/TourGuides/TourGuideList';
import ApplyGuideModal from '@/components/TourGuides/ApplyGuide';
import { motion, AnimatePresence } from 'framer-motion';

// perubahan: tambahkan import Supabase
import { supabase } from '@/lib/supabaseClient';

interface TourGuide {
  id: string;
  name: string;
  language: string;
  price: string;
  description: string;
  picture: string;
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

const fadeInPage = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const listContainerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
};

const TourGuidePage: React.FC = () => {
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const [formData, setFormData] = useState<GuideFormData>({
    name: '',
    contact: '',
    language: '',
    price: '',
    description: '',
    picture: '',
    cvFile: null,
  });

  useEffect(() => {
    const fetchTourGuides = async () => {
      const { data, error } = await supabase
        .from('bali_tour_guides')
        .select('*');

      if (error) {
        console.error('Failed to fetch tour guides:', error.message);
      } else {
        setGuides(data || []);
      }
    };

    fetchTourGuides();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevData) => ({ ...prevData, cvFile: file }));
  }, []);
  const handleSubmit = useCallback(async () => {
    if (
      !formData.name ||
      !formData.contact ||
      !formData.language ||
      !formData.price ||
      !formData.description ||
      !formData.cvFile
    ) {
      alert('Please complete all fields including contact and upload CV.');
      return;
    }

    try {
      const file = formData.cvFile;
      const filename = `${formData.name.replace(/\s/g, '_')}_${Date.now()}.pdf`;
      const filePath = `cv/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('tourguide.cv')
        .upload(filePath, file);

      if (uploadError) {
        console.error('CV Upload Error:', uploadError.message);
        alert('Failed to upload CV.');
        return;
      }

      const { error: insertError } = await supabase
        .from('tourguide_applications')
        .insert([
          {
            name: formData.name,
            contact: formData.contact,
            language: formData.language,
            price: formData.price,
            description: formData.description,
            picture: formData.picture,
            cv_path: filePath,
          },
        ]);

      if (insertError) {
        console.error('DB Insert Error:', insertError.message);
        alert('Failed to submit application.');
        return;
      }

      alert('Application submitted successfully!');

      setFormData({
        name: '',
        contact: '',
        language: '',
        price: '',
        description: '',
        picture: '',
        cvFile: null,
      });
      setFormVisible(false);
      setTimeout(() => setShowForm(false), 300);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Something went wrong.');
    }
  }, [formData]);

  const openForm = useCallback(() => {
    setShowForm(true);
    setTimeout(() => setFormVisible(true), 10);
  }, []);

  const closeForm = useCallback(() => {
    setFormVisible(false);
    setTimeout(() => setShowForm(false), 300);
    setFormData({
      name: '',
      contact: '', 
      language: '',
      price: '',
      description: '',
      picture: '',
      cvFile: null,
});

  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const filteredGuides = guides.filter(guide =>
    guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#060c20] text-white overflow-x-hidden transition-all duration-500">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

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
          <h2 className="text-2xl font-semibold">Meet Your Tour Guides</h2>
          <button
            onClick={openForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl font-medium transition-colors duration-300"
          >
            Apply as Tour Guide
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <TourGuideList guides={filteredGuides} />
          </motion.div>
        </AnimatePresence>

        {showForm && (
          <ApplyGuideModal
            isVisible={formVisible}
            formData={formData}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            onClose={closeForm}
            errorMessage={''}
          />
        )}
      </motion.main>

      <Footer />
    </div>
  );
};

export default TourGuidePage;
