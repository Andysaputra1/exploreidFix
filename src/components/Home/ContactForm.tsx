'use client';

import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- VARIAN ANIMASI ---
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const textSideVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
const modalContentVariants = {
  hidden: { scale: 0.8, opacity: 0, y: 50 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
  exit: { scale: 0.8, opacity: 0, y: 50 },
};
// --------------------


// --- TIPE DATA & STATE BARU ---
interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  interested: string;
  message: string;
}

const initialFormState: FormData = {
  name: '',
  email: '',
  phone: '',
  country: '',
  company: '',
  interested: '',
  message: '',
};
// ----------------------------


// --- KOMPONEN POPUP (Ini yang Anda maksud) ---
interface PopupProps {
  data: FormData;
  onClose: () => void;
}

const SubmissionPopup: React.FC<PopupProps> = ({ data, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[999]"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose} 
    >
      <motion.div
        className="relative w-full max-w-md bg-[#060c20]/50 backdrop-blur-xl border-2 border-white/50 rounded-3xl shadow-xl p-8"
        variants={modalContentVariants}
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <X size={24} />
        </button>
        
        {/* 1. Ini tulisan "Terima kasih, ini form dummy" */}
        <h3 className="text-2xl font-bold text-blue-300 mb-6 text-center">Message Sent (Dummy)</h3>
        <p className="text-sm text-gray-300 mb-4 text-center">
          This is a dummy form. Here is the data that would be sent:
        </p>

        {/* 2. Ini pop-up yang memunculkan data yang masuk */}
        <div className="space-y-2 bg-black/30 p-4 rounded-lg max-h-60 overflow-y-auto">
          {Object.entries(data).map(([key, value]) => (
            value ? ( // Hanya tampilkan field yang diisi
              <div key={key} className="text-sm">
                <span className="font-semibold capitalize text-gray-200">{key}: </span>
                <span className="text-blue-200 break-words">{value}</span>
              </div>
            ) : null
          ))}
          
          {/* Tambah pesan jika semua kosong */}
          {!Object.values(data).some(v => v) && (
             <p className="text-sm text-gray-400 text-center">Form was submitted empty.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
// -------------------------


// --- KOMPONEN UTAMA (YANG DIPERBARUI) ---
const ContactUsSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [showPopup, setShowPopup] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // INI ADALAH SATU-SATUNYA FUNGSI SUBMIT
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    setShowPopup(true); // Ini yang memicu POPUP, bukan alert
  };
  
  const handleClosePopup = () => {
    setShowPopup(false);
    setFormData(initialFormState); // Reset form setelah popup ditutup
  };

  return (
    <>
      <section className="bg-[#060c20] text-white py-20 px-4 md:px-8">
        <motion.div
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <motion.div
            className="w-full md:w-1/2"
            variants={itemVariants}
          >
            {/* Pastikan 'onSubmit' terhubung ke 'handleSubmit' */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                  <input
                    type="text" id="name" name="name"
                    className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent"
                    placeholder="Your Name"
                    value={formData.name} onChange={handleChange} 
                  />
                  <label htmlFor="name" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Your Name</label>
                </div>
                <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                  <input
                    type="email" id="email" name="email"
                    className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent"
                    placeholder="Your Email"
                    value={formData.email} onChange={handleChange} 
                  />
                  <label htmlFor="email" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Your Email</label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                  <input
                    type="text" id="phone" name="phone"
                    className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent"
                    placeholder="Phone Number"
                    value={formData.phone} onChange={handleChange} 
                  />
                  <label htmlFor="phone" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Phone Number</label>
                </div>
                <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                  <input
                    type="text" id="country" name="country"
                    className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent"
                    placeholder="Country"
                    value={formData.country} onChange={handleChange} 
                  />
                  <label htmlFor="country" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Country</label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                  <input
                    type="text" id="company" name="company"
                    className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent"
                    placeholder="Company Name"
                    value={formData.company} onChange={handleChange} 
                  />
                  <label htmlFor="company" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Company Name</label>
                </div>
                <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                  <select
                    id="interested" name="interested"
                    className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent appearance-none"
                    value={formData.interested} onChange={handleChange} 
                  >
                    <option value="" disabled className="bg-black text-gray-400">Interested in</option>
                    <option value="Travel" className="bg-black text-white">Travel</option>
                    <option value="Partnership" className="bg-black text-white">Partnership</option>
                    <option value="Other" className="bg-black text-white">Other</option>
                  </select>
                  <label htmlFor="interested" className="absolute left-0 -top-6 text-gray-400 text-sm peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-3D0">Interested in</label>
                  <svg className="absolute right-0 top-1/2 -mt-1 transform -translate-y-1/2 pointer-events-none w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                <textarea
                  id="message" name="message"
                  rows={3}
                  className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent resize-none"
                  placeholder="Message"
                  value={formData.message} onChange={handleChange} 
                ></textarea>
                <label htmlFor="message" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Message</label>
              </div>
              
              {/* Pastikan tombol ini memiliki type="submit" */}
              <button
                type="submit" 
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 flex items-center gap-2"
              >
                Send Message <Send size={20} />
              </button>
            </form>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 text-left md:pl-12"
            variants={textSideVariants}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">
              Let&apos;s Connect with us! <br/> Discuss for grow ...
            </h2>
            <p className="text-base text-gray-300 mb-4">
            Thank you for getting in touch! Kindly. Fill the form, have a great day!
          </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Ini adalah bagian yang akan memunculkan popup */}
      <AnimatePresence>
        {showPopup && (
          <SubmissionPopup 
            data={formData} 
            onClose={handleClosePopup} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ContactUsSection;