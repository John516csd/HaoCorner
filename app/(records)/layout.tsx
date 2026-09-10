import VinylRoom from '../components/vinyl-room';
import { MusicLanguageProvider } from '../components/vinyl-room/locale';

export default function RecordsLayout({ children }: { children: React.ReactNode }) {
  return <MusicLanguageProvider><VinylRoom />{children}</MusicLanguageProvider>;
}
