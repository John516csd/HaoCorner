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
  RotateCcw,
} from "lucide-react";
import { Polaroid } from "./components/figma-ui/Polaroid";
import { Sticker } from "./components/figma-ui/Sticker";
import { PostIt } from "./components/figma-ui/PostIt";
import { Tape } from "./components/figma-ui/Tape";
import { Doodle } from "./components/figma-ui/Doodle";
import { VinylCard } from "./components/figma-ui/VinylCard";
import { NavBar } from "./components/figma-ui/NavBar";

export default function Page() {
  const [resetKey, setResetKey] = useState(0);

  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        weekday: 'short'
      };
      // "Sun, Mar 28, 2026"
      const dateString = now.toLocaleDateString('en-US', options);
      const parts = dateString.split(', ');
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

  const [weatherInfo, setWeatherInfo] = useState<{ icon: string, temp: string } | null>(null);

  useEffect(() => {
    // Attempt to get user location and weather
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Using Open-Meteo API for free, no-key-required weather data
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const data = await res.json();
            
            if (data && data.current_weather) {
              const code = data.current_weather.weathercode;
              const temp = Math.round(data.current_weather.temperature);
              
              // WMO Weather interpretation codes
              let icon = "☀️"; // default clear
              if (code === 0) icon = "☀️"; // Clear sky
              else if (code === 1 || code === 2 || code === 3) icon = "🌤️"; // Mainly clear, partly cloudy, and overcast
              else if (code >= 45 && code <= 48) icon = "🌫️"; // Fog
              else if (code >= 51 && code <= 67) icon = "🌧️"; // Drizzle / Rain
              else if (code >= 71 && code <= 77) icon = "❄️"; // Snow
              else if (code >= 80 && code <= 82) icon = "🌧️"; // Rain showers
              else if (code >= 85 && code <= 86) icon = "❄️"; // Snow showers
              else if (code >= 95) icon = "⛈️"; // Thunderstorm
              
              setWeatherInfo({ icon, temp: `${temp}°C` });
            }
          } catch (error) {
            console.error("Failed to fetch weather data:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const handleResetLayout = () => {
    // Incrementing key forces re-render or triggers useEffect in children to reset position
    setResetKey((prev) => prev + 1);
  };
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
      coverUrl: "https://images.unsplash.com/photo-1679563837531-116c2fbe25b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGNpdHklMjBzdW5zZXR8ZW58MXx8fHwxNzc0NzAwNzM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      lyrics: "Waiting in a car, waiting for a ride in the dark...",
      tapeColor: "yellow" as const,
    },
    {
      title: "Plastic Love",
      artist: "Mariya Takeuchi",
      duration: "4:12",
      coverUrl: "https://images.unsplash.com/photo-1595981234969-8259b94fde88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFlc3RoZXRpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzc0NzAwNzI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      lyrics: "I'm just playing games, I know that's plastic love...",
      tapeColor: "pink" as const,
    },
    {
      title: "Indie Rock",
      artist: "The Wanderers",
      duration: "3:50",
      coverUrl: "https://images.unsplash.com/photo-1767462372382-b9fc964774d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMHJvY2slMjBiYW5kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc0NzAwNzI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      lyrics: "We are young and we are free, dancing in the summer breeze...",
      tapeColor: "blue" as const,
    },
    {
      title: "Lo-Fi Rain",
      artist: "Chill Beats",
      duration: "2:30",
      coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2ZpJTIwcmFpbnxlbnwxfHx8fDE3NzQ3MTAyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      lyrics: "Just the sound of the rain against the window pane...",
      tapeColor: "green" as const,
    },
    {
      title: "Neon Nights",
      artist: "Synthwave Rider",
      duration: "4:05",
      coverUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwY2l0eXxlbnwxfHx8fDE3NzQ3MTAyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      lyrics: "Driving through the neon glow, leaving everything I know...",
      tapeColor: "white" as const,
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] relative overflow-x-hidden font-sans text-gray-800">
      {/* Notebook Paper Background Grid with subtle dotted lines */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundColor: '#f8f7f2', // Base paper color slightly warmer
          backgroundImage: `
            linear-gradient(90deg, transparent 95%, rgba(0, 0, 0, 0.08) 95%),
            linear-gradient(0deg, transparent 95%, rgba(0, 0, 0, 0.08) 95%)
          `,
          backgroundSize: '24px 24px, 24px 24px',
          backgroundPosition: '0 0, 0 0'
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
          backgroundSize: '4px 4px, 4px 4px',
          backgroundPosition: '0 0, 0 0',
          opacity: 0.9
        }}
      />
      {/* Notebook ring binder holes */}
      <div className="fixed top-0 bottom-0 left-0 w-8 z-0 flex flex-col justify-evenly py-20 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-5 h-5 rounded-full bg-[#111] shadow-inner -ml-2 border-2 border-gray-300 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.8)]" />
        ))}
      </div>
      {/* Vertical texts on the left margin */}
      <div className="fixed top-1/2 -left-14 transform -translate-y-1/2 -rotate-90 pointer-events-none z-0 flex items-center gap-12 font-['Noto_Sans'] text-gray-400 text-xs tracking-widest font-semibold uppercase opacity-60">
        <span>[SNL] Paper</span>
        <span className="text-gray-500 font-bold">Crena</span>
        <span>The Paper MS-69</span>
      </div>

      {/* Handwritten Date and Weather - Vertical on the left */}
      <div className="fixed top-1/2 left-8 md:left-12 transform -translate-y-1/2 z-10 flex flex-col items-center gap-8 pointer-events-none mix-blend-multiply opacity-70">
        <div 
          className="font-['Kalam'] text-xl md:text-2xl font-bold text-gray-800 tracking-wider whitespace-nowrap" 
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
        >
          {currentDate}
        </div>
        {weatherInfo && (
          <div className="flex flex-col items-center gap-3 font-['Kalam'] text-xl md:text-2xl font-bold text-gray-700">
            <span className="text-2xl md:text-3xl filter grayscale contrast-200 transform -rotate-90">{weatherInfo.icon}</span>
            <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
              {weatherInfo.temp}
            </span>
          </div>
        )}
      </div>

      {/* Notebook red margin line - replaced with a subtle indent line to match the grid */}
      <div className="fixed top-0 bottom-0 left-12 md:left-16 w-[1px] bg-gray-300/50 z-0" />

      <NavBar />

      {/* Reset Layout Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleResetLayout}
        className="fixed bottom-6 right-6 z-50 bg-white border-2 border-dashed border-gray-300 rounded-full p-4 shadow-[2px_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors group"
      >
        <RotateCcw className="w-6 h-6 group-hover:-rotate-90 transition-transform duration-500" />
        <span className="absolute -top-10 right-0 font-['Caveat'] text-lg text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100 pointer-events-none">
          Clean up desk!
        </span>
      </motion.button>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full max-w-6xl mx-auto px-6 py-12 md:py-24 min-h-[90vh] flex items-center justify-center z-10"
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
                shouldReset={resetKey > 0}
              />
              
              {/* Paperclip overlaying the corner */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
                className="absolute -top-6 -right-2 text-[#9ca3af] z-20 cursor-grab active:cursor-grabbing hover:text-[#6b7280] transition-colors"
                drag
                dragMomentum={false}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-[30deg] drop-shadow-[2px_4px_4px_rgba(0,0,0,0.2)]">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </motion.div>
            </div>

            <PostIt
              color="yellow"
              rotation={8}
              className="absolute -left-4 md:-left-16 bottom-0 w-44 z-20"
              shouldReset={resetKey > 0}
            >
              <div className="text-xl">
                Exploring the world<br />& building stuff 🚀
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
              A creative developer passionate about crafting beautiful, interactive
              digital experiences. Let's make something amazing together!
            </motion.p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
              <Sticker rotation={-6} delay={0.5} className="px-4 py-2 bg-blue-50 text-blue-700 font-['Caveat'] text-xl font-bold cursor-grab active:cursor-grabbing">
                React & Next.js
              </Sticker>
              <Sticker rotation={8} delay={0.6} className="px-4 py-2 bg-yellow-50 text-yellow-700 font-['Caveat'] text-xl font-bold cursor-grab active:cursor-grabbing">
                TypeScript
              </Sticker>
              <Sticker rotation={-4} delay={0.7} className="px-4 py-2 bg-green-50 text-green-700 font-['Caveat'] text-xl font-bold cursor-grab active:cursor-grabbing">
                Tailwind CSS
              </Sticker>
              <Sticker rotation={10} delay={0.8} className="px-4 py-2 bg-pink-50 text-pink-700 font-['Caveat'] text-xl font-bold cursor-grab active:cursor-grabbing">
                GSAP & Motion
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

      {/* About / Interests Section */}
      <section id="about" className="relative w-full max-w-5xl mx-auto px-6 py-20 z-10">
        {/* Section Doodle Decor */}
        <Doodle
          path="M 10,50 Q 50,10 90,50 T 170,50"
          className="w-full h-24 text-gray-300 absolute -top-10 left-0 opacity-40"
          viewBox="0 0 200 100"
          delay={0.2}
        />

        <div className="flex flex-col items-center mb-16 relative">
          <Tape color="pink" className="top-0" rotation={-2} />

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-['Kalam'] font-bold text-gray-800 mt-4 bg-white/50 backdrop-blur-sm px-6 py-2 rounded-lg border-2 border-dashed border-gray-300 shadow-sm relative z-10">
              What I'm About
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

          <Sticker className="absolute -right-4 md:right-1/4 top-8 bg-red-50 p-2" rotation={18}>
            <Heart className="text-red-500" />
          </Sticker>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative flex flex-col items-center"
          >
            <Polaroid
              imageSrc={codePhotoUrl}
              caption="Late Night Coding"
              rotation={3}
              className="w-full mb-6 z-10"
              shouldReset={resetKey > 0}
            />
            <PostIt
              color="blue"
              rotation={-5}
              className="w-full text-center p-6 text-xl mt-[-20px] z-0 shadow-sm"
              shouldReset={resetKey > 0}
            >
              Building sleek, scalable web applications is my jam. I love diving
              deep into React and crafting smooth animations.
            </PostIt>

            <Doodle
              path="M20,50 Q50,20 80,50 T20,50"
              className="absolute -left-16 top-1/2 w-24 h-24 text-blue-300 opacity-60 hidden md:block"
              delay={0.6}
            />
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="relative flex flex-col items-center mt-8 md:mt-16"
          >
            <Polaroid
              imageSrc={sushiPhotoUrl}
              caption="Fuel for code"
              rotation={-4}
              className="w-full mb-6 z-10"
              shouldReset={resetKey > 0}
            />
            <PostIt
              color="pink"
              rotation={2}
              className="w-full text-center p-6 text-xl mt-[-20px] z-0 shadow-sm"
              shouldReset={resetKey > 0}
            >
              When I'm not coding, I'm hunting for the best sushi in town or trying
              out new coffee beans. 🍣☕
            </PostIt>

            {/* Sparkles doodle */}
            <Doodle
              path="M 50,10 L 50,90 M 10,50 L 90,50 M 20,20 L 80,80 M 20,80 L 80,20"
              className="absolute -right-12 top-0 w-16 h-16 text-yellow-400 opacity-60 hidden md:block"
              delay={0.8}
            />
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4 }}
            className="relative flex flex-col items-center mt-4 md:mt-[-20px]"
          >
            <Polaroid
              imageSrc={concertPhotoUrl}
              caption="Live Music Vibes"
              rotation={5}
              className="w-full mb-6 z-10"
              shouldReset={resetKey > 0}
            />
            <PostIt
              color="green"
              rotation={-3}
              className="w-full text-center p-6 text-xl mt-[-20px] z-0 shadow-sm"
              shouldReset={resetKey > 0}
            >
              Huge fan of live music and indie bands. Catch me at a local gig on the
              weekends! 🎸
            </PostIt>

            <Sticker
              tape
              className="absolute -bottom-6 -right-4 bg-purple-50 p-3"
              rotation={-15}
              shouldReset={resetKey > 0}
            >
              <Music className="text-purple-500" />
            </Sticker>

            <Doodle
              path="M 10,80 Q 30,20 50,50 T 90,20"
              className="absolute -bottom-16 left-1/2 w-24 h-16 text-green-400 opacity-50"
              delay={1.0}
            />
          </motion.div>
        </div>
      </section>

      {/* Music Section */}
      <section id="music" className="relative w-full max-w-5xl mx-auto px-6 py-24 z-10">
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
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 mt-10 mb-36 relative w-full max-w-6xl mx-auto">
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
                  rotation={0}
                  className="w-64 md:w-72"
                  delay={0.2}
                  shouldReset={resetKey > 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Doodle arrow pointing to the feature */}
            <Doodle
              path="M 80,10 Q 50,40 20,20 L 30,15 M 20,20 L 25,30"
              className="absolute -right-16 -top-8 w-24 h-24 text-pink-400 opacity-80"
              delay={1.2}
            />

            {/* Lyrics Sticker */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`lyrics-${activeSongIndex}`}
                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                className="absolute -bottom-8 -left-20 md:-bottom-4 md:-left-32 z-40"
              >
                <PostIt
                  color="yellow"
                  rotation={0}
                  className="w-48 md:w-56 p-5 text-center font-['Caveat'] text-xl md:text-2xl shadow-[2px_4px_12px_rgba(0,0,0,0.15)] text-gray-800"
                  shouldReset={resetKey > 0}
                  tape={false}
                >
                  <Tape color="pink" rotation={5} className="-top-3 left-1/2 -translate-x-1/2 w-16" />
                  "{favoriteSongs[activeSongIndex].lyrics}"
                </PostIt>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Playlist */}
          <div className="relative w-full max-w-md mt-16 md:mt-0 flex-shrink-0 z-10 pt-4">
            <PostIt
              color="blue"
              rotation={3}
              className="w-full p-6 md:p-8 z-10 relative shadow-[2px_8px_20px_rgba(0,0,0,0.15)]"
              tape={false}
              shouldReset={resetKey > 0}
            >
              <Tape color="pink" rotation={-2} className="-top-3 left-1/2 -translate-x-1/2 w-20" />

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
                    <span className="relative inline-block">
                      {idx + 1}. {song.title}
                      {activeSongIndex === idx && (
                        <motion.svg
                          layoutId="song-underline"
                          className="absolute -bottom-1 left-0 w-full h-3 text-yellow-400 z-0 overflow-visible"
                          viewBox="0 0 100 20"
                          preserveAspectRatio="none"
                        >
                          <motion.path
                            d="M 5,15 Q 50,25 95,15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
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

      {/* Footer / Connect Section */}
      <section id="contact" className="relative w-full max-w-4xl mx-auto px-6 py-32 flex flex-col items-center z-10">
        <Doodle
          path="M 10,50 L 90,50 M 20,40 L 80,40"
          className="absolute top-10 left-10 w-32 h-20 text-blue-200 opacity-50 stroke-[4px]"
          delay={0.3}
        />

        <PostIt
          color="yellow"
          rotation={1}
          className="w-full max-w-xl text-center p-12 text-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative"
          tape={false}
          shouldReset={resetKey > 0}
        >
          <Tape
            color="blue"
            className="-top-4 left-1/2 -translate-x-1/2 w-32 pointer-events-none"
            rotation={0}
          />

          <div className="mb-6 font-bold relative z-10">
            Let's create something cool together!
          </div>

          {/* Doodle underline inside the post-it */}
          <Doodle
            path="M 10,10 Q 50,20 90,5"
            className="absolute top-20 left-[10%] w-[80%] h-4 text-red-400 opacity-70"
            viewBox="0 0 100 20"
            delay={1.2}
          />

          <div className="flex justify-center gap-6 mt-8">
            <a
              href="mailto:hello@example.com"
              className="transform hover:scale-110 hover:-rotate-6 transition-all bg-black text-white px-6 py-2 rounded-full font-sans text-lg font-bold flex items-center justify-center"
            >
              Email Me
            </a>
            <a
              href="https://github.com/yanchenhao"
              target="_blank"
              rel="noreferrer"
              className="transform hover:scale-110 hover:rotate-6 transition-all border-4 border-black text-black px-6 py-2 rounded-full font-sans text-lg font-bold relative group flex items-center justify-center"
            >
              GitHub
              {/* Little arrow pointing to GitHub on hover */}
              <svg
                className="absolute -right-8 -top-8 w-8 h-8 text-black opacity-0 group-hover:opacity-100 transition-opacity rotate-[120deg]"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10,30 Q25,10 35,15 M35,15 L28,12 M35,15 L32,22" />
              </svg>
            </a>
          </div>

          <Doodle
            path="M50,80 Q20,80 20,50 Q20,20 50,20 Q80,20 80,50 M70,40 L80,50 L70,60"
            className="absolute bottom-4 right-10 w-16 h-16 text-red-400"
            delay={1.5}
            strokeDasharray="10 10"
          />
        </PostIt>

        <div className="mt-20 font-['Caveat'] text-2xl text-gray-400 flex items-center gap-2">
          Made with <Heart size={20} className="text-red-400 fill-red-400" /> in my digital journal
        </div>
      </section>
    </div>
  );
}
