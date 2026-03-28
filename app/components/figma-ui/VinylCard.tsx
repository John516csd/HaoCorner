"use client";
import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion, useAnimationControls } from 'motion/react';
import { Tape } from './Tape';

interface VinylCardProps {
  coverSrc: string;
  title: string;
  artist: string;
  rotation?: number;
  tapeColor?: 'red' | 'blue' | 'yellow' | 'green' | 'pink' | 'white';
  className?: string;
  delay?: number;
  shouldReset?: boolean;
}

export function VinylCard({ 
  coverSrc, 
  title, 
  artist, 
  rotation = 0, 
  tapeColor = 'white',
  className,
  delay = 0,
  shouldReset = false
}: VinylCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useAnimationControls();

  React.useEffect(() => {
    if (shouldReset) {
      dragControls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 20 }});
    }
  }, [shouldReset, dragControls]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotation - 10 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      animate={dragControls}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover="hover"
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      className={cn("relative flex flex-col items-center group w-48 md:w-56 cursor-grab active:cursor-grabbing", className)}
    >
      {/* Tape to stick the cover */}
      <Tape 
        color={tapeColor} 
        rotation={-rotation + 2} 
        isDragging={isDragging}
        className="absolute -top-4 z-30 pointer-events-none" 
      />

      <div className="relative w-full aspect-square mb-4">
        {/* The Vinyl Record */}
        <motion.div 
          variants={{
            hover: { x: 30, rotate: 90 }
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="absolute inset-0 bg-[#121212] rounded-full shadow-[2px_2px_10px_rgba(0,0,0,0.3)] z-0 flex items-center justify-center border border-[#222]"
        >
          {/* Vinyl Grooves */}
          <div className="w-[90%] h-[90%] rounded-full border border-white/5 flex items-center justify-center">
            <div className="w-[80%] h-[80%] rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-[70%] h-[70%] rounded-full border border-white/5 flex items-center justify-center">
                {/* Vinyl Label */}
                <div className="w-[40%] h-[40%] rounded-full bg-red-400 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Album Cover */}
        <div className="absolute inset-0 z-10 bg-white p-1 pb-2 shadow-[2px_4px_12px_rgba(0,0,0,0.15)] rounded-sm">
          <img 
            src={coverSrc} 
            alt={`${title} by ${artist}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Hand-written text underneath */}
      <div className="text-center z-20">
        <h3 className="font-['Kalam'] font-bold text-xl text-gray-800 leading-tight">
          {title}
        </h3>
        <p className="font-['Caveat'] text-lg text-gray-600">
          {artist}
        </p>
      </div>
    </motion.div>
  );
}
