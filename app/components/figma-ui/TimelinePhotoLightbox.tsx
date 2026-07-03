"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

interface TimelinePhoto {
  id: string;
  imageUrl: string;
  caption: string;
  title: string;
  rotation: number;
  imageAspectClassName?: string;
}

interface TimelinePhotoLightboxProps {
  photo: TimelinePhoto | null;
  onClose: () => void;
}

const paperBackground = {
  backgroundColor: "#f8f7f2",
  backgroundImage:
    "linear-gradient(#e5e2da 1px, transparent 1px), linear-gradient(90deg, #e5e2da 1px, transparent 1px), linear-gradient(#eeebe3 1px, transparent 1px), linear-gradient(90deg, #eeebe3 1px, transparent 1px)",
  backgroundSize: "48px 48px, 48px 48px, 12px 12px, 12px 12px",
} satisfies React.CSSProperties;

export function TimelinePhotoLightbox({
  photo,
  onClose,
}: TimelinePhotoLightboxProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!photo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [photo, onClose]);

  const isWide = photo?.imageAspectClassName?.includes("16/10");
  const imageMaxWidth = isWide ? "min(88vw, 760px)" : "min(82vw, 520px)";

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[120] flex min-h-screen cursor-zoom-out items-center justify-center overflow-hidden px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-label={`${photo.title} photo preview`}
        >
          <div
            className="absolute inset-0 opacity-95"
            style={paperBackground}
          />
          <div className="absolute inset-0 bg-white/35" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-full bg-white/80 p-2 text-gray-800 shadow-[0_6px_18px_rgba(31,41,55,0.14)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 sm:right-8 sm:top-8"
            aria-label="Close photo preview"
          >
            <X size={24} />
          </button>

          <motion.div
            key={photo.id}
            className="relative z-10 inline-flex max-w-[calc(100vw-2rem)] flex-col items-center bg-white p-3 pb-12 shadow-[0_18px_44px_rgba(28,33,42,0.22),0_8px_18px_rgba(28,33,42,0.12)] transform-gpu will-change-transform [contain:layout_paint_style] sm:p-4 sm:pb-16"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: 32,
                    scale: 0.86,
                    rotate: photo.rotation - 8,
                  }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate:
                      photo.rotation > 0
                        ? Math.min(photo.rotation, 2)
                        : Math.max(photo.rotation, -2),
                  }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: 18,
                    scale: 0.94,
                    rotate: photo.rotation,
                  }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : 0.34,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative max-w-full overflow-hidden bg-[#f3f1eb]">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                decoding="async"
                draggable={false}
                className="h-auto max-h-[72vh] w-auto select-none object-contain"
                style={{ maxWidth: imageMaxWidth }}
              />
            </div>

            <div className="absolute bottom-3 left-0 right-0 text-center font-['Kalam'] text-2xl tracking-wide text-gray-800 sm:bottom-4 sm:text-3xl">
              {photo.caption}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
