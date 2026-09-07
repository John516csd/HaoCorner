# 陈奕迅专辑备用素材

采集时间：2026-09-06 至 2026-09-07（Asia/Shanghai）。

打开 [离线专辑目录](index.html)，可以浏览封面、搜索专辑或曲名、查看每个版本的完整已收集曲序。默认展示 32 张录音室专辑；这是一份素材浏览文件，未接入网站页面。

## 已保存内容

| 内容 | 数量 / 说明 |
| --- | --- |
| 发行版本记录 | 163 份：144 个 Apple 目录 ID + 19 份早期或补充发行记录 |
| 本地专辑封面 | 148 张，约 137.67 MiB；144 张来自 CoverBox 所用的 Apple 图片源，4 张来自 JOOX |
| 音频曲目资料 | 1,597 条，保留碟号、曲序、标题、演唱者、时长及来源链接 |
| MV / 影像资料 | 60 条，与歌曲分开标记 |
| 录音室专辑展示清单 | 32 张、352 条音频资料；每张所选版本的封面和声明曲目数均已核对 |

这些数量按**发行版本和曲目条目**计算。同一首歌可能同时出现在原版、精选、重制版、地区版或现场版中；音轨也包括 intro、interlude、混音和纯音乐。1,597 不是去重后的独立歌曲数，163 也不是 163 张全新录音室专辑。

歌曲保存的是资料与平台链接，没有下载歌曲音频、MV 文件或歌词。

## 文件怎么用

| 文件 | 用途 |
| --- | --- |
| [index.html](index.html) | 无需启动服务即可打开的素材浏览目录 |
| [catalog.json](catalog.json) | 所有发行记录、封面路径及嵌套曲目列表 |
| [core-studio-albums.json](core-studio-albums.json) | 32 张录音室专辑各选一个展示版本，适合后续 3D 唱片架 |
| [albums.csv](albums.csv) | 专辑总表，UTF-8 BOM，可在 Excel 中打开 |
| [tracks.csv](tracks.csv) | 曲目总表，包含音频与影像；按 `kind` 筛选 |
| `albums/` | 每份发行记录的独立 JSON；文件名为稳定 ID |
| `covers/` | 下载的封面原图，保留来源实际尺寸和比例 |
| [cover-manifest.json](cover-manifest.json) | 每张封面的本地路径、下载地址、尺寸、字节数和 SHA-256 |
| [录音室专辑封面总览](previews/studio-albums-contact-sheet.jpg) | 32 张封面一页预览 |
| [completeness-report.json](completeness-report.json) | 缺失封面、未完整返回的目录、待核对发行与范围限制 |
| [track-supplements.json](track-supplements.json) | 从指定实体发行补入的歌曲及依据 |
| [asset-checks.json](asset-checks.json) | 文件、图片解码、尺寸、哈希、重复曲序与核心清单检查 |
| `sources/` | 本次查询的原始响应和补充来源记录 |
| `tools/` | 采集过程脚本及从缓存重建目录的脚本 |

## 页面接入时的约定

- `id` 区分发行版本，格式为 `apple-目录ID` 或 `mb-发行UUID`；不要仅按专辑名称去重。
- `cover.path` 从本目录解析。封面最高实际尺寸为 3000 像素，也有来源只提供较小图片；未把低清图放大冒充高清。
- `tracks` 保留 `discNumber` 和 `trackNumber`。页面歌曲列表使用 `kind === "song"`；MV 使用 `kind === "music-video"`。
- 某些时长、创作者、播放状态无法获取，以 `null` 保存。补充资料上的 MusicBrainz 链接是资料来源，不能作为播放地址。
- `previewUrl` 只是平台原始试听链接，不保证日后持续可用，也未下载试听文件。
- 32 张展示清单的 `originalYear` 用于时间排序。主目录 `releaseDate` 保留当前数字版或实体版来源日期，不能一律理解为作品首发日期。
- 重制版、地区版、加收曲及重复曲目保留原记录。比如《我的快樂時代》同时保留 10 曲与 14 曲版本；《L.O.V.E.》的 15 个音频条目含 interlude，另有 4 个 MV。

## 补齐与尚存缺口

Apple 数字目录中的《Solidays》《不想放手》《怎麼樣》《準備中》存在未返回的曲目。本次依据 MusicBrainz 中明确指定的官方 CD 版本，分别补入 27、4、1、1 条歌曲资料；每条均注明补充来源，原始 Apple 响应未被覆盖。16 个仅在中国大陆目录返回的单曲，则从公开 Apple 专辑页补齐。

《Eason's Life 陳奕迅2013演唱會 (Deluxe Version)》声明 23 个条目，公开接口和页面只返回 22 个。剩余 1 项名称与类型未得到确认，因此未猜填；普通 21 曲 2CD 版另行保留。

15 份补充发行尚缺独立封面，包括《Eason 18首選》《十年經典》、部分早期合作现场和独立单曲。Cover Art Archive 和 Last.fm 图片下载多次连接超时；已从 JOOX 补得《七》《陳奕迅48首選》《Sound & Sight》《The Best Moment》四张 300px 封面。JOOX 是同名数字版封面，尚未核对与实体包装是否完全一致。完整待补清单见 [核对报告](completeness-report.json)，没有挪用其他专辑图片代替。

《十面埋伏》及两份 2011 合作现场相关记录的发行信息仍需复核，已标记 `review-required`；其中 12 曲版本可能只是同一场合作现场的部分内容。它们没有进入 32 张录音室展示清单。

历史目录提及的《超人迪加》EP、独立演唱会影音发行《Big Live 陳奕迅大個唱 99》及《加州紅紅人館 903 狂熱份子音樂會》尚未获得可核对的全部曲序和包装。本资料库覆盖本次可获得的数字与补充发行，**不宣称已包含全球所有实体压片、再版、影视合集和影音章节**。

## 来源

1. [CoverBox](https://coverbox.henry-hu.com/)：页面脚本使用 Apple iTunes Search API；封面也来自 Apple 图片服务器。已保存公开脚本，按同一来源直接批量获取，避免依赖浏览器逐张保存。
2. [Apple iTunes Lookup API 文档](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/LookupExamples.html)：按艺人及专辑 ID 查询。交叉采集香港、台湾、美国、中国大陆四个 storefront；艺人 ID `137938148`。
3. [MusicBrainz 陈奕迅发行目录](https://musicbrainz.org/artist/86119d30-d930-4e65-a97a-e31e22388166)：核对作品和实体碟曲序。具体 release / release-group 地址保存在每张专辑与每条补充曲目中。
4. [JOOX《七》](https://www.joox.com/my-en/album/p%2BYlar4MvLpXMDLAtL4lJA%3D%3D)、[《48首选》](https://www.joox.com/my-zh_cn/album/FOFk8qBrXaxfalqVFx_0Tg%3D%3D)、[《Sound & Sight》](https://www.joox.com/my-en/album/QiKP9%2BDlgcTMHnZUwIBsnQ%3D%3D)、[《The Best Moment》](https://www.joox.com/hk/album/tlrm_aBhFn%2BO1C36P4pUJw%3D%3D)：补充同名专辑封面。
5. [Eason Chan discography](https://en.wikipedia.org/wiki/Eason_Chan_discography)：辅助核对历史发行范围。不同来源有日期差异，未据此无条件覆盖原始数据。

## 重建与检查

已缓存的原始资料可以离线重建，不需要 API key。Python 环境需安装 Pillow：

```sh
python3 tools/build_catalog.py
```

此命令更新 JSON、CSV、离线目录和检查报告，不重新联网采集。重建会再次检查全部封面能否解码、尺寸及 SHA-256 是否一致、单个发行是否有重复曲序，以及 32 张录音室清单是否齐备。

`tools/acquisition/` 保留本次采集脚本便于追溯；它们默认使用缓存，不是保证自动覆盖新增作品的定时同步器。`release-group-coverage-reviewed.json` 修正了同名《新生活》现场与精选、单曲重制与整张专辑之间的匹配歧义。
