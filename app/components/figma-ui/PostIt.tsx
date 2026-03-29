"use client";
import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion, useAnimationControls } from 'motion/react';
import { Tape } from './Tape';

interface PostItProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDragStart' | 'onDragEnd' | 'onDrag' | 'onAnimationStart'> {
  children: React.ReactNode;
  color?: 'yellow' | 'pink' | 'green' | 'blue';
  rotation?: number;
  tape?: boolean;
  shouldReset?: boolean;
}

const colorMap = {
  yellow: 'bg-[#fff7b0]',
  pink: 'bg-[#ffcce6]',
  green: 'bg-[#ccffcc]',
  blue: 'bg-[#cce6ff]',
};

export function PostIt({ children, className, color = 'yellow', rotation = 3, tape = true, shouldReset = false, ...props }: PostItProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useAnimationControls();

  React.useEffect(() => {
    if (shouldReset) {
      dragControls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 20 }});
    }
  }, [shouldReset, dragControls]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, rotate: rotation + 10 }}
      animate={dragControls}
      whileInView={{ opacity: 1, x: 0, rotate: rotation }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, type: 'spring' }}
      whileHover={{ scale: 1.05, rotate: rotation > 0 ? rotation + 2 : rotation - 2, zIndex: 40 }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      className={cn(
        "relative p-4 shadow-[2px_4px_10px_rgba(0,0,0,0.15)] font-['Caveat'] text-2xl text-gray-800 cursor-grab active:cursor-grabbing",
        "rounded-[255px_15px_225px_15px/15px_225px_15px_255px]",
        colorMap[color],
        className
      )}
      style={{ overflow: 'visible' }}
      {...props}
    >
          {tape && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
              <Tape 
                color="white" 
                rotation={-2} 
                isDragging={isDragging}
                className="w-16 h-6" 
              />
            </div>
          )}
          <div className="pt-2">
        {children}
      </div>
    </motion.div>
  );
}
