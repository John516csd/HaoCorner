"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react";
import type { AlbumPhoto, PhotoAlbum } from "../../data/home";
import { fallbackPhotoSize, getPhotoSize } from "../../data/photo-sizes";
import { cn } from "../../lib/utils";
import { initialWhenVisible } from "../../lib/motion";

interface PhotoModalProps {
  album: PhotoAlbum | null;
  onClose: () => void;
}

const legacyPhotoStoryPlaceholder = "Story coming soon.";
const legacyAlbumNotePlaceholder = "Personal notes will be added here later.";

function getVisibleText(value: string | undefined, hiddenValue?: string) {
  const text = value?.trim() || "";
  if (!text) return "";
  if (hiddenValue && text === hiddenValue) return "";
  return text;
}

function ImageWithAspect({
  photo,
  idx,
  albumTitle,
}: {
  photo: AlbumPhoto;
  idx: number;
  albumTitle: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const size = getPhotoSize(photo.src);

  return (
    <div
      className="relative w-full overflow-hidden rounded-sm bg-[#f8fafc]"
      style={{ aspectRatio: `${size.width} / ${size.height}` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
      <img
        src={photo.src}
        alt={`Photo ${idx + 1} from ${albumTitle}`}
        width={size.width}
        height={size.height}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
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

function AlbumStoryNote({
  album,
  className,
}: {
  album: PhotoAlbum;
  className?: string;
}) {
  const visibleNote = getVisibleText(album.note, legacyAlbumNotePlaceholder);

  return (
    <motion.div
      initial={initialWhenVisible({ opacity: 1, y: 18 })}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={cn(
        "relative z-20 mx-auto flex aspect-square w-full max-w-[21rem] flex-col justify-center rounded-sm bg-[#fff3a8] px-6 py-7 text-gray-800 shadow-[0_16px_34px_rgba(31,41,55,0.14),0_4px_0_rgba(255,255,255,0.5)_inset] lg:max-w-none lg:px-7 lg:py-7",
        className
      )}
    >
      <div className="absolute left-1/2 top-0 h-7 w-24 -translate-x-1/2 -translate-y-1/2 bg-pink-200/65 shadow-[0_1px_3px_rgba(0,0,0,0.08)] backdrop-blur-sm" />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-handnote text-lg leading-tight text-gray-600 sm:text-xl">
        {album.date && (
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={17} />
            {album.date}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={17} />
          {album.location}
        </span>
      </div>
      <h2 className="mt-2 font-handnote-title text-4xl font-bold leading-none text-gray-900 sm:text-5xl lg:text-4xl">
        {album.title}
      </h2>
      <p className="mt-4 font-handnote text-xl leading-snug text-gray-700 sm:text-2xl lg:text-lg xl:text-xl">
        {album.description}
      </p>
      {visibleNote && (
        <p className="mt-3 border-t-2 border-dashed border-yellow-500/25 pt-3 font-handnote text-lg leading-snug text-gray-600 sm:text-xl lg:text-base xl:text-lg">
          {visibleNote}
        </p>
      )}
    </motion.div>
  );
}

export function PhotoModal({ album, onClose }: PhotoModalProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const shouldReduceMotion = useReducedMotion();
  const isOpen = Boolean(album);
  const photos = album?.photos ?? [];
  const selectedPhoto =
    selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;
  const selectedPhotoSize = selectedPhoto
    ? getPhotoSize(selectedPhoto.src)
    : fallbackPhotoSize;
  const selectedPhotoRatio = selectedPhotoSize.width / selectedPhotoSize.height;
  const selectedPhotoStory = getVisibleText(
    selectedPhoto?.story,
    legacyPhotoStoryPlaceholder
  );

  const goToPreviousPhoto = useCallback(() => {
    if (!photos.length) return;
    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;
      return currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    });
  }, [photos.length]);

  const goToNextPhoto = useCallback(() => {
    if (!photos.length) return;
    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;
      return currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    });
  }, [photos.length]);

  useEffect(() => {
    if (isOpen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      document.body.style.overflow = "hidden";

      return () => {
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
      if (event.key === "Escape") {
        if (selectedPhotoIndex !== null) {
          setSelectedPhotoIndex(null);
        } else {
          onClose();
        }
        return;
      }

      if (selectedPhotoIndex === null) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPreviousPhoto();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNextPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    goToNextPhoto,
    goToPreviousPhoto,
    isOpen,
    onClose,
    selectedPhotoIndex,
  ]);

  useEffect(() => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex >= photos.length) {
      setSelectedPhotoIndex(null);
    }
  }, [photos.length, selectedPhotoIndex]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  if (!album) {
    return null;
  }

  const handlePreviewTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchStart = touchStartRef.current;
    touchStartRef.current = null;

    if (!touchStart || selectedPhotoIndex === null) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const isHorizontalSwipe =
      Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4;

    if (!isHorizontalSwipe) return;

    if (deltaX > 0) {
      goToPreviousPhoto();
    } else {
      goToNextPhoto();
    }
  };

  const photoPreview = (
    <AnimatePresence>
      {selectedPhoto && selectedPhotoIndex !== null && (
        <motion.div
          className="fixed inset-0 z-[130] flex cursor-zoom-out items-center justify-center overflow-hidden overscroll-contain bg-[#faf9f6]/92 px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
          onClick={() => setSelectedPhotoIndex(null)}
          onWheel={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onTouchMove={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${selectedPhotoIndex + 1} preview`}
        >
          <button
            type="button"
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute right-4 top-4 z-30 rounded-full bg-white/85 p-2 text-gray-800 shadow-[0_6px_18px_rgba(31,41,55,0.14)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 sm:right-8 sm:top-8"
            aria-label="Close photo preview"
          >
            <X size={24} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPreviousPhoto();
                }}
                className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-800 shadow-[0_6px_18px_rgba(31,41,55,0.14)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 sm:left-8"
                aria-label="Show previous photo"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNextPhoto();
                }}
                className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-800 shadow-[0_6px_18px_rgba(31,41,55,0.14)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 sm:right-8"
                aria-label="Show next photo"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          <motion.div
            className="relative max-h-[calc(100dvh-3rem)] max-w-[min(92vw,1120px)] cursor-default bg-white p-2 shadow-[0_18px_44px_rgba(28,33,42,0.22),0_8px_18px_rgba(28,33,42,0.12)] transform-gpu sm:p-3"
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
            onTouchStart={(event) => {
              const touch = event.touches[0];
              if (!touch) return;
              touchStartRef.current = {
                x: touch.clientX,
                y: touch.clientY,
              };
            }}
            onTouchEnd={handlePreviewTouchEnd}
          >
            <div
              className="relative overflow-hidden bg-[#f8fafc]"
              style={{
                aspectRatio: `${selectedPhotoSize.width} / ${selectedPhotoSize.height}`,
                width: `min(calc(92vw - 1.5rem), calc(1120px - 1.5rem), calc(68vh * ${selectedPhotoRatio}))`,
              }}
            >
              <img
                src={selectedPhoto.src}
                alt={`Photo ${selectedPhotoIndex + 1} from ${album.title}`}
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
            {selectedPhotoStory && (
              <p className="font-story-cn mx-auto mt-2 max-w-[34rem] px-3 pb-3 text-center text-sm leading-relaxed text-gray-600 sm:px-6 sm:text-base">
                {selectedPhotoStory}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={initialWhenVisible({ opacity: 0.96 })}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex flex-col overflow-y-scroll overscroll-contain bg-white/70 backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="fixed right-4 top-4 z-20 rounded-full bg-white/75 p-2 text-gray-800 shadow-[0_6px_18px_rgba(31,41,55,0.12)] backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 sm:right-8 sm:top-8"
              aria-label="Close photo album"
            >
              <X size={28} />
            </button>

            <div className="mx-auto w-full max-w-7xl p-6 pt-20 md:p-12 md:pt-24">
              <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
                <div className="mb-6 break-inside-avoid">
                  <AlbumStoryNote album={album} />
                </div>

                {photos.map((photo, idx) => (
                  <motion.div
                    key={photo.src}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, scale: 0.985 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: shouldReduceMotion
                        ? 0
                        : Math.min(idx * 0.025, 0.3),
                      duration: shouldReduceMotion ? 0 : 0.28,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 1.012,
                            rotate: idx % 2 === 0 ? -0.25 : 0.25,
                          }
                    }
                    className="group relative mb-6 break-inside-avoid"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className="block w-full cursor-zoom-in rounded-sm bg-white p-2 shadow-md transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-4 focus-visible:ring-offset-white/70 md:p-3"
                      aria-label={`Open photo ${idx + 1} from ${album.title}`}
                    >
                      <ImageWithAspect
                        photo={photo}
                        idx={idx}
                        albumTitle={album.title}
                      />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {typeof document !== "undefined"
        ? createPortal(photoPreview, document.body)
        : null}
    </>
  );
}
