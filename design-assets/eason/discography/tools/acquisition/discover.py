from pathlib import Path
import json, time, urllib.request, urllib.parse

BASE=Path(__file__).resolve().parents[2]
def get(url,path):
    if path.exists(): return json.loads(path.read_text())
    for attempt in range(3):
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'HaoCorner-Material-Research/1.0','Accept':'application/json'})
            with urllib.request.urlopen(req,timeout=35) as resp: data=json.load(resp)
            path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
            return data
        except Exception as e:
            print('RETRY',path.name,str(e),flush=True)
            time.sleep(5*(attempt+1))
    return {}

for country in ['hk','tw','us','cn']:
    for mode,params in [('artist',{'id':'137938148','entity':'album','limit':200}),('search',{'term':'陳奕迅','entity':'album','media':'music','limit':200})]:
        url='https://itunes.apple.com/'+('lookup' if mode=='artist' else 'search')+'?'+urllib.parse.urlencode({**params,'country':country})
        d=get(url,BASE/'sources'/'itunes'/f'{mode}-{country}.json')
        albums=[a for a in d.get('results',[]) if a.get('collectionType')=='Album' and a.get('artistId')==137938148]
        print(country,mode,'total',d.get('resultCount'),'Eason albums',len(albums),flush=True)
        time.sleep(3.5)

url='https://musicbrainz.org/ws/2/release-group?'+urllib.parse.urlencode({'artist':'86119d30-d930-4e65-a97a-e31e22388166','limit':100,'fmt':'json'})
d=get(url,BASE/'sources'/'musicbrainz-release-groups-0.json')
print('MusicBrainz',d.get('release-group-count'),len(d.get('release-groups',[])),flush=True)
for offset in range(100,d.get('release-group-count',0),100):
    time.sleep(1.1)
    d2=get(url+'&offset='+str(offset),BASE/'sources'/f'musicbrainz-release-groups-{offset}.json')
    print('MusicBrainz offset',offset,len(d2.get('release-groups',[])),flush=True)

entries={}
for path in sorted((BASE/'sources'/'itunes').glob('*.json')):
    country=path.stem.split('-')[-1]
    for a in json.loads(path.read_text()).get('results',[]):
        if a.get('collectionType')!='Album' or a.get('artistId')!=137938148: continue
        cid=str(a['collectionId'])
        e=entries.setdefault(cid,{'id':cid,'storefronts':[],'metadataByStorefront':{}})
        if country not in e['storefronts']:e['storefronts'].append(country)
        e['metadataByStorefront'][country]=a
(BASE/'sources'/'discovered-albums.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n')
print('UNIQUE ALBUM IDS',len(entries),flush=True)
for e in sorted(entries.values(),key=lambda e: next(iter(e['metadataByStorefront'].values())).get('releaseDate','')):
    a=next(iter(e['metadataByStorefront'].values()))
    print(a.get('releaseDate','')[:10],e['id'],a['collectionName'],a['trackCount'],','.join(e['storefronts']),flush=True)
