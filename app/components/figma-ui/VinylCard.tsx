"use client";
import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { initialWhenVisible } from '../../lib/motion';
import { motion, useAnimationControls, useInView, useReducedMotion } from 'motion/react';
import { Tape } from './Tape';
import { useCanDrag } from '../../hooks/use-can-drag';

interface VinylCardProps {
  coverSrc: string;
  title: string;
  artist: string;
  lyrics?: string;
  rotation?: number;
  className?: string;
  delay?: number;
  shouldReset?: boolean;
}

const cjkTextPattern =
  /[\u3000-\u303f\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef\uac00-\ud7af]/;
const cjkSegmentPattern =
  /([\u3000-\u303f\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef\uac00-\ud7af]+)/g;
const cjkOnlyPattern =
  /^[\u3000-\u303f\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef\uac00-\ud7af]+$/;

function hasCjkText(text: string | undefined) {
  return Boolean(text && cjkTextPattern.test(text));
}

function InlineCjkText({
  text,
  cjkClassName = "font-story-cn",
}: {
  text: string;
  cjkClassName?: string;
}) {
  return (
    <>
      {text.split(cjkSegmentPattern).map((segment, index) =>
        cjkOnlyPattern.test(segment) ? (
          <span key={`${segment}-${index}`} className={cjkClassName}>
            {segment}
          </span>
        ) : (
          segment
        )
      )}
    </>
  );
}

export function VinylCard({ 
  coverSrc, 
  title, 
  artist, 
  lyrics,
  rotation = 0, 
  className,
  delay = 0,
  shouldReset = false
}: VinylCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useAnimationControls();
  const canDrag = useCanDrag();
  const recordRef = React.useRef<HTMLDivElement>(null);
  const isRecordInView = useInView(recordRef, { amount: 0.1 });
  const shouldReduceMotion = useReducedMotion();
  const hasChineseLyrics = hasCjkText(lyrics);

  React.useEffect(() => {
    if (shouldReset) {
      dragControls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 20 }});
    }
  }, [shouldReset, dragControls]);

  return (
    <motion.div
      initial={initialWhenVisible({ opacity: 1, y: 30, rotate: rotation - 10 })}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      animate={dragControls}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={canDrag ? { scale: 1.05 } : undefined}
      drag={canDrag}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      className={cn(
        "relative flex flex-col items-center justify-center group w-64 md:w-72 pb-12",
        canDrag ? "cursor-grab active:cursor-grabbing" : "touch-pan-y",
        className
      )}
    >

      <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
        {/* The Vinyl Record Body (Pure Record Style) */}
        <motion.div
          ref={recordRef}
          animate={
            isRecordInView && !shouldReduceMotion
              ? { rotate: 360 }
              : { rotate: 0 }
          }
          transition={
            isRecordInView && !shouldReduceMotion
              ? { duration: 10, repeat: Infinity, ease: "linear" }
              : { duration: 0 }
          }
          className="relative w-full h-full bg-[#121212] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center border-4 border-[#222]"
          style={{
            background: 'radial-gradient(circle, #2a2a2a 0%, #111 40%, #0a0a0a 100%)'
          }}
        >
          {/* Detailed Vinyl Grooves */}
          <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none"></div>
          <div className="absolute inset-4 rounded-full border border-black/50 pointer-events-none"></div>
          <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none"></div>
          <div className="absolute inset-8 rounded-full border border-black/50 pointer-events-none"></div>
          <div className="absolute inset-10 rounded-full border border-white/5 pointer-events-none"></div>
          <div className="absolute inset-14 rounded-full border border-black/30 pointer-events-none"></div>
          
          {/* Light reflection gradient overlay */}
          <div 
            className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.2) 45deg, transparent 90deg, transparent 180deg, rgba(255,255,255,0.2) 225deg, transparent 270deg)'
            }}
          ></div>

          {/* Center Label (Album Cover as Circle) */}
          <div className="relative w-[45%] h-[45%] rounded-full overflow-hidden border-2 border-[#111] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] z-10 bg-gray-200">
            <img 
              src={coverSrc} 
              alt={`${title} by ${artist}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            
            {/* The spindle hole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#faf9f6] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.2)] border border-gray-400"></div>
          </div>
        </motion.div>
      </div>

      {/* Hand-written text underneath */}
      <div className={cn(
        "absolute -bottom-6 left-1/2 -translate-x-1/2 text-center z-20 shadow-[2px_4px_10px_rgba(0,0,0,0.1)] border border-gray-200/50 min-w-[200px] overflow-hidden",
        lyrics ? "w-max max-w-[280px] px-6 py-4 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#fff7b0]" : "w-max px-6 py-2 rounded-full bg-white/90 backdrop-blur-sm"
      )}>
        {lyrics && (
          <div 
            className="absolute inset-0 pointer-events-none z-0 opacity-40"
            style={{
              backgroundImage: 'linear-gradient(#d1d5db 1px, transparent 1px)',
              backgroundSize: '100% 2rem',
              backgroundPosition: '0 1.5rem'
            }}
          />
        )}
        {lyrics ? (
          <p
            className={cn(
              "relative z-10 whitespace-pre-line pt-1 text-gray-800 font-['Caveat']",
              hasChineseLyrics
                ? "text-lg leading-[1.8rem] md:text-xl md:leading-[2rem]"
                : "text-xl leading-[2rem] md:text-2xl"
            )}
          >
            <span aria-hidden="true">"</span>
            <InlineCjkText text={lyrics} />
            <span aria-hidden="true">"</span>
          </p>
        ) : (
          <>
            <h3
              className="relative z-10 font-['Kalam'] text-xl font-bold leading-tight text-gray-800 md:text-2xl"
            >
              <InlineCjkText text={title} />
            </h3>
            <p
              className="relative z-10 font-['Caveat'] text-lg text-gray-600 md:text-xl"
            >
              <InlineCjkText text={artist} />
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
