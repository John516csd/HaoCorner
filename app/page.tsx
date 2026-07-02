"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Heart, Music, Mail } from "lucide-react";
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
import { TimelinePhotoLightbox } from "./components/figma-ui/TimelinePhotoLightbox";
import { useIsMobile } from "./hooks/use-mobile";
import { initialWhenVisible } from "./lib/motion";

// Photo Folder Mock Data
const jejuPhotos = [
  "/jeju/optimized/DSCF1514.jpg",
  "/jeju/optimized/DSCF1528.jpg",
  "/jeju/optimized/DSCF1563.jpg",
  "/jeju/optimized/DSCF1363.jpg",
  "/jeju/optimized/DSCF1597.jpg",
  "/jeju/optimized/DSCF1396.jpg",
  "/jeju/optimized/DSCF1383.jpg",
  "/jeju/optimized/DSCF1368.jpg",
  "/jeju/optimized/DSCF1395.jpg",
  "/jeju/optimized/DSCF1633.jpg",
  "/jeju/optimized/DSCF1318.jpg",
  "/jeju/optimized/DSCF1523.jpg",
  "/jeju/optimized/DSCF1723.jpg",
  "/jeju/optimized/DSCF1694.jpg",
  "/jeju/optimized/DSCF1492.jpg",
  "/jeju/optimized/DSCF1525.jpg",
];

const xinjiangPhotos = [
  "/xinjiang/optimized/DSCF1820.jpg",
  "/xinjiang/optimized/DSCF1829.jpg",
  "/xinjiang/optimized/DSCF1854.jpg",
  "/xinjiang/optimized/DSCF1855.jpg",
  "/xinjiang/optimized/DSCF1856.jpg",
  "/xinjiang/optimized/DSCF1862.jpg",
  "/xinjiang/optimized/DSCF1864.jpg",
  "/xinjiang/optimized/DSCF1895.jpg",
  "/xinjiang/optimized/DSCF1928.jpg",
  "/xinjiang/optimized/DSCF1932.jpg",
  "/xinjiang/optimized/DSCF1957.jpg",
  "/xinjiang/optimized/DSCF2014.jpg",
  "/xinjiang/optimized/DSCF2021.jpg",
  "/xinjiang/optimized/DSCF2047.jpg",
  "/xinjiang/optimized/DSCF2063.jpg",
  "/xinjiang/optimized/DSCF2090.jpg",
  "/xinjiang/optimized/DSCF2097.jpg",
  "/xinjiang/optimized/DSCF2108.jpg",
  "/xinjiang/optimized/DSCF2114.jpg",
  "/xinjiang/optimized/DSCF2123.jpg",
  "/xinjiang/optimized/IDG_20260617_113120_748.jpg",
];

const streetVibePhotos = [
  "/street-vibe/optimized/DSCF0259.jpg",
  "/street-vibe/optimized/DSCF1198.jpg",
  "/street-vibe/optimized/DSCF1214.jpg",
  "/street-vibe/optimized/DSCF1228.jpg",
  "/street-vibe/optimized/IDG_20260102_170939_893.jpg",
  "/street-vibe/optimized/IDG_20260102_172015_065.jpg",
  "/street-vibe/optimized/IDG_20260103_114159_988.jpg",
  "/street-vibe/optimized/IDG_20260103_122437_006.jpg",
  "/street-vibe/optimized/IDG_20260103_122941_767.jpg",
  "/street-vibe/optimized/IDG_20260103_125128_532.jpg",
  "/street-vibe/optimized/IDG_20260108_174548_539.jpg",
  "/street-vibe/optimized/IDG_20260513_190259_974.jpg",
  "/street-vibe/optimized/IDG_20260513_191107_275.jpg",
  "/street-vibe/optimized/IDG_20260513_191210_421.jpg",
  "/street-vibe/optimized/IDG_20260524_180357_350.jpg",
  "/street-vibe/optimized/IMG_20250708_191226.jpg",
];

const photoFolders = [
  {
    id: "jeju",
    title: "Jeju",
    date: "2026-04",
    photoCount: jejuPhotos.length,
    coverPhotos: jejuPhotos.slice(0, 3),
    stickers: (
      <>
        <div className="absolute top-4 left-4 text-3xl transform -rotate-12 emoji-sticker-outline-text">
          🇰🇷
        </div>
        <div className="absolute bottom-3 right-3 text-[3.4rem] transform rotate-[14deg] emoji-sticker-outline origin-bottom-right">
          🏖️
        </div>
      </>
    ),
    photos: jejuPhotos,
  },
  {
    id: "xinjiang",
    title: "Xinjiang",
    date: "2026-06",
    photoCount: xinjiangPhotos.length,
    coverPhotos: xinjiangPhotos.slice(0, 3),
    stickers: (
      <>
        <div className="absolute top-4 left-5 text-3xl transform -rotate-12 emoji-sticker-outline-text">
          🐑
        </div>
        <div className="absolute top-5 right-6 text-3xl transform rotate-8 emoji-sticker-outline-text">
          🏔️
        </div>
        <div className="absolute bottom-3 right-4 text-3xl transform rotate-[12deg] emoji-sticker-outline-text">
          🌿
        </div>
      </>
    ),
    photos: xinjiangPhotos,
  },
  {
    id: "street",
    title: "Street Vibes",
    photoCount: streetVibePhotos.length,
    coverPhotos: streetVibePhotos.slice(0, 3),
    stickers: (
      <>
        <div className="absolute top-1/2 left-1/2 -translate-x-[60%] -translate-y-[60%] transform rotate-[-8deg] z-40 emoji-sticker-outline-text">
          <span className="text-3xl">📷</span>
        </div>
        <div className="absolute bottom-4 right-4 transform rotate-[12deg] z-40 emoji-sticker-outline-text">
          <span className="text-2xl" style={{ filter: "grayscale(0.2)" }}>
            🎞️
          </span>
        </div>
      </>
    ),
    photos: streetVibePhotos,
  },
];

export default function Page() {
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<
    (typeof photoFolders)[0] | null
  >(null);
  const [selectedTimelinePhotoId, setSelectedTimelinePhotoId] = useState<
    string | null
  >(null);
  const [isHeroPhotoOpen, setIsHeroPhotoOpen] = useState(false);
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
  const siteUrl = "https://yanchenhao.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Yanchenhao's Corner",
        description:
          "A scrapbook-style personal portfolio for Yanchenhao, a frontend engineer who loves building interactive web experiences, traveling, photography, and music.",
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Yanchenhao",
        alternateName: ["Chenhao", "Yan Chenhao"],
        jobTitle: "Frontend Engineer",
        url: siteUrl,
        image: `${siteUrl}${heroPhotoUrl}`,
        sameAs: ["https://github.com/John516csd"],
        knowsAbout: [
          "Frontend development",
          "React",
          "Next.js",
          "Interactive web experiences",
          "Photography",
          "Travel",
          "Music",
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile`,
        url: siteUrl,
        name: "Yanchenhao's Corner",
        dateModified: "2026-07-02",
        mainEntity: {
          "@id": `${siteUrl}/#person`,
        },
      },
    ],
  };

  const favoriteSongs = [
    {
      title: "今天只做一件事",
      artist: "陈奕迅",
      coverUrl: "/cover/1.png",
      lyrics: "慢慢地迈向听朝\n静静地怀念昨日",
      tapeColor: "yellow" as const,
    },
    {
      title: "我们万岁",
      artist: "陈奕迅",
      coverUrl: "/cover/2.png",
      lyrics: "情人游天地\n日月换行李",
      tapeColor: "pink" as const,
    },
    {
      title: "任意门",
      artist: "五月天",
      coverUrl: "/cover/5.png",
      lyrics: "你问我全世界是哪里最美\n答案是你身边 只要是你身边",
      tapeColor: "white" as const,
    },
    {
      title: "I Love You So",
      artist: "The Walters",
      coverUrl: "/cover/3.png",
      lyrics:
        "I've got to get away and let you go, I've got to get over \nBut I love you so",
      tapeColor: "blue" as const,
    },
    {
      title: "Home (feat. Hikaru Utada)",
      artist: "Charlie Puth & 宇多田光 / Hikaru Utada",
      coverUrl: "/cover/4.png",
      lyrics:
        "Ooo, don't you know (Don't you know?)\nThat you're the one\nwho makes this house a home",
      tapeColor: "green" as const,
    },
  ];

  const timelineData = [
    {
      id: "origin",
      year: "2000",
      range: "— 2018",
      title: "Roots in Zhaoqing",
      description:
        "Born in Zhaoqing, I spent my first 18 years there, from primary school to high school. Home gave me warmth, patience, and the first spark to look further.",
      imageUrl: "/images/childhood-zhaoqing.jpg",
      postItColor: "yellow" as const,
      polaroidRotation: -3,
      postItRotation: 2,
    },
    {
      id: "education",
      year: "2018",
      range: "— 2022",
      title: "University in Guangzhou",
      description:
        "Studied Software Engineering at Guangdong Polytechnic Normal University in Tianhe, Guangzhou. Earned my bachelor's degree through four years of classes, projects, and debugging.",
      imageUrl: "/images/university-graduation.jpg",
      postItColor: "blue" as const,
      polaroidRotation: 3,
      postItRotation: -2,
    },
    {
      id: "career",
      year: "2022",
      range: "— Now",
      title: "Frontend Engineer",
      description:
        "Started as a frontend intern at Sangfor, then joined Notta as a frontend engineer. Since 2022, I've been building product experiences for real users.",
      imageUrl: "/images/workstation.webp",
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
        "I love making things with code, but I also want to keep moving: across oceans, toward snow mountains, with music in my ears and a camera nearby.",
      imageUrl: "/images/snow-mountain-journey.webp",
      postItColor: "green" as const,
      polaroidRotation: 4,
      postItRotation: 3,
    },
  ];

  const getTimelineCaption = (item: (typeof timelineData)[number]) =>
    item.year + (item.range ? ` ${item.range}` : "");

  const getTimelinePhotoAspectClassName = (
    item: (typeof timelineData)[number]
  ) =>
    item.id === "education" || item.id === "career"
      ? "aspect-[16/10]"
      : undefined;

  const getTimelineTapeColor = (
    item: (typeof timelineData)[number]
  ): "blue" | "pink" | "white" =>
    item.id === "education" ? "blue" : item.id === "career" ? "pink" : "white";

  const selectedTimelineItem =
    timelineData.find((item) => item.id === selectedTimelinePhotoId) || null;

  const selectedTimelinePhoto = selectedTimelineItem
    ? {
        id: selectedTimelineItem.id,
        imageUrl: selectedTimelineItem.imageUrl,
        title: selectedTimelineItem.title,
        caption: getTimelineCaption(selectedTimelineItem),
        rotation: selectedTimelineItem.polaroidRotation,
        imageAspectClassName:
          getTimelinePhotoAspectClassName(selectedTimelineItem),
      }
    : null;

  const heroLightboxPhoto = isHeroPhotoOpen
    ? {
        id: "hero",
        imageUrl: heroPhotoUrl,
        title: "Kangding, Sichuan, China",
        caption: "KANGDING, SICHUAN, CHINA",
        rotation: -4,
        imageAspectClassName: "aspect-[3/4]",
      }
    : null;

  const selectedLightboxPhoto = heroLightboxPhoto || selectedTimelinePhoto;

  const closePhotoLightbox = () => {
    setIsHeroPhotoOpen(false);
    setSelectedTimelinePhotoId(null);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] relative overflow-x-hidden font-sans text-gray-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
      <div className="hidden md:flex fixed top-0 bottom-0 left-0 w-8 z-0 flex-col justify-evenly py-20 pointer-events-none">
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
      <div className="hidden md:block fixed top-0 bottom-0 left-12 md:left-16 w-[1px] bg-gray-300/50 z-0" />

      <NavBar />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16 lg:pt-40 lg:pb-32 min-h-screen flex items-center justify-center z-10"
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
          className="hidden sm:block w-48 h-48 text-blue-300 top-20 right-10 lg:right-32 opacity-40"
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
          className="w-16 h-16 sm:w-20 sm:h-20 text-pink-400 top-[28%] left-[8%] lg:left-[25%] opacity-50 sm:opacity-60 rotate-45"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center w-full max-w-5xl">
          {/* Left Column - Polaroid Gallery */}
          <div className="relative flex justify-center items-center h-[380px] sm:h-[430px] lg:h-[500px]">
            <motion.div
              initial={initialWhenVisible({
                opacity: 1,
                scale: 0.9,
                rotate: -15,
                x: -40,
                y: -20,
              })}
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
                ariaLabel="Open Kangding photo"
                onClick={() => setIsHeroPhotoOpen(true)}
                className="w-[78vw] max-w-72 sm:w-80"
              />

              {/* Paperclip overlaying the corner */}
              <motion.div
                initial={initialWhenVisible({ opacity: 1, scale: 0.8 })}
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

              <PostIt
                color="yellow"
                rotation={8}
                className="absolute -left-4 sm:-left-7 lg:-left-10 -bottom-4 sm:-bottom-5 lg:-bottom-6 w-40 sm:w-44 z-30"
              >
                <div className="text-xl">
                  Exploring the world
                  <br />& building stuff 🚀
                </div>
              </PostIt>
            </div>
          </div>

          {/* Right Column - Introduction & Stickers */}
          <div className="relative flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={initialWhenVisible({ scale: 0.85, rotate: -30 })}
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
              initial={initialWhenVisible({ y: 20, opacity: 1 })}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative mb-6"
            >
              <motion.svg
                aria-hidden="true"
                className="hidden sm:block absolute -right-5 -top-9 lg:-right-9 lg:-top-10 w-16 h-16 lg:w-20 lg:h-20 overflow-visible pointer-events-none text-pink-400"
                viewBox="0 0 80 80"
                fill="none"
                initial={initialWhenVisible({
                  opacity: 0,
                  scale: 0.85,
                  rotate: -8,
                })}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.75, duration: 0.45, ease: "easeOut" }}
              >
                <motion.path
                  d="M12 48 C22 36 36 38 42 46 C48 55 36 61 28 56"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.9, duration: 0.7, ease: "easeInOut" }}
                />
                <motion.path
                  d="M50 12 L55 26 M43 21 L62 17 M58 49 L62 60 M52 55 L68 52"
                  stroke="#facc15"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    delay: 1.05,
                    duration: 0.55,
                    ease: "easeInOut",
                  }}
                />
              </motion.svg>

              <h1
                className="text-[clamp(2.6rem,12vw,3.35rem)] lg:text-7xl font-bold font-['Kalam'] tracking-tight leading-[0.95]"
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
              initial={initialWhenVisible({ opacity: 0.85 })}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-[1.35rem] sm:text-2xl font-['Caveat'] text-gray-600 mb-8 sm:mb-10 max-w-md leading-relaxed"
            >
              A creative developer passionate about crafting beautiful,
              interactive digital experiences. Let's make something amazing
              together!
            </motion.p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 sm:gap-3 mt-2 sm:mt-4">
              <Sticker
                rotation={-6}
                delay={0.5}
                className="px-4 sm:px-5 py-2 bg-blue-50 text-blue-700 font-['Kalam'] text-lg sm:text-xl cursor-grab active:cursor-grabbing shadow-sm border border-blue-100/50"
              >
                ✨ Endless Creativity
              </Sticker>
              <Sticker
                rotation={8}
                delay={0.6}
                className="px-4 sm:px-5 py-2 bg-yellow-50 text-yellow-700 font-['Kalam'] text-lg sm:text-xl cursor-grab active:cursor-grabbing shadow-sm border border-yellow-100/50"
              >
                🤖 AI-Driven
              </Sticker>
              <Sticker
                rotation={-4}
                delay={0.7}
                className="px-4 sm:px-5 py-2 bg-green-50 text-green-700 font-['Kalam'] text-lg sm:text-xl cursor-grab active:cursor-grabbing shadow-sm border border-green-100/50"
              >
                🚀 Fast Learner
              </Sticker>
              <Sticker
                rotation={10}
                delay={0.8}
                className="px-4 sm:px-5 py-2 bg-pink-50 text-pink-700 font-['Kalam'] text-lg sm:text-xl cursor-grab active:cursor-grabbing shadow-sm border border-pink-100/50"
              >
                🧩 Problem Solver
              </Sticker>
            </div>
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
            className="hidden lg:block absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: "calc(10rem + 24px)",
              borderLeft: "2px dashed #c9cdd4",
              zIndex: 0,
            }}
          />

          {timelineData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={initialWhenVisible({ opacity: 1, y: 40 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative py-8 md:py-14"
            >
              {/* ── Mobile layout: horizontal strip (year | visual) then postit below ── */}
              <div className="flex lg:hidden flex-col gap-4">
                {/* Top row: year badge + visual side by side */}
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
                  <Polaroid
                    imageSrc={item.imageUrl}
                    caption={getTimelineCaption(item)}
                    imageAspectClassName={getTimelinePhotoAspectClassName(item)}
                    rotation={item.polaroidRotation}
                    tapeColor={getTimelineTapeColor(item)}
                    ariaLabel={`Open ${item.title} photo`}
                    onClick={() => setSelectedTimelinePhotoId(item.id)}
                    className={`flex-shrink-0 ${
                      item.id === "education" || item.id === "career"
                        ? "w-60"
                        : "w-44"
                    }`}
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

              {/* ── Desktop layout: [year col] [dot] [visual + postit] ── */}
              <div className="hidden lg:flex flex-row items-start gap-0">
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

                {/* Right: visual + PostIt */}
                <div className="flex flex-row items-start gap-6 flex-1 pl-8 z-10">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex-shrink-0"
                  >
                    <Polaroid
                      imageSrc={item.imageUrl}
                      caption={getTimelineCaption(item)}
                      imageAspectClassName={getTimelinePhotoAspectClassName(
                        item
                      )}
                      rotation={item.polaroidRotation}
                      tapeColor={getTimelineTapeColor(item)}
                      ariaLabel={`Open ${item.title} photo`}
                      onClick={() => setSelectedTimelinePhotoId(item.id)}
                      className={
                        item.id === "education" || item.id === "career"
                          ? "w-80"
                          : "w-56"
                      }
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
        className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 z-10"
      >
        <div className="flex flex-col items-center mb-16 relative">
          <Tape color="blue" className="top-0 w-32" rotation={3} />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Kalam'] font-bold text-gray-800 mt-4 bg-white/50 backdrop-blur-sm px-6 sm:px-8 py-2 rounded-lg border-2 border-dashed border-gray-300 shadow-sm relative z-10">
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
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 sm:gap-14 lg:gap-32 mt-6 sm:mt-10 mb-14 sm:mb-16 relative w-full max-w-6xl mx-auto">
          {/* Left: Featured Album */}
          <div className="relative flex-shrink-0 z-20 w-[min(72vw,17rem)] sm:w-72 lg:w-80 h-[320px] sm:h-[360px] lg:h-[380px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSongIndex}
                initial={initialWhenVisible({
                  opacity: 1,
                  scale: 0.9,
                  rotate: -30,
                })}
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
                  className="w-[min(70vw,16rem)] sm:w-64 lg:w-72"
                  delay={0.2}
                />
              </motion.div>
            </AnimatePresence>

            {/* Doodle arrow pointing to the feature */}
            <Doodle
              path="M 80,10 Q 50,40 20,20 L 30,15 M 20,20 L 25,30"
              className="hidden sm:block absolute -right-16 -top-8 w-24 h-24 text-pink-400 opacity-80"
              delay={1.2}
            />
          </div>

          {/* Right: Playlist */}
          <div className="relative w-full max-w-[calc(100vw-32px)] sm:max-w-md mt-8 lg:mt-0 flex-shrink-0 z-10 pt-4">
            <PostIt
              color="blue"
              rotation={isMobile ? 0 : 3}
              className="w-full max-w-[calc(100vw-32px)] p-4 sm:p-6 md:p-8 z-10 relative shadow-[2px_8px_20px_rgba(0,0,0,0.15)] mt-4"
              tape={true}
            >
              <div className="pt-2">
                <h3 className="font-handnote-title text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 text-gray-800 flex items-center gap-2">
                  <Heart size={24} className="text-red-400 fill-red-400" />
                  Vibe Check
                </h3>
                <p className="font-['Caveat'] text-base sm:text-lg text-gray-500 -mt-4 mb-5 pl-8">
                  This playlist changes over time.
                </p>

                <ul className="font-handnote text-lg sm:text-xl md:text-2xl space-y-4 text-gray-700">
                  {favoriteSongs.map((song, idx) => (
                    <li
                      key={song.title}
                      onClick={() => setActiveSongIndex(idx)}
                      className="flex items-start justify-between gap-3 border-b-2 border-dashed border-blue-200/50 pb-2 cursor-pointer group"
                    >
                      <span className="relative z-10 min-w-0 flex-1 leading-tight">
                        {idx + 1}. {song.title}
                        <span className="block sm:inline text-gray-500/80 text-base sm:text-lg md:text-xl sm:ml-2">
                          - {song.artist}
                        </span>
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
                      <span
                        aria-hidden="true"
                        className="text-gray-400 group-hover:text-gray-600 transition-colors text-lg sm:text-xl md:text-2xl flex-shrink-0 leading-tight pt-0.5"
                      >
                        ♪
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
        className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-20 sm:pb-24 z-10"
      >
        <svg className="hidden">
          <filter id="solid-outline">
            <feMorphology
              in="SourceAlpha"
              result="DILATED"
              operator="dilate"
              radius="2"
            ></feMorphology>
            <feFlood
              floodColor="white"
              floodOpacity="1"
              result="WHITE"
            ></feFlood>
            <feComposite
              in="WHITE"
              in2="DILATED"
              operator="in"
              result="OUTLINE"
            ></feComposite>
            <feMerge>
              <feMergeNode in="OUTLINE" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </svg>

        <div className="flex flex-col items-center mb-16 relative">
          <Tape color="white" className="top-0 w-32" rotation={-2} />

          <div className="relative mt-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Kalam'] font-bold text-gray-800 bg-[#fdfbf7] px-6 sm:px-8 py-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-[2px_4px_10px_rgba(0,0,0,0.1)] relative z-10">
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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-16 justify-items-center">
          {photoFolders.map((folder, idx) => (
            <PhotoFolder
              key={folder.id}
              title={folder.title}
              date={folder.date}
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
        folderTitle={
          selectedFolder
            ? selectedFolder.date
              ? `${selectedFolder.title} · ${selectedFolder.date}`
              : selectedFolder.title
            : ""
        }
        photos={selectedFolder?.photos || []}
      />

      <TimelinePhotoLightbox
        photo={selectedLightboxPhoto}
        onClose={closePhotoLightbox}
      />

      {/* Footer / Connect Section */}
      <section
        id="contact"
        className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-32 flex flex-col items-center z-10"
      >
        <Doodle
          path="M 10,50 L 90,50 M 20,40 L 80,40"
          className="absolute top-10 left-10 w-32 h-20 text-blue-200 opacity-50 stroke-[4px]"
          delay={0.3}
        />

        <div className="relative w-full max-w-xl">
          <PostIt
            color="yellow"
            rotation={isMobile ? 0 : 1}
            className="w-full max-w-[calc(100vw-32px)] text-center p-6 sm:p-8 md:p-12 text-2xl sm:text-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative"
            tape={true}
          >
            <div className="mb-6 font-['Kalam'] font-bold text-3xl sm:text-4xl text-gray-800 relative z-10 mt-2">
              Let's create something cool together!
            </div>

            {/* Doodle underline inside the post-it */}
            <Doodle
              path="M 10,10 Q 50,20 90,5"
              className="absolute top-20 left-[10%] w-[80%] h-4 text-red-400 opacity-70"
              viewBox="0 0 100 20"
              delay={1.2}
            />

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-10">
              <motion.a
                href="mailto:yanchenhao57@gmail.com"
                whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
                transition={{ duration: 0.3 }}
                className="flex min-h-11 w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 border-2 border-gray-800 text-gray-800 font-['Kalam'] font-bold text-xl bg-transparent/10 backdrop-blur-sm shadow-[2px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_6px_0px_rgba(0,0,0,0.15)] transition-shadow rounded-[255px_15px_225px_15px/15px_225px_15px_255px] cursor-grab active:cursor-grabbing"
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
                className="flex min-h-11 w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 border-2 border-gray-800 text-gray-800 font-['Kalam'] font-bold text-xl bg-transparent/10 backdrop-blur-sm shadow-[2px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_6px_0px_rgba(0,0,0,0.15)] transition-shadow rounded-[15px_225px_15px_255px/255px_15px_225px_15px] cursor-grab active:cursor-grabbing"
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
