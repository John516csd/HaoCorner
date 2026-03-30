"use client";
import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion, useAnimationControls } from 'motion/react';
import { Tape } from './Tape';
import { useIsMobile } from '../../hooks/use-mobile';

interface PolaroidProps {
  imageSrc: string;
  caption?: string;
  className?: string;
  rotation?: number;
  tapeColor?: 'red' | 'blue' | 'yellow' | 'green' | 'pink' | 'white';
  shouldReset?: boolean;
}

export function Polaroid({ imageSrc, caption, className, rotation = -3, tapeColor = 'white', shouldReset = false }: PolaroidProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useAnimationControls();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (shouldReset) {
      dragControls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 20 }});
    }
  }, [shouldReset, dragControls]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
      animate={dragControls}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.05, rotate: rotation > 0 ? rotation + 2 : rotation - 2, zIndex: 50 }}
      drag={!isMobile}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.1, zIndex: 60 }}
      className={cn(
        "relative bg-white p-3 pb-10 shadow-[2px_4px_16px_rgba(0,0,0,0.15)] max-w-sm rounded-sm cursor-grab active:cursor-grabbing",
        className
      )}
    >
      <Tape 
        color={tapeColor} 
        rotation={-rotation - 1} 
        isDragging={isDragging}
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 z-10 pointer-events-none" 
      />
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={caption || 'Polaroid photo'}
          className="w-full h-full object-cover"
        />
      </div>
      {caption && (
        <div className="absolute bottom-3 left-0 right-0 text-center text-xl font-['Kalam'] text-gray-800 tracking-wide transform -rotate-1">
          {caption}
        </div>
      )}
    </motion.div>
  );
}
