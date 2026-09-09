# 唱片收藏室目录来源

2026-09-09 核对 10 位歌手，收录 365 个专辑发行版本、5129 条曲目。每位歌手按年份排列，不再截取固定张数。

## 收录范围

- 包含录音室专辑、EP、现场专辑、精选集、原声带、混音集、重录及加曲版本。相同标题的地区重复发行合并，优先中国区；具有独立版本名称的豪华版等分别保留。这里的张数是发行版本数，不是独立录音室专辑数。
- 不纳入普通单曲和仅客串的他人专辑。保留虽被平台标为 Single 的已知 EP：邓紫棋《另一个童话》《睡皇后》，周杰伦《范特西Plus》《霍元甲》《黄金甲》。
- Apple 返回的纯 MV/视频套装不重复占据音频专辑位置；DUO、Time Flies 等对应音频发行已收录。排除的纯视频目录 ID：1445706572、1445713570、1445686357、1446016948、1446010606。邓紫棋早期现场发行另按存档曲目补入。
- 这是当前可核对的发行目录快照。地区下架、未来发行和未被来源登记的实体限定版本，需要后续以可核对来源补充。

## 元数据与链接

- Apple iTunes lookup：`lookup?id={artistId}&entity=album&country={region}&limit=200`。所有歌手均核对中国、美国及英国目录；陈奕迅、五月天、邓紫棋、周杰伦另核对香港及台湾目录。Taylor Swift 美国 lookup 达到 200 项上限，另以 `search?term=Taylor%20Swift&entity=album&attribute=artistTerm&country=us&limit=200` 返回的 197 项交叉核对；其 Red 豪华版和附留言版本均已有相应地区发行。其他 lookup 未达上限。
- 歌手 ID：Eason 137938148；Mayday 369211611；G.E.M. 425208570；The Weeknd 479756766；Kanye West 2715720；Post Malone 966309175；Charlie Puth 336249253；Justin Bieber 320569549；Taylor Swift 159260351；Jay Chou 300117743。Kanye 的联合署名目录亦纳入核对。
- 中国区专辑页解析公开的 `serialized-server-data`，仅采用本专辑 track-list 的 song 项，排除推荐列表和 MV。`sourceTrackCount` 为页面声明的歌曲数。页面不可读时采用同一发行 ID 的 iTunes 目录，保留原地区与原始链接；不是推测或拼接其他版本。
- `year` / `releaseDate` 使用来源返回的当前发行版本日期，不保证等于作品首次发行日期。中文显示采用繁转简；《范特西Plus》的平台原标题保留在 `sourceTitle`。
- 地区缺曲保留原曲序并用 `unreturnedItemCount` 标示；iTunes 回退目录的项目数可能包含未返回的 MV，因此页面使用“项”而非将差额全部称作歌曲。未核实的歌曲直链置空。首批 427 条中国区单曲直链曾逐一核对 canonical 与 ID；扩充曲目使用来源返回的链接，不宣称逐一验证全部外链可播放。
- Post Malone《Psycho》中国区单曲链接出现跳转循环，保留曲目并隐藏该直链。陈奕迅原有数据保留香港曲目 ID 及之前核对的中国区替代链接。
- Charlie Puth 早期两张 EP、邓紫棋 2011 现场、Taylor Swift《Beautiful Eyes》及 Kanye West《VH1 Storytellers》的曲目来自 MusicBrainz（有音频 CD 的套装只取 CD，不重复列入 DVD）；《不能说的秘密》原声带补自 MusicBrainz 的 25 首数字发行，并与 [LINE MUSIC](https://music-tw.line.me/album/1018315) 交叉核对（LINE 当前只列 23 首）。其 `sourceTrackId` 是 MusicBrainz UUID，数值 `trackId` 为本地稳定哈希，不是 Apple ID，歌曲直链置空。

## 封面

- 新封面按长边最多 1200px、WebP quality 82 等比压缩，不放大小图；`width` / `height` 为实际尺寸。原有陈奕迅/五月天封面保留。
- 新增 256px WebP 缩略图供收藏箱使用，高清纹理只为可见唱片加载，离开可见范围释放。背景为 48×48 预模糊 JPEG。
- Apple 图片保留 `sourceArtworkUrl`。五份历史发行图片来自相应 Cover Art Archive 记录；G.E.M. 使用该发行存档图册图片，未宣称是实体正封面。未下载音频或歌词。

| 歌手 | 发行版本 | 已读取曲目 |
| --- | ---: | ---: |
| 陈奕迅 | 75 | 1090 |
| 五月天 | 33 | 550 |
| 邓紫棋 | 19 | 232 |
| The Weeknd | 28 | 351 |
| Kanye West | 28 | 377 |
| Post Malone | 16 | 266 |
| Charlie Puth | 17 | 155 |
| Justin Bieber | 37 | 491 |
| Taylor Swift | 83 | 1226 |
| 周杰伦 | 29 | 391 |

## 逐张来源

| 歌手 | 专辑 | 来源年份 | 已读取 / 来源曲目数 | 来源 |
| --- | --- | ---: | ---: | --- |
| 陈奕迅 | 华星DSD复刻经典: 陈奕迅 | 1996 | 10 / 10 | [892603736](https://music.apple.com/cn/album/%E8%8F%AF%E6%98%9Fdsd%E5%BE%A9%E5%88%BB%E7%B6%93%E5%85%B8-%E9%99%B3%E5%A5%95%E8%BF%85/892603736) |
| 陈奕迅 | 时代曲 (华星40 复刻系列) | 1996 | 10 / 10 | [892852443](https://music.apple.com/cn/album/%E6%99%82%E4%BB%A3%E6%9B%B2-%E8%8F%AF%E6%98%9F40-%E5%BE%A9%E5%88%BB%E7%B3%BB%E5%88%97/892852443) |
| 陈奕迅 | 一滴眼泪 | 1997 | 10 / 10 | [1694525409](https://music.apple.com/cn/album/%E4%B8%80%E6%BB%B4%E7%9C%BC%E6%B7%9A/1694525409) |
| 陈奕迅 | 与我常在 | 1997 | 11 / 11 | [892735096](https://music.apple.com/cn/album/%E8%88%87%E6%88%91%E5%B8%B8%E5%9C%A8/892735096) |
| 陈奕迅 | 酝酿 | 1997 | 12 / 12 | [1694525250](https://music.apple.com/cn/album/%E9%86%9E%E9%87%80/1694525250) |
| 陈奕迅 | 我的快乐时代 | 1998 | 14 / 14 | [1575742728](https://music.apple.com/cn/album/%E6%88%91%E7%9A%84%E5%BF%AB%E6%A8%82%E6%99%82%E4%BB%A3/1575742728) |
| 陈奕迅 | 大激想 - EP | 1998 | 4 / 4 | [6785387038](https://music.apple.com/cn/album/%E5%A4%A7%E6%BF%80%E6%83%B3-ep/6785387038) |
| 陈奕迅 | 新生活 (Live) | 1999 | 13 / 14 | [1484716666](https://music.apple.com/cn/album/%E6%96%B0%E7%94%9F%E6%B4%BB-live/1484716666) |
| 陈奕迅 | 天佑爱人 | 1999 | 10 / 10 | [892819866](https://music.apple.com/cn/album/%E5%A4%A9%E4%BD%91%E6%84%9B%E4%BA%BA/892819866) |
| 陈奕迅 | 婚礼的祝福 | 1999 | 10 / 10 | [1694525826](https://music.apple.com/cn/album/%E5%A9%9A%E7%A6%AE%E7%9A%84%E7%A5%9D%E7%A6%8F/1694525826) |
| 陈奕迅 | 幸福 | 1999 | 12 / 12 | [892514705](https://music.apple.com/cn/album/%E5%B9%B8%E7%A6%8F/892514705) |
| 陈奕迅 | Eason & Friends 903 ID Club 拉阔音乐会 | 2000 | 11 / 11 | [892458133](https://music.apple.com/cn/album/eason-friends-903-id-club-%E6%8B%89%E9%97%8A%E9%9F%B3%E6%A8%82%E6%9C%83/892458133) |
| 陈奕迅 | 68'29" | 2000 | 16 / 16 | [1550844443](https://music.apple.com/cn/album/6829/1550844443) |
| 陈奕迅 | 打得火热 | 2000 | 10 / 10 | [542594340](https://music.apple.com/cn/album/%E6%89%93%E5%BE%97%E7%81%AB%E7%86%B1/542594340) |
| 陈奕迅 | Mixed Up | 2001 | 10 / 10 | [892390524](https://music.apple.com/cn/album/mixed-up/892390524) |
| 陈奕迅 | Shall We Dance? Shall We Talk! | 2001 | 13 / 13 | [542593700](https://music.apple.com/cn/album/shall-we-dance-shall-we-talk/542593700) |
| 陈奕迅 | 反正是我 (国) | 2001 | 10 / 10 | [542592136](https://music.apple.com/cn/album/%E5%8F%8D%E6%AD%A3%E6%98%AF%E6%88%91-%E5%9C%8B/542592136) |
| 陈奕迅 | The Easy Ride | 2001 | 11 / 11 | [542634698](https://music.apple.com/cn/album/the-easy-ride/542634698) |
| 陈奕迅 | The Easy Ride 演唱会 | 2002 | 22 / 22 | [542611053](https://music.apple.com/cn/album/the-easy-ride-%E6%BC%94%E5%94%B1%E6%9C%83-live/542611053) |
| 陈奕迅 | Special Thanks To.. (香港版) | 2002 | 10 / 10 | [542612232](https://music.apple.com/cn/album/special-thanks-to-%E9%A6%99%E6%B8%AF%E7%89%88/542612232) |
| 陈奕迅 | The Line-Up | 2002 | 10 / 10 | [542611601](https://music.apple.com/cn/album/the-line-up/542611601) |
| 陈奕迅 | For a Change & Hits (新曲+精选) | 2002 | 21 / 21 | [542613324](https://music.apple.com/cn/album/for-a-change-hits-%E6%96%B0%E6%9B%B2-%E7%B2%BE%E9%81%B8/542613324) |
| 陈奕迅 | Third Encounter Concert Live | 2003 | 25 / 25 | [542681657](https://music.apple.com/cn/album/third-encounter-concert-live/542681657) |
| 陈奕迅 | 黑.白.灰 | 2003 | 10 / 10 | [542923554](https://music.apple.com/cn/album/%E9%BB%91-%E7%99%BD-%E7%81%B0/542923554) |
| 陈奕迅 | Live for Today | 2003 | 11 / 11 | [542676848](https://music.apple.com/cn/album/live-for-today/542676848) |
| 陈奕迅 | 英皇钢琴热恋系列: 陈奕迅 | 2004 | 20 / 20 | [548143960](https://music.apple.com/cn/album/%E8%8B%B1%E7%9A%87%E9%8B%BC%E7%90%B4%E7%86%B1%E6%88%80%E7%B3%BB%E5%88%97-%E9%99%B3%E5%A5%95%E8%BF%85/548143960) |
| 陈奕迅 | 怎么样 | 2005 | 9 / 10 | [1443938740](https://music.apple.com/cn/album/%E6%80%8E%E9%BA%BC%E6%A8%A3/1443938740) |
| 陈奕迅 | Great 5000 Secs (新曲+精选) | 2005 | 18 / 18 | [542693388](https://music.apple.com/cn/album/great-5000-secs-%E6%96%B0%E6%9B%B2-%E7%B2%BE%E9%81%B8/542693388) |
| 陈奕迅 | Great 5000 Secs, Vol. 2 (新曲+精选) | 2005 | 17 / 17 | [542698905](https://music.apple.com/cn/album/great-5000-secs-vol-2-%E6%96%B0%E6%9B%B2-%E7%B2%BE%E9%81%B8/542698905) |
| 陳奕迅 | U87 | 2005 | 12 / 12 | [1443374875](https://music.apple.com/cn/album/u-87/1443374875) |
| 陈奕迅 | Life Continues | 2006 | 7 / 7 | [1442912707](https://music.apple.com/cn/album/life-continues/1442912707) |
| 陳奕迅 | What's Going On...? | 2006 | 10 / 10 | [1443345687](https://music.apple.com/cn/album/whats-going-on/1443345687) |
| 陈奕迅 | 正东10X10我至爱唱片 - U87 | 2006 | 13 / 13 | [1443368631](https://music.apple.com/cn/album/%E6%AD%A3%E6%9D%B110x10%E6%88%91%E8%87%B3%E6%84%9B%E5%94%B1%E7%89%87-u87/1443368631) |
| 陈奕迅 | 我的最好時代 | 2006 | 44 / 44 | [542910172](https://music.apple.com/cn/album/%E6%88%91%E7%9A%84%E6%9C%80%E5%A5%BD%E6%99%82%E4%BB%A3/542910172) |
| 陈奕迅 | Get A Life (Live) | 2006 | 38 / 38 | [1462045698](https://music.apple.com/cn/album/get-a-life-live/1462045698) |
| 陈奕迅 | What's Going On...? (Remastered 2019) | 2006 | 10 / 10 | [1490822079](https://music.apple.com/cn/album/whats-going-on-remastered-2019/1490822079) |
| 陳奕迅 | 认了吧 | 2007 | 11 / 11 | [1443816775](https://music.apple.com/cn/album/%E8%AA%8D%E4%BA%86%E5%90%A7-%E5%8F%B0%E7%81%A3%E7%89%88/1443352354) |
| 陈奕迅 | What's Going On...? (2nd Edition) | 2007 | 15 / 15 | [1720091272](https://music.apple.com/cn/album/whats-going-on-2nd-edition/1720091272) |
| 陈奕迅 | 认了吧 (台湾版) | 2007 | 10 / 10 | [1443352354](https://music.apple.com/cn/album/%E8%AA%8D%E4%BA%86%E5%90%A7-%E5%8F%B0%E7%81%A3%E7%89%88/1443352354) |
| 陈奕迅 | Listen to Eason Chan | 2007 | 20 / 20 | [1462039068](https://music.apple.com/cn/album/listen-to-eason-chan/1462039068) |
| 陈奕迅 | Listen to Eason Chan (Remastered 2019) | 2007 | 10 / 10 | [1490821997](https://music.apple.com/cn/album/listen-to-eason-chan-remastered-2019/1490821997) |
| 陈奕迅 | 你的陈奕迅国语精选 | 2007 | 28 / 28 | [542922079](https://music.apple.com/cn/album/%E4%BD%A0%E7%9A%84%E9%99%B3%E5%A5%95%E8%BF%85%E5%9C%8B%E8%AA%9E%E7%B2%BE%E9%81%B8/542922079) |
| 陈奕迅 | Eason Moving on Stage 1 (Live) | 2007 | 27 / 27 | [1462045568](https://music.apple.com/cn/album/eason-moving-on-stage-1-live/1462045568) |
| 陈奕迅 | The 1st Eleven Years 然后呢? | 2008 | 8 / 8 | [1443826314](https://music.apple.com/cn/album/the-1st-eleven-years-%E7%84%B6%E5%BE%8C%E5%91%A2/1443826314) |
| 陳奕迅 | 不想放手 | 2008 | 7 / 11 | [1443493887](https://music.apple.com/cn/album/%E4%B8%8D%E6%83%B3%E6%94%BE%E6%89%8B/1443493887) |
| 陳奕迅 | H³M | 2009 | 10 / 10 | [1443774258](https://music.apple.com/cn/album/h3m/1443774258) |
| 陈奕迅 | Solidays | 2009 | 25 / 27 | [1442943933](https://music.apple.com/cn/album/solidays/1442943933) |
| 陈奕迅 | 上五楼的快活 | 2009 | 11 / 11 | [1442260565](https://music.apple.com/cn/album/%E4%B8%8A%E4%BA%94%E6%A8%93%E7%9A%84%E5%BF%AB%E6%B4%BB/1442260565) |
| 陈奕迅 | 上五楼的快活 (2nd Edition) | 2009 | 11 / 11 | [1442429995](https://music.apple.com/cn/album/%E4%B8%8A%E4%BA%94%E6%A8%93%E7%9A%84%E5%BF%AB%E6%B4%BB-2nd-edition/1442429995) |
| 陈奕迅 | H3M (Remastered 2019) | 2009 | 10 / 10 | [1490822198](https://music.apple.com/cn/album/h3m-remastered-2019/1490822198) |
| 陳奕迅 | Time Flies · EP | 2010 | 6 / 6 | [1443717418](https://music.apple.com/cn/album/time-flies-2010-ep/1443717418) |
| 陈奕迅 | 陈奕迅2010 Duo演唱会 | 2010 | 34 / 36 | [1442966677](https://music.apple.com/cn/album/%E9%99%B3%E5%A5%95%E8%BF%852010-duo%E6%BC%94%E5%94%B1%E6%9C%83/1442966677) |
| 陈奕迅 | Taste The Atmosphere | 2010 | 8 / 8 | [1604745788](https://music.apple.com/cn/album/taste-the-atmosphere/1604745788) |
| 陈奕迅 | Taste the Atmosphere (Remastered 2025) | 2010 | 8 / 8 | [1829423915](https://music.apple.com/cn/album/taste-the-atmosphere-remastered-2025/1829423915) |
| 陈奕迅 | 903 ID Club拉阔音乐会 陈奕迅 - EP | 2011 | 4 / 6 | [1442491195](https://music.apple.com/cn/album/903-id-club%E6%8B%89%E9%97%8A%E9%9F%B3%E6%A8%82%E6%9C%83-%E9%99%B3%E5%A5%95%E8%BF%85-ep/1442491195) |
| 陳奕迅 | Stranger Under My Skin | 2011 | 9 / 9 | [1443711302](https://music.apple.com/cn/album/stranger-under-my-skin/1443711302) |
| 陈奕迅 | Stranger Under My Skin (Remastered 2025) | 2011 | 8 / 9 | [1821210438](https://music.apple.com/cn/album/stranger-under-my-skin-remastered-2025/1821210438) |
| 陈奕迅 | ? | 2011 | 12 / 12 | [1443783500](https://music.apple.com/cn/album/1443783500) |
| 陳奕迅 | ...3mm | 2012 | 10 / 11 | [1445753233](https://music.apple.com/cn/album/3mm/1445753233) |
| 陈奕迅 | ...3mm Remix - EP | 2012 | 5 / 5 | [1443067287](https://music.apple.com/cn/album/3mm-remix-ep/1443067287) |
| 陈奕迅 | Eason's Life 2013演唱会 | 2013 | 21 / 21 | [1443270803](https://music.apple.com/us/album/easons-life-2013%E6%BC%94%E5%94%B1%E6%9C%83/1443270803) |
| 陈奕迅 | 陈奕迅 国语精选 | 2013 | 17 / 17 | [651455891](https://music.apple.com/cn/album/%E9%99%B3%E5%A5%95%E8%BF%85-%E5%9C%8B%E8%AA%9E%E7%B2%BE%E9%81%B8/651455891) |
| 陈奕迅 | 陈奕迅 (广东精选) | 2013 | 17 / 17 | [651449675](https://music.apple.com/cn/album/%E9%99%B3%E5%A5%95%E8%BF%85-%E5%BB%A3%E6%9D%B1%E7%B2%BE%E9%81%B8/651449675) |
| 陈奕迅 | 2013 陈奕迅 Music Life 精选 | 2013 | 74 / 74 | [667921627](https://music.apple.com/cn/album/2013-%E9%99%B3%E5%A5%95%E8%BF%85-music-life-%E7%B2%BE%E9%81%B8/667921627) |
| 陳奕迅 | The Key | 2013 | 8 / 8 | [1386714588](https://music.apple.com/cn/album/the-key/1386714588) |
| 陈奕迅 | Eason's Life 陈奕迅2013演唱会 (Deluxe Version) | 2014 | 22 / 22 | [1444164011](https://music.apple.com/cn/album/easons-life-%E9%99%B3%E5%A5%95%E8%BF%852013%E6%BC%94%E5%94%B1%E6%9C%83-deluxe-version/1444164011) |
| 陳奕迅 | Rice & Shine | 2014 | 11 / 11 | [1422694136](https://music.apple.com/cn/album/rice-shine/1422694136) |
| 陈奕迅 | 新生活 (新曲+精選) | 2014 | 19 / 19 | [892692130](https://music.apple.com/cn/album/%E6%96%B0%E7%94%9F%E6%B4%BB-%E6%96%B0%E6%9B%B2-%E7%B2%BE%E9%81%B8/892692130) |
| 陈奕迅 | Nothing Really Matters | 2014 | 10 / 10 | [892669236](https://music.apple.com/cn/album/nothing-really-matters/892669236) |
| 陈奕迅 | 准备中 | 2015 | 10 / 10 | [1422674966](https://music.apple.com/cn/album/%E6%BA%96%E5%82%99%E4%B8%AD/1422674966) |
| 陳奕迅 | C'mon in~ | 2017 | 10 / 10 | [1440909180](https://music.apple.com/cn/album/cmon-in/1440909180) |
| 陳奕迅 & eason and the duo band | L.O.V.E. | 2018 | 15 / 19 | [1441543918](https://music.apple.com/cn/album/l-o-v-e/1441543918) |
| 陈奕迅 | EasON AIR - EP | 2022 | 6 / 6 | [1642253501](https://music.apple.com/cn/album/eason-air-ep/1642253501) |
| 陈奕迅 | CHIN UP! | 2023 | 8 / 8 | [1712647195](https://music.apple.com/cn/album/chin-up/1712647195) |
| 陈奕迅 | FEAR and DREAMS (Live) | 2025 | 31 / 31 | [1831490372](https://music.apple.com/cn/album/fear-and-dreams-live/1831490372) |
| 五月天 | 五月天第一张创作专辑 | 1999 | 12 / 12 | [162129396](https://music.apple.com/cn/album/%E4%BA%94%E6%9C%88%E5%A4%A9%E7%AC%AC%E4%B8%80%E5%BC%B5%E5%89%B5%E4%BD%9C%E5%B0%88%E8%BC%AF/162129396) |
| 五月天 | 第168场演唱会 | 1999 | 16 / 16 | [183554890](https://music.apple.com/cn/album/%E7%AC%AC168%E5%A0%B4%E6%BC%94%E5%94%B1%E6%9C%83-live/183554890) |
| 五月天 | 超级Band Band Band | 2000 | 7 / 7 | [181116605](https://music.apple.com/cn/album/%E8%B6%85%E7%B4%9Aband-band-band/181116605) |
| 五月天 | 爱情万岁 | 2000 | 12 / 12 | [150093860](https://music.apple.com/cn/album/%E6%84%9B%E6%83%85%E8%90%AC%E6%AD%B2/150093860) |
| 五月天 | 十万青年站出来 (Live巡回演唱会全纪录) | 2000 | 26 / 26 | [657724722](https://music.apple.com/cn/album/%E5%8D%81%E8%90%AC%E9%9D%92%E5%B9%B4%E7%AB%99%E5%87%BA%E4%BE%86-live%E5%B7%A1%E8%BF%B4%E6%BC%94%E5%94%B1%E6%9C%83%E5%85%A8%E7%B4%80%E9%8C%84/657724722) |
| 五月天 | 候鸟 五月天电影音乐作品 | 2001 | 13 / 13 | [183708857](https://music.apple.com/cn/album/%E5%80%99%E9%B3%A5-%E4%BA%94%E6%9C%88%E5%A4%A9%E9%9B%BB%E5%BD%B1%E9%9F%B3%E6%A8%82%E4%BD%9C%E5%93%81/183708857) |
| 五月天 | 人生海海 | 2001 | 12 / 12 | [541019015](https://music.apple.com/cn/album/%E4%BA%BA%E7%94%9F%E6%B5%B7%E6%B5%B7/541019015) |
| 五月天 | 你要去哪里巡回演唱会 | 2001 | 35 / 35 | [153722851](https://music.apple.com/cn/album/%E4%BD%A0%E8%A6%81%E5%8E%BB%E5%93%AA%E8%A3%A1%E5%B7%A1%E8%BF%B4%E6%BC%94%E5%94%B1%E6%9C%83-live/153722851) |
| 五月天 | 五月天纪录电影.摇滚本事 (电影音乐原声带) - EP | 2002 | 4 / 4 | [559630541](https://music.apple.com/cn/album/%E4%BA%94%E6%9C%88%E5%A4%A9%E7%B4%80%E9%8C%84%E9%9B%BB%E5%BD%B1-%E6%90%96%E6%BB%BE%E6%9C%AC%E4%BA%8B-%E9%9B%BB%E5%BD%B1%E9%9F%B3%E6%A8%82%E5%8E%9F%E8%81%B2%E5%B8%B6-ep/559630541) |
| 五月天 | 我们是五月天 | 2003 | 14 / 14 | [1078528641](https://music.apple.com/cn/album/%E6%88%91%E5%80%91%E6%98%AF%E4%BA%94%E6%9C%88%E5%A4%A9/1078528641) |
| 五月天 | 时光机 | 2003 | 15 / 15 | [153785619](https://music.apple.com/cn/album/%E6%99%82%E5%85%89%E6%A9%9F/153785619) |
| 五月天 | 天空之城复出演唱会 | 2004 | 26 / 27 | [558714778](https://music.apple.com/cn/album/%E5%A4%A9%E7%A9%BA%E4%B9%8B%E5%9F%8E%E5%BE%A9%E5%87%BA%E6%BC%94%E5%94%B1%E6%9C%83-live/558714778) |
| 五月天 | 神的孩子都在跳舞 | 2004 | 13 / 13 | [183919330](https://music.apple.com/cn/album/%E7%A5%9E%E7%9A%84%E5%AD%A9%E5%AD%90%E9%83%BD%E5%9C%A8%E8%B7%B3%E8%88%9E/183919330) |
| 五月天 | 当我们混在一起 2005世界巡回演唱会 | 2005 | 39 / 39 | [164410861](https://music.apple.com/cn/album/%E7%95%B6%E6%88%91%E5%80%91%E6%B7%B7%E5%9C%A8%E4%B8%80%E8%B5%B7-2005%E4%B8%96%E7%95%8C%E5%B7%A1%E8%BF%B4%E6%BC%94%E5%94%B1%E6%9C%83-live/164410861) |
| 五月天 | 知足 just my pride 最真杰作选 | 2005 | 30 / 30 | [1554431588](https://music.apple.com/cn/album/%E7%9F%A5%E8%B6%B3-just-my-pride-%E6%9C%80%E7%9C%9F%E5%82%91%E4%BD%9C%E9%81%B8/1554431588) |
| 五月天 | 为爱而生 | 2006 | 13 / 13 | [1081397791](https://music.apple.com/cn/album/%E7%82%BA%E6%84%9B%E8%80%8C%E7%94%9F/1081397791) |
| 五月天 | 离开地球表面 | 2007 | 17 / 17 | [1081738606](https://music.apple.com/cn/album/%E9%9B%A2%E9%96%8B%E5%9C%B0%E7%90%83%E8%A1%A8%E9%9D%A2/1081738606) |
| 五月天 | 后 青春期的诗 | 2008 | 12 / 12 | [1081381033](https://music.apple.com/cn/album/%E5%BE%8C-%E9%9D%92%E6%98%A5%E6%9C%9F%E7%9A%84%E8%A9%A9/1081381033) |
| 五月天 | 十万人出头天 (Live) | 2009 | 15 / 15 | [1087693463](https://music.apple.com/cn/album/%E5%8D%81%E8%90%AC%E4%BA%BA%E5%87%BA%E9%A0%AD%E5%A4%A9-live/1087693463) |
| 五月天 | 「创造」小巨蛋 D.N.A Live 创纪录音 | 2009 | 26 / 26 | [1084272578](https://music.apple.com/cn/album/%E5%89%B5%E9%80%A0-%E5%B0%8F%E5%B7%A8%E8%9B%8Bdna-live-%E6%BC%94%E5%94%B1%E6%9C%83%E5%89%B5%E7%B4%80%E9%8C%84%E9%9F%B3/1084272578) |
| 五月天 | 五月天【追梦3DNA】电影原声音乐专辑 | 2011 | 16 / 16 | [1081701267](https://music.apple.com/cn/album/%E4%BA%94%E6%9C%88%E5%A4%A9-%E8%BF%BD%E5%A4%A23dna-%E9%9B%BB%E5%BD%B1%E5%8E%9F%E8%81%B2%E9%9F%B3%E6%A8%82%E5%B0%88%E8%BC%AF/1081701267) |
| 五月天 | 第二人生 (明日版) | 2011 | 14 / 14 | [1081308968](https://music.apple.com/cn/album/%E7%AC%AC%E4%BA%8C%E4%BA%BA%E7%94%9F-%E6%98%8E%E6%97%A5%E7%89%88/1081308968) |
| 五月天 | 第二人生 (末日版) | 2011 | 14 / 14 | [1081297124](https://music.apple.com/cn/album/%E7%AC%AC%E4%BA%8C%E4%BA%BA%E7%94%9F-%E6%9C%AB%E6%97%A5%E7%89%88/1081297124) |
| 五月天 | 诺亚方舟 世界巡回演唱会 (Live) | 2013 | 26 / 26 | [1084288487](https://music.apple.com/cn/album/%E8%AB%BE%E4%BA%9E%E6%96%B9%E8%88%9F-%E4%B8%96%E7%95%8C%E5%B7%A1%E8%BF%B4%E6%BC%94%E5%94%B1%E6%9C%83-live/1084288487) |
| 五月天 | 步步自选作品辑 1999-2013 | 2013 | 30 / 30 | [1207222248](https://music.apple.com/cn/album/%E6%AD%A5%E6%AD%A5%E8%87%AA%E9%81%B8%E4%BD%9C%E5%93%81%E8%BC%AF-1999-2013/1207222248) |
| 五月天 | Do You Ever Shine? - EP | 2014 | 6 / 6 | [1080934365](https://music.apple.com/cn/album/do-you-ever-shine-ep/1080934365) |
| 五月天 | YOUR LEGEND - EP | 2015 | 6 / 6 | [1080036409](https://music.apple.com/cn/album/your-legend-ep/1080036409) |
| 五月天 | 自传 | 2016 | 13 / 13 | [1158763922](https://music.apple.com/cn/album/%E8%87%AA%E5%82%B3/1158763922) |
| 五月天 | 五月天 人生无限公司 Life Live 好友加班篇 | 2019 | 12 / 12 | [1463565278](https://music.apple.com/cn/album/%E4%BA%94%E6%9C%88%E5%A4%A9-%E4%BA%BA%E7%94%9F%E7%84%A1%E9%99%90%E5%85%AC%E5%8F%B8-life-live-%E5%A5%BD%E5%8F%8B%E5%8A%A0%E7%8F%AD%E7%AF%87/1463565278) |
| 五月天 | 五月天 人生无限公司 Life Live 完整收录篇 | 2019 | 24 / 24 | [1464877093](https://music.apple.com/cn/album/%E4%BA%94%E6%9C%88%E5%A4%A9-%E4%BA%BA%E7%94%9F%E7%84%A1%E9%99%90%E5%85%AC%E5%8F%B8-life-live-%E5%AE%8C%E6%95%B4%E6%94%B6%E9%8C%84%E7%AF%87/1464877093) |
| 五月天 | 五月天 突然好想见到你 live in the sky | 2020 | 12 / 12 | [1522299247](https://music.apple.com/cn/album/%E4%BA%94%E6%9C%88%E5%A4%A9-%E7%AA%81%E7%84%B6%E5%A5%BD%E6%83%B3%E8%A6%8B%E5%88%B0%E4%BD%A0-live-in-the-sky/1522299247) |
| 五月天 | 五月天 好好好想见到你 Mayday fly to 2022 线上特别版 LIVE | 2022 | 10 / 10 | [1606885161](https://music.apple.com/cn/album/%E4%BA%94%E6%9C%88%E5%A4%A9-%E5%A5%BD%E5%A5%BD%E5%A5%BD%E6%83%B3%E8%A6%8B%E5%88%B0%E4%BD%A0-mayday-fly-to-2022-%E7%B7%9A%E4%B8%8A%E7%89%B9%E5%88%A5%E7%89%88-live/1606885161) |
| 五月天 | 五月天 fly to 2023 诺亚方舟十周年线上特别版 LIVE | 2023 | 10 / 10 | [1678909890](https://music.apple.com/cn/album/%E4%BA%94%E6%9C%88%E5%A4%A9-fly-to-2023-%E8%AB%BE%E4%BA%9E%E6%96%B9%E8%88%9F%E5%8D%81%E9%80%B1%E5%B9%B4%E7%B7%9A%E4%B8%8A%E7%89%B9%E5%88%A5%E7%89%88-live/1678909890) |
| 邓紫棋 | G.E.M. - EP | 2008 | 5 / 5 | [6775748908](https://music.apple.com/cn/album/g-e-m-ep/6775748908) |
| 邓紫棋 | 18... | 2009 | 13 / 13 | [6775749474](https://music.apple.com/cn/album/18/6775749474) |
| 邓紫棋 | MySecret | 2010 | 10 / 10 | [6776100461](https://music.apple.com/cn/album/mysecret/6776100461) |
| 邓紫棋 | Get Everybody Moving Concert 2011 | 2011 | 31 / 31 | [4bb80009-dc7f-4cb3-a2f7-de70935e9d12](https://musicbrainz.org/release/4bb80009-dc7f-4cb3-a2f7-de70935e9d12) |
| 邓紫棋 | Xposed | 2012 | 10 / 11 | [541862703](https://music.apple.com/cn/album/xposed/541862703) |
| 邓紫棋 | The Best of G.E.M. 2008 - 2012 | 2013 | 24 / 24 | [6775736404](https://music.apple.com/cn/album/the-best-of-g-e-m-2008-2012/6775736404) |
| 邓紫棋 | The Best of G.E.M. 2008-2012 (Deluxe Version) | 2013 | 26 / 27 | [666994246](https://music.apple.com/cn/album/the-best-of-g-e-m-2008-2012-deluxe-version/666994246) |
| 邓紫棋 | G.E.M. X.X.X. Live | 2013 | 21 / 21 | [6775775910](https://music.apple.com/cn/album/g-e-m-x-x-x-live/6775775910) |
| 邓紫棋 | 新的心跳 | 2015 | 10 / 10 | [1053567923](https://music.apple.com/cn/album/%E6%96%B0%E7%9A%84%E5%BF%83%E8%B7%B3/1053567923) |
| 邓紫棋 | 新的心跳 (Deluxe) | 2015 | 10 / 20 | [1070300722](https://music.apple.com/cn/album/%E6%96%B0%E7%9A%84%E5%BF%83%E8%B7%B3-deluxe/1070300722) |
| 邓紫棋 | 25 LOOKS - EP | 2016 | 4 / 4 | [1159449601](https://music.apple.com/cn/album/25-looks-ep/1159449601) |
| 邓紫棋 | 另一个童话 - Single | 2018 | 3 / 3 | [1422581993](https://music.apple.com/cn/album/%E5%8F%A6%E4%B8%80%E5%80%8B%E7%AB%A5%E8%A9%B1-single/1422581993) |
| 邓紫棋 | 毒苹果 | 2018 | 3 / 3 | [1438724940](https://music.apple.com/cn/album/%E6%AF%92%E8%98%8B%E6%9E%9C/1438724940) |
| 邓紫棋 | 睡皇后 - Single | 2018 | 3 / 3 | [1445400716](https://music.apple.com/cn/album/%E7%9D%A1%E7%9A%87%E5%90%8E-single/1445400716) |
| 邓紫棋 | 摩天动物园 | 2019 | 13 / 13 | [1491477494](https://music.apple.com/cn/album/city-zoo/1491477494) |
| 邓紫棋 | 启示录 | 2022 | 14 / 14 | [1641502284](https://music.apple.com/cn/album/%E5%90%AF%E7%A4%BA%E5%BD%95/1641502284) |
| 邓紫棋 | Revelación | 2023 | 14 / 14 | [1695076267](https://music.apple.com/cn/album/revelaci%C3%B3n/1695076267) |
| 邓紫棋 | T.I.M.E. - EP | 2023 | 6 / 6 | [1717030435](https://music.apple.com/cn/album/t-i-m-e-ep/1717030435) |
| 邓紫棋 | I AM GLORIA | 2025 | 12 / 12 | [1818540352](https://music.apple.com/cn/album/i-am-gloria/1818540352) |
| The Weeknd | House of Balloons (Original) | 2011 | 9 / 9 | [1558941834](https://music.apple.com/cn/album/house-of-balloons-original/1558941834) |
| The Weeknd | Thursday (Original) | 2011 | 8 / 9 | [1579255902](https://music.apple.com/cn/album/thursday-original/1579255902) |
| The Weeknd | Echoes Of Silence (Original) | 2011 | 8 / 9 | [1598758840](https://music.apple.com/cn/album/echoes-of-silence-original/1598758840) |
| The Weeknd | Trilogy | 2012 | 22 / 30 | [1714908584](https://music.apple.com/cn/album/trilogy/1714908584) |
| The Weeknd | Kiss Land | 2013 | 12 / 13 | [1445315678](https://music.apple.com/cn/album/kiss-land/1445315678) |
| The Weeknd | Kiss Land (Deluxe) | 2013 | 12 / 14 | [1440860916](https://music.apple.com/gb/album/kiss-land-deluxe/1440860916) |
| The Weeknd | Beauty Behind the Madness | 2015 | 11 / 14 | [1440826239](https://music.apple.com/cn/album/beauty-behind-the-madness/1440826239) |
| The Weeknd | Starboy | 2016 | 17 / 18 | [1440871397](https://music.apple.com/cn/album/starboy/1440871397) |
| The Weeknd | Starboy (Deluxe) | 2016 | 20 / 21 | [1676999839](https://music.apple.com/cn/album/starboy-deluxe/1676999839) |
| The Weeknd | My Dear Melancholy, | 2018 | 6 / 6 | [1363309866](https://music.apple.com/cn/album/my-dear-melancholy/1363309866) |
| The Weeknd | After Hours | 2020 | 11 / 14 | [1499378108](https://music.apple.com/cn/album/after-hours/1499378108) |
| The Weeknd | After Hours (Deluxe) | 2020 | 16 / 18 | [1615103111](https://music.apple.com/cn/album/after-hours-deluxe/1615103111) |
| The Weeknd | After Hours (Remixes) - EP | 2020 | 6 / 6 | [1505682596](https://music.apple.com/cn/album/after-hours-remixes-ep/1505682596) |
| The Weeknd | Blinding Lights - EP | 2020 | 4 / 5 | [1531552242](https://music.apple.com/cn/album/blinding-lights-ep/1531552242) |
| The Weeknd | The Highlights | 2021 | 17 / 18 | [1550875218](https://music.apple.com/cn/album/the-highlights/1550875218) |
| The Weeknd | Dawn FM | 2022 | 16 / 16 | [1603171516](https://music.apple.com/cn/album/dawn-fm/1603171516) |
| The Weeknd | Dawn FM (Alternate World) | 2022 | 24 / 24 | [1641597259](https://music.apple.com/cn/album/dawn-fm-alternate-world/1641597259) |
| The Weeknd | The Weeknd Chill Sollos Focus Collection | 2022 | 13 / 13 | [1821496329](https://music.apple.com/cn/album/the-weeknd-chill-sollos-focus-collection/1821496329) |
| The Weeknd | The Weeknd Heightened Sollos Focus Collection | 2022 | 13 / 13 | [1821490674](https://music.apple.com/cn/album/the-weeknd-heightened-sollos-focus-collection/1821490674) |
| The Weeknd | Live At SoFi Stadium | 2023 | 27 / 31 | [1674298155](https://music.apple.com/cn/album/live-at-sofi-stadium/1674298155) |
| The Weeknd | The Idol Episode 2 (Music from the HBO Original Series) - EP | 2023 | 3 / 3 | [1691967256](https://music.apple.com/cn/album/the-idol-episode-2-music-from-the-hbo-original-series-ep/1691967256) |
| The Weeknd | The Idol Episode 3 (Music from the HBO Original Series) - EP | 2023 | 3 / 3 | [1692991369](https://music.apple.com/cn/album/the-idol-episode-3-music-from-the-hbo-original-series-ep/1692991369) |
| The Weeknd | The Idol Episode 5 Part 2 (Music from the HBO Original Series) - EP | 2023 | 3 / 3 | [1695186347](https://music.apple.com/cn/album/the-idol-episode-5-part-2-music-from-the-hbo/1695186347) |
| The Weeknd | One of the Girls - EP | 2023 | 5 / 5 | [1720045950](https://music.apple.com/cn/album/one-of-the-girls-ep/1720045950) |
| The Weeknd | The Highlights (Deluxe) | 2024 | 34 / 36 | [1729918970](https://music.apple.com/cn/album/the-highlights-deluxe/1729918970) |
| The Weeknd | Dancing In The Flames - EP | 2024 | 5 / 9 | [1768635694](https://music.apple.com/cn/album/dancing-in-the-flames-ep/1768635694) |
| The Weeknd | São Paulo - EP | 2024 | 4 / 6 | [1840048871](https://music.apple.com/cn/album/s%C3%A3o-paulo-ep/1840048871) |
| The Weeknd | Hurry Up Tomorrow | 2025 | 22 / 22 | [1793654348](https://music.apple.com/cn/album/hurry-up-tomorrow/1793654348) |
| Kanye West | All Falls Down - EP | 2004 | 4 / 4 | [1444315280](https://music.apple.com/cn/album/all-falls-down-ep/1444315280) |
| Kanye West | The College Dropout | 2004 | 21 / 21 | [1412872568](https://music.apple.com/cn/album/the-college-dropout/1412872568) |
| Kanye West | Heard 'Em Say - EP | 2005 | 3 / 3 | [1445131057](https://music.apple.com/gb/album/heard-em-say-ep/1445131057) |
| Kanye West | Late Registration | 2005 | 21 / 21 | [1440668749](https://music.apple.com/cn/album/late-registration/1440668749) |
| Kanye West | Late Orchestration - Live at Abbey Road Studios | 2006 | 13 / 13 | [1442493527](https://music.apple.com/gb/album/late-orchestration-live-at-abbey-road-studios/1442493527) |
| Kanye West | Touch the Sky - EP | 2006 | 3 / 3 | [1445289795](https://music.apple.com/gb/album/touch-the-sky-ep/1445289795) |
| Kanye West | Graduation | 2007 | 14 / 14 | [1451901307](https://music.apple.com/cn/album/graduation/1451901307) |
| Kanye West | 808s & Heartbreak (Exclusive Edition) | 2008 | 12 / 14 | [1609149054](https://music.apple.com/cn/album/808s-heartbreak-exclusive-edition/1609149054) |
| Kanye West | 808s & Heartbreak | 2008 | 12 / 15 | [1441410287](https://music.apple.com/us/album/808s-heartbreak/1441410287) |
| Kanye West | My Beautiful Dark Twisted Fantasy (Deluxe Edition) | 2010 | 13 / 15 | [1445865909](https://music.apple.com/cn/album/my-beautiful-dark-twisted-fantasy-deluxe-edition/1445865909) |
| Kanye West | VH1 Storytellers | 2010 | 9 / 9 | [9bf05b90-3809-4ddc-95a8-789a217a0bbd](https://musicbrainz.org/release/9bf05b90-3809-4ddc-95a8-789a217a0bbd) |
| Kanye West | My Beautiful Dark Twisted Fantasy | 2010 | 14 / 14 | [1440742903](https://music.apple.com/cn/album/my-beautiful-dark-twisted-fantasy/1440742903) |
| Kanye West | Watch the Throne | 2011 | 12 / 12 | [1440848092](https://music.apple.com/cn/album/watch-the-throne/1440848092) |
| Kanye West | Watch the Throne (Deluxe) | 2011 | 16 / 16 | [1440845249](https://music.apple.com/cn/album/watch-the-throne-deluxe/1440845249) |
| Kanye West | Yeezus | 2013 | 10 / 10 | [1440873068](https://music.apple.com/cn/album/yeezus/1440873068) |
| Kanye West | The Life of Pablo | 2016 | 20 / 20 | [1443063578](https://music.apple.com/cn/album/the-life-of-pablo/1443063578) |
| Kanye West | ye | 2018 | 7 / 7 | [1441456689](https://music.apple.com/cn/album/ye/1441456689) |
| Kanye West | KIDS SEE GHOSTS | 2018 | 7 / 7 | [1396710872](https://music.apple.com/cn/album/kids-see-ghosts/1396710872) |
| Kanye West | JESUS IS KING | 2019 | 11 / 11 | [1484936940](https://music.apple.com/cn/album/jesus-is-king/1484936940) |
| Kanye West | Donda | 2021 | 27 / 27 | [1587795158](https://music.apple.com/cn/album/donda/1587795158) |
| Kanye West | Donda (Deluxe) | 2021 | 32 / 32 | [1595496182](https://music.apple.com/cn/album/donda-deluxe/1595496182) |
| Kanye West | CARNIVAL PACK (feat. Rich The Kid, Playboi Carti) - EP | 2024 | 5 / 5 | [1762082199](https://music.apple.com/us/album/carnival-pack-feat-rich-the-kid-playboi-carti-ep/1762082199) |
| Kanye West | VULTURES 1 | 2024 | 15 / 15 | [1760997037](https://music.apple.com/us/album/vultures-1/1760997037) |
| Kanye West | VULTURES 2 | 2024 | 16 / 16 | [1762101173](https://music.apple.com/cn/album/vultures-2/1762101173) |
| Kanye West | DONDA 2 | 2025 | 19 / 21 | [1818888557](https://music.apple.com/cn/album/donda-2/1818888557) |
| Kanye West | BULLY - EP | 2025 | 3 / 3 | [1872771948](https://music.apple.com/cn/album/bully-ep/1872771948) |
| Kanye West | BULLY | 2026 | 18 / 18 | [1888707282](https://music.apple.com/cn/album/bully/1888707282) |
| Kanye West | BULLY - DELUXE | 2026 | 20 / 32 | [6782267796](https://music.apple.com/cn/album/bully-deluxe/6782267796) |
| Post Malone | August 26 | 2016 | 10 / 10 | [6799168319](https://music.apple.com/cn/album/august-26/6799168319) |
| Post Malone | Stoney | 2016 | 14 / 14 | [1440890146](https://music.apple.com/cn/album/stoney/1440890146) |
| Post Malone | Stoney (Complete Edition) | 2016 | 31 / 34 | [1596836200](https://music.apple.com/cn/album/stoney-complete-edition/1596836200) |
| Post Malone | Stoney (Deluxe) | 2016 | 18 / 18 | [1440887225](https://music.apple.com/cn/album/stoney-deluxe/1440887225) |
| Post Malone | beerbongs & bentleys | 2018 | 15 / 18 | [1373516902](https://music.apple.com/cn/album/beerbongs-bentleys/1373516902) |
| Post Malone | Circles (SILO x Martin Wave Sollos Sleep Mix) | 2019 | 19 / 19 | [1825361062](https://music.apple.com/cn/album/circles-silo-x-martin-wave-sollos-sleep-mix/1825361062) |
| Post Malone | Hollywood's Bleeding | 2019 | 13 / 17 | [1477880265](https://music.apple.com/cn/album/hollywoods-bleeding/1477880265) |
| Post Malone | Twelve Carat Toothache | 2022 | 14 / 14 | [1623192950](https://music.apple.com/cn/album/twelve-carat-toothache/1623192950) |
| Post Malone | Twelve Carat Toothache (Deluxe) | 2022 | 16 / 16 | [1628227327](https://music.apple.com/cn/album/twelve-carat-toothache-deluxe/1628227327) |
| Post Malone | The Diamond Collection | 2023 | 9 / 9 | [1683443777](https://music.apple.com/cn/album/the-diamond-collection/1683443777) |
| Post Malone | The Diamond Collection (Deluxe) | 2023 | 19 / 20 | [1762885412](https://music.apple.com/cn/album/the-diamond-collection-deluxe/1762885412) |
| Post Malone | Post Malone: The LongBao’s Hits | 2023 | 10 / 10 | [1692271337](https://music.apple.com/cn/album/post-malone-the-longbaos-hits/1692271337) |
| Post Malone | AUSTIN | 2023 | 16 / 17 | [1688021170](https://music.apple.com/cn/album/austin/1688021170) |
| Post Malone | AUSTIN (Bonus) | 2023 | 17 / 18 | [1699799646](https://music.apple.com/cn/album/austin-bonus/1699799646) |
| Post Malone | F-1 Trillion | 2024 | 18 / 18 | [1752531522](https://music.apple.com/cn/album/f-1-trillion/1752531522) |
| Post Malone | F-1 Trillion (Long Bed) | 2024 | 27 / 27 | [1762471747](https://music.apple.com/cn/album/f-1-trillion-long-bed/1762471747) |
| Charlie Puth | The Otto Tunes | 2010 | 7 / 7 | [e400967d-d748-4bfa-9a1d-b068b0667aa4](https://open.spotify.com/album/43TkICa0ghoWf1UFECLCpx) |
| Charlie Puth | Ego | 2013 | 10 / 10 | [06d37134-5a90-4ed0-9fd8-10e4c8b0ac84](https://open.spotify.com/album/3tK1UC5h0T1pG4MPV3z8P5) |
| Charlie Puth | Some Type of Love - EP | 2015 | 3 / 3 | [990351372](https://music.apple.com/cn/album/some-type-of-love-ep/990351372) |
| Charlie Puth | Marvin Gaye (feat. Meghan Trainor) [Remixes] - EP | 2015 | 4 / 4 | [1485013598](https://music.apple.com/us/album/marvin-gaye-feat-meghan-trainor-remixes-ep/1485013598) |
| Charlie Puth | One Call Away (Acoustic + Remixes) - EP | 2015 | 6 / 6 | [1484826309](https://music.apple.com/us/album/one-call-away-acoustic-remixes-ep/1484826309) |
| Charlie Puth | Nine Track Mind | 2016 | 13 / 13 | [1041127262](https://music.apple.com/cn/album/nine-track-mind/1041127262) |
| Charlie Puth | Nine Track Mind (Special Edition) | 2016 | 20 / 20 | [1137789804](https://music.apple.com/cn/album/nine-track-mind-special-edition/1137789804) |
| Charlie Puth | Nine Track Mind Deluxe | 2016 | 15 / 16 | [1172996798](https://music.apple.com/cn/album/nine-track-mind-deluxe/1172996798) |
| Charlie Puth | We Don't Talk Anymore (feat. Selena Gomez) [Remixes] - EP | 2016 | 6 / 6 | [1484826203](https://music.apple.com/us/album/we-dont-talk-anymore-feat-selena-gomez-remixes-ep/1484826203) |
| Charlie Puth | Attention (Acoustic + Remixes) | 2017 | 7 / 7 | [1484537124](https://music.apple.com/cn/album/attention-acoustic-remixes/1484537124) |
| Charlie Puth | How Long (Remixes) - EP | 2017 | 6 / 6 | [1484536649](https://music.apple.com/us/album/how-long-remixes-ep/1484536649) |
| Charlie Puth | Done for Me (feat. Kehlani) [Remixes] - EP | 2018 | 4 / 4 | [1484537125](https://music.apple.com/us/album/done-for-me-feat-kehlani-remixes-ep/1484537125) |
| Charlie Puth | Voicenotes | 2018 | 13 / 13 | [1293229669](https://music.apple.com/cn/album/voicenotes/1293229669) |
| Charlie Puth | The Way I Am (Acoustic + Remixes) - EP | 2018 | 4 / 4 | [1485044865](https://music.apple.com/us/album/the-way-i-am-acoustic-remixes-ep/1485044865) |
| Charlie Puth | CHARLIE | 2022 | 12 / 12 | [1633318292](https://music.apple.com/cn/album/charlie/1633318292) |
| Charlie Puth | Whatever's Clever! | 2026 | 12 / 12 | [1845189970](https://music.apple.com/cn/album/whatevers-clever/1845189970) |
| Charlie Puth | Whatever's Clever! (Expanded) | 2026 | 13 / 15 | [1888624679](https://music.apple.com/cn/album/whatevers-clever-expanded/1888624679) |
| Justin Bieber | My World - EP | 2009 | 7 / 7 | [1440790361](https://music.apple.com/us/album/my-world-ep/1440790361) |
| Justin Bieber | My World (iTunes Exclusive Edition) | 2009 | 8 / 10 | [1440616467](https://music.apple.com/cn/album/my-world-itunes-exclusive-edition/1440616467) |
| Justin Bieber | My World 2.0 | 2010 | 10 / 11 | [1443008825](https://music.apple.com/cn/album/my-world-2-0/1443008825) |
| Justin Bieber | My Worlds | 2010 | 18 / 19 | [1440803218](https://music.apple.com/cn/album/my-worlds/1440803218) |
| Justin Bieber | My Worlds - The Collection | 2010 | 30 / 31 | [1440802303](https://music.apple.com/cn/album/my-worlds-the-collection/1440802303) |
| Justin Bieber | My World 2.0 (Bonus Track Version) | 2010 | 11 / 13 | [1440661543](https://music.apple.com/us/album/my-world-2-0-bonus-track-version/1440661543) |
| Justin Bieber | My Worlds Acoustic | 2010 | 10 / 11 | [1440662143](https://music.apple.com/cn/album/my-worlds-acoustic/1440662143) |
| Justin Bieber | Never Say Never (The Remixes) - EP | 2011 | 7 / 7 | [1442924367](https://music.apple.com/cn/album/never-say-never-the-remixes-ep/1442924367) |
| Justin Bieber | Under The Mistletoe | 2011 | 15 / 18 | [1440650036](https://music.apple.com/cn/album/under-the-mistletoe/1440650036) |
| Justin Bieber | Under The Mistletoe (Deluxe Edition) | 2011 | 15 / 17 | [1440640693](https://music.apple.com/us/album/under-the-mistletoe-deluxe-edition/1440640693) |
| Justin Bieber | As Long As You Love Me (Remixes) [feat. Big Sean] | 2012 | 12 / 12 | [1443940172](https://music.apple.com/cn/album/as-long-as-you-love-me-remixes-feat-big-sean/1443940172) |
| Justin Bieber | Beauty and a Beat (Remixes) [feat. Nicki Minaj] | 2012 | 12 / 12 | [1443769292](https://music.apple.com/cn/album/beauty-and-a-beat-remixes-feat-nicki-minaj/1443769292) |
| Justin Bieber | Believe | 2012 | 14 / 14 | [1440804754](https://music.apple.com/cn/album/believe/1440804754) |
| Justin Bieber | Boyfriend (Remixes) | 2012 | 8 / 8 | [1444892037](https://music.apple.com/cn/album/boyfriend-remixes/1444892037) |
| Justin Bieber | Believe (Deluxe Edition) | 2012 | 17 / 17 | [1440650852](https://music.apple.com/cn/album/believe-deluxe-edition/1440650852) |
| Justin Bieber | Believe Acoustic | 2013 | 11 / 11 | [1440857765](https://music.apple.com/cn/album/believe-acoustic/1440857765) |
| Justin Bieber | Journals | 2013 | 15 / 18 | [1440861853](https://music.apple.com/cn/album/journals/1440861853) |
| Justin Bieber | Purpose | 2015 | 13 / 14 | [1442504476](https://music.apple.com/cn/album/purpose/1442504476) |
| Justin Bieber | Purpose (Deluxe) | 2015 | 18 / 19 | [1442692577](https://music.apple.com/cn/album/purpose-deluxe/1442692577) |
| Justin Bieber | Changes | 2020 | 17 / 17 | [1499663003](https://music.apple.com/cn/album/changes/1499663003) |
| Justin Bieber | R&Bieber - EP | 2020 | 5 / 5 | [1503943986](https://music.apple.com/cn/album/r-bieber-ep/1503943986) |
| Justin Bieber | Work From Home - EP | 2020 | 5 / 5 | [1504335303](https://music.apple.com/cn/album/work-from-home-ep/1504335303) |
| Justin Bieber | Biebs and Chill - EP | 2020 | 5 / 5 | [1504923655](https://music.apple.com/cn/album/biebs-and-chill-ep/1504923655) |
| Justin Bieber | Couple Goals - EP | 2020 | 5 / 5 | [1505909895](https://music.apple.com/cn/album/couple-goals-ep/1505909895) |
| Justin Bieber | Party - EP | 2020 | 5 / 5 | [1506321665](https://music.apple.com/cn/album/party-ep/1506321665) |
| Justin Bieber | Hailey’s Favs - EP | 2020 | 5 / 5 | [1506961047](https://music.apple.com/cn/album/haileys-favs-ep/1506961047) |
| Justin Bieber | #tBt - EP | 2020 | 5 / 5 | [1531042302](https://music.apple.com/cn/album/tbt-ep/1531042302) |
| Justin Bieber | Home for Christmas - EP | 2020 | 6 / 6 | [1541887995](https://music.apple.com/cn/album/home-for-christmas-ep/1541887995) |
| Justin Bieber | JB6 - EP | 2021 | 5 / 5 | [1554916996](https://music.apple.com/cn/album/jb6-ep/1554916996) |
| Justin Bieber | Justice | 2021 | 15 / 16 | [1556175419](https://music.apple.com/cn/album/justice/1556175419) |
| Justin Bieber | Justice (Triple Chucks Deluxe) | 2021 | 22 / 23 | [1560274125](https://music.apple.com/cn/album/justice-triple-chucks-deluxe/1560274125) |
| Justin Bieber | Freedom. - EP | 2021 | 6 / 6 | [1561535456](https://music.apple.com/cn/album/freedom-ep/1561535456) |
| Justin Bieber | Justice (The Complete Edition) | 2021 | 24 / 25 | [1588043759](https://music.apple.com/cn/album/justice-the-complete-edition/1588043759) |
| Justin Bieber | SWAG | 2025 | 21 / 21 | [1825994646](https://music.apple.com/cn/album/swag/1825994646) |
| Justin Bieber | SWAG II | 2025 | 44 / 44 | [1837867200](https://music.apple.com/cn/album/swag-ii/1837867200) |
| Justin Bieber | SWAG LIVE FROM COACHELLA (Weekend I) | 2026 | 22 / 22 | [6783430401](https://music.apple.com/cn/album/swag-live-from-coachella-weekend-i/6783430401) |
| Justin Bieber | SWAG LIVE FROM COACHELLA (Weekend II) | 2026 | 23 / 23 | [6786441259](https://music.apple.com/cn/album/swag-live-from-coachella-weekend-ii/6786441259) |
| Taylor Swift | Taylor Swift (Deluxe Edition) | 2006 | 15 / 15 | [1440802681](https://music.apple.com/cn/album/taylor-swift-deluxe-edition/1440802681) |
| Taylor Swift | Taylor Swift Karaoke (Instrumentals with Background Vocals) | 2006 | 14 / 15 | [1443205032](https://music.apple.com/us/album/taylor-swift-karaoke-instrumentals-with-background/1443205032) |
| Taylor Swift | Taylor Swift | 2006 | 11 / 11 | [1860454442](https://music.apple.com/cn/album/taylor-swift/1860454442) |
| Taylor Swift | Taylor Swift (Big Machine Radio Release Special) | 2006 | 30 / 30 | [1445940437](https://music.apple.com/cn/album/taylor-swift-big-machine-radio-release-special/1445940437) |
| Taylor Swift | Taylor Swift (Bonus Track Version) | 2006 | 15 / 15 | [1440913923](https://music.apple.com/us/album/taylor-swift-bonus-track-version/1440913923) |
| Taylor Swift | iTunes Live from SoHo | 2007 | 8 / 8 | [1440929037](https://music.apple.com/us/album/itunes-live-from-soho/1440929037) |
| Taylor Swift | The Taylor Swift Holiday Collection - EP | 2007 | 6 / 6 | [1439806628](https://music.apple.com/cn/album/the-taylor-swift-holiday-collection-ep/1439806628) |
| Taylor Swift | Taylor Swift (Karaoke Version) | 2008 | 14 / 14 | [1469555046](https://music.apple.com/cn/album/taylor-swift-karaoke-version/1469555046) |
| Taylor Swift | Live From Clear Channel Stripped 2008 | 2008 | 8 / 8 | [1508579276](https://music.apple.com/cn/album/live-from-clear-channel-stripped-2008/1508579276) |
| Taylor Swift | Fearless | 2008 | 13 / 13 | [1440924803](https://music.apple.com/cn/album/fearless/1440924803) |
| Taylor Swift | Fearless (Big Machine Radio Release Special) | 2008 | 26 / 26 | [1445939760](https://music.apple.com/cn/album/fearless-big-machine-radio-release-special/1445939760) |
| Taylor Swift | Live From SoHo | 2008 | 8 / 8 | [530002076](https://music.apple.com/cn/album/live-from-soho/530002076) |
| Taylor Swift | Fearless (Karaoke Version) | 2009 | 13 / 13 | [1440795311](https://music.apple.com/cn/album/fearless-karaoke-version/1440795311) |
| Taylor Swift | Fearless (Platinum Edition) | 2009 | 19 / 29 | [1452879607](https://music.apple.com/cn/album/fearless-platinum-edition/1452879607) |
| Taylor Swift | Taylor Swift Karaoke: Fearless (Instrumentals with Background Vocals) | 2009 | 13 / 14 | [1443149328](https://music.apple.com/us/album/taylor-swift-karaoke-fearless-instrumentals-with/1443149328) |
| Taylor Swift | Fearless (International Version) | 2009 | 16 / 16 | [1440748115](https://music.apple.com/cn/album/fearless-international-version/1440748115) |
| Taylor Swift | Speak Now | 2010 | 22 / 24 | [1440493756](https://music.apple.com/cn/album/speak-now/1440493756) |
| Taylor Swift | Speak Now (Bonus Track Version) | 2010 | 15 / 15 | [1440724790](https://music.apple.com/cn/album/speak-now-bonus-track-version/1440724790) |
| Taylor Swift | Speak Now (Karaoke Version) | 2010 | 14 / 14 | [1440635412](https://music.apple.com/cn/album/speak-now-karaoke-version/1440635412) |
| Taylor Swift | Speak Now (Big Machine Radio Release Special) | 2010 | 28 / 28 | [1445941811](https://music.apple.com/cn/album/speak-now-big-machine-radio-release-special/1445941811) |
| Taylor Swift | Speak Now (Deluxe Edition) | 2010 | 20 / 20 | [1440935756](https://music.apple.com/us/album/speak-now-deluxe-edition/1440935756) |
| Taylor Swift | Speak Now - World Tour Live | 2011 | 16 / 17 | [1413627031](https://music.apple.com/cn/album/speak-now-world-tour-live/1413627031) |
| Taylor Swift | Red | 2012 | 16 / 16 | [1440935340](https://music.apple.com/cn/album/red/1440935340) |
| Taylor Swift | Red (Deluxe Version) | 2012 | 22 / 22 | [1440873509](https://music.apple.com/cn/album/red-deluxe-version/1440873509) |
| Taylor Swift | Red (Big Machine Radio Release Special) | 2012 | 32 / 32 | [1445766378](https://music.apple.com/cn/album/red-big-machine-radio-release-special/1445766378) |
| Taylor Swift | Red (Karaoke Edition) | 2013 | 16 / 16 | [1445890163](https://music.apple.com/cn/album/red-karaoke-edition/1445890163) |
| Taylor Swift | Taylor Swift Karaoke: Red | 2013 | 16 / 17 | [1443071886](https://music.apple.com/us/album/taylor-swift-karaoke-red/1443071886) |
| Taylor Swift | Taylor Swift Karaoke: Speak Now | 2013 | 14 / 15 | [1443174899](https://music.apple.com/us/album/taylor-swift-karaoke-speak-now/1443174899) |
| Taylor Swift | 1989 | 2014 | 13 / 13 | [1445888258](https://music.apple.com/cn/album/1989/1445888258) |
| Taylor Swift | Taylor Swift Karaoke: 1989 | 2014 | 13 / 14 | [1440935508](https://music.apple.com/us/album/taylor-swift-karaoke-1989/1440935508) |
| Taylor Swift | 1989 (Big Machine Radio Release Special) | 2014 | 26 / 26 | [1445765736](https://music.apple.com/cn/album/1989-big-machine-radio-release-special/1445765736) |
| Taylor Swift | 1989 (Deluxe Edition) | 2014 | 16 / 19 | [1445881848](https://music.apple.com/cn/album/1989-deluxe-edition/1445881848) |
| Taylor Swift | Taylor Swift Karaoke: 1989 (Deluxe) | 2015 | 16 / 16 | [1446743614](https://music.apple.com/cn/album/taylor-swift-karaoke-1989-deluxe/1446743614) |
| Taylor Swift | reputation Stadium Tour Surprise Song Playlist | 2017 | 46 / 46 | [1444778002](https://music.apple.com/cn/album/reputation-stadium-tour-surprise-song-playlist/1444778002) |
| Taylor Swift | reputation | 2017 | 15 / 15 | [1440933849](https://music.apple.com/cn/album/reputation/1440933849) |
| Taylor Swift | reputation (Big Machine Radio Release Special) | 2017 | 31 / 31 | [1445765846](https://music.apple.com/cn/album/reputation-big-machine-radio-release-special/1445765846) |
| Taylor Swift | Taylor Swift Karaoke: reputation | 2018 | 15 / 15 | [1440935632](https://music.apple.com/cn/album/taylor-swift-karaoke-reputation/1440935632) |
| Taylor Swift | Lover | 2019 | 18 / 18 | [1468058165](https://music.apple.com/cn/album/lover/1468058165) |
| Taylor Swift | Beautiful Eyes | 2020 | 6 / 6 | [b0c15427-b379-4e6a-af7d-854b4c5da40b](https://musicbrainz.org/release/b0c15427-b379-4e6a-af7d-854b4c5da40b) |
| Taylor Swift | folklore | 2020 | 16 / 16 | [1524801260](https://music.apple.com/cn/album/folklore/1524801260) |
| Taylor Swift | folklore (deluxe version) | 2020 | 17 / 17 | [1528112358](https://music.apple.com/cn/album/folklore-deluxe-version/1528112358) |
| Taylor Swift | folklore: the escapism chapter - EP | 2020 | 6 / 6 | [1741958878](https://music.apple.com/cn/album/folklore-the-escapism-chapter-ep/1741958878) |
| Taylor Swift | folklore: the sleepless nights chapter - EP | 2020 | 6 / 6 | [1742004596](https://music.apple.com/cn/album/folklore-the-sleepless-nights-chapter-ep/1742004596) |
| Taylor Swift | folklore: the saltbox house chapter - EP | 2020 | 6 / 6 | [1741959447](https://music.apple.com/cn/album/folklore-the-saltbox-house-chapter-ep/1741959447) |
| Taylor Swift | folklore: the yeah I showed up at your party chapter - EP | 2020 | 6 / 6 | [1532357210](https://music.apple.com/cn/album/folklore-the-yeah-i-showed-up-at-your-party-chapter-ep/1532357210) |
| Taylor Swift | folklore: the long pond studio sessions (from the Disney+ special) [deluxe edition] | 2020 | 34 / 34 | [1541904688](https://music.apple.com/cn/album/folklore-the-long-pond-studio-sessions-from-the/1541904688) |
| Taylor Swift | evermore | 2020 | 15 / 15 | [1544268281](https://music.apple.com/cn/album/evermore/1544268281) |
| Taylor Swift | evermore (deluxe version) | 2020 | 17 / 17 | [1547315522](https://music.apple.com/cn/album/evermore-deluxe-version/1547315522) |
| Taylor Swift | willow (the witch collection) - EP | 2020 | 4 / 6 | [1545223630](https://music.apple.com/cn/album/willow-the-witch-collection-ep/1545223630) |
| Taylor Swift | the "dropped your hand while dancing" chapter - EP | 2021 | 6 / 6 | [1548507056](https://music.apple.com/cn/album/the-dropped-your-hand-while-dancing-chapter-ep/1548507056) |
| Taylor Swift | the "forever is the sweetest con" chapter - EP | 2021 | 6 / 6 | [1550666656](https://music.apple.com/cn/album/the-forever-is-the-sweetest-con-chapter-ep/1550666656) |
| Taylor Swift | the "ladies lunching" chapter - EP | 2021 | 6 / 6 | [1550667540](https://music.apple.com/cn/album/the-ladies-lunching-chapter-ep/1550667540) |
| Taylor Swift | Fearless (Taylor's Version) | 2021 | 26 / 26 | [1552791073](https://music.apple.com/cn/album/fearless-taylors-version/1552791073) |
| Taylor Swift | Fearless (Taylor's Version): The Halfway Out The Door Chapter - EP | 2021 | 6 / 6 | [1566423066](https://music.apple.com/cn/album/fearless-taylors-version-the-halfway-out-the-door/1566423066) |
| Taylor Swift | Fearless (Taylor's Version): The Kissing In The Rain Chapter - EP | 2021 | 6 / 6 | [1567259315](https://music.apple.com/cn/album/fearless-taylors-version-the-kissing-in-the-rain-chapter-ep/1567259315) |
| Taylor Swift | Fearless (Taylor’s Version): The I Remember What You Said Last Night Chapter - EP | 2021 | 6 / 6 | [1568160264](https://music.apple.com/cn/album/fearless-taylors-version-the-i-remember-what-you-said/1568160264) |
| Taylor Swift | Fearless (Taylor’s Version): The From The Vault Chapter - EP | 2021 | 6 / 6 | [1568159069](https://music.apple.com/cn/album/fearless-taylors-version-the-from-the-vault-chapter-ep/1568159069) |
| Taylor Swift | All Too Well (10 Minute Version) (Taylor's Version) (From The Vault) - EP | 2021 | 1 / 1 | [1595666852](https://music.apple.com/us/album/all-too-well-10-minute-version-taylors-version-from/1595666852) |
| Taylor Swift | Red (Taylor's Version) | 2021 | 30 / 30 | [1589139584](https://music.apple.com/us/album/red-taylors-version/1589139584) |
| Taylor Swift | Red (Taylor’s Version) [+ A Message from Taylor] | 2021 | 31 / 31 | [1590368448](https://music.apple.com/cn/album/red-taylors-version-a-message-from-taylor/1590368448) |
| Taylor Swift | Red (Taylor’s Version): Could You Be The One Chapter - EP | 2022 | 6 / 6 | [1604420757](https://music.apple.com/cn/album/red-taylors-version-could-you-be-the-one-chapter-ep/1604420757) |
| Taylor Swift | Red (Taylor’s Version): She Wrote A Song About Me Chapter - EP | 2022 | 6 / 6 | [1604665348](https://music.apple.com/cn/album/red-taylors-version-she-wrote-a-song-about-me-chapter-ep/1604665348) |
| Taylor Swift | Red (Taylor’s Version): From The Vault Chapter - EP | 2022 | 6 / 6 | [1605534756](https://music.apple.com/cn/album/red-taylors-version-from-the-vault-chapter-ep/1605534756) |
| Taylor Swift | Red (Taylor’s Version): The Slow Motion Chapter | 2022 | 6 / 6 | [1604664512](https://music.apple.com/cn/album/red-taylors-version-the-slow-motion-chapter/1604664512) |
| Taylor Swift | All Too Well (10 Minute Version) [The Short Film] - EP | 2022 | 1 / 1 | [1628961781](https://music.apple.com/cn/album/all-too-well-10-minute-version-the-short-film-ep/1628961781) |
| Taylor Swift | Midnights | 2022 | 14 / 14 | [1649434004](https://music.apple.com/cn/album/midnights/1649434004) |
| Taylor Swift | Midnights (3am Edition) | 2022 | 20 / 20 | [1650841512](https://music.apple.com/cn/album/midnights-3am-edition/1650841512) |
| Taylor Swift | Midnights (The Til Dawn Edition) | 2022 | 23 / 23 | [1689131527](https://music.apple.com/cn/album/midnights-the-til-dawn-edition/1689131527) |
| Taylor Swift | Lavender Haze (Remixes) - EP | 2023 | 5 / 5 | [1674643689](https://music.apple.com/cn/album/lavender-haze-remixes-ep/1674643689) |
| Taylor Swift | The More Fearless (Taylor’s Version) Chapter - EP | 2023 | 5 / 5 | [1677234192](https://music.apple.com/cn/album/the-more-fearless-taylors-version-chapter-ep/1677234192) |
| Taylor Swift | The More Lover Chapter - EP | 2023 | 5 / 5 | [1677234264](https://music.apple.com/cn/album/the-more-lover-chapter-ep/1677234264) |
| Taylor Swift | The More Red (Taylor’s Version) Chapter - EP | 2023 | 6 / 6 | [1677234495](https://music.apple.com/cn/album/the-more-red-taylors-version-chapter-ep/1677234495) |
| Taylor Swift | Speak Now (Taylor's Version) | 2023 | 22 / 23 | [1690839749](https://music.apple.com/cn/album/speak-now-taylors-version/1690839749) |
| Taylor Swift | 1989 (Taylor's Version) | 2023 | 21 / 21 | [1708308989](https://music.apple.com/cn/album/1989-taylors-version/1708308989) |
| Taylor Swift | 1989 (Taylor's Version) [Deluxe] | 2023 | 22 / 22 | [1713845538](https://music.apple.com/cn/album/1989-taylors-version-deluxe/1713845538) |
| Taylor Swift | THE TORTURED POETS DEPARTMENT | 2024 | 16 / 17 | [1736268193](https://music.apple.com/cn/album/the-tortured-poets-department/1736268193) |
| Taylor Swift | THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY | 2024 | 31 / 31 | [1742057774](https://music.apple.com/cn/album/the-tortured-poets-department-the-anthology/1742057774) |
| Taylor Swift | THE TORTURED POETS DEPARTMENT  TS The Eras Tour Setlist | 2024 | 7 / 7 | [1771718102](https://music.apple.com/cn/album/the-tortured-poets-department-ts-the-eras-tour-setlist/1771718102) |
| Taylor Swift | The Life of a Showgirl | 2025 | 12 / 13 | [1833328839](https://music.apple.com/cn/album/the-life-of-a-showgirl/1833328839) |
| Taylor Swift | The Life of a Showgirl (Track by Track Version) | 2025 | 26 / 38 | [1843998665](https://music.apple.com/cn/album/the-life-of-a-showgirl-track-by-track-version/1843998665) |
| Taylor Swift | The Life of a Showgirl + “A Look Behind the Curtain” | 2025 | 12 / 13 | [1838812720](https://music.apple.com/us/album/the-life-of-a-showgirl-a-look-behind-the-curtain/1838812720) |
| Taylor Swift | The Life of a Showgirl + Acoustic Collection | 2025 | 19 / 19 | [1850496031](https://music.apple.com/cn/album/the-life-of-a-showgirl-acoustic-collection/1850496031) |
| Taylor Swift | Elizabeth Taylor | 2026 | 3 / 4 | [1888604488](https://music.apple.com/cn/album/elizabeth-taylor/1888604488) |
| 周杰伦 | 杰伦 | 2000 | 10 / 10 | [535790918](https://music.apple.com/cn/album/%E5%90%8C%E5%90%8D%E5%B0%88%E8%BC%AF/535790918) |
| 周杰伦 | 范特西 | 2001 | 10 / 10 | [535739206](https://music.apple.com/cn/album/%E8%8C%83%E7%89%B9%E8%A5%BF/535739206) |
| 周杰伦 | 范特西Plus (Live EP) | 2001 | 3 / 3 | [536110584](https://music.apple.com/cn/album/%E8%8C%83%E7%89%B9%E8%A5%BF-live-single/536110584) |
| 周杰伦 | 八度空间 | 2002 | 10 / 10 | [536161722](https://music.apple.com/cn/album/%E5%85%AB%E5%BA%A6%E7%A9%BA%E9%96%93/536161722) |
| 周杰伦 | The One 周杰伦演唱会 | 2002 | 20 / 20 | [536686684](https://music.apple.com/cn/album/the-one-%E5%91%A8%E6%9D%B0%E5%80%AB%E6%BC%94%E5%94%B1%E6%9C%83/536686684) |
| 周杰伦 | 叶惠美 | 2003 | 11 / 11 | [535824731](https://music.apple.com/cn/album/%E8%91%89%E6%83%A0%E7%BE%8E/535824731) |
| 周杰伦 | 寻找周杰伦 - EP | 2003 | 4 / 4 | [536108118](https://music.apple.com/cn/album/%E5%B0%8B%E6%89%BE%E5%91%A8%E6%9D%B0%E5%80%AB-ep/536108118) |
| 周杰伦 | 七里香 | 2004 | 10 / 10 | [536114662](https://music.apple.com/cn/album/%E4%B8%83%E9%87%8C%E9%A6%99/536114662) |
| 周杰伦 | 2004 无与伦比演唱会 (Live) | 2004 | 25 / 25 | [535913600](https://music.apple.com/cn/album/2004-%E7%84%A1%E8%88%87%E5%80%AB%E6%AF%94%E6%BC%94%E5%94%B1%E6%9C%83-live/535913600) |
| 周杰伦 | 11月的萧邦 | 2005 | 12 / 12 | [536009641](https://music.apple.com/cn/album/11%E6%9C%88%E7%9A%84%E8%95%AD%E9%82%A6/536009641) |
| 周杰伦 | 霍元甲 - Single | 2006 | 2 / 2 | [536129008](https://music.apple.com/cn/album/%E9%9C%8D%E5%85%83%E7%94%B2-single/536129008) |
| 周杰伦 | 依然范特西 | 2006 | 10 / 10 | [536285027](https://music.apple.com/cn/album/%E4%BE%9D%E7%84%B6%E8%8C%83%E7%89%B9%E8%A5%BF/536285027) |
| 周杰伦 | 黄金甲 - Single | 2006 | 2 / 2 | [535756564](https://music.apple.com/cn/album/%E9%BB%83%E9%87%91%E7%94%B2-single/535756564) |
| 周杰伦 | 不能说的秘密电影原声带 | 2007 | 25 / 25 | [1721457659](https://musicbrainz.org/release/53e6d524-b3bd-4662-8678-3ee72964ca1e) |
| 周杰伦 | 我很忙 | 2007 | 10 / 10 | [536030690](https://music.apple.com/cn/album/%E6%88%91%E5%BE%88%E5%BF%99/536030690) |
| 周杰伦 | 周杰伦2007世界巡回演唱会 | 2008 | 21 / 21 | [536743616](https://music.apple.com/cn/album/%E5%91%A8%E6%9D%B0%E5%80%AB2007%E4%B8%96%E7%95%8C%E5%B7%A1%E8%BF%B4%E6%BC%94%E5%94%B1%E6%9C%83/536743616) |
| 周杰伦 | 魔杰座 | 2008 | 11 / 11 | [1624000713](https://music.apple.com/cn/album/%E9%AD%94%E6%9D%B0%E5%BA%A7/1624000713) |
| 周杰伦 | 跨时代 | 2010 | 11 / 11 | [536247746](https://music.apple.com/cn/album/%E8%B7%A8%E6%99%82%E4%BB%A3/536247746) |
| 周杰伦 | 超时代演唱会 | 2011 | 24 / 24 | [536637791](https://music.apple.com/cn/album/%E8%B6%85%E6%99%82%E4%BB%A3%E6%BC%94%E5%94%B1%E6%9C%83/536637791) |
| 周杰伦 | 惊叹号 | 2011 | 11 / 11 | [535754551](https://music.apple.com/cn/album/%E9%A9%9A%E5%98%86%E8%99%9F/535754551) |
| 周杰伦 | 十二新作 | 2012 | 12 / 12 | [587743633](https://music.apple.com/cn/album/%E5%8D%81%E4%BA%8C%E6%96%B0%E4%BD%9C/587743633) |
| 周杰伦 | 周杰倫「天台」(电影原声带) | 2013 | 35 / 35 | [667353912](https://music.apple.com/cn/album/%E5%91%A8%E6%9D%B0%E5%80%AB-%E5%A4%A9%E5%8F%B0-%E9%9B%BB%E5%BD%B1%E5%8E%9F%E8%81%B2%E5%B8%B6/667353912) |
| 周杰伦 | 黄俊郎的黑 | 2013 | 8 / 8 | [793227801](https://music.apple.com/cn/album/%E9%BB%83%E4%BF%8A%E9%83%8E%E7%9A%84%E9%BB%91/793227801) |
| 周杰伦 | 哎呦, 不错哦 | 2014 | 12 / 12 | [944321428](https://music.apple.com/cn/album/%E5%93%8E%E5%91%A6-%E4%B8%8D%E9%8C%AF%E5%93%A6/944321428) |
| 周杰伦 | 魔天伦世界巡回演唱会 (Live) | 2016 | 22 / 22 | [1108410359](https://music.apple.com/cn/album/%E9%AD%94%E5%A4%A9%E5%80%AB%E4%B8%96%E7%95%8C%E5%B7%A1%E8%BF%B4%E6%BC%94%E5%94%B1%E6%9C%83-live/1108410359) |
| 周杰伦 | 周杰伦的床边故事 | 2016 | 10 / 10 | [1118757859](https://music.apple.com/cn/album/%E5%91%A8%E6%9D%B0%E5%80%AB%E7%9A%84%E5%BA%8A%E9%82%8A%E6%95%85%E4%BA%8B/1118757859) |
| 周杰伦 | 周杰伦地表最强世界巡回演唱会 (Live) | 2019 | 25 / 25 | [1485220306](https://music.apple.com/cn/album/%E5%91%A8%E6%9D%B0%E4%BC%A6%E5%9C%B0%E8%A1%A8%E6%9C%80%E5%BC%BA%E4%B8%96%E7%95%8C%E5%B7%A1%E5%9B%9E%E6%BC%94%E5%94%B1%E4%BC%9A-live/1485220306) |
| 周杰伦 | 最伟大的作品 | 2022 | 12 / 12 | [1633408719](https://music.apple.com/cn/album/%E6%9C%80%E4%BC%9F%E5%A4%A7%E7%9A%84%E4%BD%9C%E5%93%81/1633408719) |
| 周杰伦 | 太阳之子 | 2026 | 13 / 13 | [6771326786](https://music.apple.com/cn/album/%E5%A4%AA%E9%98%B3%E4%B9%8B%E5%AD%90/6771326786) |
