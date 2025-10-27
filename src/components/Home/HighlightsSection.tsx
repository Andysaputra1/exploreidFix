'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface FeatureBlockProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  imageOnLeft: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const imageSlideVariants = (fromLeft: boolean) => ({
  hidden: { opacity: 0, x: fromLeft ? -100 : 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
});

const textSlideVariants = (fromLeft: boolean) => ({
  hidden: { opacity: 0, x: fromLeft ? 100 : -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
});

const FeatureBlock: React.FC<FeatureBlockProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  buttonLink,
  imageOnLeft,
}) => {
  return (
    <motion.div
      className={`flex flex-col md:flex-row items-center gap-12 md:gap-16 mb-20 last:mb-0`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={containerVariants}
    >
      <motion.div
        className={`w-full md:w-1/2 flex-shrink-0 ${imageOnLeft ? '' : 'md:order-2'}`}
        variants={imageSlideVariants(imageOnLeft)}
      >
        <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            quality={90}
            className="transition-transform duration-500 hover:scale-105"
          />
        </div>
      </motion.div>

      <motion.div
        className="w-full md:w-1/2 text-white text-center md:text-left"
        variants={textSlideVariants(imageOnLeft)}
      >
        <h3 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">
          {title}
        </h3>
        <p className="text-base text-gray-300 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
          {description}
        </p>
        {/* MODIFIED PART HERE */}
        <Link href={buttonLink} className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg">
          {buttonText}
        </Link>
      </motion.div>
    </motion.div>
  );
};

const HighlightsSection: React.FC = () => {
  const featuresData = [
    {
      title: "Discover Serene Paths Through Lush Indonesian Landscapes",
      description: "Trek through winding trails amidst lush rainforests, discover hidden waterfalls, and immerse yourself in Indonesia's untouched natural beauty. Each step brings you closer to tranquility and biological wonders.",
      imageUrl: "/assets/home/waterfall.webp",
      buttonText: "Learn More",
      buttonLink: "/explore",
      imageOnLeft: true,
    },
    {
      title: "Idyllic Shores: Your Escape to Sun-Kissed Indonesian Beaches",
      description: "Feel the soft white sand beneath your feet, dive into crystal-clear turquoise waters, and witness mesmerizing sunsets. Indonesia's beaches offer a perfect blend of relaxation and unforgettable underwater adventures.",
      imageUrl: "/assets/home/sea.webp",
      buttonText: "Learn More",
      buttonLink: "/explore",
      imageOnLeft: false,
    },
  ];

  return (
    <section className="bg-[#060c20] text-white py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {featuresData.map((feature, index) => (
          <FeatureBlock
            key={index}
            title={feature.title}
            description={feature.description}
            imageUrl={feature.imageUrl}
            buttonText={feature.buttonText}
            buttonLink={feature.buttonLink}
            imageOnLeft={feature.imageOnLeft}
          />
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;