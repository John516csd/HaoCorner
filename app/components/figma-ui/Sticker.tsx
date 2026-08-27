"use client";
import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { initialWhenVisible } from '../../lib/motion';
import { motion, useAnimationControls } from 'motion/react';
import { Tape } from './Tape';
import { useCanDrag } from '../../hooks/use-can-drag';

interface StickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDragStart' | 'onDragEnd' | 'onDrag' | 'onAnimationStart'> {
  children: React.ReactNode;
  rotation?: number;
  delay?: number;
  tape?: boolean;
  shouldReset?: boolean;
}

export function Sticker({ children, className, rotation = 5, delay = 0, tape = false, shouldReset = false, ...props }: StickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useAnimationControls();
  const canDrag = useCanDrag();

  React.useEffect(() => {
    if (shouldReset) {
      dragControls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 20 }});
    }
  }, [shouldReset, dragControls]);

  return (
    <motion.div
      initial={initialWhenVisible({ opacity: 1, scale: 0.85, rotate: rotation - 20 })}
      animate={dragControls}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={canDrag ? { scale: 1.15, rotate: rotation > 0 ? rotation + 5 : rotation - 5 } : undefined}
      drag={canDrag}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.2, zIndex: 50 }}
      className={cn(
        "relative inline-flex items-center justify-center bg-white border-4 border-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
        canDrag ? "cursor-grab active:cursor-grabbing" : "touch-pan-y",
        className
      )}
      {...props}
    >
      {tape && (
        <Tape 
          color="white" 
          rotation={-rotation + 2} 
          isDragging={isDragging}
          className="-top-4 -left-2 w-12 h-5 pointer-events-none" 
        />
      )}
      {children}
    </motion.div>
  );
}
