import SvgText from "app/components/svg-text";

const HeroBanner = () => {
    return <section className="relative h-screen w-full flex flex-col items-center justify-center">
        <div className="flex flex-row items-end justify-end gap-20">
            <div className="relative flex flex-row items-center justify-center max-w-[500px] overflow-hidden" style={{
                padding: '32px 16px 64px',
                borderRadius: '4px',
                boxShadow: '0 0 30px 10px rgba(0, 0, 0, 0.2)',
            }}>
                <picture className="w-full h-full">
                    <source srcSet="/images/me.jpg" type="image/jpg" />
                    <img src="/images/me.jpg" alt="Hero Banner" className="w-full h-full object-cover" />
                </picture>
            </div>
            <div className="flex flex-col items-start justify-start gap-10">
                <picture className="w-[160px] h-[160px]">
                    <source srcSet="/images/halo.webp" type="image/webp" />
                    <img src="/images/halo.png" alt="Hero Banner" className="w-full h-full object-cover" />
                </picture>
                <SvgText fontSize={80} strokeWidth={6} text="Hi, I'm Chenhao" />
            </div>
        </div>
    </section>;
};

export default HeroBanner;