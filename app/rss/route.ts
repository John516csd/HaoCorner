export async function GET() {
  const siteUrl = 'https://yanchenhao.com'
  const updatedAt = new Date().toUTCString()
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Yanchenhao's Corner</title>
    <link>${siteUrl}</link>
    <description>A scrapbook-style personal portfolio by Yanchenhao.</description>
    <language>en</language>
    <lastBuildDate>${updatedAt}</lastBuildDate>
    <item>
      <title>Yanchenhao's Corner</title>
      <link>${siteUrl}</link>
      <guid>${siteUrl}</guid>
      <description>Frontend engineering, travel moments, music, and personal notes.</description>
      <pubDate>${updatedAt}</pubDate>
    </item>
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
