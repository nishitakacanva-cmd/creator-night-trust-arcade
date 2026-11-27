const {chromium}=require('playwright'),fs=require('fs'),assert=require('assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
const errors=[],shots='output/playwright/polish/rides-';let p;
try{
p=await browser.newPage({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});
p.on('pageerror',e=>{errors.push(String(e));console.log('ERROR',String(e))});p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
await p.goto((process.argv[2]||'http://127.0.0.1:8130/')+'?test=1&q=low&v=3.3.1',{waitUntil:'domcontentloaded'});
await p.waitForFunction(()=>window.TrustArcade?.ready,null,{timeout:120000});await p.evaluate(()=>Promise.all([TrustArcade.modelsReady,brandArtReady]));
await p.locator('#btnStart').waitFor();await p.evaluate(()=>TrustArcade.start({sound:false}));
const tick=async(n=3,dt=.05)=>p.evaluate(([n,dt])=>TrustArcade.tick(n,dt,true),[n,dt]);
const jump=async id=>{await p.evaluate(async id=>{TrustArcadeBridge.jumpToZone(id);for(let i=0;i<20;i++){TrustArcade.tick(1,.04,false);await Promise.resolve()}TrustArcade.tick(2,.03,true)},id);await p.waitForTimeout(350)};
const snap=async name=>{await tick();await p.screenshot({path:shots+name+'.jpg',quality:78})};
for(const id of ['fashion','beauty','food','fitness','travel','education','collab','fall','pit','coaster']){
await jump(id);await snap(id);
if(['collab','fall','pit','coaster'].includes(id)){
await p.locator('#rideLaunch').click();await snap(id+'-open');
if(id==='collab'){
await p.locator('#collabPosition').fill('70');await p.locator('#collabDrop').click();await p.locator('[data-decision]').first().waitFor();await p.locator('[data-decision]').first().click();
assert.ok(await p.evaluate(()=>JSON.parse(sessionStorage.getItem('trust_arcade_v3_field_notes')).collab));await snap('collab-done');
}else if(id==='fall'){
await p.locator('#startFall').click();await tick(40);await snap('fall-active');await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>TrustRides.active),null);await tick();assert.equal(await p.evaluate(()=>TrustArcade.S.ui.modal),null);
}else if(id==='pit'){await p.locator('#dunkProof').click();await p.locator('#nextDunk').waitFor();await snap('pit-done')}
else{await p.locator('#startCoaster').click();await tick(190);await snap('coaster-active');await p.locator('#exitRide').click();assert.equal(await p.evaluate(()=>TrustRides.active),null)}
if(await p.locator('#dlgRide').isVisible())await p.keyboard.press('Escape');
}
}
await jump('chai');await p.locator('#btnView').click();await tick();assert.equal(await p.evaluate(()=>TrustArcade.view()),true);await snap('thirdperson');await p.locator('#btnView').click();
await jump('market');await snap('merch');await jump('travel');
await p.evaluate(()=>{const a=TrustArcade,g=a.REFS.pav.travel.group,v=g.localToWorld(g.position.clone().set(1.9,0,3.5)),t=g.localToWorld(g.position.clone().set(1.9,1.975,1.4));a.teleport(v.x,v.z);a.lookAt(t.x,t.y,t.z);a.tick(3,.03,true)});await snap('travel-close');

await jump('chai');await p.locator('#socialAction').click();await p.locator('#drinkChoices button').last().click();await p.locator('#payDrink').click();
assert.ok((await p.locator('#drinkStatus').innerText()).includes('chai'));
assert.equal(await p.evaluate(()=>+sessionStorage.getItem('creator-night-wallet')),470);await snap('chai-order');await p.keyboard.press('Escape');
await jump('hub');await p.locator('#btnView').click();await tick();await snap('hub-third');
await p.locator('#contentCapture').click();await p.locator('#photoOut').evaluate(async el=>el.decode());await p.waitForTimeout(950);await snap('heart-portrait');await p.keyboard.press('Escape');
await p.locator('#btnView').click();
await jump('stage');assert.equal(await p.locator('#subs').isVisible(),false);await p.locator('#listenPanel').click();await tick(350);await snap('panel-listening');
await p.locator('#askPanel').click();await p.locator('#panelQuestions button').first().click();assert.ok((await p.locator('#panelResponse').innerText()).length>20);await snap('panel-answer');await p.keyboard.press('Escape');await tick();await p.locator('#listenPanel').click();await tick();assert.equal(await p.locator('#subs').isVisible(),false);
await p.locator('#btnFireworks').click();await tick(30);await snap('fireworks');await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>TrustRides.active),null);
await jump('maze');
for(const index of [0,1,0]){await p.locator('#mazeGuide button').nth(index).click();await p.evaluate(async()=>{for(let i=0;i<32;i++){TrustArcade.tick(1,.05,false);await Promise.resolve()}TrustArcade.tick(2,.03,true)});}
assert.equal(await p.evaluate(()=>['core1','core2','core3'].every(id=>TrustArcade.S.gates[id].passed)),true);await snap('maze-cleared');
console.log('EXTRA FEATURES PASS');
await p.setViewportSize({width:390,height:844});
for(const id of ['collab','fall','pit','coaster']){await jump(id);await p.locator('#rideLaunch').click();await snap('mobile-'+id);await p.keyboard.press('Escape')}
assert.deepEqual(errors,[]);console.log('RIDES PASS',await p.evaluate(()=>TrustArcade.stats()));
}catch(e){console.log(e);if(p)await p.screenshot({path:shots+'failure.jpg'}).catch(()=>{});process.exitCode=1}finally{await browser.close()}
})();
