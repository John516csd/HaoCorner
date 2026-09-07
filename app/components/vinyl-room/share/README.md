# Lyric sharing

Both record rooms use `ShareWorkshop`. The original album view stays mounted while choosing lyrics so returning preserves its scroll position. Desktop composing replaces the record with a poster; mobile uses a scrollable editor. Escape returns one step, and drafts are stored per track in local storage.

Song selection starts loading immediately and waits for the song panel's opacity transition to settle before revealing the lyric panel. Loaded lyrics enter in order with a short stagger on visible rows only. Scrolling or keyboard input cancels the reveal; selecting lines does not replay it. Reduced motion skips it. Returning cancels pending entry work and aborts the lyrics request.

`/api/lyrics?room=mayday&track=…` only accepts songs in the local album catalog. It queries [LRCLIB](https://lrclib.net/docs), normalizes Chinese metadata with OpenCC, and automatically opens a result only when artist, title, album and duration agree (within four seconds). Other versions require selection. Missing lyrics and provider failures have manual entry and retry paths. Catalog coverage and the accuracy of community lyrics are not guaranteed. Public API availability does not establish permission for lyric redistribution; confirm a suitable content source before a public launch.

`poster.ts` draws preview and export from the same layout. Single posters are 1080 × 1080. The grid uses the album cover across the whole image, with a dark gradient supporting small lyrics and personal notes in the bottom row. It is rendered at 3240 × 3240 and cut row by row into nine 1080 × 1080 PNGs. Added text and the QR remain inside their tiles. Text is fitted without truncation; excess blank lines produce an actionable error. Gap previews and order badges are outside the exported artwork. QR codes link to the production song route and never contain the personal note or signature. Older drafts retain their lyrics, notes and signature; the retired keyword emphasis is ignored.

Export supports individual images, ZIP archives and the Web Share API when the browser reports support for the generated files. The UI does not claim to publish to Moments. Mobile saving still needs a real Safari/WeChat device check before release.

Validation: `node scripts/check-lyric-sharing.mjs`, `pnpm typecheck`, `pnpm build`, plus browser checks of both rooms, three poster styles, nine PNG dimensions, draft restoration, keyboard back navigation, and mobile layouts.
