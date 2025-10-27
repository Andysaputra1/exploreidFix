'use client';
import React from 'react';

interface ApplyGuideModalProps {
  isVisible: boolean;
  formData: {
    name: string;
    language: string;
    price: string;
    description: string;
    picture: string;
    cvFile: File | null;
    contact: string; // Mengganti email dan phone dengan contact
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
  errorMessage: string;
}

const ApplyGuideModal: React.FC<ApplyGuideModalProps> = ({
  isVisible,
  formData,
  onInputChange,
  onFileChange,
  onSubmit,
  onClose,
  errorMessage,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
      <div
        className={`bg-[#1f1d2b] rounded-3xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">Apply as Tour Guide</h2>

        {/* Hanya satu input untuk kontak */}
        <input
          type="text" // Menggunakan type="text" agar bisa menerima email atau angka
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
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-600 px-5 py-2 rounded-xl hover:bg-blue-700 transition font-medium text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyGuideModal;