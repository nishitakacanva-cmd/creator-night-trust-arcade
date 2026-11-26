/* Physical content moments and a private, browser-local trust wall. No posting API. */
(() => {
  let ctx, lastFocus, photoTimer, clawBusy=false, clawX=50, activeBrand;
  const key='creator-night-trust-wall-v1', sampleKey='creator-night-samples-v1';
  const $=id=>document.getElementById(id);
  let notes=[]; try { notes=JSON.parse(localStorage.getItem(key)||'[]').filter(n=>typeof n==='string').map(n=>n.slice(0,160)).slice(-12); } catch{}
  const examples=['Tell me what you actually tried.','Show the gift. Keep the honest opinion.','A beautiful post can still need context.'];
  const brands=[
    {name:'Kay Beauty',cat:'Beauty',color:'#e7bbba',x:-9.5,z:-12.3,rot:.38,source:'https://www.kaybeauty.com/',item:'a makeup mini'},
    {name:'Plum',cat:'Beauty',color:'#b8a4cb',x:-10.8,z:-17.4,rot:.8,source:'https://plumgoodness.com/',item:'a skincare sample'},
    {name:'SNITCH',cat:'Fashion',color:'#ddd1b7',x:9.5,z:-12.3,rot:-.38,source:'https://www.snitch.com/',item:'a fabric swatch kit'},
    {name:'MOKOBARA',cat:'Travel',color:'#dccb6c',x:10.8,z:-17.4,rot:-.8,source:'https://mokobara.com/',item:'a luggage tag'},
    {name:'Swiss Beauty',cat:'Beauty',color:'#dbb3c7',x:15.4,z:-16.3,rot:-.8,source:'https://swissbeauty.in/',item:'a lip colour sample'},
    {name:'Paper Boat',cat:'Food & drinks',color:'#e8b176',x:-15.4,z:-11.8,rot:.65,source:'https://www.paperboatdrinks.com/',item:'a tasting drink'},
    {name:'Blue Tokai',cat:'Coffee',color:'#a3bfc9',x:15.4,z:-11.8,rot:-.65,source:'https://bluetokaicoffee.com/',item:'a coffee taster'},
    {name:'Boldfit',cat:'Fitness',color:'#b1c4a2',x:-15.4,z:-21,rot:.65,source:'https://www.boldfit.com/',item:'a grip-band trial'},
    {name:'upGrad',cat:'Education',color:'#dfa29b',x:15.4,z:-21,rot:-.65,source:'https://www.upgrad.com/',item:'a learning workbook'}
  ];
  function dialog(id,kicker,title,body){
    const el=document.createElement('div');el.id=id;el.className='modal hidden';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby',id+'Title');
    el.innerHTML=`<div class="card"><button class="x" aria-label="Close">×</button><p class="social-kicker">${kicker}</p><h2 id="${id}Title">${title}</h2>${body}</div>`;
    document.body.append(el);el.querySelector('.x').onclick=()=>ctx.closeModal(id);el.addEventListener('click',e=>{if(e.target===el&&!clawBusy&&!ctx.Booth.busy)ctx.closeModal(id)});return el;
  }
  function open(id){lastFocus=document.activeElement;ctx.openModal(id);$(id).querySelector('button,textarea')?.focus()}
  function textScreen(name,w,h,draw,parent,x,y,z,ry=0,interactive=false){const s=new ctx.CanvasScreen({name,w,h,ppm:220,interactive,draw});s.mesh.position.set(x,y,z);s.mesh.rotation.y=ry;parent.add(s.mesh);return s;}
  function sign(parent,x,y,z,w,title,sub,color='#d5b7bf',ry=0){return textScreen('social_'+title,w,.72,(c,W,H)=>{c.fillStyle='#241c2b';c.fillRect(0,0,W,H);ctx.drawMark(c,40,H/2,23);ctx.txt(c,title,80,H*.43,H*.26,{w:800,color,maxW:W-92});ctx.txt(c,sub,80,H*.76,H*.13,{color:'#fff0dc',maxW:W-90});},parent,x,y,z,ry);}
  function openStudio(){open('dlgStudio');$('studioStatus').textContent='Pick a pose, then I’ll count you in. Your avatar moves to the mark automatically.'}
  function buildPhoto(){
    const {THREE,REFS,Person}=ctx,g=REFS.booth;
    sign(g,0,4.35,1.6,3.6,'Instagram','CREATOR NIGHT · PHOTO STUDIO');
    const pos=g.localToWorld(new THREE.Vector3(-1.3,0,1.5));
    new Person({key:'photographer',name:'Dev · Photographer',model:'Male_Adult_08',x:pos.x,z:pos.z,ry:Math.PI/2,role:'photographer',interact:openStudio});
    sign(g,-1.3,2.3,1.5,1.3,'Dev','CLICK TO TAKE YOUR PHOTO');
    const pl=ctx.mesh(ctx.boxGeo(1.05,.8,.55),ctx.MAT.cream,g,2.4,.5,1.85);pl.name='instant_print_station';
    ctx.mesh(ctx.boxGeo(.75,.04,.03),ctx.MAT.black,g,2.4,.83,2.14);
    sign(g,2.4,1.15,2.15,1.1,'PRINT BAR','YOUR MOMENT, ON PAPER');
    dialog('dlgStudio','Instagram photo studio','Hi, I’m Dev. Ready for your photo?',`<p class="social-copy">No running back to the camera. I’ll put your avatar on the mark and count down from three.</p><div class="btnrow" id="studioPoses"></div><div class="btnrow"><button class="btn pri" id="takeMyPhoto">Take my photo</button></div><p id="studioStatus" class="social-status" role="status"></p><p class="fine">Your photo stays here until you choose to download it.</p>`);
    ctx.Booth.poses.forEach((p,i)=>{const b=document.createElement('button');b.className='btn';b.textContent=ctx.L(p[1]);b.setAttribute('aria-pressed',String(i===ctx.Booth.pose));b.onclick=()=>{ctx.Booth.pose=i;$('studioPoses').querySelectorAll('button').forEach((x,j)=>x.setAttribute('aria-pressed',String(i===j)))};$('studioPoses').append(b)});
    $('takeMyPhoto').onclick=async()=>{if(ctx.Booth.busy)return;$('takeMyPhoto').disabled=true;let count=3;$('studioStatus').textContent='On your mark… 3';photoTimer=setInterval(()=>{$('studioStatus').textContent=--count>0?'Hold your pose… '+count:'Printing your photo…'},1000);await ctx.Booth.shoot();photoFinished()};
  }
  let wallScreen;
  function drawWall(c,W,H){c.fillStyle='#c8ad91';c.fillRect(0,0,W,H);ctx.txt(c,'What does trust mean to you?',W/2,65,40,{w:800,align:'center',color:'#2b2232'});ctx.txt(c,'TAKE A NOTE. LEAVE YOUR OWN WORDS.',W/2,103,18,{align:'center',color:'#453548'});
    const all=[...examples.map(t=>({t,example:true})),...notes.map(t=>({t}))].slice(-12);all.forEach((n,i)=>{const x=30+i%4*(W/4),y=145+Math.floor(i/4)*(H-170)/3,nw=W/4-45,nh=(H-195)/3;c.save();c.translate(x+nw/2,y+nh/2);c.rotate((i%3-1)*.04);c.fillStyle=['#ffe4a1','#edbad4','#d2e5c1'][i%3];c.shadowColor='#382a2940';c.shadowBlur=6;c.shadowOffsetY=5;c.fillRect(-nw/2,-nh/2,nw,nh);c.shadowBlur=0;c.shadowOffsetY=0;c.fillStyle='#382b3c';c.font='22px "Segoe Print", cursive';const words=n.t.split(/\s+/);let line='',ly=-nh/2+35;for(const word of words){const next=line+word+' ';if(c.measureText(next).width>nw-24){c.fillText(line,-nw/2+12,ly);ly+=28;line=word+' '}else line=next}c.fillText(line,-nw/2+12,ly);ctx.txt(c,n.example?'EXAMPLE':'YOUR NOTE',-nw/2+12,nh/2-15,12,{color:'#584253'});c.restore()});}
  function renderNotes(){const list=$('trustNotes');list.replaceChildren();[...examples.map(t=>({t,example:true})),...notes.map(t=>({t}))].forEach(n=>{const d=document.createElement('div');d.className='social-note';d.textContent=n.t;const small=document.createElement('small');small.textContent=n.example?'Example note':'Your note · this browser';d.append(small);list.append(d)});wallScreen?.invalidate()}
  function buildWall(){
    const {WORLD,MAT,mesh,boxGeo,TRAVEL}=ctx;
    mesh(boxGeo(4.65,2.95,.16),MAT.woodSlat,WORLD,-15,1.72,24.7);
    for(const x of [-17,-13])mesh(boxGeo(.09,2.9,.14),MAT.alu,WORLD,x,1.45,24.7);
    wallScreen=textScreen('trust_note_wall',4.4,2.7,drawWall,WORLD,-15,1.75,24.8);
    ctx.setInteractable(wallScreen.mesh,{cue:()=> 'Leave a trust note',onClick:()=>{renderNotes();open('dlgTrustWall')},reach:5,outline:false});
    ctx.colBox(-17.35,24.55,-12.65,24.9,'trustWall');TRAVEL.wall={x:-15,z:28,yaw:0};
    dialog('dlgTrustWall','The trust wall','What does trust mean to you?',`<p class="social-copy">Take a Post-it. Leave one thing that makes a creator worth trusting.</p><div id="trustNotes" class="social-notes"></div><form id="trustNoteForm" class="social-form"><label for="trustNoteText">Your note · up to 160 characters</label><textarea id="trustNoteText" maxlength="160" required placeholder="I trust a creator when…"></textarea><div class="btnrow"><button class="btn pri" type="submit">Pin my note</button><button class="btn" type="button" id="clearTrustNotes">Clear my notes</button></div></form><p id="trustNoteStatus" class="social-status" role="status"></p><p class="fine">Saved on this browser only. Example notes are labelled. No public upload.</p>`);
    $('trustNoteForm').onsubmit=e=>{e.preventDefault();const t=$('trustNoteText').value.trim();if(!t)return;notes=[...notes,t].slice(-12);try{localStorage.setItem(key,JSON.stringify(notes));$('trustNoteStatus').textContent='Pinned to the wall. Saved in this browser.'}catch{$('trustNoteStatus').textContent='Pinned for this visit. Browser storage is unavailable.'} $('trustNoteText').value='';renderNotes()};
    $('clearTrustNotes').onclick=()=>{notes=[];try{localStorage.removeItem(key)}catch{}renderNotes();$('trustNoteStatus').textContent='Your notes were cleared.'};renderNotes();
  }
  function buildDrinks(){const {THREE,REFS,MAT,mesh,std}=ctx;const g=REFS.chai;
    const shape=[new THREE.Vector2(.0,0),new THREE.Vector2(.075,0),new THREE.Vector2(.08,.02),new THREE.Vector2(.09,.22),new THREE.Vector2(.084,.23),new THREE.Vector2(.075,.02)];
    const cup=new THREE.LatheGeometry(shape,16);for(let i=0;i<3;i++){const x=2.4+i*.38;mesh(cup,MAT.glass,g,x,1.18,-2.4);mesh(new THREE.CylinderGeometry(.074,.063,.17,16),std(['#8d9d53','#573c2d','#b57b40'][i],{roughness:.45}),g,x,1.27,-2.4)}
    sign(g,2.6,3.95,-1.65,3.6,'Caffeine Corner','MATCHA · COFFEE · CHAI');
    dialog('dlgCaffeine','A little pause','What’s your caffeine mood?',`<p class="social-copy">Matcha, cold brew or adrak chai. Pick your cup and take a moment away from the feed.</p><div class="btnrow" id="drinkChoices"></div><p id="drinkStatus" role="status" class="social-status"></p><p class="fine">A virtual refreshment. No purchase or personal details needed.</p>`);
    // Register the extra dialog with the shared movement freeze.
    const openDrink=()=>{lastFocus=document.activeElement;ctx.openModal('dlgCaffeine');$('dlgCaffeine').querySelector('button').focus()};
    ['Iced matcha','Cold brew','Adrak chai'].forEach((label,i)=>{const b=document.createElement('button');b.className='btn';b.textContent=label;b.onclick=()=>{$('drinkStatus').textContent=label+' is ready. Find a seat and enjoy the evening.';ctx.Sound.play('select')};$('drinkChoices').append(b)});
    const menu=g.children.find(x=>x.name==='social_Caffeine Corner');if(menu)ctx.setInteractable(menu,{cue:()=> 'Pick your caffeine',onClick:openDrink,reach:5});
  }
  function nearestBrand(x,z) {
    return brands.reduce((near,b) => Math.hypot(x-b.x,z-b.z)<Math.hypot(x-near.x,z-near.z)?b:near);
  }
  function openMarket(brand){activeBrand=brand;$('marketBrand').textContent=brand.name+' · '+brand.cat;$('marketItem').textContent='Try '+brand.item+'. Make a story that tells people what you actually know.';$('storyText').value='I received '+brand.item+' from '+brand.name+'. Here’s my first impression — I haven’t tested it long term.';$('giftDisclosure').checked=true;$('storyStatus').textContent='';updateStory();open('dlgMarket')}
  function updateStory(){ $('storyDisclosure').textContent=$('giftDisclosure').checked?'Gifted · '+activeBrand.name:'Disclosure hidden';$('storyWords').textContent=$('storyText').value;$('previewStory').disabled=!$('giftDisclosure').checked||!$('storyText').value.trim();
    $('storyStatus').textContent=!$('giftDisclosure').checked?'Add the Gifted label so viewers know where the sample came from.':!$('storyText').value.trim()?'Write your own first impression before collecting the sample.':'';}
  function dressCounter(g, brand, accent) {
    const {THREE, MAT, Merger, rboxGeo, torusGeo} = ctx;
    const parts = new Merger();
    const at = (x,y,z) => new THREE.Matrix4().makeTranslation(x,y,z);
    const round = (mat,w,h,d,x,y,z,r=.025) => parts.add(rboxGeo(w,h,d,r),mat,at(x,y,z));
    // Fluted timber fronts, edge lighting and a woven scalloped awning share a batch per finish.
    for (let i=0;i<26;i++) parts.box(MAT.woodSlat,.045,.76,.045,-1.36+i*.109,.60,.844);
    parts.box(MAT.bulb,2.82,.014,.023,0,1.107,.87);
    for (let i=0;i<14;i++) round(i%2 ? MAT.cream : accent,.232,.19,.07,-1.5+i*.231,2.80,1.09,.035);
    const top=1.181;
    if (brand.cat==='Coffee' || brand.cat==='Food & drinks') {
      for (let i=0;i<3;i++){
        const x=-.72+i*.29;
        parts.cyl(MAT.cream,.114,.071,.18,x,top+.09,.52,24);
        parts.cyl(brand.cat==='Coffee'?MAT.woodSlat:accent,.101,.101,.006,x,top+.18,.52,24);
        if(brand.cat==='Coffee') parts.add(torusGeo(.044,.010,6,14),MAT.cream,at(x+.108,top+.10,.52));
      }
    } else if (brand.cat==='Fashion' || brand.cat==='Education') {
      for(let i=0;i<4;i++) {
        round(i%2?accent:MAT.cream,.55,.045,.36,-.36+i*.015,top+.025+i*.045,.52);
        parts.box(MAT.woodSlat,.012,.013,.32,-.59+i*.015,top+.05+i*.045,.52);
      }
      if(brand.cat==='Education') { round(MAT.metal,.57,.028,.37,.52,top+.014,.48);round(MAT.black,.57,.31,.025,.52,top+.18,.31); }
    } else if (brand.cat==='Travel') {
      for(const x of [-.43,.23]){
        round(accent,.36,.45,.18,x,top+.225,.51,.056);
        for(let j=0;j<5;j++) round(MAT.cream,.009,.34,.009,x-.12+j*.06,top+.22,.602,.003);
        round(MAT.metal,.14,.025,.03,x,top+.47,.51);
      }
    } else if(brand.cat==='Fitness') {
      for(let i=0;i<3;i++)parts.add(torusGeo(.14-i*.021,.018,8,24),i%2?accent:MAT.black,at(-.48+i*.22,top+.15,.48));
      parts.cyl(MAT.metal,.065,.072,.29,.5,top+.145,.5);parts.cyl(MAT.black,.045,.045,.035,.5,top+.307,.5);
    } else {
      const tones=[MAT.cream,accent,MAT.black];
      for(let i=0;i<3;i++){
        const x=-.70+i*.24, h=.13+i*.045;
        parts.cyl(tones[i],.057,.061,h,x,top+h/2,.48,18);
        parts.cyl(MAT.alu,.046,.051,.035,x,top+h+.017,.48,16);
        parts.cyl(accent,.027,.034,.068,x,top+h+.068,.48,14);
      }
      round(MAT.black,.43,.033,.26,.55,top+.017,.52);
      for(let i=0;i<6;i++)parts.cyl(tones[i%3],.045,.045,.01,.42+i%3*.123,top+.04,.456+Math.floor(i/3)*.12,16);
    }
    parts.build(g,{name:'market_counter_details',shadow:false});
  }
  function buildMarket(){const {THREE,WORLD,MAT,mesh,boxGeo,cylGeo,std,Person}=ctx;
    dialog('dlgMarket','Creator market · concept stalls','Make something worth trusting',`<h3 id="marketBrand"></h3><p id="marketItem" class="social-copy"></p><form class="social-form" id="marketForm"><label for="storyText">Your first-impression story</label><textarea id="storyText" maxlength="250"></textarea><label class="check"><input id="giftDisclosure" type="checkbox" checked>Keep “Gifted” visible, before people tap or expand.</label><div class="story-preview"><span class="disclosure" id="storyDisclosure"></span><p id="storyWords"></p><small>CONCEPT PREVIEW · NO REAL BRAND PARTNERSHIP</small></div><p class="fine">Describe your own experience. Skip results you cannot support. A free sample doesn’t buy a positive review.</p><div class="btnrow"><button class="btn pri" id="previewStory" type="submit">Preview story & collect demo sample</button><button class="btn" id="marketPhoto" type="button">Make a content photo</button></div></form><p id="storyStatus" class="social-status" role="status"></p><p class="fine">Educational concept. Nothing is sent to Instagram. Samples are virtual.</p>`);
    $('storyText').oninput=updateStory;$('giftDisclosure').onchange=updateStory;
    $('marketForm').onsubmit=e=>{e.preventDefault();if(!$('giftDisclosure').checked||!$('storyText').value.trim())return;let samples=[];try{samples=JSON.parse(sessionStorage.getItem(sampleKey)||'[]')}catch{}if(!samples.includes(activeBrand.name))samples.push(activeBrand.name);try{sessionStorage.setItem(sampleKey,JSON.stringify(samples))}catch{}$('storyStatus').textContent='Story preview ready. '+activeBrand.item+' added to your demo sample bag. No real post was made.';ctx.Sound.play('stamp')};
    $('marketPhoto').onclick=()=>{ctx.Booth.last=ctx.capture();ctx.showPhoto(ctx.Booth.last)};
    brands.forEach((b,i)=>{const g=new THREE.Group();g.name='market_'+b.name;g.position.set(b.x,0,b.z);g.rotation.y=b.rot;WORLD.add(g);
      const colored=std(b.color,{roughness:.7}),shell=new ctx.Merger();
      shell.box(MAT.deck,3.05,.13,2.15,0,.065,0);
      shell.box(colored,2.9,1,.65,0,.62,.5);shell.box(MAT.cream,3,.06,.75,0,1.15,.5);
      shell.box(colored,2.9,1.55,.09,0,1.6,-.8);
      for(const x of [-1.46,1.46])shell.cyl(MAT.alu,.035,.035,2.8,x,1.4,0,8);
      shell.box(colored,3.3,.1,2.35,0,2.87,-.05);shell.build(g,{name:'market_shell'});
      sign(g,0,2.4,.12,2.7,b.name,'CONCEPT STALL · '+b.cat.toUpperCase(),b.color);
      const invite=sign(g,0,.75,.85,2.5,'Try. Create. Disclose.','CLICK FOR YOUR STORY + SAMPLE',b.color);ctx.setInteractable(invite.mesh,{cue:()=>b.name+' · create a story',onClick:()=>openMarket(b),reach:4.8,outline:false});
      // Rounded sample packaging and a single shared attendant rig per stall.
      dressCounter(g,b,colored);
      const pos=g.localToWorld(new THREE.Vector3(.6,0,-.2));new Person({key:'market_host_'+i,name:['Riya','Maya','Kabir','Zoya','Naina','Arun','Anya','Neel','Tara'][i]+' · '+b.name,model:i%2?'Female_Adult_08':'Business_Male_05',x:pos.x,z:pos.z,ry:b.rot,interact:()=>openMarket(b)});
      ctx.colBox(b.x-1.55,b.z-.9,b.x+1.55,b.z+.95,'marketStall');
    });
    ctx.TRAVEL.market={x:-8.05,z:-8.70,yaw:.38};
  }
  function buildExit(){const {THREE,WORLD,MAT,mesh,boxGeo,cylGeo,std,TRAVEL}=ctx,g=new THREE.Group();g.name='exit_sample_lounge';g.position.set(9,0,29);WORLD.add(g);
    mesh(boxGeo(8,.12,5.6),MAT.deck,g,0,.06,0);sign(g,0,3.25,-1.3,4.7,'One last little joy','EXIT LOUNGE · THE FREEBIE CLUB');
    const pink=std('#bb668f',{roughness:.45});mesh(boxGeo(1.45,1.2,1.1),pink,g,-1.6,.72,-.5);mesh(boxGeo(1.45,.12,1.1),MAT.cream,g,-1.6,2.65,-.5);
    for(const x of [-2.3,-.9])mesh(boxGeo(.06,1.3,.06),MAT.alu,g,x,1.95,-.04);mesh(boxGeo(1.4,1.28,.03),MAT.glass,g,-1.6,1.95,.06);
    const geo=new THREE.SphereGeometry(.13,12,8),colors=['#e9bf71','#e187ac','#a6a0d7'];for(let i=0;i<9;i++)mesh(geo,std(colors[i%3]),g,-2.08+(i%3)*.42,1.37+Math.floor(i/3)*.1,-.7+(i%2)*.33);
    mesh(boxGeo(.03,.45,.03),MAT.alu,g,-1.6,2.38,-.5);const label=sign(g,-1.6,1,.09,1.3,'THE CLAW','CLICK · PLAY · KEEP THE TRUST');ctx.setInteractable(label.mesh,{cue:()=> 'Play the sample claw',onClick:()=>open('dlgFreebies'),reach:4.5,outline:false});
    mesh(cylGeo(.5,.5,.65,24),MAT.cream,g,.5,.45,-.5);mesh(new THREE.SphereGeometry(.53,24,16),MAT.glass,g,.5,1.25,-.5);for(let i=0;i<7;i++)mesh(geo,std(colors[i%3]),g,.5+Math.sin(i*2)*.24,1.05+i*.045,-.5+Math.cos(i*2)*.24);
    const lever=mesh(cylGeo(.09,.09,.12,12),MAT.alu,g,.5,.72,.05);ctx.setInteractable(lever,{cue:()=> 'Pick a freebie capsule',onClick:()=>{open('dlgFreebies');dropClaw()},reach:4.5});
    for(const x of [2.3,3.3]){const chair=mesh(boxGeo(.85,.15,.8),MAT.cream,g,x,.5,-.3);mesh(boxGeo(.85,.8,.12),pink,g,x,.9,-.65);for(const a of [-.3,.3])mesh(cylGeo(.025,.025,.45,8),MAT.alu,g,x+a,.25,-.3)}
    ctx.colBox(6.6,27.8,8.2,29.8,'clawMachine');ctx.colCircle(9.5,28.5,.55,'capsules');TRAVEL.freebies={x:9,z:32,yaw:0};
    dialog('dlgFreebies','Exit lounge · demo samples','A little surprise. No hidden strings.',`<p class="social-copy">Move the claw, then drop it. Or pick a capsule for a surprise. Your demo sample never depends on a positive review.</p><div class="claw-window" aria-hidden="true"><div class="claw-arm" id="clawArm"></div>${Array.from({length:8},(_,i)=>`<i class="capsule" style="left:${6+i*11}%;bottom:${8+i%3*12}px"></i>`).join('')}</div><div class="btnrow"><button class="btn" id="clawLeft" aria-label="Move claw left">← Left</button><button class="btn pri" id="clawDrop">Drop claw</button><button class="btn" id="clawRight" aria-label="Move claw right">Right →</button><button class="btn" id="capsulePick">Pick a capsule</button></div><p id="freebieResult" class="sample-result" role="status">What will you pick up?</p><p class="fine">If you post about a gift, make “Gifted” clear. Receiving it doesn’t prove it works. Virtual samples only; nothing is shipped.</p>`);
    $('clawLeft').onclick=()=>moveClaw(-18);$('clawRight').onclick=()=>moveClaw(18);$('clawDrop').onclick=dropClaw;$('capsulePick').onclick=dropClaw;
  }
  function moveClaw(n){if(clawBusy)return;clawX=Math.max(10,Math.min(90,clawX+n));$('clawArm').style.left=clawX+'%'}
  async function dropClaw(){if(clawBusy)return;clawBusy=true;document.querySelectorAll('#dlgFreebies .btn').forEach(b=>b.disabled=true);$('clawArm').style.height='180px';$('freebieResult').textContent='Picking your capsule…';ctx.Sound.play('select');await new Promise(r=>setTimeout(r,750));$('clawArm').style.height='60px';await new Promise(r=>setTimeout(r,650));const items=['a mini skincare sample','a luggage tag','a fabric swatch set','a matcha token'];$('freebieResult').textContent='You picked '+items[Math.floor(clawX/25)%items.length]+'. A gift, not an obligation. Yours in the demo sample bag!';ctx.Sound.play('stamp');clawBusy=false;document.querySelectorAll('#dlgFreebies .btn').forEach(b=>b.disabled=false)}
  function photoFinished(){clearInterval(photoTimer);if($('takeMyPhoto'))$('takeMyPhoto').disabled=false}
  function animatePrint(){const img=$('photoOut');img.classList.remove('printing');void img.offsetWidth;img.classList.add('printing')}
  function handProp(p,kind){
    if(!p?.model)return;const {THREE,MAT}=ctx;let hand;p.model.traverse(o=>{if(o.isBone&&/hand/i.test(o.name)&&/(right|[ _]r[ _]|r_hand|hand_r)/i.test(o.name))hand=o});
    if(!hand){p.model.traverse(o=>{if(!hand&&o.isBone&&/hand/i.test(o.name))hand=o})}if(!hand)return;
    hand.children.filter(o=>o.name==='held_content_prop').forEach(o=>hand.remove(o));const g=new THREE.Group();g.name='held_content_prop';
    // Bone scale is inherited from the original avatar; compensate to world metres.
    const sc=hand.getWorldScale(new THREE.Vector3());g.scale.set(1/sc.x,1/sc.y,1/sc.z);g.position.set(.02,0,.025);hand.add(g);
    if(kind==='phone'){ctx.mesh(new THREE.BoxGeometry(.074,.15,.012),MAT.blackGloss,g,0,.055,0);ctx.mesh(new THREE.PlaneGeometry(.064,.13),new THREE.MeshBasicMaterial({color:'#ce9bbc'}),g,0,.055,.007)}
    else {ctx.mesh(new THREE.CylinderGeometry(.045,.034,.13,16),MAT.cream,g,0,.04,0);ctx.mesh(new THREE.CylinderGeometry(.04,.04,.008,16),ctx.std(kind==='matcha'?'#8c9d5b':'#a8703f'),g,0,.108,0)}
  }
  function buildReelCrew(){
    const {Person,PEOPLE_BY}=ctx;for(const p of Object.values(PEOPLE_BY))if(p.base==='drink')handProp(p,p.key==='extra1'?'matcha':'chai');
    const a=new Person({key:'reel_dancer_1',name:'Meera · Reel crew',model:'Female_Party_02',x:3,z:-10.4,ry:0,base:'dance'});
    const b=new Person({key:'reel_dancer_2',name:'Aarav · Reel crew',model:'Male_Adult_12',x:4.4,z:-10.4,ry:0,base:'dance'});
    const filmer=new Person({key:'reel_camera',name:'Ira · Recording a reel',model:'Female_Adult_15',x:3.7,z:-7.8,ry:Math.PI,base:'phone'});handProp(filmer,'phone');
    sign(ctx.WORLD,3.7,2.65,-10.6,2.8,'Reel together','MAKE A MOMENT. KEEP IT HONEST.');
  }
  function install(c){ctx=c;buildPhoto();buildWall();buildDrinks();buildMarket();buildExit();buildReelCrew();
    const action=document.createElement('button');action.id='socialAction';action.className='btn pri hidden';document.body.append(action);action.onclick=()=>{const id=action.dataset.action;if(id==='photo')openStudio();else if(id==='wall'){renderNotes();open('dlgTrustWall')}else if(id==='chai')open('dlgCaffeine');else if(id==='freebies')open('dlgFreebies');else openMarket(nearestBrand(ctx.player.x,ctx.player.z))};
    let prev='';setInterval(()=>{if(!ctx.S.started)return;const x=ctx.player.x,z=ctx.player.z;const a=x<-20&&z>21?'photo':x>20&&z>21?'chai':Math.hypot(x+15,z-27)<5?'wall':Math.hypot(x-9,z-30)<5?'freebies':z<-8&&z>-23&&Math.abs(x)>=6&&Math.abs(x)<18?'market':'';
      const destination=a==='market'?nearestBrand(x,z).name:a; if(destination!==prev){prev=destination;action.dataset.action=a;action.textContent={photo:'Ask Dev: take my photo',wall:'Leave a trust note',chai:'Pick your caffeine',freebies:'Play for a demo freebie',market:'Visit '+destination}[a]||''}action.classList.toggle('hidden',!a||!!ctx.S.ui.modal)},250);
    // One focus trap serves both existing and new dialogs, including the Visual Labs.
    let visible=null;const observer=new MutationObserver(()=>{const next=document.querySelector('.modal:not(.hidden)');if(next===visible)return;visible=next;if(next){lastFocus=document.activeElement;next.setAttribute('role','dialog');next.setAttribute('aria-modal','true');if(!next.getAttribute('aria-labelledby')){const h=next.querySelector('h2');if(h){h.id||=next.id+'Title';next.setAttribute('aria-labelledby',h.id)}}next.querySelectorAll('button.x').forEach(b=>b.setAttribute('aria-label','Close'));next.querySelector('button,textarea,input')?.focus()}else lastFocus?.focus?.()});observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
    document.addEventListener('keydown',e=>{const modal=document.querySelector('.modal:not(.hidden)');if(!modal)return;if(e.key==='Tab'){const items=[...modal.querySelectorAll('button:not(:disabled),input,textarea,select,[tabindex="0"]')].filter(x=>x.offsetParent!==null);if(!items.length)return;const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault()}}});
  }
  window.TrustSocial={install,photoFinished,animatePrint,brands};
})();


