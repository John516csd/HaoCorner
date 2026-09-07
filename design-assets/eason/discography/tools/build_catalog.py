"""Build the offline material catalog from cached public metadata. No network calls."""
from pathlib import Path
from collections import Counter
from datetime import datetime, timezone
import csv, json, re, hashlib, html, unicodedata
from PIL import Image, ImageOps, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parents[1]
SRC = BASE / 'sources'
def read(p): return json.loads(p.read_text())
def write(p, data): p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
def duration(ms):
    if ms is None: return None
    sec = round(ms / 1000)
    return f'{sec // 60}:{sec % 60:02}'
def credit(xs): return ''.join(x.get('name', x.get('artist', {}).get('name', '')) + x.get('joinphrase', '') for x in xs)

# One deliberately selected edition per studio album. Edition variations remain in catalog.json.
CORE = [
 ('892603736','陳奕迅',1996,'粤语'),('1694525409','一滴眼淚',1997,'国语'),
 ('892735096','與我常在',1997,'粤语'),('1694525250','醞釀',1997,'国语'),
 ('1575742728','我的快樂時代',1998,'粤语'),('892819866','天佑愛人',1999,'粤语'),
 ('1694525826','婚禮的祝福',1999,'国语'),('892669236','Nothing Really Matters',2000,'粤语'),
 ('542594340','打得火熱',2000,'粤语'),('542593700','Shall We Dance? Shall We Talk!',2001,'粤语'),
 ('542592136','反正是我',2001,'国语'),('542634698','The Easy Ride',2001,'粤语'),
 ('542612232','Special Thanks To..',2002,'国语'),('542611601','The Line-Up',2002,'粤语'),
 ('542923554','黑.白.灰',2003,'国语'),('542676848','Live for Today',2003,'粤语'),
 ('1443374875','U87',2005,'粤语'),('1443938740','怎麼樣',2005,'国语'),
 ('1443345687',"What's Going On...?",2006,'粤语'),('1443816775','認了吧',2007,'国语'),
 ('1462039068','Listen to Eason Chan',2007,'粤语'),('1443493887','不想放手',2008,'国语'),
 ('1443774258','H3M',2009,'粤语'),('1442260565','上五樓的快活',2009,'国语'),
 ('1443783500','?',2011,'国语'),('1445753233','...3mm',2012,'粤语'),
 ('1386714588','The Key',2013,'粤语'),('1422694136','rice & shine',2014,'国语'),
 ('1422674966','準備中',2015,'粤语'),('1440909180',"C'mon in~",2017,'国语'),
 ('1441543918','L.O.V.E.',2018,'粤语'),('1712647195','CHIN UP!',2023,'粤语'),
]
CORE_BY_ID = {a[0]: a for a in CORE}
GROUPS = read(SRC / 'release-group-coverage-reviewed.json')
GROUP_BY_ALBUM = {}
for group in GROUPS:
    for cid in group['albumIds']: GROUP_BY_ALBUM.setdefault(cid, []).append(group)

# Only documented empty slots are supplied from a specified official physical edition.
# The original Apple response remains unmodified under sources/.
PATCHES = {
 '1442943933': ('10478872-39e1-3e3d-b997-b0aed2428bed', '4f7452e3-b3c4-4abc-bc73-950686cdc847',
                 'Apple 曲目接口未返回内容；按 2008 年官方 2CD 发行补入 27 首歌曲，附赠 DVD 不混入该数字版本。'),
 '1443493887': ('208d3080-1ebf-35a4-8a0c-f04fe589d88e', '94d3809d-d594-4742-a15f-2297c46f107f',
                 '按官方 11 曲 CD 发行补入曲序 2、3、6、9。'),
 '1443938740': ('e9024bcc-845b-3549-b0bd-0770822e6cf0', '00dd1112-1ebc-4553-9e8c-2a17cf745e18',
                 '按官方 10 曲 CD 发行补入第 3 首 Hippie。'),
 '1422674966': ('fcae667c-725e-4801-9e38-c21f69a80103', '708e75f6-3fea-4cba-ba05-e27695d71e1e',
                 '按官方 11 曲 CD 发行补入加收曲「異夢」；另有 10 曲版本。'),
}

def apple_track(t, album_id, country):
    ms = t.get('trackTimeMillis')
    return {
      'id': 'apple-' + str(t['trackId']), 'albumId': album_id,
      'title': t['trackName'], 'artist': t.get('artistName'),
      'discNumber': t.get('discNumber', 1), 'trackNumber': t.get('trackNumber'),
      'kind': 'music-video' if t.get('kind') == 'music-video' else 'song',
      'durationMs': ms, 'duration': duration(ms), 'appleTrackId': str(t['trackId']),
      'musicbrainzRecordingId': None, 'url': t.get('trackViewUrl'),
      'previewUrl': t.get('previewUrl'), 'composer': t.get('composer'),
      'isStreamable': t.get('isStreamable'), 'explicitness': t.get('trackExplicitness'),
      'source': t.get('metadataSource', 'Apple iTunes Search API'),
      'sourceUrl': t.get('metadataSourceUrl') or f'https://itunes.apple.com/lookup?id={album_id.removeprefix("apple-")}&entity=song&limit=200&country={country}',
      'supplemented': bool(t.get('metadataSource')),
    }

def mb_track(t, m, r, album_id, supplemented=False):
    recording = t.get('recording', {})
    ms = t.get('length') or recording.get('length')
    return {
      'id': 'mb-' + t['id'], 'albumId': album_id,
      'title': t.get('title', recording.get('title')),
      'artist': credit(t.get('artist-credit', recording.get('artist-credit', r.get('artist-credit', [])))),
      'discNumber': m['position'], 'trackNumber': t['position'],
      'kind': 'music-video' if m.get('format') in ['DVD', 'DVD-Video', 'Blu-ray', 'VCD'] or recording.get('video') else 'song',
      'mediumFormat': m.get('format'), 'durationMs': ms, 'duration': duration(ms),
      'appleTrackId': None, 'musicbrainzRecordingId': recording.get('id'),
      'url': 'https://musicbrainz.org/recording/' + recording['id'] if recording.get('id') else None,
      'previewUrl': None, 'composer': None, 'isStreamable': None, 'explicitness': None,
      'source': 'MusicBrainz physical release metadata' if m.get('format') != 'Digital Media' else 'MusicBrainz digital release metadata',
      'sourceUrl': 'https://musicbrainz.org/release/' + r['id'], 'supplemented': supplemented,
    }

def classify(cid, title, groups):
    types = {g['type'] for g in groups}
    secondary = {t for g in groups for t in g['secondaryTypes']}
    if re.search(r'\bSingle$', title, re.I): return 'single'
    if re.search(r'\bEP$', title, re.I): return 'ep'
    if cid in ['545058478','548143960']: return 'instrumental'
    if 'Remix' in secondary or re.search('Mixed Up|Remix', title, re.I): return 'remix'
    if 'Live' in secondary or re.search(r'演唱會|Concert|\(Live\)|拉闊', title): return 'live'
    if 'Compilation' in secondary or re.search('精選|首選|68.*29', title): return 'compilation'
    if 'EP' in types: return 'ep'
    return 'studio' if cid in CORE_BY_ID or 'Album' in types else 'album'

def counts(album):
    ts = album['tracks']; album['trackCount'] = len(ts)
    album['songCount'] = sum(t['kind'] == 'song' for t in ts)
    album['videoCount'] = sum(t['kind'] == 'music-video' for t in ts)
    album['durationMs'] = sum(t['durationMs'] or 0 for t in ts if t['kind'] == 'song')
    album['durationComplete'] = all(t['durationMs'] is not None for t in ts if t['kind'] == 'song')
    album['missingTrackCount'] = max(0, album['declaredTrackCount'] - len(ts))

def build():
    entries = read(SRC / 'discovered-albums.json')
    raw_tracks = read(SRC / 'tracks-by-album.json')
    covers = read(SRC / 'downloaded-covers.json')
    albums = []; patches_log = []
    for cid, entry in entries.items():
        country = next(c for c in ['hk','tw','cn','us'] if c in entry['storefronts'])
        meta = entry['metadataByStorefront'][country]; aid = 'apple-' + cid
        raw = {str(t['trackId']): t for t in raw_tracks.get(cid, [])}
        page = SRC / 'apple-pages' / (cid + '-tracks.json')
        if page.exists():
            for t in read(page).get('tracks', []): raw.setdefault(str(t['trackId']), t)
        tracks = [apple_track(t, aid, country) for t in raw.values()]
        groups = GROUP_BY_ALBUM.get(cid, [])
        notes = []
        if cid in PATCHES:
            gid, rid, note = PATCHES[cid]
            r = next(r for r in read(SRC / 'musicbrainz-releases' / (gid + '.json'))['releases'] if r['id'] == rid)
            slots = {(t['discNumber'], t['trackNumber']) for t in tracks}
            added = []
            for m in r['media']:
                if m.get('format') not in ['CD','HDCD']: continue
                for t in m.get('tracks', []):
                    if (m['position'], t['position']) not in slots:
                        item = mb_track(t, m, r, aid, True); tracks.append(item); added.append(item)
            notes.append(note)
            patches_log.append({'albumId': aid, 'title': meta['collectionName'], 'note': note,
                'sourceUrl': 'https://musicbrainz.org/release/' + rid,
                'addedTracks': [{'disc': t['discNumber'], 'track': t['trackNumber'], 'title': t['title']} for t in added]})
        tracks.sort(key=lambda t: (t['discNumber'], t['trackNumber'], t['kind']))
        if cid == '1444164011': notes.append('Apple 声明 23 项，公开接口和专辑页返回 22 项；剩余 1 项类型及名称未获确认，未猜填。实体 2CD 普通版为 21 曲，不能用它替代 Deluxe 的目录。')
        if cid == '1575742728': notes.append('本版含 14 曲；另保留 Apple 892745229 的 10 曲版本。')
        if cid == '1441543918': notes.append('包含 15 个音频条目（含 interlude）和 4 个 MV；音频条目数不等于 15 首独立创作。')
        release_date = meta.get('releaseDate', '')[:10] or None
        album = {
          'id': aid, 'appleCollectionId': cid, 'musicbrainzReleaseId': None,
          'title': meta['collectionName'], 'artist': meta['artistName'],
          'type': classify(cid, meta['collectionName'], groups),
          'selectedForStudioShelf': cid in CORE_BY_ID,
          'releaseDate': release_date,
          'releaseDateMeaning': 'Apple 当前发行版本的日期；不保证为实体首版日期',
          'originalReleaseDateCandidates': [{'date': g['firstReleaseDate'], 'sourceUrl': g['sourceUrl']} for g in groups if g.get('firstReleaseDate')],
          'storefronts': sorted(entry['storefronts']), 'preferredStorefront': country,
          'genre': meta.get('primaryGenreName'), 'copyright': meta.get('copyright'),
          'declaredTrackCount': meta['trackCount'], 'cover': covers.get(cid),
          'tracks': tracks, 'notes': notes,
          'metadataStatus': 'supplemented-from-physical' if cid in PATCHES else 'catalog',
          'sourceUrls': [meta['collectionViewUrl']] + [g['sourceUrl'] for g in groups],
          'releaseGroupIds': [g['id'] for g in groups],
        }
        counts(album)
        if album['missingTrackCount']: album['metadataStatus'] = 'incomplete'
        albums.append(album)
    extras = read(SRC / 'supplemental-releases.json')
    extra_covers = read(SRC / 'supplemental-covers.json')
    for item in extras:
        r = item['release']; g = item['group']; aid = 'mb-' + r['id']
        ts = [mb_track(t, m, r, aid) for m in r.get('media', []) for t in m.get('tracks', [])]
        notes = ['Apple 四区目录未找到该发行 ID；依据 MusicBrainz 指定版本保存，未与相似标题版本合并。']
        review = r.get('status') != 'Official' or g['title'] == '十面埋伏'
        if review: notes.append('发行信息仍需复核；暂不进入录音室专辑展示清单。')
        if g['title'] == '903id Club 拉阔音乐会': notes.append('可能是 2011 合作现场发行的部分曲目版本；两份源记录分别保留，勿按独立新专辑计数。')
        cov = extra_covers.get(r['id'], {})
        if not cov.get('path'): notes.append('曲目已保存，独立封面尚未下载成功；不使用其他专辑图片代替。')
        album = {
          'id': aid, 'appleCollectionId': None, 'musicbrainzReleaseId': r['id'],
          'title': g['title'], 'artist': credit(r.get('artist-credit', [])),
          'type': 'compilation' if g['title'] == '十面埋伏' else classify('', g['title'], [g]),
          'selectedForStudioShelf': False,
          'releaseDate': r.get('date') or g.get('firstReleaseDate') or None,
          'releaseDateMeaning': 'MusicBrainz 指定发行版本的日期',
          'originalReleaseDateCandidates': [{'date': g['firstReleaseDate'], 'sourceUrl': g['sourceUrl']}] if g.get('firstReleaseDate') else [],
          'storefronts': [], 'preferredStorefront': None, 'genre': None, 'copyright': None,
          'declaredTrackCount': sum(m.get('track-count', 0) for m in r.get('media', [])),
          'cover': cov if cov.get('path') else None, 'tracks': ts, 'notes': notes,
          'metadataStatus': 'review-required' if review else 'physical-reference',
          'sourceUrls': ['https://musicbrainz.org/release/' + r['id'], g['sourceUrl']],
          'releaseGroupIds': [g['id']],
        }
        if g['type'] == 'Single': album['type'] = 'single'
        counts(album); albums.append(album)
    albums.sort(key=lambda a: (a['releaseDate'] or '9999', a['title'], a['id']))
    by_id = {a['id']: a for a in albums}
    studio = []
    for i, (cid, title, year, language) in enumerate(CORE):
        a = by_id['apple-' + cid]
        studio.append({'index': i + 1, 'albumId': a['id'], 'title': title, 'originalYear': year,
          'primaryLanguage': language, 'coverPath': a['cover']['path'],
          'songCount': a['songCount'], 'videoCount': a['videoCount'],
          'albumDataPath': 'albums/' + a['id'] + '.json',
          'notes': a['notes']})
    stamp = datetime.now(timezone.utc).isoformat()
    report = {
      'builtAt': stamp, 'collectionStartedOn': '2026-09-06',
      'releaseVersionCount': len(albums), 'appleReleaseVersionCount': len(entries),
      'supplementalReleaseRecordCount': len(extras), 'studioAlbumSelectionCount': len(studio),
      'downloadedCoverCount': sum(bool(a['cover']) for a in albums),
      'audioTrackEntryCount': sum(a['songCount'] for a in albums),
      'musicVideoEntryCount': sum(a['videoCount'] for a in albums),
      'countingNote': '按发行版本计算曲目条目；同一歌曲在原版、精选、现场、重制和地区版中重复出现，音轨含 intro / interlude / 纯音乐。',
      'types': dict(Counter(a['type'] for a in albums)),
      'incompleteTrackLists': [{'id': a['id'], 'title': a['title'], 'declared': a['declaredTrackCount'], 'collected': a['trackCount'], 'notes': a['notes']} for a in albums if a['missingTrackCount']],
      'missingCovers': [{'id': a['id'], 'title': a['title'], 'sourceUrls': a['sourceUrls']} for a in albums if not a['cover']],
      'reviewRequired': [{'id': a['id'], 'title': a['title'], 'notes': a['notes']} for a in albums if a['metadataStatus'] == 'review-required'],
      'knownUncollectedFormats': [
        {'title': '超人迪加', 'note': '历史目录中的 EP 发行形态及曲序待核实；相关歌曲已收录于现有专辑。', 'url': 'https://en.wikipedia.org/wiki/Eason_Chan_discography'},
        {'title': 'Big Live 陳奕迅大個唱 99', 'note': '独立演唱会 VCD/DVD 发行，未采集视频载体的完整章节与包装。', 'url': 'https://www.yesasia.com/us/big-live-easons-dvd-karaoke-99/1000001689-0-0-0-en/info.html'},
        {'title': '加州紅紅人館 903 狂熱份子音樂會', 'note': '早期演唱会影碟发行，未获得可核对的完整曲序与封面。', 'url': 'https://en.wikipedia.org/wiki/Eason_Chan_discography'},
      ],
      'excludedReleaseGroups': read(SRC / 'excluded-release-groups.json'),
      'limitations': ['这是四个 Apple 地区目录及 MusicBrainz 交叉核对后的素材快照，不是全球所有压片、再版及影音发行的完整权威全集。',
        '不同来源的首发日期存在差异，保留来源原值；32 张录音室清单的 originalYear 单独用于时间顺序展示。',
        '补充记录中的独立单曲和实体版本封面无法获取时保留空值，未合成或挪用其他专辑封面。'],
    }
    catalog = {'schemaVersion': 1, 'artist': '陳奕迅 / Eason Chan', 'summary': report, 'albums': albums}
    write(BASE / 'catalog.json', catalog)
    write(BASE / 'core-studio-albums.json', {'note': '32 张录音室专辑各选一个展示版本；国语/粤语为专辑主要语言，不排除加收其他语言歌曲。', 'albums': studio})
    write(BASE / 'completeness-report.json', report)
    write(BASE / 'track-supplements.json', patches_log)
    for a in albums: write(BASE / 'albums' / (a['id'] + '.json'), a)
    cover_manifest = [{'albumId': a['id'], 'title': a['title'], **a['cover']} for a in albums if a['cover']]
    write(BASE / 'cover-manifest.json', cover_manifest)
    def output_csv(name, rows, fields):
        with (BASE / name).open('w', encoding='utf-8-sig', newline='') as f:
            w = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore'); w.writeheader(); w.writerows(rows)
    output_csv('albums.csv', [{**a, 'coverPath': a['cover']['path'] if a['cover'] else '',
      'storefronts': ','.join(a['storefronts']), 'sourceUrls': ' | '.join(a['sourceUrls']), 'notes': ' | '.join(a['notes'])} for a in albums],
      ['id','title','artist','type','releaseDate','selectedForStudioShelf','songCount','videoCount','declaredTrackCount','missingTrackCount','coverPath','storefronts','metadataStatus','sourceUrls','notes'])
    output_csv('tracks.csv', [{**t, 'albumTitle': a['title'], 'albumType': a['type']} for a in albums for t in a['tracks']],
      ['albumId','albumTitle','albumType','discNumber','trackNumber','kind','title','artist','duration','durationMs','appleTrackId','musicbrainzRecordingId','url','previewUrl','source','sourceUrl','supplemented'])
    render_index(catalog, studio)
    verify(catalog, studio, cover_manifest)
    print(json.dumps({k: v for k, v in report.items() if isinstance(v, (int, str))}, ensure_ascii=False, indent=2))
    print('Missing covers:', len(report['missingCovers']), 'Incomplete track lists:', len(report['incompleteTrackLists']))

def render_index(catalog, studio):
    # Small offline asset browser. It does not modify or depend on the application.
    template = (BASE / 'tools' / 'index-template.html').read_text()
    js_data = json.dumps({'catalog': catalog, 'studio': studio}, ensure_ascii=False).replace('</', '<\\/')
    (BASE / 'index.html').write_text(template.replace('__CATALOG_DATA__', js_data))

def verify(catalog, studio, cover_manifest):
    albums = catalog['albums']; by_id = {a['id']: a for a in albums}; errors = []
    for a in albums:
        if not a['tracks']: errors.append('empty tracks: ' + a['id'])
        slots = [(t['discNumber'], t['trackNumber']) for t in a['tracks']]
        if len(slots) != len(set(slots)): errors.append('duplicate disc/track slot: ' + a['id'])
        if len({t['id'] for t in a['tracks']}) != len(a['tracks']): errors.append('duplicate track ID: ' + a['id'])
        for t in a['tracks']:
            if not t['title'] or not t['sourceUrl']: errors.append('missing title/source: ' + t['id'])
    total_bytes = 0
    for c in cover_manifest:
        p = BASE / c['path']; b = p.read_bytes(); total_bytes += len(b)
        with Image.open(p) as im:
            im.load()
            if list(im.size) != [c['width'], c['height']]: errors.append('wrong dimensions: ' + str(p))
        if hashlib.sha256(b).hexdigest() != c['sha256']: errors.append('hash mismatch: ' + str(p))
    for item in studio:
        a = by_id[item['albumId']]
        if a['missingTrackCount'] or not a['cover']: errors.append('incomplete studio selection: ' + a['id'])
    checks = {'checkedAt': datetime.now(timezone.utc).isoformat(), 'passed': not errors,
      'releaseVersions': len(albums), 'validatedCoverFiles': len(cover_manifest),
      'coverBytes': total_bytes, 'coverMiB': round(total_bytes / 1048576, 2),
      'studioSelectionsWithCoverAndCompleteCount': len(studio),
      'maxCoverWidth': max(c['width'] for c in cover_manifest),
      'errors': errors, 'knownDataGaps': catalog['summary']['incompleteTrackLists']}
    write(BASE / 'asset-checks.json', checks)
    if errors: raise ValueError(errors)
    make_contact_sheet(studio)

def make_contact_sheet(studio):
    fonts = list(Path('/System/Library/AssetsV2/com_apple_MobileAsset_Font7').glob('*/AssetData/PingFang.ttc'))
    if not fonts: return
    font = ImageFont.truetype(str(fonts[0]), 18, index=3)
    small = ImageFont.truetype(str(fonts[0]), 14, index=3)
    title_font = ImageFont.truetype(str(fonts[0]), 36, index=3)
    cols = 8; width = 1600; cell = 192; padding = 32
    sheet = Image.new('RGB', (width, 1140), '#eeeeea'); d = ImageDraw.Draw(sheet)
    d.text((padding, 27), 'EASON CHAN  /  录音室专辑素材', font=title_font, fill='#242523')
    d.text((padding, 83), '32 张专辑 · 本地封面预览 · 原图与曲目见离线目录', font=font, fill='#62635f')
    for i, a in enumerate(studio):
        x = padding + (i % cols) * cell; y = 135 + (i // cols) * 240
        with Image.open(BASE / a['coverPath']) as im:
            thumb = ImageOps.contain(im.convert('RGB'), (176,176), Image.Resampling.LANCZOS)
        sheet.paste(thumb, (x + (176 - thumb.width)//2, y + (176 - thumb.height)//2))
        name = a['title']
        while d.textlength(name, font=font) > 177: name = name[:-2] + '…'
        d.text((x, y+183), name, font=font, fill='#242523')
        d.text((x, y+208), str(a['originalYear']) + '  /  ' + a['primaryLanguage'], font=small, fill='#6f706c')
    sheet.save(BASE / 'previews' / 'studio-albums-contact-sheet.jpg', quality=90)

if __name__ == '__main__': build()
