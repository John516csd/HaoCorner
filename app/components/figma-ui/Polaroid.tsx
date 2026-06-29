"use client";
import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { initialWhenVisible } from '../../lib/motion';
import { motion, useAnimationControls } from 'motion/react';
import { Tape } from './Tape';
import { useIsMobile } from '../../hooks/use-mobile';

interface PolaroidProps {
  imageSrc: string;
  caption?: string;
  className?: string;
  imageAspectClassName?: string;
  layoutId?: string;
  ariaLabel?: string;
  onClick?: () => void;
  dragEnabled?: boolean;
  rotation?: number;
  tapeColor?: 'red' | 'blue' | 'yellow' | 'green' | 'pink' | 'white';
  shouldReset?: boolean;
}

export function Polaroid({ imageSrc, caption, className, imageAspectClassName = 'aspect-[3/4]', layoutId, ariaLabel, onClick, dragEnabled = true, rotation = -3, tapeColor = 'white', shouldReset = false }: PolaroidProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useAnimationControls();
  const isMobile = useIsMobile();
  const isClickable = Boolean(onClick);
  const canDrag = dragEnabled && !isMobile && !isClickable;

  React.useEffect(() => {
    if (shouldReset) {
      dragControls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 20 }});
    }
  }, [shouldReset, dragControls]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      layoutId={layoutId}
      initial={initialWhenVisible({ opacity: 1, scale: 0.9, rotate: rotation - 10 })}
      animate={dragControls}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.05, rotate: rotation > 0 ? rotation + 2 : rotation - 2, zIndex: 50 }}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      drag={canDrag}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? ariaLabel || `Open ${caption || 'photo'}` : undefined}
      whileDrag={{ scale: 1.1, zIndex: 60 }}
      className={cn(
        "relative bg-white p-3 pb-10 shadow-[2px_4px_16px_rgba(0,0,0,0.15)] max-w-sm rounded-sm focus-visible:outline-none",
        isClickable
          ? "cursor-zoom-in focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#faf9f6]"
          : "cursor-grab active:cursor-grabbing",
        className
      )}
    >
      <Tape 
        color={tapeColor} 
        rotation={-rotation - 1} 
        isDragging={isDragging}
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 z-10 pointer-events-none" 
      />
      <div className={cn("relative overflow-hidden bg-gray-100", imageAspectClassName)}>
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
