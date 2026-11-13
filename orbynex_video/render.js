const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const ROOT = __dirname;
const DATA = { timeline: JSON.parse(fs.readFileSync(ROOT + '/build/timeline.json')), script: JSON.parse(fs.readFileSync(ROOT + '/script.json')) };
async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  await page.addInitScript(d => { window.DATA = d; }, DATA);
  await page.goto('file://' + ROOT + '/index.html');
  await page.evaluate(() => window.READY);
  return page;
}
(async () => {
  const mode = process.argv[2];
  const browser = await chromium.launch();
  if (mode === 'preview') {
    const page = await openPage(browser);
    for (const t of process.argv.slice(3)) {
      await page.evaluate(t => window.render(t), +t);
      await page.screenshot({ path: `${ROOT}/build/prev_${t}.png` });
    }
  } else if (mode === 'seg') {
    const [f0, f1, out] = [+process.argv[3], +process.argv[4], process.argv[5]];
    const page = await openPage(browser);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = f0; f < f1; f++) {
      await page.evaluate(t => window.render(t), f / 30);
      const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((f - f0) % 600 === 0) console.log(out, f - f0, '/', f1 - f0);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
