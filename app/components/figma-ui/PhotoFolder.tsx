"use client";

import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { motion, useAnimationControls } from "motion/react";

interface PhotoFolderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDragStart' | 'onDragEnd' | 'onDrag' | 'onAnimationStart'> {
  title: string;
  photoCount: number;
  coverPhotos: string[];
  stickers?: React.ReactNode;
  onClick?: () => void;
  delay?: number;
}

export function PhotoFolder({
  title,
  photoCount,
  coverPhotos,
  stickers,
  className,
  onClick,
  delay = 0,
  ...props
}: PhotoFolderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center cursor-pointer",
        className
      )}
      {...props}
    >
      <div className="relative w-40 h-32 sm:w-48 sm:h-36 mt-4">
        {/* Back Cover & Tab - Faint Blue Tint */}
        <div className="absolute bottom-0 w-full h-[85%] bg-[#e2eaf4] rounded-xl rounded-tr-sm shadow-inner" />
        <div className="absolute top-[3%] left-0 w-[45%] h-[15%] bg-[#e2eaf4] rounded-t-lg" />

        {/* Photos Sticking Out */}
        <div className="absolute inset-0 top-[10%] left-0 right-0 flex justify-center items-end px-2 z-10 transition-transform duration-300 group-hover:-translate-y-4">
          {coverPhotos.map((src, idx) => {
            // Adjust rotations and translations to match the reference image closely
            // Left photo
            let rotation = -14;
            let translateX = -22;
            let translateY = -12;
            let zIndex = 10;
            
            // Middle photo
            if (idx % 3 === 1) {
              rotation = 0;
              translateX = 0;
              translateY = -24;
              zIndex = 12;
            }
            // Right photo
            else if (idx % 3 === 2) {
              rotation = 14;
              translateX = 22;
              translateY = -12;
              zIndex = 11;
            }
            
            return (
              <div
                key={idx}
                className="absolute w-16 h-20 sm:w-20 sm:h-24 bg-white p-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-gray-200/60 rounded-[3px] origin-bottom"
                style={{
                  transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg)`,
                  zIndex: zIndex,
                }}
              >
                <div className="relative w-full h-full bg-gray-100 overflow-hidden rounded-[2px]">
                  <img
                    src={src}
                    alt={`Cover ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Frosted Front Cover - Faint Blue Tint */}
        <div className="absolute bottom-0 w-full h-[85%] rounded-xl rounded-tr-sm bg-[#f0f6ff]/40 backdrop-blur-md border border-white/70 shadow-[0_8px_32px_rgba(0,10,30,0.06)] z-20 flex items-center justify-center p-2">
          {/* Stickers inside or on the front cover */}
          {stickers && (
            <div className="absolute inset-0 w-full h-full overflow-hidden rounded-xl z-30">
              {stickers}
            </div>
          )}
          {/* Folder bottom line detail */}
          <div className="absolute bottom-3 left-4 right-4 h-1 border-b-2 border-white/50 rounded-full" />
        </div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="font-['Kalam'] text-xl sm:text-2xl font-bold text-gray-800">
          {title}
        </h3>
        <p className="font-['Caveat'] text-lg text-gray-500 bg-gray-200/50 rounded-full px-3 py-0.5 inline-block mt-1">
          {photoCount} photos
        </p>
      </div>
    </motion.div>
  );
}
