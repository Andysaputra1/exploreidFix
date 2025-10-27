'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
}) => {
  const ref = useRef<HTMLSpanElement>(null); // Ubah ke HTMLSpanElement
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 12,
    stiffness: 120,
    mass: 0.8,
  });
  const displayValue = useTransform(springValue, (latest) => {
    const formatted = latest.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  return (
    <motion.span ref={ref} className="inline-block"> 
      <motion.span>{displayValue}</motion.span>
    </motion.span>
  );
};

export default AnimatedNumber;