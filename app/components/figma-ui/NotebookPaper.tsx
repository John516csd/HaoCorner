"use client";
import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion, useAnimationControls } from 'motion/react';
import { Tape } from './Tape';
import { useIsMobile } from '../../hooks/use-mobile';

interface NotebookPaperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDragStart' | 'onDragEnd' | 'onDrag' | 'onAnimationStart'> {
  children: React.ReactNode;
  headerText?: string;
  rotation?: number;
  tape?: boolean;
  shouldReset?: boolean;
}

export function NotebookPaper({ children, className, headerText, rotation = -2, tape = true, shouldReset = false, ...props }: NotebookPaperProps) {
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
      initial={{ opacity: 0, x: -20, rotate: rotation - 10 }}
      animate={dragControls}
      whileInView={{ opacity: 1, x: 0, rotate: rotation }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, type: 'spring' }}
      whileHover={{ scale: 1.05, rotate: rotation > 0 ? rotation + 2 : rotation - 2, zIndex: 40 }}
      drag={!isMobile}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      className={cn(
        "relative shadow-[2px_6px_15px_rgba(0,0,0,0.12)] font-['Caveat'] text-2xl text-gray-800 cursor-grab active:cursor-grabbing flex flex-col",
        "rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#fdfbf7]",
        className
      )}
      style={{ overflow: 'visible', ...props.style }}
      {...props}
    >
          {tape && (
            <Tape 
              color="white" 
              rotation={-3} 
              isDragging={isDragging}
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-7 z-50 pointer-events-none" 
            />
          )}

          {/* Yellow Header */}
      <div className="w-full bg-[#ffea2e] h-12 flex items-center justify-center relative z-10 shrink-0 border-b border-gray-200/50">
        {headerText && (
          <span className="font-['Kalam'] font-bold text-gray-800 text-xl tracking-wide">{headerText}</span>
        )}
      </div>

      {/* Ruled Lines Background */}
      <div 
        className="absolute inset-0 top-12 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: 'linear-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '100% 2.5rem',
          backgroundPosition: '0 0.5rem'
        }}
      />

      {/* Content Area */}
      <div className="p-5 pt-3 relative z-10 flex-1 leading-[2.5rem]">
        {children}
      </div>
    </motion.div>
  );
}
