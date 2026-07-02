"use client";

import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { initialWhenVisible } from "../../lib/motion";
import { motion } from "motion/react";

interface PhotoFolderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDragStart' | 'onDragEnd' | 'onDrag' | 'onAnimationStart'> {
  title: string;
  date?: string;
  photoCount: number;
  coverPhotos: string[];
  stickers?: React.ReactNode;
  onClick?: () => void;
  delay?: number;
}

const photoVariants = [
  {
    closed: { rotate: -15, x: -28, y: 12, zIndex: 10 },
    open:   { rotate: -22, x: -48, y: -22, zIndex: 10 },
  },
  {
    closed: { rotate: -2, x: 0, y: -4, zIndex: 12 },
    open:   { rotate: -2, x: 0, y: -30, zIndex: 12 },
  },
  {
    closed: { rotate: 18, x: 28, y: 12, zIndex: 11 },
    open:   { rotate: 26, x: 48, y: -18, zIndex: 11 },
  },
];

const springTransition = { type: "spring" as const, stiffness: 260, damping: 22 };
const previewFrames = [
  { maxWidth: 98, maxHeight: 76 },
  { maxWidth: 106, maxHeight: 78 },
  { maxWidth: 98, maxHeight: 76 },
];

function getPreviewSize(aspectRatio: number | undefined, idx: number) {
  const frame = previewFrames[idx] ?? previewFrames[0];

  if (!aspectRatio) {
    return {
      width: frame.maxWidth,
      height: Math.round(frame.maxWidth * 0.68),
    };
  }

  const frameRatio = frame.maxWidth / frame.maxHeight;

  if (aspectRatio >= frameRatio) {
    return {
      width: frame.maxWidth,
      height: Math.round(frame.maxWidth / aspectRatio),
    };
  }

  return {
    width: Math.round(frame.maxHeight * aspectRatio),
    height: frame.maxHeight,
  };
}

export function PhotoFolder({
  title,
  date,
  photoCount,
  coverPhotos,
  stickers,
  className,
  onClick,
  delay = 0,
  ...props
}: PhotoFolderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      {...props}
      initial={initialWhenVisible({ opacity: 1, y: 30 })}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      role={isInteractive ? "button" : props.role}
      tabIndex={isInteractive ? props.tabIndex ?? 0 : props.tabIndex}
      aria-label={
        isInteractive
          ? props["aria-label"] ?? `Open ${title} photo album`
          : props["aria-label"]
      }
      className={cn(
        "relative flex flex-col items-center cursor-pointer select-none",
        className
      )}
    >
      {/* Folder body container - extra top padding for photos to fan out into */}
      <div className="relative w-[140px] h-[132px] sm:w-[190px] sm:h-[170px] mt-2">

        {/* 1. Back cover — top-left is square so the tab merges flush with it */}
        <div className="absolute bottom-0 left-0 w-full h-[78%] bg-[#e0eaf6] rounded-[16px] rounded-tl-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.04)]" />
        {/* Tab */}
        <div className="absolute bottom-[78%] left-0 w-[38%] h-[16%] bg-[#e0eaf6] rounded-tl-[16px] rounded-tr-[14px]" />

        {/* 2. Cover photos – fan out on hover using Framer Motion */}
        {coverPhotos.slice(0, 3).map((src, idx) => {
          const v = photoVariants[idx] ?? photoVariants[0];
          const previewSize = getPreviewSize(imageRatios[src], idx);

          return (
            <motion.div
              key={idx}
              animate={isHovered ? "open" : "closed"}
              variants={{
                closed: { rotate: v.closed.rotate, x: v.closed.x, y: v.closed.y },
                open:   { rotate: v.open.rotate,   x: v.open.x,   y: v.open.y   },
              }}
              transition={springTransition}
              className="absolute bg-[#f8fafc] p-[4px] shadow-[0_3px_10px_rgba(0,0,0,0.18)] border border-gray-200/60 rounded-[12px] will-change-transform"
              style={{
                width: previewSize.width,
                height: previewSize.height,
                bottom: "22%",
                left: "50%",
                marginLeft: -(previewSize.width / 2),
                zIndex: v.closed.zIndex,
                transformOrigin: "bottom center",
              }}
            >
              <div className="h-full w-full bg-white overflow-hidden rounded-[8px]">
                <img
                  src={src}
                  alt={`Cover ${idx + 1}`}
                  className="block h-full w-full"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  onLoad={(event) => {
                    const { naturalWidth, naturalHeight } = event.currentTarget;

                    if (!naturalWidth || !naturalHeight) {
                      return;
                    }

                    const nextRatio = naturalWidth / naturalHeight;

                    setImageRatios((currentRatios) => {
                      if (currentRatios[src] === nextRatio) {
                        return currentRatios;
                      }

                      return { ...currentRatios, [src]: nextRatio };
                    });
                  }}
                />
              </div>
            </motion.div>
          );
        })}

        {/* 3. Front flap – perspective container */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20"
          style={{ height: "78%", perspective: "600px" }}
        >
          <motion.div
            animate={isHovered ? "open" : "closed"}
            variants={{
              closed: { rotateX: -18, translateZ: 5, y: 0 },
              open:   { rotateX: -45, translateZ: 20, y: 8 },
            }}
            transition={springTransition}
            style={{ transformOrigin: "bottom", width: "100%", height: "100%" }}
            className="bg-[#edf2f9]/75 backdrop-blur-md border-[1.5px] border-white/70 rounded-[16px] shadow-[0_8px_32px_rgba(0,10,30,0.07)] relative overflow-hidden"
          >
            {/* Stickers slot */}
            {stickers && (
              <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[16px] z-30">
                {stickers}
              </div>
            )}

            {/* Heat-press seam lines at bottom */}
            <div className="absolute bottom-[10px] left-3 right-3 flex flex-col gap-[5px] z-20">
              <div className="h-[2px] w-full rounded-full bg-white/70 shadow-[0_1px_0px_rgba(255,255,255,0.8)]" />
              <div className="h-[2px] w-full rounded-full bg-white/70 shadow-[0_1px_0px_rgba(255,255,255,0.8)]" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Title & count */}
      <div className="mt-5 text-center">
        <h3 className="font-['Kalam'] text-xl sm:text-2xl font-bold text-[#1e293b]">
          {title}
        </h3>
        {date && (
          <p className="font-['Caveat'] text-base text-[#94a3b8] leading-none mt-0.5">
            {date}
          </p>
        )}
        <p className="font-['Caveat'] text-base sm:text-[17px] text-[#64748b] bg-[#f1f5f9] rounded-full px-3 py-0.5 inline-block mt-1">
          {photoCount} photos
        </p>
      </div>
    </motion.div>
  );
}
