"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Tape } from './Tape';
import { initialWhenVisible } from '../../lib/motion';

const navItems = [
  { id: 'hero', label: 'Home', shortLabel: 'Home' },
  { id: 'about', label: 'About', shortLabel: 'About' },
  { id: 'music', label: 'Music', shortLabel: 'Music' },
  { id: 'photography', label: 'Moments', shortLabel: 'Photos' },
  { id: 'contact', label: 'Contact', shortLabel: 'Contact' }
];

export function NavBar() {
  const [hovered, setHovered] = useState<string | null>(null);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={initialWhenVisible({ y: -12, x: '-50%', rotate: -2 })}
      animate={{ y: 0, x: '-50%', rotate: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      className="fixed top-4 md:top-6 left-1/2 z-50 w-[calc(100vw-24px)] max-w-sm md:w-[min(calc(100vw-32px),46rem)] md:max-w-none bg-[#fffcf2] px-2.5 sm:px-4 md:px-8 py-2 md:py-3 shadow-[2px_6px_15px_rgba(0,0,0,0.1)] border-2 border-dashed border-gray-300 overflow-visible"
      style={{ 
        // Generates a slightly imperfect, hand-drawn paper box look
        borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' 
      }}
    >
      {/* Tapes to stick the nav to the screen */}
      <Tape color="pink" rotation={-15} className="hidden sm:block -top-3 -left-6 w-12 h-6 z-20" />
      <Tape color="blue" rotation={10} className="hidden sm:block -bottom-3 -right-6 w-12 h-6 z-20" />

      <div className="relative z-10 flex w-full items-center justify-start md:justify-center gap-1.5 sm:gap-3 md:gap-7 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-label={`Go to ${item.label}`}
            onClick={(e) => scrollToSection(e, item.id)}
            className="relative flex min-h-11 flex-none items-center px-1.5 sm:px-2 py-0.5 cursor-pointer no-underline group"
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="relative z-10 whitespace-nowrap text-[0.95rem] sm:text-lg md:text-2xl font-['Kalam'] font-bold text-gray-700 group-hover:text-black transition-colors">
              <span className="md:hidden">{item.shortLabel}</span>
              <span className="hidden md:inline">{item.label}</span>
            </span>

            {hovered === item.id && (
              <motion.svg
                layoutId="nav-underline"
                className="absolute -bottom-2 left-0 w-full h-4 text-yellow-400 z-0 overflow-visible"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M 5,15 Q 50,-5 95,15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </motion.svg>
            )}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
