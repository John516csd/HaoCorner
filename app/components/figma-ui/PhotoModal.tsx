"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { initialWhenVisible } from "../../lib/motion";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderTitle: string;
  photos: string[];
}

export function PhotoModal({ isOpen, onClose, folderTitle, photos }: PhotoModalProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      document.body.style.overflow = "hidden";
      
      return () => {
        // Delay restoring the scrollbar to match the Framer Motion exit animation duration
        timeoutRef.current = setTimeout(() => {
          document.body.style.overflow = "";
        }, 300);
      };
    }
  }, [isOpen]);

  // Clean up on unmount completely
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  // Image component that handles its own aspect ratio padding
  const ImageWithAspect = ({ src, idx }: { src: string, idx: number }) => {
    // Determine orientation based on index to mock different image shapes
    // In a real app, the image data should include width/height
    const isPortrait = idx % 3 === 0;
    const isSquare = idx % 5 === 0;
    const isLandscape = !isPortrait && !isSquare;
    
    // Set aspect ratio (width / height)
    // Make them look slightly different to give a masonry feel
    let ratio = 1.5;
    if (idx === 0) ratio = 0.67; // Portrait
    else if (idx === 1) ratio = 1.5; // Landscape
    else if (idx === 2) ratio = 1.2; // Slightly landscape
    else if (idx === 3) ratio = 0.8; // Portrait
    else if (idx === 4) ratio = 1; // Square
    else if (isPortrait) ratio = 0.75;
    else if (isSquare) ratio = 1;
    
    return (
      <div 
        className="relative w-full overflow-hidden rounded-sm"
        style={{ paddingBottom: `${(1 / ratio) * 100}%` }} // CSS trick for aspect ratio
      >
        {/* Placeholder for loading */}
        <div className="absolute inset-0 bg-gray-100 animate-pulse z-0 flex items-center justify-center">
           <svg className="w-8 h-8 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
           </svg>
        </div>
        
        <img
          src={src}
          alt={`Photo ${idx + 1} from ${folderTitle}`}
          className="absolute inset-0 w-full h-full object-cover z-10"
          loading="lazy"
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.opacity = "1";
            // Find the placeholder and hide it
            const placeholder = target.previousElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = "none";
          }}
          style={{ opacity: 0, transition: "opacity 0.3s ease-in-out" }}
        />
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={initialWhenVisible({ opacity: 0.96 })}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col bg-white/70 backdrop-blur-xl overflow-y-scroll"
        >
          {/* Header */}
          <div 
            className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 md:px-12 md:py-6 bg-white/30 backdrop-blur-md border-b border-white/50 shadow-sm"
          >
            <h2 className="font-['Kalam'] text-3xl md:text-4xl font-bold text-gray-800">
              {folderTitle}
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-white/50 hover:bg-white/80 rounded-full transition-colors backdrop-blur-sm shadow-sm"
            >
              <X size={28} className="text-gray-800" />
            </button>
          </div>

          {/* Masonry Grid */}
          <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {photos.map((src, idx) => (
                <motion.div
                  key={idx}
                  initial={initialWhenVisible({ opacity: 1, y: 20 })}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="break-inside-avoid relative group mb-6"
                >
                  <div className="bg-white p-2 md:p-3 shadow-md hover:shadow-xl transition-shadow rounded-sm flex items-center justify-center relative">
                    <ImageWithAspect src={src} idx={idx} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
