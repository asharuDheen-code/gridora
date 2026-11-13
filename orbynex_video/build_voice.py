import json, ssl, asyncio, os, subprocess, sys
import numpy as np, certifi
CA="/root/.ccr/ca-bundle.crt"
import edge_tts, edge_tts.communicate as c
c._SSL_CTX = ssl.create_default_context(cafile=CA)
ROOT=os.path.dirname(os.path.abspath(__file__)); TTS=f"{ROOT}/tts"; SR=48000
RATE=os.environ.get("RATE","+3%")
S=json.load(open(f"{ROOT}/script.json"))
lines=[(si,li,l) for si,s in enumerate(S["scenes"]) for li,l in enumerate(s["lines"])]
force=set(sys.argv[1:])  # keys to regenerate e.g. hook-0

async def gen(key, text, sem):
    mp3=f"{TTS}/{key}.mp3"; js=f"{TTS}/{key}.json"
    if os.path.exists(js) and key not in force: return
    async with sem:
        for attempt in range(4):
            try:
                com=edge_tts.Communicate(text,"ml-IN-MidhunNeural",rate=RATE,boundary="WordBoundary")
                audio=bytearray(); words=[]
                async for ch in com.stream():
                    if ch["type"]=="audio": audio+=ch["data"]
                    elif ch["type"]=="WordBoundary":
                        words.append({"t0":ch["offset"]/1e7,"t1":(ch["offset"]+ch["duration"])/1e7,"w":ch["text"]})
                open(mp3,"wb").write(audio); json.dump(words,open(js,"w"),ensure_ascii=False); return
            except Exception as e:
                print("retry",key,e); await asyncio.sleep(2+attempt*3)
        raise SystemExit("failed "+key)

async def main():
    sem=asyncio.Semaphore(4)
    await asyncio.gather(*[gen(f"{S['scenes'][si]['id']}-{li}", l["ml"], sem) for si,li,l in lines])
asyncio.run(main())

def decode(p):
    raw=subprocess.run(["ffmpeg","-v","error","-i",p,"-f","f32le","-ac","1","-ar",str(SR),"-"],capture_output=True,check=True).stdout
    return np.frombuffer(raw,dtype=np.float32)

LEAD=0.6; GAP=0.42; TAIL=0.75
TAILS={"hook":0.6,"overview":1.0,"step2":1.0,"step6":1.6,"catch":0.9,"cancel":0.9,"recap":1.4,"cta":3.0,"p1":0.9,"p2":1.3,"p3":1.3,"p4":1.3,"p5":1.0}
t=0.0; out=[]; clips=[]
for s in S["scenes"]:
    sc={"id":s["id"],"start":t,"lines":[]}; t+=LEAD
    for li,l in enumerate(s["lines"]):
        key=f"{s['id']}-{li}"; a=decode(f"{TTS}/{key}.mp3"); w=json.load(open(f"{TTS}/{key}.json"))
        a0=max(0.0,w[0]["t0"]-0.07); a1=min(len(a)/SR,w[-1]["t1"]+0.2)
        # compress long inner pauses (sentence stops) to MAXP seconds
        MAXP=0.5; parts=[]; cur=a0; shift=0.0; w2=[]
        for k,x in enumerate(w):
            if k>0:
                g=x["t0"]-w[k-1]["t1"]
                if g>MAXP:
                    cut0=w[k-1]["t1"]+MAXP/2; cut1=x["t0"]-MAXP/2
                    parts.append(a[int(cur*SR):int(cut0*SR)]); cur=cut1; shift+=cut1-cut0
            w2.append({"t0":x["t0"]-shift,"t1":x["t1"]-shift,"w":x["w"]})
        parts.append(a[int(cur*SR):int(a1*SR)])
        n2=int(0.02*SR)
        for k in range(len(parts)-1):
            if len(parts[k])>n2: parts[k]=parts[k].copy(); parts[k][-n2:]*=np.linspace(1,0,n2)
            if len(parts[k+1])>n2: parts[k+1]=parts[k+1].copy(); parts[k+1][:n2]*=np.linspace(0,1,n2)
        seg=np.concatenate(parts).copy(); w=w2
        n=int(0.01*SR); seg[:n]*=np.linspace(0,1,n); seg[-n:]*=np.linspace(1,0,n)
        clips.append((t,seg))
        words=[{"t0":round(t+x["t0"]-a0,3),"t1":round(t+x["t1"]-a0,3),"w":x["w"]} for x in w]
        sc["lines"].append({"start":round(t,3),"end":round(t+len(seg)/SR,3),"words":words,"ml":l["ml"],"en":l["en"]})
        t+=len(seg)/SR+GAP
    t+=TAILS.get(s["id"],TAIL)-GAP
    sc["end"]=round(t,3); out.append(sc)
total=t
v=np.zeros(int(total*SR)+SR,dtype=np.float32)
for st,seg in clips: i=int(st*SR); v[i:i+len(seg)]+=seg
v=v[:int(total*SR)]
import wave
def wwav(p,x):
    x=np.clip(x,-1,1); d=(x*32767).astype(np.int16)
    with wave.open(p,"wb") as f: f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes(d.tobytes())
wwav(f"{ROOT}/build/voice.wav",v)
json.dump({"total":round(total,3),"scenes":out,"chapters":S["chapters"]},open(f"{ROOT}/build/timeline.json","w"),ensure_ascii=False,indent=1)
print("total",round(total,2),"s lines",len(clips))
