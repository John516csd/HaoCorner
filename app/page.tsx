"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Laptop,
  Palette,
  Camera,
  Code,
  Sparkles,
  MapPin,
  Heart,
  Music,
  Mail,
} from "lucide-react";
import { Polaroid } from "./components/figma-ui/Polaroid";
import { Sticker } from "./components/figma-ui/Sticker";
import { PostIt } from "./components/figma-ui/PostIt";
import { Tape } from "./components/figma-ui/Tape";
import { Doodle } from "./components/figma-ui/Doodle";
import { VinylCard } from "./components/figma-ui/VinylCard";
import { NavBar } from "./components/figma-ui/NavBar";
import { NotebookPaper } from "./components/figma-ui/NotebookPaper";
import { VoiceMemo } from "./components/figma-ui/VoiceMemo";
import { PhotoFolder } from "./components/figma-ui/PhotoFolder";
import { PhotoModal } from "./components/figma-ui/PhotoModal";
import { useIsMobile } from "./hooks/use-mobile";

// Photo Folder Mock Data
const photoFolders = [
  {
    id: "japan",
    title: "Japan 2024",
    photoCount: 83,
    coverPhotos: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542051812871-75f56cc9a3a0?w=500&h=500&fit=crop",
    ],
    stickers: (
      <>
        <div className="absolute top-4 left-4 text-3xl transform -rotate-12 emoji-sticker-outline-text">
          🇯🇵
        </div>
        <div className="absolute bottom-3 right-3 text-[3.5rem] transform rotate-[15deg] emoji-sticker-outline origin-bottom-right">
          ⛩️
        </div>
      </>
    ),
    photos: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&fit=crop",
      "https://images.unsplash.com/photo-1542051812871-75f56cc9a3a0?w=800&fit=crop",
      "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=800&fit=crop",
      "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800&fit=crop",
    ]
  },
  {
    id: "paris",
    title: "Paris 2024",
    photoCount: 62,
    coverPhotos: [
      "https://images.unsplash.com/photo-1502602898657-3e90760b3746?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1520939822890-a3399479e00b?w=500&h=500&fit=crop",
    ],
    stickers: (
      <>
        <div className="absolute top-4 left-5 text-4xl transform rotate-6 emoji-sticker-outline-text">
          🗼
        </div>
        <div className="absolute bottom-4 right-5 text-3xl transform -rotate-12 emoji-sticker-outline-text">
          🥐
        </div>
      </>
    ),
    photos: [
      "https://images.unsplash.com/photo-1502602898657-3e90760b3746?w=800&fit=crop",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&fit=crop",
      "https://images.unsplash.com/photo-1520939822890-a3399479e00b?w=800&fit=crop",
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&fit=crop",
    ]
  },
  {
    id: "street",
    title: "Street Vibes",
    photoCount: 145,
    coverPhotos: [
      "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1555805562-b911c750b380?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1605371924599-2d0365da26f5?w=500&h=500&fit=crop",
    ],
    stickers: (
      <>
        <div className="absolute top-1/2 left-1/2 -translate-x-[60%] -translate-y-[60%] transform rotate-[-8deg] z-40 emoji-sticker-outline-text">
          <span className="text-3xl">📷</span>
        </div>
        <div className="absolute bottom-4 right-4 transform rotate-[12deg] z-40 emoji-sticker-outline-text">
          <span className="text-2xl" style={{ filter: 'grayscale(0.2)' }}>🎞️</span>
        </div>
      </>
    ),
    photos: [
      "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&fit=crop",
      "https://images.unsplash.com/photo-1555805562-b911c750b380?w=800&fit=crop",
      "https://images.unsplash.com/photo-1605371924599-2d0365da26f5?w=800&fit=crop",
      "https://images.unsplash.com/photo-1534533983617-640a3dd9dce8?w=800&fit=crop",
      "https://images.unsplash.com/photo-1516961642265-531546e84af2?w=800&fit=crop",
      "https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=800&fit=crop",
    ]
  }
];

export default function Page() {
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<typeof photoFolders[0] | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
        weekday: "short",
      };
      // "Sun, Mar 28, 2026"
      const dateString = now.toLocaleDateString("en-US", options);
      const parts = dateString.split(", ");
      if (parts.length === 3) {
        const weekday = parts[0];
        const monthDay = parts[1];
        const year = parts[2];
        setCurrentDate(`${monthDay}, ${year}   ${weekday}`);
      } else {
        setCurrentDate(dateString);
      }
    };
    updateDate();
    const intervalId = setInterval(updateDate, 60000);
    return () => clearInterval(intervalId);
  }, []);


  const heroPhotoUrl = "/images/me.jpg";
  const sushiPhotoUrl =
    "https://images.unsplash.com/photo-1664882589261-498d42a9ad44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHBsYXRlfGVufDF8fHx8MTc3NDYxOTE2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const concertPhotoUrl =
    "https://images.unsplash.com/photo-1576514129883-2f1d47a65da6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2V8ZW58MXx8fHwxNzc0NjAxMDcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const codePhotoUrl =
    "https://images.unsplash.com/photo-1633185072510-7fa0f164d24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwY29kZXxlbnwxfHx8fDE3NzQ3MDAwMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  const favoriteSongs = [
    {
      title: "Midnight City",
      artist: "Sunset Groove",
      duration: "3:45",
      coverUrl:
        "https://images.unsplash.com/photo-1679563837531-116c2fbe25b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGNpdHklMjBzdW5zZXR8ZW58MXx8fHwxNzc0NzAwNzM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      lyrics: "Waiting in a car, waiting for a ride in the dark...",
      tapeColor: "yellow" as const,
    },
    {
      title: "Plastic Love",
      artist: "Mariya Takeuchi",
      duration: "4:12",
      coverUrl:
        "https://images.unsplash.com/photo-1595981234969-8259b94fde88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFlc3RoZXRpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzc0NzAwNzI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      lyrics: "I'm just playing games, I know that's plastic love...",
      tapeColor: "pink" as const,
    },
    {
      title: "Indie Rock",
      artist: "The Wanderers",
      duration: "3:50",
      coverUrl:
        "https://images.unsplash.com/photo-1767462372382-b9fc964774d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMHJvY2slMjBiYW5kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc0NzAwNzI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      lyrics: "We are young and we are free, dancing in the summer breeze...",
      tapeColor: "blue" as const,
    },
    {
      title: "Lo-Fi Rain",
      artist: "Chill Beats",
      duration: "2:30",
      coverUrl:
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2ZpJTIwcmFpbnxlbnwxfHx8fDE3NzQ3MTAyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      lyrics: "Just the sound of the rain against the window pane...",
      tapeColor: "green" as const,
    },
    {
      title: "Neon Nights",
      artist: "Synthwave Rider",
      duration: "4:05",
      coverUrl:
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwY2l0eXxlbnwxfHx8fDE3NzQ3MTAyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      lyrics: "Driving through the neon glow, leaving everything I know...",
      tapeColor: "white" as const,
    },
  ];

  const timelineData = [
    {
      id: "origin",
      year: "199X",
      range: "— 201X",
      title: "Where it started",
      description:
        "Born and raised in my hometown. The early days of curiosity and exploring the world.",
      imageUrl:
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjaXR5c2NhcGV8ZW58MXx8fHwxNzc0NzkwMzIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      postItColor: "yellow" as const,
      polaroidRotation: -3,
      postItRotation: 2,
    },
    {
      id: "education",
      year: "201X",
      range: "— 202X",
      title: "University Days",
      description:
        "Dived deep into Computer Science. Late night coding sessions and endless cups of coffee. ☕",
      imageUrl: codePhotoUrl,
      postItColor: "blue" as const,
      polaroidRotation: 3,
      postItRotation: -2,
    },
    {
      id: "career",
      year: "202X",
      range: "— Now",
      title: "Frontend Engineer",
      description:
        "Building cool, interactive web applications. Turning complex problems into sleek UI.",
      imageUrl: sushiPhotoUrl,
      postItColor: "pink" as const,
      polaroidRotation: -2,
      postItRotation: -3,
    },
    {
      id: "life",
      year: "Always",
      range: "",
      title: "Life Beyond Code",
      description:
        "Huge fan of live music, photography, and exploring the outdoors. 🎸📸",
      imageUrl: concertPhotoUrl,
      postItColor: "green" as const,
      polaroidRotation: 4,
      postItRotation: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] relative overflow-x-hidden font-sans text-gray-800">
      {/* Notebook Paper Background Grid with subtle dotted lines */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundColor: "#f8f7f2", // Base paper color slightly warmer
          backgroundImage: `
            linear-gradient(90deg, transparent 95%, rgba(0, 0, 0, 0.08) 95%),
            linear-gradient(0deg, transparent 95%, rgba(0, 0, 0, 0.08) 95%)
          `,
          backgroundSize: "24px 24px, 24px 24px",
          backgroundPosition: "0 0, 0 0",
        }}
      />
      {/* Secondary overlay to create the dashed/dotted line effect on the grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #f8f7f2 50%, transparent 50%),
            linear-gradient(0deg, #f8f7f2 50%, transparent 50%)
          `,
          backgroundSize: "4px 4px, 4px 4px",
          backgroundPosition: "0 0, 0 0",
          opacity: 0.9,
        }}
      />
      {/* Notebook ring binder holes */}
      <div className="fixed top-0 bottom-0 left-0 w-8 z-0 flex flex-col justify-evenly py-20 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full bg-[#111] shadow-inner -ml-2 border-2 border-gray-300 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.8)]"
          />
        ))}
      </div>
      {/* Vertical texts on the left margin */}
      <div className="hidden md:flex fixed top-1/2 -left-14 transform -translate-y-1/2 -rotate-90 pointer-events-none z-0 items-center gap-12 font-['Noto_Sans'] text-gray-400 text-xs tracking-widest font-semibold uppercase opacity-60">
        <span>[SNL] Paper</span>
        <span className="text-gray-500 font-bold">Crena</span>
        <span>The Paper MS-69</span>
      </div>

      {/* Handwritten Date and Weather - Vertical on the left */}
      <div className="hidden md:flex fixed top-1/2 left-8 md:left-12 transform -translate-y-1/2 z-10 flex-col items-center gap-8 pointer-events-none mix-blend-multiply opacity-70">
        <div
          className="font-['Kalam'] text-xl md:text-2xl font-bold text-gray-800 tracking-wider whitespace-nowrap"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
          }}
        >
          {currentDate}
        </div>
      </div>

      {/* Notebook red margin line - replaced with a subtle indent line to match the grid */}
      <div className="fixed top-0 bottom-0 left-12 md:left-16 w-[1px] bg-gray-300/50 z-0" />

      <NavBar />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-32 min-h-screen flex items-center justify-center z-10"
      >
        {/* ================= BACKGROUND DOODLES ================= */}
        {/* Top left corner stars */}
        <Doodle
          path="M 20,20 L 30,30 M 30,15 L 30,35 M 15,30 L 35,30 M 20,40 L 30,30"
          className="w-24 h-24 text-yellow-400 top-10 left-10 md:left-32 opacity-60"
          delay={0.2}
        />
        {/* Top right swirly cloud */}
        <Doodle
          path="M 20,50 C 20,30 40,20 50,30 C 60,10 80,10 90,30 C 110,30 110,60 90,70 C 80,90 40,90 30,70 C 10,70 10,50 20,50 Z"
          className="w-48 h-48 text-blue-300 top-20 right-10 md:right-32 opacity-40"
          viewBox="0 0 120 100"
          delay={0.6}
        />
        {/* Connecting dashed line from name to photo */}
        <Doodle
          path="M 10,10 Q 50,80 90,10"
          className="w-64 h-32 text-gray-400 top-[40%] left-1/2 -translate-x-1/2 opacity-30 stroke-dashed hidden md:block"
          strokeDasharray="8 8"
          delay={1.5}
        />
        {/* Arrow pointing at the Polaroid */}
        <Doodle
          path="M 10,10 Q 30,30 50,50 L 40,50 M 50,50 L 50,40"
          className="w-20 h-20 text-pink-400 top-[30%] left-[10%] md:left-[25%] opacity-60 rotate-45"
          delay={1.2}
        />
        {/* Zig-zags on the bottom left */}
        <Doodle
          path="M 10,50 L 30,10 L 50,50 L 70,10 L 90,50"
          className="w-32 h-16 text-green-300 bottom-10 left-10 md:left-40 opacity-50"
          delay={0.8}
        />
        {/* Circles bottom right */}
        <Doodle
          path="M 50,50 m -30,0 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0 M 50,50 m -20,0 a 20,20 0 1,0 40,0 a 20,20 0 1,0 -40,0"
          className="w-24 h-24 text-purple-300 bottom-20 right-20 opacity-50"
          delay={1.0}
        />
        {/* ==================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center w-full max-w-5xl">
          {/* Left Column - Polaroid Gallery */}
          <div className="relative flex justify-center items-center h-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -15, x: -40, y: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -12, x: -40, y: -20 }}
              transition={{ delay: 0.2 }}
              className="absolute z-0 w-48 hidden md:block"
            >
              <div className="bg-white p-2 pb-8 shadow-md transform rotate-12 rounded-sm">
                <div className="aspect-square bg-blue-100 flex items-center justify-center text-gray-400">
                  <Camera size={32} />
                </div>
                <div className="absolute bottom-1 right-2 font-['Caveat'] text-gray-600 rotate-2">
                  Memories
                </div>
              </div>
              <Tape color="pink" className="-top-3 -right-6" rotation={15} />
            </motion.div>

            <div className="relative z-10">
              <Polaroid
                imageSrc={heroPhotoUrl}
                caption="KANGDING, SICHUAN, CHINA"
                rotation={-4}
                className="w-72 sm:w-80"
              />

              {/* Paperclip overlaying the corner */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.8,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="absolute -top-6 -right-2 text-[#9ca3af] z-20 cursor-grab active:cursor-grabbing hover:text-[#6b7280] transition-colors"
                drag={!isMobile}
                dragMomentum={false}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transform rotate-[30deg] drop-shadow-[2px_4px_4px_rgba(0,0,0,0.2)]"
                >
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </motion.div>
            </div>

            <PostIt
              color="yellow"
              rotation={8}
              className="absolute -left-4 md:-left-16 bottom-0 w-44 z-20"
            >
              <div className="text-xl">
                Exploring the world
                <br />& building stuff 🚀
              </div>
            </PostIt>
          </div>

          {/* Right Column - Introduction & Stickers */}
          <div className="relative flex flex-col items-center md:items-start text-center md:text-left">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3 }}
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="mb-4 bg-white rounded-full p-2 border-4 border-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] inline-block relative cursor-grab active:cursor-grabbing"
            >
              <span className="text-4xl leading-none block transform origin-bottom-right animate-wave">
                👋
              </span>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative mb-6"
            >
              <h1
                className="text-5xl md:text-7xl font-bold font-['Kalam'] tracking-tight"
                style={{
                  color: "#1f2937",
                  textShadow:
                    "-3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff, 0 6px 12px rgba(0,0,0,0.15)",
                }}
              >
                Hi, I'm Chenhao
              </h1>
              <svg
                className="absolute -bottom-4 -left-4 w-[110%] h-8 -z-10 text-yellow-300 overflow-visible"
                viewBox="0 0 200 20"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M5,15 Q100,0 195,15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                />
              </svg>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl font-['Caveat'] text-gray-600 mb-10 max-w-md leading-relaxed"
            >
              A creative developer passionate about crafting beautiful,
              interactive digital experiences. Let's make something amazing
              together!
            </motion.p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <Sticker
                rotation={-6}
                delay={0.5}
                className="px-5 py-2 bg-blue-50 text-blue-700 font-['Kalam'] text-xl cursor-grab active:cursor-grabbing shadow-sm border border-blue-100/50"
              >
                ✨ Endless Creativity
              </Sticker>
              <Sticker
                rotation={8}
                delay={0.6}
                className="px-5 py-2 bg-yellow-50 text-yellow-700 font-['Kalam'] text-xl cursor-grab active:cursor-grabbing shadow-sm border border-yellow-100/50"
              >
                🤖 AI-Driven
              </Sticker>
              <Sticker
                rotation={-4}
                delay={0.7}
                className="px-5 py-2 bg-green-50 text-green-700 font-['Kalam'] text-xl cursor-grab active:cursor-grabbing shadow-sm border border-green-100/50"
              >
                🚀 Fast Learner
              </Sticker>
              <Sticker
                rotation={10}
                delay={0.8}
                className="px-5 py-2 bg-pink-50 text-pink-700 font-['Kalam'] text-xl cursor-grab active:cursor-grabbing shadow-sm border border-pink-100/50"
              >
                🧩 Problem Solver
              </Sticker>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute -top-10 -right-4 text-pink-400 rotate-12 hidden md:block"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10,30 Q25,10 35,15 M35,15 L28,12 M35,15 L32,22" />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About / Timeline Section */}
      <section
        id="about"
        className="relative w-full max-w-5xl mx-auto px-6 py-24 z-10"
      >
        {/* Section Doodle Decor */}
        <Doodle
          path="M 10,50 Q 50,10 90,50 T 170,50"
          className="w-full h-24 text-gray-300 absolute -top-10 left-0 opacity-40"
          viewBox="0 0 200 100"
          delay={0.2}
        />

        <div className="flex flex-col items-center mb-24 relative">
          <Tape color="pink" className="top-0" rotation={-2} />

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-['Kalam'] font-bold text-gray-800 mt-4 bg-white/50 backdrop-blur-sm px-6 py-2 rounded-lg border-2 border-dashed border-gray-300 shadow-sm relative z-10">
              My Journey
            </h2>
            {/* Outline highlight behind text */}
            <Doodle
              path="M 5,20 L 95,20"
              className="w-full h-full text-yellow-200 absolute -top-1 -left-2 -z-10 opacity-70 stroke-[15px]"
              fill="currentColor"
              viewBox="0 0 100 40"
              delay={0.5}
            />
          </div>

          <Sticker
            className="absolute -right-4 md:right-1/4 top-8 bg-red-50 p-2"
            rotation={18}
          >
            <Heart className="text-red-500" />
          </Sticker>
        </div>

        {/* Journal-style Timeline Layout */}
        <div className="relative w-full flex flex-col">
          {/* Single continuous dashed spine line — desktop only */}
          <div
            className="hidden md:block absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: "calc(10rem + 24px)",
              borderLeft: "2px dashed #c9cdd4",
              zIndex: 0,
            }}
          />

          {timelineData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative py-8 md:py-14"
            >
              {/* ── Mobile layout: horizontal strip (year | photo) then postit below ── */}
              <div className="flex md:hidden flex-col gap-4">
                {/* Top row: year badge + polaroid side by side */}
                <div className="flex flex-row items-start gap-4">
                  {/* Year badge */}
                  <div className="flex-shrink-0 pt-2">
                    <span className="font-['Kalam'] font-bold text-2xl text-gray-800 leading-tight block">
                      {item.year}
                    </span>
                    {item.range && (
                      <span className="font-['Caveat'] text-base text-gray-400 block">
                        {item.range}
                      </span>
                    )}
                  </div>
                  {/* Polaroid */}
                  <Polaroid
                    imageSrc={item.imageUrl}
                    caption={item.year + (item.range ? " " + item.range : "")}
                    rotation={item.polaroidRotation}
                    className="w-44 flex-shrink-0"
                  />
                </div>
                {/* Content below, slightly offset */}
                <div className="pl-4">
                  {index % 2 === 1 ? (
                    <NotebookPaper
                      headerText={item.title}
                      rotation={item.postItRotation}
                      className="w-full max-w-xs h-auto min-h-[160px]"
                      tape={true}
                    >
                      <p className="text-lg text-gray-700">
                        {item.description}
                      </p>
                    </NotebookPaper>
                  ) : (
                    <PostIt
                      color={item.postItColor}
                      rotation={item.postItRotation}
                      className="w-full max-w-xs p-5 shadow-md"
                      tape={true}
                    >
                      <h3 className="font-['Kalam'] font-bold text-xl mb-2 text-gray-800">
                        {item.title}
                      </h3>
                      <p className="font-['Caveat'] text-lg leading-relaxed text-gray-700">
                        {item.description}
                      </p>
                    </PostIt>
                  )}
                </div>
              </div>

              {/* ── Desktop layout: [year col] [dot] [polaroid + postit] ── */}
              <div className="hidden md:flex flex-row items-start gap-0">
                {/* Left: year stamp */}
                <div className="flex-shrink-0 w-40 flex flex-col items-end pr-6 pt-5 z-10">
                  <span className="font-['Kalam'] font-bold text-4xl text-gray-800 leading-tight">
                    {item.year}
                  </span>
                  {item.range && (
                    <span className="font-['Caveat'] text-lg text-gray-400 mt-1">
                      {item.range}
                    </span>
                  )}
                </div>

                {/* Dot on the spine */}
                <div
                  className="flex-shrink-0 flex items-start pt-6 z-10"
                  style={{ width: "49px" }}
                >
                  <div className="w-5 h-5 rounded-full bg-[#faf9f6] border-[2.5px] border-gray-400 shadow-sm mx-auto mt-0.5" />
                </div>

                {/* Right: Polaroid + PostIt */}
                <div className="flex flex-row items-start gap-6 flex-1 pl-8 z-10">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex-shrink-0"
                  >
                    <Polaroid
                      imageSrc={item.imageUrl}
                      caption={item.year + (item.range ? " " + item.range : "")}
                      rotation={item.polaroidRotation}
                      className="w-56"
                    />
                  </motion.div>

                  {index % 2 === 1 ? (
                    <NotebookPaper
                      headerText={item.title}
                      rotation={item.postItRotation}
                      className="min-w-[200px] max-w-[260px] min-h-[180px] mt-6"
                      tape={true}
                    >
                      <p className="text-[1.15rem] text-gray-700">
                        {item.description}
                      </p>
                    </NotebookPaper>
                  ) : (
                    <PostIt
                      color={item.postItColor}
                      rotation={item.postItRotation}
                      className="min-w-[200px] max-w-[260px] p-6 shadow-md mt-6"
                      tape={true}
                    >
                      <h3 className="font-['Kalam'] font-bold text-2xl mb-3 text-gray-800">
                        {item.title}
                      </h3>
                      <p className="font-['Caveat'] text-[1.15rem] leading-relaxed text-gray-700">
                        {item.description}
                      </p>
                    </PostIt>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Music Section */}
      <section
        id="music"
        className="relative w-full max-w-5xl mx-auto px-6 pt-24 pb-12 z-10"
      >
        <div className="flex flex-col items-center mb-16 relative">
          <Tape color="blue" className="top-0 w-32" rotation={3} />

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-['Kalam'] font-bold text-gray-800 mt-4 bg-white/50 backdrop-blur-sm px-8 py-2 rounded-lg border-2 border-dashed border-gray-300 shadow-sm relative z-10">
              On Repeat 🎧
            </h2>
            <Doodle
              path="M 0,20 L 100,20"
              className="w-full h-full text-blue-200 absolute -top-1 -left-2 -z-10 opacity-70 stroke-[15px]"
              fill="currentColor"
              viewBox="0 0 100 40"
              delay={0.4}
            />
          </div>

          <Sticker
            tape
            className="absolute left-0 md:left-1/4 top-10 bg-gray-50 p-2"
            rotation={-15}
          >
            <Music className="text-gray-800" />
          </Sticker>
        </div>

        {/* New Scrapbook Collage Layout */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 mt-10 mb-16 relative w-full max-w-6xl mx-auto">
          {/* Left: Featured Album */}
          <div className="relative flex-shrink-0 z-20 w-72 md:w-80 h-[380px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSongIndex}
                initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 30 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="absolute flex items-center justify-center w-full h-full"
              >
                <VinylCard
                  coverSrc={favoriteSongs[activeSongIndex].coverUrl}
                  title={favoriteSongs[activeSongIndex].title}
                  artist={favoriteSongs[activeSongIndex].artist}
                  lyrics={favoriteSongs[activeSongIndex].lyrics}
                  rotation={0}
                  className="w-64 md:w-72"
                  delay={0.2}
                />
              </motion.div>
            </AnimatePresence>

            {/* Doodle arrow pointing to the feature */}
            <Doodle
              path="M 80,10 Q 50,40 20,20 L 30,15 M 20,20 L 25,30"
              className="absolute -right-16 -top-8 w-24 h-24 text-pink-400 opacity-80"
              delay={1.2}
            />
          </div>

          {/* Right: Playlist */}
          <div className="relative w-full max-w-md mt-16 md:mt-0 flex-shrink-0 z-10 pt-4">
            <PostIt
              color="blue"
              rotation={3}
              className="w-full p-6 md:p-8 z-10 relative shadow-[2px_8px_20px_rgba(0,0,0,0.15)] mt-4"
              tape={true}
            >
              <div className="pt-2">
                <h3 className="font-['Kalam'] text-2xl md:text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <Heart size={24} className="text-red-400 fill-red-400" />
                  Vibe Check
                </h3>

                <ul className="font-['Caveat'] text-2xl md:text-3xl space-y-4 text-gray-700">
                  {favoriteSongs.map((song, idx) => (
                    <li
                      key={idx}
                      onClick={() => setActiveSongIndex(idx)}
                      className="flex justify-between items-center border-b-2 border-dashed border-blue-200/50 pb-2 cursor-pointer group"
                    >
                    <span className="relative inline-block z-10">
                      {idx + 1}. {song.title}
                      <span className="text-gray-500/80 text-lg md:text-xl ml-2">- {song.artist}</span>
                      {activeSongIndex === idx && (
                        <motion.svg
                            layoutId="song-underline"
                            className="absolute -bottom-2 left-0 w-full h-3 text-yellow-400 -z-10 overflow-visible opacity-80"
                            viewBox="0 0 100 20"
                            preserveAspectRatio="none"
                          >
                            <motion.path
                              d="M 5,15 Q 50,25 95,15"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                          </motion.svg>
                        )}
                      </span>
                      <span className="text-gray-400 group-hover:text-gray-600 transition-colors text-xl md:text-2xl">
                        {song.duration}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </PostIt>
          </div>
        </div>

        {/* Decorative background swirl for the whole section */}
        <Doodle
          path="M 10,80 C 40,10 60,100 90,20"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 text-purple-200 opacity-30 -z-10"
          viewBox="0 0 100 100"
          delay={1.5}
        />
      </section>

      {/* Photography Section */}
      <section
        id="photography"
        className="relative w-full max-w-6xl mx-auto px-6 pt-12 pb-24 z-10"
      >
        <svg className="hidden">
          <filter id="solid-outline">
            <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="2"></feMorphology>
            <feFlood floodColor="white" floodOpacity="1" result="WHITE"></feFlood>
            <feComposite in="WHITE" in2="DILATED" operator="in" result="OUTLINE"></feComposite>
            <feMerge>
              <feMergeNode in="OUTLINE" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </svg>

        <div className="flex flex-col items-center mb-16 relative">
          <Tape color="white" className="top-0 w-32" rotation={-2} />

          <div className="relative mt-4">
            <h2 className="text-4xl md:text-5xl font-['Kalam'] font-bold text-gray-800 bg-[#fdfbf7] px-8 py-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-[2px_4px_10px_rgba(0,0,0,0.1)] relative z-10">
              Moments
            </h2>
            <Doodle
              path="M 0,20 Q 50,0 100,20"
              className="w-[120%] h-full text-pink-300 absolute -top-4 -left-4 -z-10 opacity-60 stroke-[12px]"
              fill="none"
              viewBox="0 0 100 40"
              delay={0.6}
            />
          </div>
          
          <Sticker
            rotation={12}
            className="absolute right-4 md:right-1/4 top-10 bg-white p-2"
          >
            <Camera className="text-gray-800" size={28} />
          </Sticker>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 justify-items-center">
          {photoFolders.map((folder, idx) => (
            <PhotoFolder
              key={folder.id}
              title={folder.title}
              photoCount={folder.photoCount}
              coverPhotos={folder.coverPhotos}
              stickers={folder.stickers}
              delay={idx * 0.15}
              onClick={() => setSelectedFolder(folder)}
            />
          ))}
        </div>
      </section>

      <PhotoModal
        isOpen={selectedFolder !== null}
        onClose={() => setSelectedFolder(null)}
        folderTitle={selectedFolder?.title || ""}
        photos={selectedFolder?.photos || []}
      />

      {/* Footer / Connect Section */}
      <section
        id="contact"
        className="relative w-full max-w-4xl mx-auto px-6 py-32 flex flex-col items-center z-10"
      >
        <Doodle
          path="M 10,50 L 90,50 M 20,40 L 80,40"
          className="absolute top-10 left-10 w-32 h-20 text-blue-200 opacity-50 stroke-[4px]"
          delay={0.3}
        />

        <div className="relative w-full max-w-xl">
          <PostIt
            color="yellow"
            rotation={1}
            className="w-full text-center p-12 text-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative"
            tape={true}
          >
            
            <div className="mb-6 font-['Kalam'] font-bold text-4xl text-gray-800 relative z-10 mt-2">
              Let's create something cool together!
            </div>

          {/* Doodle underline inside the post-it */}
          <Doodle
            path="M 10,10 Q 50,20 90,5"
            className="absolute top-20 left-[10%] w-[80%] h-4 text-red-400 opacity-70"
            viewBox="0 0 100 20"
            delay={1.2}
          />

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
            <motion.a
              href="mailto:yanchenhao57@gmail.com"
              whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-800 text-gray-800 font-['Kalam'] font-bold text-xl bg-transparent/10 backdrop-blur-sm shadow-[2px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_6px_0px_rgba(0,0,0,0.15)] transition-shadow rounded-[255px_15px_225px_15px/15px_225px_15px_255px] cursor-grab active:cursor-grabbing"
            >
              <Mail className="w-5 h-5" />
              Email Me
            </motion.a>
            <motion.a
              href="https://github.com/John516csd"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05, rotate: [0, 3, -3, 0] }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-800 text-gray-800 font-['Kalam'] font-bold text-xl bg-transparent/10 backdrop-blur-sm shadow-[2px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_6px_0px_rgba(0,0,0,0.15)] transition-shadow rounded-[15px_225px_15px_255px/255px_15px_225px_15px] cursor-grab active:cursor-grabbing"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub
            </motion.a>
          </div>

          <Doodle
            path="M50,80 Q20,80 20,50 Q20,20 50,20 Q80,20 80,50 M70,40 L80,50 L70,60"
            className="absolute bottom-4 right-10 w-16 h-16 text-red-400"
            delay={1.5}
            strokeDasharray="10 10"
          />
        </PostIt>
        </div>

        <div className="mt-20 font-['Caveat'] text-2xl text-gray-400 flex items-center gap-2">
          Made with <Heart size={20} className="text-red-400 fill-red-400" /> in
          my digital journal
        </div>
      </section>
    </div>
  );
}
