// Usage: node render.js [fps] [onlyPreviewSeconds...]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
  const fps=+(process.argv[2]||30); const preview=process.argv.slice(3).map(Number);
  const tl=JSON.parse(fs.readFileSync('timeline.json','utf8'));
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+__dirname+'/scene.html'); await p.evaluate(tl=>setup(tl),tl);
  await p.evaluate(()=>document.fonts.ready);
  if(preview.length){for(const s of preview){await p.evaluate(t=>render(t),s);await p.screenshot({path:`preview_${s}.png`});}await b.close();return;}
  fs.mkdirSync('frames',{recursive:true});
  const n=Math.ceil(tl.total*fps);
  for(let f=0;f<n;f++){await p.evaluate(t=>render(t),f/fps);await p.screenshot({path:`frames/f${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});}
  await b.close(); console.log('frames',n);
})();
