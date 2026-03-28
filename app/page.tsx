"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
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

  const album1Url =
    "https://images.unsplash.com/photo-1679563837531-116c2fbe25b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGNpdHklMjBzdW5zZXR8ZW58MXx8fHwxNzc0NzAwNzM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const album2Url =
    "https://images.unsplash.com/photo-1595981234969-8259b94fde88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFlc3RoZXRpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzc0NzAwNzI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const album3Url =
    "https://images.unsplash.com/photo-1767462372382-b9fc964774d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMHJvY2slMjBiYW5kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc0NzAwNzI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <div className="min-h-screen bg-[#faf9f6] relative overflow-x-hidden font-sans text-gray-800">
      {/* Notebook Paper Background Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage:
            "radial-gradient(#9ca3af 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Notebook red margin line */}
      <div className="fixed top-0 bottom-0 left-8 md:left-20 w-[2px] bg-red-400/30 z-0" />

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
              <Sticker
                className="absolute -bottom-6 -right-8 w-16 h-16 bg-[#ffecb3] border-[#ffecb3]"
                rotation={12}
                delay={0.4}
                shouldReset={resetKey > 0}
              >
                <MapPin className="text-[#e65100]" size={28} />
              </Sticker>
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
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 mt-10 mb-36 relative w-full max-w-5xl mx-auto">
          {/* Left: Featured Album */}
          <div className="relative flex-shrink-0 z-20">
            <VinylCard
              coverSrc={album1Url}
              title="City Pop Vibes"
              artist="Sunset Groove"
              rotation={-4}
              tapeColor="yellow"
              className="w-64 md:w-80"
              delay={0.2}
            />
            {/* Doodle arrow pointing to the feature */}
            <Doodle
              path="M 80,10 Q 50,40 20,20 L 30,15 M 20,20 L 25,30"
              className="absolute -right-16 -top-8 w-24 h-24 text-pink-400 opacity-80"
              delay={1.2}
            />
            <div className="absolute -right-20 -top-12 font-['Caveat'] text-2xl text-pink-500 rotate-12 hidden md:block z-30 bg-white/80 px-2 rounded-md shadow-sm border border-pink-100">
              Absolute<br />Favorite!
            </div>
          </div>

          {/* Right: Playlist + Scattered Records */}
          <div className="relative w-full max-w-md mt-16 md:mt-0 flex-shrink-0 z-10">
            <PostIt
              color="blue"
              rotation={3}
              className="w-full p-6 md:p-8 z-10 relative shadow-[2px_8px_20px_rgba(0,0,0,0.15)]"
              tape={false}
            >
              <Tape color="pink" rotation={-2} className="-top-3 left-1/2 -translate-x-1/2 w-20" />

              <h3 className="font-['Kalam'] text-2xl md:text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Heart size={24} className="text-red-400 fill-red-400" />
                Vibe Check
              </h3>

              <ul className="font-['Caveat'] text-xl md:text-2xl space-y-3 text-gray-700">
                <li className="flex justify-between border-b-2 border-dashed border-blue-200/50 pb-1">
                  <span>1. Midnight City</span>
                  <span className="text-gray-400">3:45</span>
                </li>
                <li className="flex justify-between border-b-2 border-dashed border-blue-200/50 pb-1">
                  <span>2. Plastic Love</span>
                  <span className="text-gray-400">4:12</span>
                </li>
                <li className="flex justify-between border-b-2 border-dashed border-blue-200/50 pb-1">
                  <span>3. Sunset Groove</span>
                  <span className="text-gray-400">3:50</span>
                </li>
                <li className="flex justify-between border-b-2 border-dashed border-blue-200/50 pb-1">
                  <span>4. Lo-Fi Rain</span>
                  <span className="text-gray-400">2:30</span>
                </li>
              </ul>
            </PostIt>

            {/* Overlapping smaller albums */}
            <VinylCard
              coverSrc={album2Url}
              title="Abstract Lo-Fi"
              artist="Chill Beats"
              rotation={-12}
              tapeColor="green"
              className="absolute -bottom-32 -left-12 md:-bottom-36 md:-left-28 w-40 md:w-44 z-20"
              delay={0.6}
            />

            <VinylCard
              coverSrc={album3Url}
              title="Indie Rock"
              artist="The Wanderers"
              rotation={8}
              tapeColor="white"
              className="absolute -bottom-24 -right-10 md:-bottom-28 md:-right-24 w-44 md:w-48 z-30"
              delay={0.8}
            />
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
