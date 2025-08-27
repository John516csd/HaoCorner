"use client";

import SvgText from "app/components/svg-text";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

const MapLeaflet = dynamic(() => import("app/components/map-leaflet"), {
  ssr: false,
});

const HeroBanner = () => {
  const [svgFontSize, setSvgFontSize] = useState(80);

  useEffect(() => {
    const updateFontSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // sm
        setSvgFontSize(40);
      } else if (width < 768) {
        // md
        setSvgFontSize(50);
      } else if (width < 1024) {
        // lg
        setSvgFontSize(50);
      } else if (width < 1280) {
        // xl
        setSvgFontSize(70);
      } else {
        // 2xl+
        setSvgFontSize(80);
      }
    };

    updateFontSize();

    window.addEventListener("resize", updateFontSize);

    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  return (
    <section className={styles.hero_banner}>
      <div className={styles.main_container}>
        <div className={styles.card_container}>
          <div className={styles.card_inner}>
            {/* 正面 */}
            <div className={styles.front_layer}>
              <div className={styles.image_container}>
                <picture className={styles.picture_full}>
                  <source srcSet="/images/me.jpg" type="image/jpg" />
                  <img
                    src="/images/me.jpg"
                    alt="Hero Banner"
                    className={styles.image_full}
                  />
                </picture>
              </div>
              <div className={styles.location_text}>
                Kangding, Sichuan, China
              </div>
            </div>
            {/* 背面 */}
            <div className={styles.back_layer}>
              {/* Don't put in mouth */}
              <div className={styles.top_bar}>
                <div className={styles.top_bar_text_wrapper}>
                  <div className={styles.top_bar_text}>
                    <div className={styles.dont_put_in_mouth_img_container}>
                      <img
                        src="/images/dont-put-in-mouth.png"
                        alt="Don't put in mouth"
                        className={styles.dont_put_in_mouth_img}
                      />
                    </div>{" "}
                    Don't put in mouth
                  </div>
                  <div className={styles.top_bar_text}>
                    <div className={styles.dont_put_in_mouth_img_container}>
                      <img
                        src="/images/dont-put-in-mouth.png"
                        alt="Don't put in mouth"
                        className={styles.dont_put_in_mouth_img}
                      />
                    </div>{" "}
                    Don't put in mouth
                  </div>
                  <div className={styles.top_bar_text}>
                    <div className={styles.dont_put_in_mouth_img_container}>
                      <img
                        src="/images/dont-put-in-mouth.png"
                        alt="Don't put in mouth"
                        className={styles.dont_put_in_mouth_img}
                      />
                    </div>{" "}
                    Don't put in mouth
                  </div>
                  <div className={styles.top_bar_text}>
                    <div className={styles.dont_put_in_mouth_img_container}>
                      <img
                        src="/images/dont-put-in-mouth.png"
                        alt="Don't put in mouth"
                        className={styles.dont_put_in_mouth_img}
                      />
                    </div>{" "}
                    Don't put in mouth
                  </div>
                </div>
              </div>
              {/* instax FUJIFILM */}
              <div className={styles.instax_container}>
                <div className={styles.instax_img_wrapper}>
                  <div className={styles.instax_img_container}>
                    <img
                      src="/images/instax.png"
                      alt="instax FUJIFILM"
                      className={styles.instax_img}
                    />
                  </div>
                  <div className={styles.instax_img_container}>
                    <img
                      src="/images/instax.png"
                      alt="instax FUJIFILM"
                      className={styles.instax_img}
                    />
                  </div>
                  <div className={styles.instax_img_container}>
                    <img
                      src="/images/instax.png"
                      alt="instax FUJIFILM"
                      className={styles.instax_img}
                    />
                  </div>
                  <div className={styles.instax_img_container}>
                    <img
                      src="/images/instax.png"
                      alt="instax FUJIFILM"
                      className={styles.instax_img}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right_container}>
          <picture className={styles.halo_picture}>
            <source srcSet="/images/halo.webp" type="image/webp" />
            <img
              src="/images/halo.png"
              alt="Hero Banner"
              className={styles.image_full}
            />
          </picture>
          <SvgText
            fontSize={svgFontSize}
            strokeWidth={6}
            text="Hi, I'm Chenhao"
          />
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
    </section>
  );
};

export default HeroBanner;
