import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone } from 'lucide-react';

interface TourGuide {
  id: string;
  name: string;
  language: string;
  price: string;
  description: string;
  picture: string;
  email?: string;
  phone?: string;
}

interface TourGuideCardProps {
  guide: TourGuide;
}

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalContentVariants = {
  hidden: { y: 50, opacity: 0, scale: 0.9 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 25 } },
  exit: { y: 50, opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const TourGuideCard: React.FC<TourGuideCardProps> = ({ guide }) => {
  const [showContactModal, setShowContactModal] = useState(false);

  // ✅ Fallback image dengan state (mengganti onError lama)
  const [imgSrc, setImgSrc] = useState(
    (guide.picture || "")
      .replace(/^\.?\/?public\//, "/")
      .replace(/^\/\//, "/")
  );

  const email = useMemo(
    () => guide.email || `${guide.name.replace(/\s+/g, '').toLowerCase()}@baliguide.com`,
    [guide.email, guide.name]
  );

  const phone = useMemo(
    () =>
      guide.phone ||
      `+62812-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    [guide.phone]
  );

  const handleContactClick = () => setShowContactModal(true);
  const handleCloseModal = () => setShowContactModal(false);

  return (
    <>
      <div className="bg-[#1f1d2b] rounded-3xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col h-full">
        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3">
          <Image
            src={imgSrc}
            alt={guide.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            onError={() => setImgSrc('/assets/tourGuide/fallback.webp')}
            priority={false}
          />
        </div>

        <h3 className="text-lg font-semibold mb-1 text-white line-clamp-2">{guide.name}</h3>
        <p className="text-gray-300 text-sm mb-1">🗣️ {guide.language}</p>
        <p className="text-blue-300 font-semibold mt-1 mb-2">💰 {guide.price}</p>
        <p className="text-gray-400 text-sm mt-2 flex-grow leading-normal line-clamp-3">{guide.description}</p>

        <button
          onClick={handleContactClick}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Contact Guide
        </button>
      </div>

      <AnimatePresence>
        {showContactModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[9999]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-[#0e253b] rounded-2xl p-6 w-full max-w-sm shadow-xl text-white relative"
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
                aria-label="Close contact modal"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold mb-4 text-blue-300">Contact {guide.name}</h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail size={20} className="text-blue-400 mr-3" />
                  <p className="text-gray-200">
                    <strong className="text-white">Email:</strong>{' '}
                    <a href={`mailto:${email}`} className="text-blue-400 hover:underline">
                      {email}
                    </a>
                  </p>
                </div>
                <div className="flex items-center">
                  <Phone size={20} className="text-green-400 mr-3" />
                  <p className="text-gray-200">
                    <strong className="text-white">Phone:</strong>{' '}
                    <a href={`tel:${phone}`} className="text-green-400 hover:underline">
                      {phone}
                    </a>
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-400 mt-6">
                For direct booking or inquiries, please use the contact details above to connect with your chosen guide.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TourGuideCard;
