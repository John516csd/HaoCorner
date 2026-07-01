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

type PhotoSize = {
  width: number;
  height: number;
};

const fallbackPhotoSize = { width: 4, height: 3 };

const photoSizes: Record<string, PhotoSize> = {
  "/jeju/optimized/DSCF1318.jpg": { width: 1014, height: 1800 },
  "/jeju/optimized/DSCF1363.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1368.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1383.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1395.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1396.jpg": { width: 1014, height: 1800 },
  "/jeju/optimized/DSCF1492.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1514.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1523.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1525.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1528.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1563.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1597.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1633.jpg": { width: 1014, height: 1800 },
  "/jeju/optimized/DSCF1694.jpg": { width: 1800, height: 1014 },
  "/jeju/optimized/DSCF1723.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF1820.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF1829.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF1854.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF1855.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF1856.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF1862.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF1864.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF1895.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF1928.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF1932.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF1957.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF2014.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF2021.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF2047.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF2063.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF2090.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF2097.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF2108.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF2114.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/DSCF2123.jpg": { width: 1800, height: 1014 },
  "/xinjiang/optimized/IDG_20260617_113120_748.jpg": { width: 1800, height: 1350 },
  "/street-vibe/optimized/DSCF0259.jpg": { width: 1800, height: 1200 },
  "/street-vibe/optimized/DSCF1198.jpg": { width: 1800, height: 1014 },
  "/street-vibe/optimized/DSCF1214.jpg": { width: 1014, height: 1800 },
  "/street-vibe/optimized/DSCF1228.jpg": { width: 1800, height: 1014 },
  "/street-vibe/optimized/IDG_20260102_170939_893.jpg": { width: 1350, height: 1800 },
  "/street-vibe/optimized/IDG_20260102_172015_065.jpg": { width: 1350, height: 1800 },
  "/street-vibe/optimized/IDG_20260103_114159_988.jpg": { width: 1800, height: 1350 },
  "/street-vibe/optimized/IDG_20260103_122437_006.jpg": { width: 1350, height: 1800 },
  "/street-vibe/optimized/IDG_20260103_122941_767.jpg": { width: 1350, height: 1800 },
  "/street-vibe/optimized/IDG_20260103_125128_532.jpg": { width: 1350, height: 1800 },
  "/street-vibe/optimized/IDG_20260108_174548_539.jpg": { width: 1350, height: 1800 },
  "/street-vibe/optimized/IDG_20260513_190259_974.jpg": { width: 1350, height: 1800 },
  "/street-vibe/optimized/IDG_20260513_191107_275.jpg": { width: 1350, height: 1800 },
  "/street-vibe/optimized/IDG_20260513_191210_421.jpg": { width: 1800, height: 1350 },
  "/street-vibe/optimized/IDG_20260524_180357_350.jpg": { width: 1800, height: 1350 },
  "/street-vibe/optimized/IMG_20250708_191226.jpg": { width: 1800, height: 1350 },
};

function getPhotoSize(src: string): PhotoSize {
  return photoSizes[src] ?? fallbackPhotoSize;
}

function ImageWithAspect({
  src,
  idx,
  folderTitle,
}: {
  src: string;
  idx: number;
  folderTitle: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const size = getPhotoSize(src);

  return (
    <div
      className="relative w-full overflow-hidden rounded-sm bg-[#f8fafc]"
      style={{ aspectRatio: `${size.width} / ${size.height}` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
      <img
        src={src}
        alt={`Photo ${idx + 1} from ${folderTitle}`}
        width={size.width}
        height={size.height}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

export function PhotoModal({ isOpen, onClose, folderTitle, photos }: PhotoModalProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const selectedPhoto =
    selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;
  const selectedPhotoSize = selectedPhoto ? getPhotoSize(selectedPhoto) : fallbackPhotoSize;
  const selectedPhotoRatio = selectedPhotoSize.width / selectedPhotoSize.height;

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
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0, scale: 0.985 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : Math.min(idx * 0.025, 0.3),
                    duration: shouldReduceMotion ? 0 : 0.28,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { scale: 1.012, rotate: idx % 2 === 0 ? -0.25 : 0.25 }
                  }
                  className="break-inside-avoid relative group mb-6"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className="block w-full cursor-zoom-in bg-white p-2 md:p-3 shadow-md transition-shadow hover:shadow-xl rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-4 focus-visible:ring-offset-white/70"
                    aria-label={`Open photo ${idx + 1} from ${folderTitle}`}
                  >
                    <ImageWithAspect src={src} idx={idx} folderTitle={folderTitle} />
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
                      : { opacity: 0, rotate: -0.8, scale: 0.965 }
                  }
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, rotate: 0, scale: 1 }
                  }
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, rotate: 0.4, scale: 0.985 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.22,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div
                    className="relative overflow-hidden bg-[#f8fafc]"
                    style={{
                      aspectRatio: `${selectedPhotoSize.width} / ${selectedPhotoSize.height}`,
                      width: `min(92vw, 1120px, calc(78vh * ${selectedPhotoRatio}))`,
                    }}
                  >
                    <img
                      src={selectedPhoto}
                      alt={`Photo ${selectedPhotoIndex + 1} from ${folderTitle}`}
                      width={selectedPhotoSize.width}
                      height={selectedPhotoSize.height}
                      className="absolute inset-0 h-full w-full select-none object-contain"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
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
