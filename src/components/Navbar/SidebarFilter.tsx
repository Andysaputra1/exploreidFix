'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface SidebarFilterProps {
  showFilter: boolean;
  filterRef: React.RefObject<HTMLButtonElement | null>;
  selectedExperience: string;
  selectedActivity: string;
  selectedCrowdness: string;
  setSelectedExperience: (value: string) => void;
  setSelectedActivity: (value: string) => void;
  setSelectedCrowdness: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  showFilter,
  filterRef,
  selectedExperience,
  selectedActivity,
  selectedCrowdness,
  setSelectedExperience,
  setSelectedActivity,
  setSelectedCrowdness,
  onApply,
  onReset,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const animateFilter = searchParams.get('animateFilter');

  const shouldDisableAnimation = animateFilter === 'false';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        const blurEvent = new CustomEvent('blurFilter');
        window.dispatchEvent(blurEvent);
      }
    };

    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter, filterRef]);

  return (
    <AnimatePresence>
      {showFilter && (
        <motion.div
          ref={dropdownRef}
          initial={shouldDisableAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={shouldDisableAnimation ? { duration: 0 } : { duration: 0.2 }}
          className="absolute top-full right-0 mt-2 w-80 bg-white shadow-xl rounded-xl p-4 z-50"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Experience</h4>
              <div className="space-y-1 text-gray-700">
                {[
                  'Nature',
                  'Beach',
                  'Cultural & Temple Visits',
                  'Adventure',
                  'Wildlife',
                  'Relaxation & Scenic Views',
                  'Historical Sites',
                ].map((exp) => (
                  <label key={exp} className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="experience"
                      value={exp}
                      checked={selectedExperience === exp}
                      onChange={() => setSelectedExperience(exp)}
                      className="mr-2"
                    />
                    {exp}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700">Activity</h4>
              <div className="space-y-1 text-gray-700">
                {[
                  'Sightseeing',
                  'Hiking & Trekking',
                  'Swimming & Snorkeling',
                  'Photography',
                  'Spiritual & Religious',
                  'Shopping & Local Markets',
                ].map((act) => (
                  <label key={act} className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="activity"
                      value={act}
                      checked={selectedActivity === act}
                      onChange={() => setSelectedActivity(act)}
                      className="mr-2"
                    />
                    {act}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700">Crowdness</h4>
              <div className="space-y-1 text-gray-700">
                {['Popular & Crowded', 'Quiet & Less Touristy', "Doesn't Matter"].map((crowd) => (
                  <label key={crowd} className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="crowdness"
                      value={crowd}
                      checked={selectedCrowdness === crowd}
                      onChange={() => setSelectedCrowdness(crowd)}
                      className="mr-2"
                    />
                    {crowd}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={onApply}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700"
              >
                Apply
              </button>
              <button
                onClick={onReset}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-300"
              >
                Reset
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarFilter;