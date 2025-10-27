'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const heroImages = [
  { src: "/assets/home/hero-1.webp", alt: "Indonesia's Pristine Landscapes" },
  { src: "/assets/home/hero-2.webp", alt: "Cultural Richness" },
  { src: "/assets/home/hero-3.webp", alt: "Serene Nature" },
];

const imageContainerVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 2.0, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 2.0, ease: "easeInOut" } },
};

const kenBurnsAnimationObject = {
  scale: [1, 1.05, 1.02],
  x: [0, 10, -5],
  y: [0, -5, 5],  
  transition: {
    duration: 25, 
    repeat: Infinity,
    repeatType: "mirror" as const, 
    ease: "linear",
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: "easeOut", delay: 0.3 } },
};

const buttonGroupVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 1.0 } },
};

const scrollIconVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    y: [0, 10, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop" as const, 
      ease: "easeInOut",
      delay: 2.0,
    },
  },
};

const HeroSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 9000);

    return () => clearInterval(timer);
  }, []);

  const headline = "Unveil Bali's Exquisite Secrets A Path to Enchanting Bliss";
  const subHeadline = "Beyond the ordinary, discover a tapestry of natural wonders and profound cultural narratives.";

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-white overflow-hidden bg-gray-950">
      <AnimatePresence mode='wait'>
        <motion.div
          key={heroImages[currentImageIndex].src}
          className="absolute inset-0 w-full h-full"
          variants={imageContainerVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <motion.div
            className="absolute inset-0 w-full h-full"
            animate={kenBurnsAnimationObject}
          >
            <Image
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              fill
              objectFit="cover"
              quality={90}
              priority={currentImageIndex === 0}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10" />

      <div className="relative z-20 text-center px-4 md:px-8 max-w-4xl mx-auto">
        <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg"
            initial="hidden"
            animate="visible"
            variants={contentVariants}
        >
            {headline}
        </motion.h2>

        <motion.p
            className="text-sm sm:text-base text-gray-200 mb-10 max-w-lg mx-auto drop-shadow-md"
            initial="hidden"
            animate="visible"
            variants={contentVariants}
        >
            {subHeadline}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-6"
          initial="hidden"
          animate="visible"
          variants={buttonGroupVariants}
        >
          <Link href="/explore" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors duration-300 transform hover:scale-105">
            Explore Destinations
          </Link>
          <Link href="/tour-guides" className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            Plan Your Journey
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 z-20 text-white"
        initial="hidden"
        animate="visible"
        variants={scrollIconVariants}
      >
        <ChevronDown size={36} />
      </motion.div>
    </section>
  );
};

export default HeroSection;