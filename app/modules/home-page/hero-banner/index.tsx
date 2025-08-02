'use client'

import SvgText from "app/components/svg-text";
import dynamic from 'next/dynamic';

const MapLeaflet = dynamic(() => import('app/components/map-leaflet'), {
    ssr: false,
});

const HeroBanner = () => {
    return <section className="relative h-screen w-full flex flex-col items-center justify-center bg-[#fff] overflow-hidden">
        <div className="relative flex flex-row items-end justify-end gap-20 z-10">
            <div className="relative flex flex-col items-center justify-center max-w-[500px] overflow-hidden gap-4 bg-white" style={{
                padding: '32px 16px 24px',
                borderRadius: '4px',
                boxShadow: '0 0 30px 10px rgba(0, 0, 0, 0.2)',
            }}>
                <picture className="w-full h-full">
                    <source srcSet="/images/me.jpg" type="image/jpg" />
                    <img src="/images/me.jpg" alt="Hero Banner" className="w-full h-full object-cover" />
                </picture>
                <div className="w-full flex flex-row items-center justify-start">
                    <picture className="w-[40px] h-[40px]">
                        <source srcSet="/images/camera.webp" type="image/webp" />
                        <img src="/images/camera.png" alt="Hero Banner" className="w-full h-full object-cover" />
                    </picture>
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-10">
                <picture className="w-[160px] h-[160px]">
                    <source srcSet="/images/halo.webp" type="image/webp" />
                    <img src="/images/halo.png" alt="Hero Banner" className="w-full h-full object-cover" />
                </picture>
                <SvgText fontSize={80} strokeWidth={6} text="Hi, I'm Chenhao" />
            </div>
        </div>
        <MapLeaflet style={{
            position: 'absolute',
            bottom: "24px",
            left: "24px",
            width: '250px',
            height: '250px',
            overflow: 'hidden',
            boxShadow: '0 0 30px 10px rgba(0, 0, 0, 0.2)',
            border: '10px solid #fff',
            borderRadius: '100%',
        }} />
    </section>;
};

export default HeroBanner;