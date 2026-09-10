import { useMusicLanguage } from './locale';
import styles from './language-switch.module.css';

export default function LanguageSwitch() {
  const { locale, setLocale, t } = useMusicLanguage();
  return <div className={styles.switcher} role="group" aria-label={t('切换语言')} data-locale={locale}
    onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) event.stopPropagation(); }}>
    <span className={styles.indicator} aria-hidden="true" />
    <button type="button" lang="zh-CN" aria-pressed={locale === 'zh'} aria-label="切换为中文" onClick={() => setLocale('zh')}>中文</button>
    <button type="button" lang="en" aria-pressed={locale === 'en'} aria-label="Switch to English" onClick={() => setLocale('en')}>EN</button>
  </div>;
}
