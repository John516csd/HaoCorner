import styles from './artist-atmosphere.module.css';

export type ArtistRoomTheme = string;

/** Warm paper and a quiet grain keep the box and shelf in the same room. */
export default function ArtistAtmosphere({ theme }: {
  theme: ArtistRoomTheme;
}) {
  return (
    <div className={styles.atmosphere} data-theme={theme} aria-hidden="true">
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
