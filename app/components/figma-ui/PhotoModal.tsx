"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const selectedPhoto =
    selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

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

  useEffect(() => {
    if (!isOpen) {
      setSelectedPhotoIndex(null);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (selectedPhotoIndex !== null) {
        setSelectedPhotoIndex(null);
      } else {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, selectedPhotoIndex]);

  useEffect(() => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex >= photos.length) {
      setSelectedPhotoIndex(null);
    }
  }, [photos.length, selectedPhotoIndex]);

  // Clean up on unmount completely
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  // Keep each photo at its natural aspect ratio inside the masonry layout.
  const ImageWithAspect = ({ src, idx }: { src: string, idx: number }) => {
    return (
      <div className="w-full overflow-hidden rounded-sm bg-gray-100">
        <img
          src={src}
          alt={`Photo ${idx + 1} from ${folderTitle}`}
          className="h-auto w-full object-contain"
          loading="lazy"
          decoding="async"
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
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className="block w-full cursor-zoom-in bg-white p-2 md:p-3 shadow-md hover:shadow-xl transition-shadow rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-4 focus-visible:ring-offset-white/70"
                    aria-label={`Open photo ${idx + 1} from ${folderTitle}`}
                  >
                    <ImageWithAspect src={src} idx={idx} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedPhoto && selectedPhotoIndex !== null && (
              <motion.div
                className="fixed inset-0 z-[130] flex cursor-zoom-out items-center justify-center bg-[#faf9f6]/90 px-4 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
                onClick={() => setSelectedPhotoIndex(null)}
                role="dialog"
                aria-modal="true"
                aria-label={`Photo ${selectedPhotoIndex + 1} preview`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="absolute right-4 top-4 z-20 rounded-full bg-white/85 p-2 text-gray-800 shadow-[0_6px_18px_rgba(31,41,55,0.14)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 sm:right-8 sm:top-8"
                  aria-label="Close photo preview"
                >
                  <X size={24} />
                </button>

                <motion.div
                  className="relative max-h-[86vh] max-w-[min(92vw,1120px)] cursor-default bg-white p-2 shadow-[0_18px_44px_rgba(28,33,42,0.22),0_8px_18px_rgba(28,33,42,0.12)] transform-gpu sm:p-3"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 24, scale: 0.94 }
                  }
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 16, scale: 0.96 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.26,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <img
                    src={selectedPhoto}
                    alt={`Photo ${selectedPhotoIndex + 1} from ${folderTitle}`}
                    className="max-h-[78vh] w-auto max-w-full select-none object-contain"
                    decoding="async"
                    draggable={false}
                  />
                  <div className="mt-2 text-center font-['Caveat'] text-xl text-gray-500">
                    {selectedPhotoIndex + 1} / {photos.length}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
