from pathlib import Path
from concurrent.futures import ThreadPoolExecutor,as_completed
from urllib.request import Request,urlopen
import json,re,time,urllib.parse,hashlib,io
from PIL import Image

BASE=Path(__file__).resolve().parents[2]
(BASE/'sources/apple-pages').mkdir(exist_ok=True)
(BASE/'sources/musicbrainz-releases').mkdir(exist_ok=True)
(BASE/'sources/cover-art-archive').mkdir(exist_ok=True)
UA='HaoCorner-Material-Research/1.0'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def get(url,path=None,as_json=True):
    if path and path.exists():return read(path) if as_json else path.read_bytes()
    for attempt in range(3):
        try:
            with urlopen(Request(url,headers={'User-Agent':UA}),timeout=35) as r:b=r.read()
            d=json.loads(b) if as_json else b
            if path:
                if as_json:write(path,d)
                else:path.write_bytes(b)
            return d
        except Exception as e:
            if getattr(e,'code',None)==404: return {'error':'HTTP 404'} if as_json else None
            if attempt==2:
                print('FAILED',url,str(e),flush=True);return {'error':str(e)} if as_json else None
            time.sleep(2*(attempt+1))

def walk(x):
    if isinstance(x,dict):
        yield x
        for v in x.values():yield from walk(v)
    elif isinstance(x,list):
        for v in x:yield from walk(v)

entries=read(BASE/'sources/discovered-albums.json')
issues=read(BASE/'sources/initial-track-count-issues.json')
def apple(issue):
    cid=issue['id'];e=entries[cid]
    country=next(c for c in ['hk','tw','cn','us'] if c in e['storefronts'])
    meta=e['metadataByStorefront'][country]
    url=meta['collectionViewUrl']
    b=get(url,BASE/'sources/apple-pages'/f'{cid}-{country}.html',False)
    if not b:return {'id':cid,'error':'page fetch failed'}
    s=b.decode('utf-8')
    match=re.search(r'<script type="application/json" id="serialized-server-data">(.*?)</script>',s,re.S)
    if not match:return {'id':cid,'error':'no structured page data'}
    d=json.loads(match.group(1))
    tracks={}
    for x in walk(d):
        cd=x.get('contentDescriptor',{})
        if 'trackNumber' not in x or 'title' not in x or cd.get('kind') not in ['song','musicVideo']:continue
        if not x.get('id','').startswith('track-lockup - '+cid+' - '):continue
        tid=cd.get('identifiers',{}).get('storeAdamID')
        t={'wrapperType':'track','kind':'song' if cd['kind']=='song' else 'music-video','collectionId':int(cid),'trackId':int(tid),'trackName':x['title'],'artistName':x.get('artistName',meta['artistName']),'collectionName':meta['collectionName'],'discNumber':x.get('discNumber',1),'trackNumber':x['trackNumber'],'trackTimeMillis':x.get('duration'),'trackViewUrl':cd.get('url'),'previewUrl':x.get('previewUrl'),'composer':x.get('composer'),'isStreamable':not x.get('isDisabled',False),'metadataSource':'Apple Music public album page','metadataSourceUrl':url}
        tracks[tid]=t
    result={'id':cid,'sourceUrl':url,'storefront':country,'tracks':list(tracks.values())}
    write(BASE/'sources/apple-pages'/f'{cid}-tracks.json',result)
    print('APPLE PAGE',cid,meta['collectionName'],len(tracks),'/',issue['declared'],flush=True)
    return result

with ThreadPoolExecutor(max_workers=3) as pool:
    for f in as_completed([pool.submit(apple,i) for i in issues]):
        r=f.result()
        if r.get('error'):print(r,flush=True)

coverage=read(BASE/'sources/release-group-coverage.json')
missing=[g for g in coverage if not g['albumIds']]
for g in missing:
    gid=g['id'];url='https://musicbrainz.org/ws/2/release?'+urllib.parse.urlencode({'release-group':gid,'inc':'recordings+artist-credits+labels','fmt':'json','limit':100})
    d=get(url,BASE/'sources/musicbrainz-releases'/f'{gid}.json')
    releases=d.get('releases',[])
    official=[r for r in releases if r.get('status')=='Official']
    candidates=official or releases
    def rank(r):
        return (not bool(r.get('cover-art-archive',{}).get('front')),r.get('country') not in ['HK','TW','CN'],r.get('date') or '9999')
    candidates.sort(key=rank)
    if candidates:
        r=candidates[0]
        print('MB',g['title'],'releases',len(releases),'official',len(official),'chosen',r['id'],'tracks',sum(len(m.get('tracks',[])) for m in r.get('media',[])),flush=True)
    else:print('MB EMPTY',g['title'],flush=True)
    time.sleep(1.1)

print('Supplement metadata finished',flush=True)
