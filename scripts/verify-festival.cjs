const { chromium } = require('playwright');
const fs = require('fs');
(async()=>{
const mode=process.argv[2]||'desktop', url=process.argv[3]||'http://127.0.0.1:8127/', mobile=mode.includes('mobile'), before=mode==='before';
const out=process.env.QA_OUTPUT || 'output/playwright/polish';fs.mkdirSync(out,{recursive:true});
const e=[],req=[],counts={}, checks={};
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
try {
const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile,ignoreHTTPSErrors:true});page.setDefaultTimeout(20000);
page.on('pageerror',err=>e.push(String(err)));page.on('console',m=>{if(m.type()==='error')e.push(m.text())});page.on('requestfailed',r=>{if(!r.failure()?.errorText.includes('ABORTED'))req.push([r.failure()?.errorText,r.url()])});page.on('response',r=>{if(r.status()>=400)req.push([r.status(),r.url()])});
await page.goto(url+'?test=1&q=low',{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForFunction(()=>window.TrustArcade?.ready,null,{timeout:180000});checks.readyMs=await page.evaluate(()=>Math.round(performance.now()));await page.evaluate(()=>Promise.all([TrustArcade.modelsReady,window.brandArtReady]));
await page.locator('#btnStart').waitFor({state:'visible'}); if(!before)await page.screenshot({path:out+'/'+mode+'-welcome.jpg',quality:75});
await page.evaluate(()=>TrustArcade.start({sound:false,consent:false}));
const tick=(draw=true)=>page.evaluate(draw=>TrustArcade.tick(4,.03,draw),draw);
async function jump(id){await page.evaluate(async id=>{TrustArcadeBridge.jumpToZone(id);for(let i=0;i<22;i++){TrustArcade.tick(1,.033,false);await Promise.resolve()}TrustArcade.tick(1,.033,true)},id);await page.waitForTimeout(270)}
const snap=async name=>page.screenshot({path:out+'/'+mode+'-'+name+'.jpg',quality:72,timeout:60000});
const stats=async()=>page.evaluate(()=>TrustArcade.stats());
for(const q of ['high','medium','low']){
  const fps=await page.evaluate(q=>{
    TrustArcade.quality(q);TrustArcade.tick(4,.016,true);
    const gl=document.querySelector('#stage canvas').getContext('webgl2'),pixel=new Uint8Array(4);
    const sync=()=>gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
    sync();const t=performance.now();
    for(let i=0;i<5;i++){TrustArcade.tick(1,.016,true);sync()}
    return +(5000/(performance.now()-t)).toFixed(1)
  },q);
  counts[q]={...await stats(),sampleFps:fps};console.log(mode,q,fps)
}
if(!before) {
for(const id of ['entry','maze','hub','fashion','beauty','food','fitness','travel','education','stage','market','photo','chai','wall','freebies','lounge','arcade']){
 await jump(id); await snap(id);
 if(['fashion','beauty','food','fitness','travel','education','stage'].includes(id)){
  await page.evaluate(id=>TrustLabs.openLab(id),id);
  await page.locator('#labBody img').first().evaluate(img=>img.decode().catch(()=>{})).catch(()=>{});
  await snap(id+'-lab');
  await page.keyboard.press('Escape');
 }
}
}
if(!before){const assert=require('node:assert/strict');
await page.addScriptTag({path:process.env.AXE_PATH || require.resolve('axe-core/axe.min.js')});
await jump('travel');
await page.locator('#labLaunchBtn').click();
const range=page.locator('#travelRange');await range.focus();await page.keyboard.press('End');
assert.equal(await range.inputValue(),'100');assert.equal(await range.evaluate(el=>el===document.activeElement),true);
await page.locator('[data-tdec]').first().click();assert.equal(await page.evaluate(()=>!!TrustArcade.S.stamps.travel),true);
checks.axeTravel=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
await page.keyboard.press('Escape');await jump('fitness');await page.locator('#labLaunchBtn').click();
await page.locator('[data-fcl="universal"]').click();assert.ok((await page.locator('.lab-preview-box').innerText()).includes('Exceeds'));
await page.locator('[data-fcl="universal"]').click();await page.locator('#fitResetBtn').click();assert.ok((await page.locator('.lab-preview-box').innerText()).includes('No claims'));
await page.keyboard.press('Escape');await jump('market');await page.locator('#socialAction').click();
await page.locator('#giftDisclosure').uncheck();assert.equal(await page.locator('#previewStory').isDisabled(),true);await page.locator('#giftDisclosure').check();await page.locator('#previewStory').click();
await snap('market-story');checks.market=await page.locator('#storyStatus').innerText();await page.keyboard.press('Escape');
await jump('wall');await page.locator('#socialAction').click();await page.locator('#trustNoteText').fill('Show me what you actually tried.');await page.locator('#trustNoteForm button[type=submit]').click();
checks.note=await page.evaluate(()=>localStorage.getItem('creator-night-trust-wall-v1'));await snap('note');await page.keyboard.press('Escape');
await jump('freebies');await page.locator('#socialAction').click();await page.locator('#clawDrop').click();await page.waitForFunction(()=>document.querySelector('#freebieResult').textContent.startsWith('You picked'));await snap('claw');await page.keyboard.press('Escape');
await jump('chai');await page.locator('#socialAction').click();await page.locator('#drinkChoices button').first().click();await snap('cafe');await page.keyboard.press('Escape');
await jump('photo');await page.locator('#socialAction').click();await page.locator('#studioPoses button').nth(1).click();
assert.equal(await page.locator('#studioPreview canvas').count(),1);await snap('studio');await page.locator('#takeMyPhoto').click();
await page.evaluate(async()=>{for(let i=0;i<190;i++){TrustArcade.tick(1,.04,false);await Promise.resolve()}});
await page.locator('#photoOut').waitFor({state:'visible'});checks.print=await page.locator('#photoOut').evaluate(async el=>{await el.decode();return [el.naturalWidth,el.naturalHeight]});await page.waitForTimeout(900);await snap('print');await page.keyboard.press('Escape');
await page.locator('#btnLang').click();await jump('travel');await page.locator('#labLaunchBtn').click();assert.ok((await page.locator('#labTitle').innerText()).includes('तस्वीर'));await snap('hindi-lab');await page.keyboard.press('Escape');
await page.locator('#btnMap').click();checks.map=await page.locator('#mapList button').count();await snap('map');await page.keyboard.press('Escape');await page.locator('#btnPass').click();await snap('passport');await page.keyboard.press('Escape');
await page.locator('#btnLang').click();await page.locator('#btnDJ').click();
await page.locator('#djPlayBtn').click();await page.waitForFunction(()=>TrustDJ.playing && TrustArcade.PEOPLE_BY.festival_dj.base==='dance');
await page.locator('#djPlayBtn').click();await page.waitForFunction(()=>!TrustDJ.playing && TrustArcade.PEOPLE_BY.festival_dj.base==='idle');await page.locator('#djClose').click();checks.audio=true;
const gate=await page.evaluate(()=>{const a=TrustArcade,r=a.REFS.gates.core1,old=a.S.meter;r.opts.find(i=>!i.good).screen.mesh.userData.interact.onClick();const wrong=a.S.meter;r.opts.find(i=>i.good).screen.mesh.userData.interact.onClick();const after=a.S.meter;r.opts.find(i=>i.good).screen.mesh.userData.interact.onClick();return old===wrong && after===a.S.meter && !!a.S.gates.core1.passed});assert.ok(gate);checks.gates=gate;
await page.evaluate(()=>{for(const button of ['a1','z0','leave'])TrustArcade.press('exit_kiosk',button)});await page.locator('#dlgEnd').waitFor({state:'visible'});await snap('exit-summary');
checks.horizontalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
}
checks.models=await page.evaluate(()=>TrustArcade.modelStatus);checks.art=await page.evaluate(()=>window.brandArtReady);
console.log(JSON.stringify({mode,checks,counts,e,req}));fs.writeFileSync(out+'/'+mode+'.json',JSON.stringify({checks,counts,e,req},null,2));if(e.length || req.length || checks.models.skipped || checks.axeTravel?.length || checks.horizontalOverflow)throw Error('Review browser results in '+out);
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
