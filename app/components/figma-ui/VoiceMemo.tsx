"use client";
import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion, useAnimationControls } from 'motion/react';

interface VoiceMemoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDragStart' | 'onDragEnd' | 'onDrag' | 'onAnimationStart'> {
  title?: string;
  rotation?: number;
  shouldReset?: boolean;
  children?: React.ReactNode;
}

export function VoiceMemo({ className, title = "Voice", rotation = 4, shouldReset = false, children, ...props }: VoiceMemoProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useAnimationControls();

  React.useEffect(() => {
    if (shouldReset) {
      dragControls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 20 }});
    }
  }, [shouldReset, dragControls]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotation + 15 }}
      animate={dragControls}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, type: 'spring' }}
      whileHover={{ scale: 1.05, rotate: rotation > 0 ? rotation + 2 : rotation - 2, zIndex: 40 }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      className={cn(
        "relative w-56 sm:w-64 bg-white shadow-[2px_6px_15px_rgba(0,0,0,0.1)] cursor-grab active:cursor-grabbing flex flex-col",
        "rounded-[12px_12px_24px_16px/12px_12px_16px_24px]", // slightly imperfect card shape
        className
      )}
      style={{ overflow: 'visible' }}
      {...props}
    >
                {tape && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                    <Tape color="white" rotation={5} className="w-16" isDragging={isDragging} />
                  </div>
                )}
                
                {/* Orange Header */}
      <div className="w-full bg-[#f97316] py-3 flex items-center justify-center shrink-0">
        <span className="font-['Kalam'] font-bold text-white text-xl tracking-wider">{title}</span>
      </div>

      {children && (
        <div className="p-4 flex-1 text-center font-['Caveat'] text-xl text-gray-700 bg-white">
          {children}
        </div>
      )}

      {/* Cassette Reels Area */}
      <div className="flex-1 flex items-center justify-center gap-4 py-8 border-b border-gray-100 relative">
        <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-px bg-gray-100 pointer-events-none" />
        
        {/* Left Reel */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-50/50">
          <div className="w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          {/* Reel lines */}
          <div className="absolute w-10 h-px bg-gray-200" />
          <div className="absolute w-px h-10 bg-gray-200" />
        </div>

        {/* Right Reel */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-50/50">
          <div className="w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          {/* Reel lines */}
          <div className="absolute w-10 h-px bg-gray-200" />
          <div className="absolute w-px h-10 bg-gray-200" />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-16 flex items-center bg-white shrink-0">
        <div className="flex-1 border-r border-gray-100 h-full flex items-center justify-center">
          {/* Optional small details */}
        </div>
        <div className="w-1/2 h-full flex items-center justify-center border-r border-gray-100">
          {/* Red Record Button */}
          <div className="w-4 h-4 rounded-full bg-red-500 shadow-inner" />
        </div>
        <div className="flex-1 h-full flex items-center justify-center text-gray-300">
          {/* Play/Stop icon indicator */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
