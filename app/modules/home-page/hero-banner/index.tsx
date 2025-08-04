'use client'

import SvgText from "app/components/svg-text";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import styles from './index.module.css';

const MapLeaflet = dynamic(() => import('app/components/map-leaflet'), {
    ssr: false,
});

const HeroBanner = () => {
    const [svgFontSize, setSvgFontSize] = useState(80);

    useEffect(() => {
        const updateFontSize = () => {
            const width = window.innerWidth
            if (width < 640) { // sm
                setSvgFontSize(40)
            } else if (width < 768) { // md
                setSvgFontSize(50)
            } else if (width < 1024) { // lg
                setSvgFontSize(50)
            } else if (width < 1280) { // xl
                setSvgFontSize(70)
            } else { // 2xl+
                setSvgFontSize(80)
            }
        }

        updateFontSize()

        window.addEventListener('resize', updateFontSize)

        return () => window.removeEventListener('resize', updateFontSize)
    }, [])

    return <section className="relative h-screen w-full flex flex-col items-center justify-center bg-[#00b4ff] overflow-hidden">
        <div className="w-full relative flex flex-col md:flex-row items-center md:items-end justify-center gap-[24px] z-10 px-[24px] md:px-[40px]">
            <div className="w-full relative flex flex-col items-center justify-center max-w-[360px] sm:max-w-[400px] overflow-hidden gap-4 bg-white" style={{
                padding: '16px 16px 24px',
                borderRadius: '4px',
                boxShadow: '0 0 40px 10px rgba(0, 0, 0, 0.1)',
            }}>
                <div className="w-full" style={{
                    aspectRatio: '681 / 909'
                }}>
                    <picture className="w-full h-full">
                        <source srcSet="/images/me.jpg" type="image/jpg" />
                        <img src="/images/me.jpg" alt="Hero Banner" className="w-full h-full object-cover" />
                    </picture>
                </div>
                <div className="w-full text-left text-lg text-black" style={{
                    fontFamily: 'Permanent Marker',
                }}>
                    Kangding, Sichuan, China
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[24px]">
                <picture className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] ml-[24px] lg:ml-[40px]">
                    <source srcSet="/images/halo.webp" type="image/webp" />
                    <img src="/images/halo.png" alt="Hero Banner" className="w-full h-full object-cover" />
                </picture>
                <SvgText fontSize={svgFontSize} strokeWidth={6} text="Hi, I'm Chenhao" />
            </div>
        </div>
        {/* <MapLeaflet style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '250px',
            height: '250px',
            overflow: 'hidden',
            boxShadow: '0 0 30px 10px rgba(0, 0, 0, 0.2)',
            border: '10px solid #fff',
            borderRadius: '100%',
        }} /> */}
    </section>;
};

export default HeroBanner;