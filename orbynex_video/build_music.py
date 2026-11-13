import numpy as np, json, wave
SR=48000; T=json.load(open("build/timeline.json"))["total"]+0.5; N=int(T*SR)
t=np.arange(N)/SR; rng=np.random.default_rng(7)
bpm=84; beat=60/bpm; bar=beat*4
def mtof(m): return 440*2**((m-69)/12)
# progression (2 bars each): Cmaj9, Am7, Fmaj7, G6
prog=[[48,55,59,62,64],[45,52,55,60,64],[41,48,52,57,60],[43,50,55,59,64]]
L=np.zeros(N); R=np.zeros(N)
nb=int(T/bar)+2
for b in range(0,nb,2):
    ch=prog[(b//2)%4]; s0=int(b*bar*SR); s1=min(N,int((b+2)*bar*SR+0.8*SR))
    if s0>=N: break
    n=s1-s0; tt=np.arange(n)/SR; env=np.minimum(1,tt/1.2)*np.minimum(1,np.maximum(0,(n/SR-tt)/1.0))
    for k,m in enumerate(ch):
        f=mtof(m+12); ph=rng.random()*6.28
        for det,pan in((-0.12,0.3),(0.12,0.7)):
            ff=f*2**(det/12/8)
            w=(np.sin(2*np.pi*ff*tt+ph)+0.25*np.sin(4*np.pi*ff*tt+ph)+0.08*np.sin(6*np.pi*ff*tt))*env*0.05
            L[s0:s1]+=w*(1-pan); R[s0:s1]+=w*pan
    # soft bass
    fb=mtof(ch[0]-12); wb=np.sin(2*np.pi*fb*tt)*env*0.09
    L[s0:s1]+=wb; R[s0:s1]+=wb
    # pluck arpeggio, 8th notes
    arp=[ch[0]+24,ch[2]+24,ch[3]+24,ch[4]+24,ch[3]+24,ch[2]+24,ch[1]+24,ch[2]+24]
    for e in range(16):
        st=s0+int(e*beat/2*SR)
        if st>=N: break
        m=arp[e%8]; ln=int(1.2*SR); e1=min(N,st+ln); tt2=np.arange(e1-st)/SR
        f=mtof(m); w=(np.sin(2*np.pi*f*tt2)+0.3*np.sin(4*np.pi*f*tt2)*np.exp(-tt2*8))*np.exp(-tt2*4.5)*np.minimum(1,tt2/0.004)*0.045
        pan=0.35+0.3*((e%4)/3)
        L[st:e1]+=w*(1-pan); R[st:e1]+=w*pan
# simple stereo echo on everything for space
d=int(beat*0.75*SR)
L[d:]+=0.25*R[:-d]; R[d:]+=0.25*L[:-d]
# gentle lowpass (one-pole)
def lp(x,fc=4500):
    a=np.exp(-2*np.pi*fc/SR); y=np.empty_like(x); acc=0.0
    from scipy.signal import lfilter
    return lfilter([1-a],[1,-a],x)
try:
    L=lp(L);R=lp(R)
except Exception as e: print("no scipy",e)
fade=np.ones(N); fi=int(2*SR); fo=int(3*SR); fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
st=np.stack([L*fade,R*fade],1); st/=np.max(np.abs(st))*1.12
with wave.open("build/music.wav","wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes())
print("music",T)
