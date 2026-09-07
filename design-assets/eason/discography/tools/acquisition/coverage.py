from pathlib import Path
import json,re,unicodedata,difflib
BASE=Path(__file__).resolve().parents[2]
entries=json.loads((BASE/'sources/discovered-albums.json').read_text())
groups=[]
for p in (BASE/'sources').glob('musicbrainz-release-groups-*.json'):groups+=json.loads(p.read_text())['release-groups']
def norm(s):
    s=unicodedata.normalize('NFKC',s).casefold().replace('’',"'").replace('…','...')
    s=re.sub(r'\([^)]*\)|\[[^]]*\]|（[^）]*）','',s)
    s=re.sub(r'\s*-\s*(single|ep)$','',s)
    return re.sub(r'[^\w\u4e00-\u9fff]','',s)
names={cid:next(iter(e['metadataByStorefront'].values()))['collectionName'] for cid,e in entries.items()}
aliases={
 '陳奕迅':['華星DSD復刻經典: 陳奕迅','時代曲 (華星40 復刻系列)'],
 'U87':['U 87','正東10X10我至愛唱片 - U87'],
 'Life Continues…':['Life Continues'],
 '陳奕迅2011 "?" 國語專輯':['?'],
 '反正是我':['反正是我 (國)'],
 '純音樂世界':['謝霆鋒 + 陳奕迅 (純音樂世界)'],
 'The 1st Eleven Years 然後呢? 1997-2007 跨世紀國語精選':['The 1st Eleven Years 然後呢?'],
 'Eason 4 A Change & Hits':['For a Change & Hits (新曲+精選)'],
 'Great 5000 Secs, Volume 2':['Great 5000 Secs, Vol. 2 (新曲+精選)'],
 '新生活：新曲＋精選':['新生活 (新曲+精選)'],
 '新生活音樂會現場':['新生活 (Live)'],
 '英皇钢琴热恋系列':['英皇鋼琴熱戀系列: 陳奕迅'],
 'Third Encounter':['Third Encounter Concert Live'],
 'DUO 陳奕迅2010演唱會':['陳奕迅2010 Duo演唱會'],
 'Eason\'s Moving On Stage 1':['Eason Moving on Stage 1 (Live)'],
 'Get a Life: Eason Chan Live in Hong Kong':['Get A Life (Live)'],
 'Eason\'s Life 陳奕迅2013演唱會 (2CD)':["Eason's Life 陳奕迅2013演唱會 (Deluxe Version)","Eason's Life 2013演唱會"],
 'Music Life':['2013 陳奕迅 Music Life 精選'],
 '廣東精選':['陳奕迅 廣東精選'],
 '在这个世界相遇':['在這個世界相遇 (動畫電影《大魚海棠》主題曲) - Single'],
}
coverage=[]
for g in groups:
    keys={norm(t) for t in [g['title']]+aliases.get(g['title'],[])}
    match=[cid for cid,t in names.items() if norm(t) in keys]
    if norm(g['title'])=='timeflies':match+=['1443717418']
    item={'id':g['id'],'title':g['title'],'firstReleaseDate':g.get('first-release-date'),'type':g.get('primary-type'),'secondaryTypes':g.get('secondary-types',[]),'albumIds':sorted(set(match)),'sourceUrl':'https://musicbrainz.org/release-group/'+g['id']}
    coverage.append(item)
    if not match:
        close=sorted(names.items(),key=lambda kv:difflib.SequenceMatcher(None,norm(g['title']),norm(kv[1])).ratio(),reverse=True)[:2]
        print('MISSING',g.get('primary-type'),g.get('secondary-types'),g['title'],g['id'],'CLOSE',close)
(BASE/'sources'/'release-group-coverage.json').write_text(json.dumps(coverage,ensure_ascii=False,indent=2)+'\n')
print('Matched',sum(bool(a['albumIds']) for a in coverage),'of',len(coverage),'MB groups')
