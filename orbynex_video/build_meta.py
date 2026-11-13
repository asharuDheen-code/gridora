import json, re
T=json.load(open("build/timeline.json")); S=json.load(open("script.json"))
def ts(x):
    ms=int(round(x*1000)); h,ms=divmod(ms,3600000); m,ms=divmod(ms,60000); s,ms=divmod(ms,1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"
# Malayalam: caption chunks like on screen
chunks=[]
for s in T["scenes"]:
    for L in s["lines"]:
        cur=[];ln=0
        def push():
            global cur,ln
            if cur: chunks.append(cur)
            cur=[];ln=0
        for i,w in enumerate(L["words"]):
            if ln+len(w["w"])>40 and cur: push()
            cur.append(w); ln+=len(w["w"])+1
            if re.search(r"[,.?]$",w["w"]) and ln>22 and i<len(L["words"])-2: push()
        push()
out=[]
for i,k in enumerate(chunks):
    a=k[0]["t0"]; b=k[-1]["t1"]+0.3
    if i+1<len(chunks): b=min(b,chunks[i+1][0]["t0"]-0.02)
    out.append(f"{i+1}\n{ts(a)} --> {ts(b)}\n{' '.join(w['w'] for w in k)}\n")
open("deliver/orbynex_ai_video_ads_ml.srt","w").write("\n".join(out))
# English: one cue per line
out=[];n=0
for s in T["scenes"]:
    for L in s["lines"]:
        n+=1; out.append(f"{n}\n{ts(L['start'])} --> {ts(L['end']+0.25)}\n{L['en']}\n")
open("deliver/orbynex_ai_video_ads_en.srt","w").write("\n".join(out))
# chapters
st={s["id"]:s["start"] for s in T["scenes"]}
def mmss(x): x=int(x); return f"{x//60:02}:{x%60:02}"
ch="\n".join(f"{mmss(0 if i==0 else st[c['scene']])} {c['title']}" for i,c in enumerate(T["chapters"]))
prompts=[s for s in S["scenes"] if s["kind"]=="prompt"]
pl="\n".join(f"{p['n']}. {p['style']}: \"{p['prompt']}\"" for p in prompts)
desc=f"""Agencies charge ₹15,000–25,000 for one video ad. Here's how to make yours for ₹0 during Higgsfield's 3-day free trial, inside Claude, using the Higgsfield connector. Full step-by-step setup in Malayalam, plus the catch you must know (auto-renew) and 5 ready-to-copy prompts.

⚠️ Important
• Claude Fable 5.2 launched on 9 Nov 2026. Using it needs a paid Claude plan.
• Higgsfield's 72-hour (3-day) free trial is for NEW users. A card may be required.
• The trial AUTO-RENEWS to a paid Higgsfield plan (Ultra, 40% off the first month) after 72 hours unless you cancel. Cancel auto-renew right after signing up. The trial stays active for the 3 days.
• Higgsfield's own help page says connector generations may still deduct credits. Test one short generation and check your credits first.
• The offer has no published end date. It can end anytime.

🔗 Connector URL (copy this)
https://mcp.higgsfield.ai/mcp
Free trial page: https://higgsfield.ai/mcp

🛠 Setup steps
1. Open Claude (web or app) → Customize → Connectors
2. Add custom connector → Name: Higgsfield → URL: https://mcp.higgsfield.ai/mcp
3. Connect → sign in to Higgsfield → Allow permissions
4. Start the free trial at higgsfield.ai/mcp
5. Right away: Higgsfield account → Subscription / Billing → cancel auto-renew
6. In Claude, just ask, e.g. "Make a 10-second vertical ad for my bakery"

✍️ 5 ready-to-copy prompts
{pl}

💡 Tips: use 9:16 for Reels/Shorts, keep clips 5–10 s, download each clip, join clips in any editor, add your logo and phone number.

⏱ Chapters
{ch}

📞 Need video ads or AI automation for your business?
Orbynex: https://orbynex.io
Phone / WhatsApp: 7012937250

Subscribe for more AI tutorials in Malayalam, and comment your doubts below.

Disclaimer: On-screen app screens are simple illustrations, not real screenshots. Offers, prices and menu names can change. Check the current terms on Higgsfield's and Claude's sites before you sign up.

#AIVideo #Malayalam #Claude #Higgsfield #VideoAds #AITools #Orbynex
"""
title="Make AI Video Ads for ₹0 with Claude + Higgsfield (3-Day Free Trial) | Full Setup (Malayalam)"
tags=["ai video ads","claude","claude fable 5.2","higgsfield","higgsfield mcp","claude connector","ai video malayalam","malayalam tutorial","free ai video","ai ads for small business","video ad kerala","reels ads","youtube shorts ai","ugc ads ai","ai automation","orbynex","claude ai malayalam","mcp connector","ai marketing malayalam","free trial ai video"]
open("deliver/youtube_metadata.txt","w").write(f"TITLE\n{title}\n\nDESCRIPTION\n{desc}\nTAGS\n{', '.join(tags)}\n")
print(title, len(title)); print(ch); print("tags chars", len(", ".join(tags)))
