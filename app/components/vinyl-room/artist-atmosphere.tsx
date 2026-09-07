import styles from './artist-atmosphere.module.css';

export type ArtistRoomTheme = 'eason' | 'mayday';

/** Decorative objects live behind the transparent CD canvas and never intercept input. */
export default function ArtistAtmosphere({ theme, subdued }: {
  theme: ArtistRoomTheme;
  subdued: boolean;
}) {
  const balloons = theme === 'eason';
  const source = balloons ? '/vinyl-room/atmosphere/balloon-pair.webp' : '/vinyl-room/atmosphere/mojo-carrot.webp';

  return (
    <div className={styles.atmosphere} data-theme={theme} data-subdued={subdued} aria-hidden="true">
      <div className={styles.objects}>
        <div className={`${styles.object} ${balloons ? styles.balloonPair : styles.far}`}>
          <img className={styles.keepsake} src={source} alt="" width={1024} height={1536} decoding="async" draggable={false} />
        </div>
        {!balloons && <div className={`${styles.object} ${styles.near}`}>
          <img className={styles.keepsake} src={source} alt="" width={1024} height={1536} decoding="async" draggable={false} />
        </div>}
      </div>
      <div className={styles.vignette} />
      <svg className={styles.grain} width="100%" height="100%" focusable="false">
        <filter id={`room-grain-${theme}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".76" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#room-grain-${theme})`} />
      </svg>
    </div>
  );
}
