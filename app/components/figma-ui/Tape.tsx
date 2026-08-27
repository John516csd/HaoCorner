"use client";
import React from 'react';
import { cn } from '../../lib/utils';
import { initialWhenVisible } from '../../lib/motion';
import { motion } from 'motion/react';

interface TapeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDragStart' | 'onDragEnd' | 'onDrag' | 'onAnimationStart'> {
  color?: 'red' | 'blue' | 'yellow' | 'green' | 'pink' | 'white';
  rotation?: number;
  isDragging?: boolean;
}

const colorMap = {
  red: 'bg-red-200/75',
  blue: 'bg-blue-200/75',
  yellow: 'bg-yellow-200/75',
  green: 'bg-green-200/75',
  pink: 'bg-pink-200/75',
  white: 'bg-white/80 border border-white/50',
};

export function Tape({ className, color = 'white', rotation = -4, isDragging = false, ...props }: TapeProps) {
  return (
    <motion.div
      initial={initialWhenVisible({ opacity: 0.75 })}
      animate={{ 
        opacity: isDragging ? 0.75 : 1, 
        rotate: rotation,
        scaleY: isDragging ? 1.25 : 1, 
        scaleX: isDragging ? 0.9 : 1,
        y: isDragging ? -4 : 0
      }}
      transition={{ delay: isDragging ? 0 : 0.2, type: 'spring', stiffness: 300, damping: 15 }}
      className={cn(
        "absolute w-24 h-8 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-colors duration-200 pointer-events-none",
        "clip-path-tape",
        colorMap[color],
        className
      )}
      style={{
        clipPath: isDragging 
          ? 'polygon(5% 5%, 95% 0%, 100% 90%, 0% 100%)' 
          : 'polygon(2% 0%, 98% 3%, 100% 95%, 4% 100%)',
        transformOrigin: "center center",
        ...props.style,
      }}
      {...props}
    />
  );
}
