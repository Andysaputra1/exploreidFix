'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

const textSideVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

const ContactUsSection: React.FC = () => {
  return (
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
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent"
                  placeholder="Your Name"
                  suppressHydrationWarning // Add this line
                />
                <label htmlFor="name" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Your Name</label>
              </div>
              <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent"
                  placeholder="Your Email"
                  suppressHydrationWarning // Add this line
                />
                <label htmlFor="email" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Your Email</label>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent"
                  placeholder="Phone Number"
                  suppressHydrationWarning // Add this line
                />
                <label htmlFor="phone" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Phone Number</label>
              </div>
              <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent"
                  placeholder="Country"
                  suppressHydrationWarning // Add this line
                />
                <label htmlFor="country" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Country</label>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent"
                  placeholder="Company Name"
                  suppressHydrationWarning // Add this line
                />
                <label htmlFor="company" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Company Name</label>
              </div>
              <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
                <select
                  id="interested"
                  name="interested"
                  className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent appearance-none"
                  defaultValue=""
                  suppressHydrationWarning // Add this line
                >
                  <option value="" disabled className="bg-black text-gray-400">Interested in</option>
                  <option value="travel" className="bg-black text-white">Travel</option>
                  <option value="partnership" className="bg-black text-white">Partnership</option>
                  <option value="other" className="bg-black text-white">Other</option>
                </select>
                <label htmlFor="interested" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Interested in</label>
                <svg className="absolute right-0 top-1/2 -mt-1 transform -translate-y-1/2 pointer-events-none w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <div className="relative border-b border-gray-700 focus-within:border-blue-500 pb-2">
              <textarea
                id="message"
                name="message"
                rows={3}
                className="w-full bg-transparent outline-none text-white text-base peer placeholder-transparent resize-none"
                placeholder="Message"
                suppressHydrationWarning // Add this line
              ></textarea>
              <label htmlFor="message" className="absolute left-0 -top-6 text-gray-400 text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-6 peer-focus:text-blue-500 peer-focus:text-sm transition-all duration-300">Message</label>
            </div>
            <button
              type="submit"
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 flex items-center gap-2"
              suppressHydrationWarning // Add this line
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
  );
};

export default ContactUsSection;