'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.15,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const quoteTextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      delay: 0.3,
    },
  },
};

const StatsAndQuote: React.FC = () => {
  const stats = [
    {
      number: 100,
      suffix: '+',
      label: 'Bali Experiences',
      description: 'From spiritual journeys to adventurous escapes, we\'ve curated extraordinary experiences across the island of Bali.'
    },
    {
      number: 43000,
      suffix: '+',
      label: 'Happy Bali Travelers',
      description: 'Our greatest joy is seeing our clients return with incredible stories and unforgettable memories from their Bali adventures.'
    },
    {
      number: 30,
      suffix: '+',
      label: 'Years of Bali Expertise',
      description: 'Decades of expertise in crafting bespoke travel experiences specifically for Bali, ensuring seamless and enriching adventures.'
    },
  ];

  return (
    <section
      className="relative py-20 px-4 md:px-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/home/background.webp')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <motion.div
        className="max-w-6xl mx-auto text-center relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight">
          By The Numbers
        </h2>
        <p className="text-lg md:text-xl font-light text-gray-300 mb-16">
          Our journey in Bali, our impact, our passion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center p-6 rounded-lg bg-white/10 backdrop-blur-md
                         shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out text-white"
              variants={statItemVariants}
            >
              <div className="mb-2 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                <AnimatedNumber value={stat.number} suffix={stat.suffix} />
              </div>
              <p className="text-md font-semibold text-gray-100 mb-2">{stat.label}</p>
              <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="max-w-3xl mx-auto py-8"
          variants={quoteTextVariants}
        >
          <p className="text-xl md:text-2xl italic mb-4 leading-relaxed text-gray-200">
            &ldquo;Bali opens your heart, broadens your mind, and fills your life with stories to tell.&rdquo;
          </p>
          <p className="text-base font-medium text-gray-300">- An Avid Bali Explorer</p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StatsAndQuote;