from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import defaultdict
import json,time,re,urllib.request,urllib.parse,hashlib,io
from PIL import Image

BASE=Path(__file__).resolve().parents[2]
RAW=BASE/'sources'/'itunes'
UA='HaoCorner-Material-Research/1.0'
def read(path):return json.loads(path.read_text())
def write(path,data):path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def fetch_json(url,path):
    if path.exists(): return read(path)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':UA}),timeout=40) as r:data=json.load(r)
            write(path,data);return data
        except Exception as e:
            print('RETRY',path.name,str(e),flush=True);time.sleep(5*(attempt+1))
    return {'results':[],'error':'Request failed','url':url}

entries={}
related_ids=set()
for p in RAW.glob('artist-*.json'):
    related_ids.update(str(a['collectionId']) for a in read(p).get('results',[]) if a.get('collectionType')=='Album')
for p in list(RAW.glob('artist-*.json'))+list(RAW.glob('search-*.json'))+list(RAW.glob('extra-*.json')):
    country=p.stem.split('-')[-1]
    for a in read(p).get('results',[]):
        if a.get('collectionType')!='Album':continue
        cid=str(a['collectionId'])
        if cid not in related_ids and a.get('artistId')!=137938148 and not re.search('陳奕迅|陈奕迅|eason chan',a.get('artistName',''),re.I):continue
        e=entries.setdefault(cid,{'id':cid,'storefronts':[],'metadataByStorefront':{}})
        if country not in e['storefronts']:e['storefronts'].append(country)
        e['metadataByStorefront'][country]=a
write(BASE/'sources'/'discovered-albums.json',entries)
print('Discovered',len(entries),'release IDs',flush=True)

def selected(e):
    country=next(c for c in ['hk','tw','cn','us'] if c in e['storefronts'])
    return country,e['metadataByStorefront'][country]

def cover(e):
    country,a=selected(e)
    url=a.get('artworkUrl100')
    if not url:return {'id':e['id'],'error':'no artwork URL'}
    name=re.sub(r'[\\/:*?"<>|\x00-\x1f]','_',a['collectionName']).strip().strip('.')[:90]
    filename=f"{e['id']}-{name}.jpg"
    dest=BASE/'covers'/filename
    for size in [3000,2048,1400,600]:
        link=url.replace('100x100',f'{size}x{size}')
        try:
            if dest.exists():data=dest.read_bytes()
            else:
                for attempt in range(2):
                    try:
                        with urllib.request.urlopen(urllib.request.Request(link,headers={'User-Agent':UA}),timeout=40) as r:data=r.read()
                        break
                    except Exception:
                        if attempt:raise
                        time.sleep(2)
            with Image.open(io.BytesIO(data)) as im:
                im.load(); dims=list(im.size);fmt=im.format
            if fmt!='JPEG':
                filename=str(Path(filename).with_suffix('.'+fmt.lower()));dest=BASE/'covers'/filename
            if not dest.exists():dest.write_bytes(data)
            return {'id':e['id'],'path':'covers/'+filename,'sourceUrl':link,'originalArtworkUrl':url,'requestedSize':size,'width':dims[0],'height':dims[1],'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'format':fmt,'via':'https://coverbox.henry-hu.com/'}
        except Exception as exc:
            print('COVER RETRY',e['id'],size,str(exc),flush=True)
    return {'id':e['id'],'error':'artwork download failed','sourceUrl':url}

bycountry=defaultdict(list)
for e in entries.values():
    country,a=selected(e);bycountry[country].append((e,a))
batches=[]
for country,items in bycountry.items():
    batch=[];n=0
    for e,a in items:
        cost=a.get('trackCount',0)+1
        if batch and (n+cost>175 or len(batch)>=25):batches.append((country,batch));batch=[];n=0
        batch.append(e['id']);n+=cost
    if batch:batches.append((country,batch))

covers={}
with ThreadPoolExecutor(max_workers=4) as pool:
    futurecovers={pool.submit(cover,e):e['id'] for e in entries.values()}
    for bi,(country,ids) in enumerate(batches):
        url='https://itunes.apple.com/lookup?'+urllib.parse.urlencode({'id':','.join(ids),'entity':'song','limit':200,'country':country})
        path=RAW/f'tracks-{country}-{hashlib.sha1(",".join(ids).encode()).hexdigest()[:10]}.json'
        data=fetch_json(url,path)
        counts=defaultdict(int)
        for a in data.get('results',[]):
            if a.get('wrapperType')=='track':counts[str(a['collectionId'])]+=1
        print('TRACK BATCH',bi+1,'/',len(batches),country,'albums',len(ids),'tracks',sum(counts.values()),'results',data.get('resultCount'),flush=True)
        time.sleep(3.5)
    for i,future in enumerate(as_completed(futurecovers)):
        result=future.result();covers[result['id']]=result
        if (i+1)%20==0 or 'error' in result:print('COVERS',i+1,'/',len(entries),result.get('error','OK'),flush=True)
write(BASE/'sources'/'downloaded-covers.json',covers)

tracks=defaultdict(dict);collections={}
for p in RAW.glob('tracks-*.json'):
    for a in read(p).get('results',[]):
        cid=str(a.get('collectionId',''))
        if a.get('wrapperType')=='collection':collections[cid]=a
        elif a.get('wrapperType')=='track':tracks[cid][str(a['trackId'])]=a
write(BASE/'sources'/'tracks-by-album.json',{k:list(v.values()) for k,v in tracks.items()})
issues=[]
for cid,e in entries.items():
    _,a=selected(e);ts=list(tracks[cid].values())
    if len(ts)!=a['trackCount']:issues.append({'id':cid,'title':a['collectionName'],'declared':a['trackCount'],'fetched':len(ts),'kinds':sorted(set(x.get('kind','') for x in ts)),'storefronts':e['storefronts']})
write(BASE/'sources'/'initial-track-count-issues.json',issues)
print('RESULT',len(entries),'releases',sum(len(v) for v in tracks.values()),'tracks',len(covers),'covers','ISSUES',len(issues),flush=True)
print(json.dumps(issues,ensure_ascii=False,indent=2),flush=True)
