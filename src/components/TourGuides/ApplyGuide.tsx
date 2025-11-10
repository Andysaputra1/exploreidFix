'use client';
import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react'; // Import ikon baru
import { motion } from 'framer-motion';

interface ApplyGuideModalProps {
  isVisible: boolean;
  formData: {
    name: string;
    language: string;
    price: string;
    description: string;
    picture: string;
    cvFile: File | null;
    contact: string; 
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
  errorMessage: string;
  isLoading: boolean;  // Prop baru
  isSuccess: boolean; // Prop baru
}

const ApplyGuideModal: React.FC<ApplyGuideModalProps> = ({
  isVisible,
  formData,
  onInputChange,
  onFileChange,
  onSubmit,
  onClose,
  errorMessage,
  isLoading,
  isSuccess,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4">
      <motion.div
        className={`bg-[#1f1d2b] rounded-3xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* ----- KONTEN MODAL KITA UBAH ----- */}
        {isSuccess ? (
          // --- TAMPILAN SUKSES ---
          <div className="flex flex-col items-center justify-center p-6 text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <CheckCircle className="w-20 h-20 text-green-400 mb-6" />
            </motion.div>
            <h2 className="text-2xl font-semibold mb-3">Application Sent!</h2>
            <p className="text-gray-300 text-center mb-6">
              Thank you for applying. (This is a dummy action and no data was sent).
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-500 transition font-medium text-white"
            >
              Close
            </button>
          </div>
        ) : (
          // --- TAMPILAN FORM (Seperti sebelumnya) ---
          <>
            <h2 className="text-2xl font-semibold mb-6 text-center text-white">Apply as Tour Guide</h2>

            <input
              type="text" 
              name="contact"
              placeholder="Email Address or Phone Number"
              value={formData.contact}
              onChange={onInputChange}
              className="w-full mb-4 p-3 rounded-xl bg-[#060c20] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={onInputChange}
              className="w-full mb-4 p-3 rounded-xl bg-[#060c20] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              name="language"
              placeholder="Languages Spoken"
              value={formData.language}
              onChange={onInputChange}
              className="w-full mb-4 p-3 rounded-xl bg-[#060c20] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              name="price"
              placeholder="Price Range (e.g., $50 - $100)"
              value={formData.price}
              onChange={onInputChange}
              className="w-full mb-4 p-3 rounded-xl bg-[#060c20] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              required
            />
            <textarea
              name="description"
              placeholder="Description (e.g., years of experience, specialties, etc.)"
              value={formData.description}
              onChange={onInputChange}
              rows={4}
              className="w-full mb-4 p-3 rounded-xl bg-[#060c20] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-y"
              required
            />

            <div className="w-full mb-6">
              <label htmlFor="cvUpload" className="block text-white text-md font-medium mb-2">Upload CV (.pdf only)</label>
              <div className="relative w-full p-3 rounded-xl bg-[#060c20] border border-gray-700 flex items-center justify-between overflow-hidden cursor-pointer">
                <span className="text-white text-base truncate pr-1">
                  {formData.cvFile ? formData.cvFile.name : 'Choose file (.pdf only)'}
                </span>
                <input
                  type="file"
                  id="cvUpload"
                  name="cvFile"
                  accept=".pdf"
                  onChange={onFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition flex-shrink-0">
                  Browse
                </span>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-400 text-sm mb-4 text-center">{errorMessage}</p>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="bg-gray-600 px-5 py-2 rounded-xl hover:bg-gray-500 transition font-medium text-white"
                disabled={isLoading} // Disable saat loading
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="bg-blue-600 px-5 py-2 rounded-xl hover:bg-blue-700 transition font-medium text-white flex items-center gap-2 disabled:opacity-50"
                disabled={isLoading} // Disable saat loading
              >
                {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ApplyGuideModal;