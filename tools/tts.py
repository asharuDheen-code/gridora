import sys, ssl, asyncio, certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts, edge_tts.communicate as c
c._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
from edge_tts import SubMaker
async def main(text, out, srt, rate):
    com = edge_tts.Communicate(text, "ml-IN-MidhunNeural", rate=rate, boundary="WordBoundary")
    sm = SubMaker()
    with open(out, "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] in ("WordBoundary","SentenceBoundary"): sm.feed(ch)
    open(srt, "w").write(sm.get_srt())
asyncio.run(main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4] if len(sys.argv)>4 else "+3%"))
