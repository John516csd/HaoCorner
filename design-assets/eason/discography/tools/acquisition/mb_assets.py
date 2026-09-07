from pathlib import Path
from urllib.request import Request,urlopen
from concurrent.futures import ThreadPoolExecutor,as_completed
import json,time,urllib.parse,re,hashlib,io,html
from PIL import Image

BASE=Path(__file__).resolve().parents[2]
UA='HaoCorner-Material-Research/1.0'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def get(url,path=None,as_json=True):
    if path and path.exists():return read(path) if as_json else path.read_bytes()
    for attempt in range(2):
        try:
            with urlopen(Request(url,headers={'User-Agent':UA}),timeout=15) as r:b=r.read()
            d=json.loads(b) if as_json else b
            if path:
                if as_json:write(path,d)
                else:path.write_bytes(b)
            return d
        except Exception as e:
            if getattr(e,'code',None) in [404,400]:return {'error':str(e)} if as_json else None
            if attempt==1:return {'error':str(e)} if as_json else None
            time.sleep(2*(attempt+1))

extra_groups={
 '1442943933':'10478872-39e1-3e3d-b997-b0aed2428bed',
 '1443493887':'208d3080-1ebf-35a4-8a0c-f04fe589d88e',
 '1443938740':'e9024bcc-845b-3549-b0bd-0770822e6cf0',
 '1422674966':'fcae667c-725e-4801-9e38-c21f69a80103',
 '1444164011':'08107436-e26c-4221-b078-a25d001f94a6',
}
for cid,gid in extra_groups.items():
    url='https://musicbrainz.org/ws/2/release?'+urllib.parse.urlencode({'release-group':gid,'inc':'recordings+artist-credits+labels','fmt':'json','limit':100})
    d=get(url,BASE/'sources/musicbrainz-releases'/f'{gid}.json')
    print('GAP',cid,[(r['id'],r.get('title'),r.get('status'),[(m.get('format'),m.get('track-count')) for m in r.get('media',[])]) for r in d.get('releases',[])],flush=True)
    time.sleep(1.1)

coverage=read(BASE/'sources/release-group-coverage.json')
excluded={
 '20be69b2-058f-4053-a633-0b04a3c11f52':'Cancelled release: I Had a Great Time was not independently released.',
 '2173430c-b478-4ee8-8120-18d8ca845132':'Conflicting artist credit: Superboy & Connie Chen. Do not include as a verified Eason Chan release.',
}
selected=[]
for g in coverage:
    if g['albumIds'] or g['id'] in excluded:continue
    p=BASE/'sources/musicbrainz-releases'/f"{g['id']}.json"
    if not p.exists():continue
    rs=[r for r in read(p).get('releases',[]) if r.get('status') not in ['Cancelled','Bootleg','Pseudo-Release']]
    rs.sort(key=lambda r:(r.get('status')!='Official',not bool(r.get('cover-art-archive',{}).get('front')),r.get('country') not in ['HK','TW','CN'],r.get('date') or '9999'))
    if rs:selected.append({'group':g,'release':rs[0],'alternates':[r['id'] for r in rs[1:]]})

def archive_cover(item):
    g=item['group'];r=item['release'];rid=r['id']
    candidates=[]
    for kind,id in [('release',rid),('release-group',g['id'])]:
        data=get(f'https://coverartarchive.org/{kind}/{id}',BASE/'sources/cover-art-archive'/f'{kind}-{id}.json')
        candidates += [im for im in data.get('images',[]) if im.get('front')]
        if candidates:break
    if not candidates:return {'releaseId':rid,'error':'No cover in Cover Art Archive'}
    im=candidates[0];url=im.get('image');blob=get(url,None,False)
    if not blob:return {'releaseId':rid,'error':'Cover download failed','sourceUrl':url}
    with Image.open(io.BytesIO(blob)) as img:img.load();width,height=img.size;fmt=img.format
    ext={'JPEG':'.jpg','PNG':'.png','WEBP':'.webp'}.get(fmt,'.img')
    title=re.sub(r'[\\/:*?"<>|\x00-\x1f]','_',g['title']).strip().strip('.')[:70]
    name='mb-'+rid+'-'+title+ext;(BASE/'covers'/name).write_bytes(blob)
    return {'releaseId':rid,'path':'covers/'+name,'sourceUrl':url,'width':width,'height':height,'bytes':len(blob),'sha256':hashlib.sha256(blob).hexdigest(),'format':fmt,'via':'https://coverartarchive.org/'}

def cover(item):
    g=item['group'];r=item['release'];rid=r['id']
    cache=BASE/'sources/lastfm';cache.mkdir(exist_ok=True)
    alternate_titles={
      'Eason 18首選':['18首選'],
      '陳奕迅48首選':['48首選','Eason Chan Best Buy Top 48'],
      '陳奕迅 Eason':['Eason'],
      'Super Master Series: Eason Chan 陳奕迅':['Super Master Series','Super Master'],
      'Music Is Live 2011 903 id club 陳奕迅 x 楊千嬅 x 梁漢文':['Music Is Live 2011','903 ID Club 拉闊音樂會'],
      '陳奕迅&葉蒨文 903 id club 拉闊音樂會':['903 id club 拉闊音樂會','陳奕迅 & 葉蒨文 903 id club 拉闊音樂會'],
      '拉闊壓軸：林子祥 / 陳奕迅':['拉闊壓軸','01拉闊壓軸'],
    }
    for i,title in enumerate([g['title']]+alternate_titles.get(g['title'],[])):
        url='https://www.last.fm/music/Eason+Chan/'+urllib.parse.quote(title,safe='')+'/+images'
        b=get(url,cache/f'{rid}-{i}.html',False)
        if not b:continue
        s=b.decode('utf-8');gallery=re.search(r'<ul class="image-list">(.*?)</ul>',s,re.S)
        if not gallery:continue
        first=re.search(r'<img\s+src="([^"]+)"',gallery.group(1))
        og=re.search(r'<meta property="og:image"\s+content="([^"]+)"',s)
        if not first or not og:continue
        thumb=html.unescape(first.group(1));imageurl=html.unescape(og.group(1))
        key=thumb.rsplit('/',1)[-1].split('.')[0]
        if key not in imageurl:continue
        blob=get(imageurl,None,False)
        if not blob:continue
        with Image.open(io.BytesIO(blob)) as img:img.load();width,height=img.size;fmt=img.format
        ext={'JPEG':'.jpg','PNG':'.png','WEBP':'.webp'}.get(fmt,'.img')
        name='mb-'+rid+'-'+re.sub(r'[\\/:*?"<>|\x00-\x1f]','_',g['title'])[:70]+ext
        (BASE/'covers'/name).write_bytes(blob)
        return {'releaseId':rid,'path':'covers/'+name,'sourceUrl':imageurl,'sourcePage':url,'width':width,'height':height,'bytes':len(blob),'sha256':hashlib.sha256(blob).hexdigest(),'format':fmt,'via':'Last.fm album artwork','matchTitle':title,'reviewRequired':True}
    return {'releaseId':rid,'error':'No downloadable matching cover located in available sources'}

write(BASE/'sources/supplemental-releases.json',selected)
write(BASE/'sources/excluded-release-groups.json',excluded)
covers=read(BASE/'sources/supplemental-covers.json') if (BASE/'sources/supplemental-covers.json').exists() else {}
with ThreadPoolExecutor(max_workers=3) as pool:
    fs={pool.submit(cover,x):x for x in selected if not covers.get(x['release']['id'], {}).get('path')}
    for f in as_completed(fs):
        r=f.result();covers[r['releaseId']]=r
        write(BASE/'sources/supplemental-covers.json',covers)
        print('ARCHIVE COVER',fs[f]['group']['title'],r.get('error',str(r.get('width'))+'x'+str(r.get('height'))),flush=True)
write(BASE/'sources/supplemental-releases.json',selected)
write(BASE/'sources/supplemental-covers.json',covers)
write(BASE/'sources/excluded-release-groups.json',excluded)
print('SUPPLEMENTAL',len(selected),'releases',sum('path' in c for c in covers.values()),'covers',flush=True)
