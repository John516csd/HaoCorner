"use client";
import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion, useAnimationControls } from 'motion/react';
import { Tape } from './Tape';

interface VinylCardProps {
  coverSrc: string;
  title: string;
  artist: string;
  lyrics?: string;
  rotation?: number;
  className?: string;
  delay?: number;
  shouldReset?: boolean;
}

export function VinylCard({ 
  coverSrc, 
  title, 
  artist, 
  lyrics,
  rotation = 0, 
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
      whileHover={{ scale: 1.05 }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      className={cn("relative flex flex-col items-center justify-center group w-64 md:w-72 cursor-grab active:cursor-grabbing pb-12", className)}
    >

      <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
        {/* The Vinyl Record Body (Pure Record Style) */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative w-full h-full bg-[#121212] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center border-4 border-[#222]"
          style={{
            background: 'radial-gradient(circle, #2a2a2a 0%, #111 40%, #0a0a0a 100%)'
          }}
        >
          {/* Detailed Vinyl Grooves */}
          <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none"></div>
          <div className="absolute inset-4 rounded-full border border-black/50 pointer-events-none"></div>
          <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none"></div>
          <div className="absolute inset-8 rounded-full border border-black/50 pointer-events-none"></div>
          <div className="absolute inset-10 rounded-full border border-white/5 pointer-events-none"></div>
          <div className="absolute inset-14 rounded-full border border-black/30 pointer-events-none"></div>
          
          {/* Light reflection gradient overlay */}
          <div 
            className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.2) 45deg, transparent 90deg, transparent 180deg, rgba(255,255,255,0.2) 225deg, transparent 270deg)'
            }}
          ></div>

          {/* Center Label (Album Cover as Circle) */}
          <div className="relative w-[45%] h-[45%] rounded-full overflow-hidden border-2 border-[#111] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] z-10 bg-gray-200">
            <img 
              src={coverSrc} 
              alt={`${title} by ${artist}`}
              className="w-full h-full object-cover"
            />
            
            {/* The spindle hole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#faf9f6] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.2)] border border-gray-400"></div>
          </div>
        </motion.div>
      </div>

      {/* Hand-written text underneath */}
      <div className={cn(
        "absolute -bottom-6 left-1/2 -translate-x-1/2 text-center z-20 shadow-[2px_4px_10px_rgba(0,0,0,0.1)] border border-gray-200/50 min-w-[200px] overflow-hidden",
        lyrics ? "w-max max-w-[280px] px-6 py-4 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#fff7b0]" : "w-max px-6 py-2 rounded-full bg-white/90 backdrop-blur-sm"
      )}>
        {lyrics && (
          <div 
            className="absolute inset-0 pointer-events-none z-0 opacity-40"
            style={{
              backgroundImage: 'linear-gradient(#d1d5db 1px, transparent 1px)',
              backgroundSize: '100% 2rem',
              backgroundPosition: '0 1.5rem'
            }}
          />
        )}
        {lyrics ? (
          <p className="font-['Caveat'] text-xl md:text-2xl text-gray-800 leading-[2rem] relative z-10 pt-1">
            "{lyrics}"
          </p>
        ) : (
          <>
            <h3 className="font-['Kalam'] font-bold text-xl md:text-2xl text-gray-800 leading-tight relative z-10">
              {title}
            </h3>
            <p className="font-['Caveat'] text-lg md:text-xl text-gray-600 relative z-10">
              {artist}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
