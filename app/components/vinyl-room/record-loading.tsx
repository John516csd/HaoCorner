import styles from './record-loading.module.css';

export default function RecordLoading({ active }: { active: boolean }) {
  return <output className={styles.loading} data-active={active} aria-hidden={!active} aria-live="polite" aria-atomic="true">
    <span className={styles.player} aria-hidden="true">
      <span className={styles.disc}>
        <span className={styles.hub} />
        <span className={styles.print}>COMPACT<small>DIGITAL AUDIO</small></span>
      </span>
    </span>
    <span className={styles.caption}>
      <span className={styles.levels} aria-hidden="true"><i /><i /><i /></span>
      加载唱片
    </span>
  </output>;
}
