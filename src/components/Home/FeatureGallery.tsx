'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const FeatureGallery: React.FC = () => {
  const galleryImages = [
    { src: "/assets/home/gallery-1.webp", alt: "gallery1" },
    { src: "/assets/home/gallery-2.webp", alt: "gallery2" },
    { src: "/assets/home/gallery-3.webp", alt: "gallery3" },
    { src: "/assets/home/gallery-4.webp", alt: "gallery4" },
    { src: "/assets/home/gallery-5.webp", alt: "gallery5" },
    { src: "/assets/home/gallery-6.webp", alt: "gallery6" },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const imgRef0 = useRef<HTMLDivElement>(null);
  const imgRef1 = useRef<HTMLDivElement>(null);
  const imgRef2 = useRef<HTMLDivElement>(null);
  const imgRef3 = useRef<HTMLDivElement>(null);
  const imgRef4 = useRef<HTMLDivElement>(null);
  const imgRef5 = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <section className="bg-[#060c20] py-20 px-4 md:px-8">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4 text-white"
          variants={textVariants}
        >
          Capturing Bali's Enchantment
        </motion.h2>
        <motion.p
          className="text-base text-gray-300 mb-12 max-w-xl mx-auto"
          variants={textVariants}
        >
          Immerse yourself in the breathtaking beauty and rich cultural tapestry of the Island of the Gods through our curated visual stories.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-4">
            <motion.div
              ref={imgRef0}
              onMouseEnter={() => handleMouseEnter(0)}
              onMouseLeave={handleMouseLeave}
              className={`relative rounded-xl overflow-hidden w-full group cursor-pointer transition-all duration-300 ${hoveredIndex !== null && hoveredIndex !== 0 ? 'filter grayscale' : ''}`}
              style={{ paddingTop: '133.33%' }}
              variants={imageVariants}
            >
              <Image src={galleryImages[0].src} alt={galleryImages[0].alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" />
            </motion.div>
            <motion.div
              ref={imgRef3}
              onMouseEnter={() => handleMouseEnter(3)}
              onMouseLeave={handleMouseLeave}
              className={`relative rounded-xl overflow-hidden w-full group cursor-pointer transition-all duration-300 ${hoveredIndex !== null && hoveredIndex !== 3 ? 'filter grayscale' : ''}`}
              style={{ paddingTop: '75%' }}
              variants={imageVariants}
            >
              <Image src={galleryImages[3].src} alt={galleryImages[3].alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" />
            </motion.div>
          </div>

          <div className="flex flex-col gap-4">
            <motion.div
              ref={imgRef1}
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={handleMouseLeave}
              className={`relative rounded-xl overflow-hidden w-full group cursor-pointer transition-all duration-300 ${hoveredIndex !== null && hoveredIndex !== 1 ? 'filter grayscale' : ''}`}
              style={{ paddingTop: '75%' }}
              variants={imageVariants}
            >
              <Image src={galleryImages[1].src} alt={galleryImages[1].alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" />
            </motion.div>
            <motion.div
              ref={imgRef4}
              onMouseEnter={() => handleMouseEnter(4)}
              onMouseLeave={handleMouseLeave}
              className={`relative rounded-xl overflow-hidden w-full group cursor-pointer transition-all duration-300 ${hoveredIndex !== null && hoveredIndex !== 4 ? 'filter grayscale' : ''}`}
              style={{ paddingTop: '133.5%' }}
              variants={imageVariants}
            >
              <Image src={galleryImages[4].src} alt={galleryImages[4].alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" />
            </motion.div>
          </div>

          <div className="flex flex-col gap-4">
            <motion.div
              ref={imgRef2}
              onMouseEnter={() => handleMouseEnter(2)}
              onMouseLeave={handleMouseLeave}
              className={`relative rounded-xl overflow-hidden w-full group cursor-pointer transition-all duration-300 ${hoveredIndex !== null && hoveredIndex !== 2 ? 'filter grayscale' : ''}`}
              style={{ paddingTop: '110%' }}
              variants={imageVariants}
            >
              <Image src={galleryImages[2].src} alt={galleryImages[2].alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" />
            </motion.div>
            <motion.div
              ref={imgRef5}
              onMouseEnter={() => handleMouseEnter(5)}
              onMouseLeave={handleMouseLeave}
              className={`relative rounded-xl overflow-hidden w-full group cursor-pointer transition-all duration-300 ${hoveredIndex !== null && hoveredIndex !== 5 ? 'filter grayscale' : ''}`}
              style={{ paddingTop: '98.3%' }}
              variants={imageVariants}
            >
              <Image src={galleryImages[5].src} alt={galleryImages[5].alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FeatureGallery;