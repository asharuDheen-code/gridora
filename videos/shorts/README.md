# Malayalam animated Shorts / Reels

Each folder is one 9:16 (1080x1920) short with Malayalam voiceover. Everything renders
in the cloud session, so nothing runs on your own computer.

## Make a new video
1. Copy `demo-01` to a new folder and edit `script.json`.
   Each scene has `say` (the voiceover), `title`, `sub`, `emoji` and an optional `num`.
2. Run these from that folder (voices: `ml-IN-MidhunNeural` male, `ml-IN-SobhanaNeural` female):
   - Voice + timeline: the Python steps in the commit history (edge-tts → `audio/`, `timeline.json`, `voice.wav`)
   - Frames: `node render.js 30`
   - Encode: `ffmpeg -framerate 30 -i frames/f%05d.jpg -i voice.wav -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -shortest -movflags +faststart out.mp4`

Keep each video at 30 seconds or less: a hook in the first 2 seconds, 3 quick points, then a call to action.
