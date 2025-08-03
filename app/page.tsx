'use client'

import HeroBanner from './modules/home-page/hero-banner'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Page() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // 初始化 ScrollSmoother
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2, // 数值越大滚动越慢
      effects: true // 允许在内部元素上添加 data-speed 视差效果
    });

    return () => {
      // 卸载
      smoother.kill();
    };
  }, []);


  return (
    <div ref={wrapperRef}>
      <div ref={contentRef}>
        <HeroBanner />
        <div className="w-full h-screen bg-black"></div>
        <div className="w-full h-screen bg-white"></div>
        <div className="w-full h-screen bg-black"></div>
        <div className="w-full h-screen bg-white"></div>
      </div>
    </div>
  )
}
