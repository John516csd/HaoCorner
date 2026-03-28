"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Tape } from './Tape';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'music', label: 'Music' },
  { id: 'contact', label: 'Contact' }
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
      initial={{ y: -100, x: '-50%', rotate: -2 }}
      animate={{ y: 0, x: '-50%', rotate: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      className="fixed top-6 left-1/2 z-50 flex items-center gap-4 md:gap-8 bg-[#fffcf2] px-6 md:px-10 py-3 shadow-[2px_6px_15px_rgba(0,0,0,0.1)] border-2 border-dashed border-gray-300"
      style={{ 
        // Generates a slightly imperfect, hand-drawn paper box look
        borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' 
      }}
    >
      {/* Tapes to stick the nav to the screen */}
      <Tape color="pink" rotation={-15} className="-top-3 -left-6 w-12 h-6 z-20" />
      <Tape color="blue" rotation={10} className="-bottom-3 -right-6 w-12 h-6 z-20" />

      {navItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => scrollToSection(e, item.id)}
          className="relative px-2 py-1 cursor-pointer no-underline group"
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <span className="relative z-10 text-xl md:text-2xl font-['Kalam'] font-bold text-gray-700 group-hover:text-black transition-colors">
            {item.label}
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
    </motion.nav>
  );
}