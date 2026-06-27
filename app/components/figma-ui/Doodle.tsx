"use client";
import React from 'react';
import { cn } from '../../lib/utils';
import { initialWhenVisible } from '../../lib/motion';
import { motion } from 'motion/react';

interface DoodleProps extends React.SVGAttributes<SVGSVGElement> {
  path: string;
  delay?: number;
}

export function Doodle({ path, className, delay = 0.5, viewBox = "0 0 100 100", ...props }: DoodleProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="none"
      className={cn("absolute pointer-events-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round", className)}
      initial={initialWhenVisible({ pathLength: 0, opacity: 0 })}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, delay, ease: "easeInOut" }}
      {...(props as any)}
    >
      <motion.path d={path} />
    </motion.svg>
  );
}
