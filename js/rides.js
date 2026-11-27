/* Physical rides, bounded camera sequences and pavilion content spots. */
(() => {
  let c, clock=0, active=null, elapsed=0, lastFocus;
  const coasterDuration=24;
  const $=id=>document.getElementById(id);
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const points={
    collab:{x:10.5,z:29,label:'Collab claw',hi:'कोलैब क्लॉ',file:'entry_collab_claw',poster:'poster_collab_claw'},
    fall:{x:-17,z:-28.6,label:'Trust Fall',hi:'ट्रस्ट फ़ॉल',file:'trust_fall_bungee',poster:'poster_trust_fall'},
    pit:{x:0,z:-16,label:'Claim Dunk',hi:'क्लेम डंक',file:'ball_pit_dunk',poster:'poster_ball_pit_dunk'},
    coaster:{x:-20.5,z:-24,label:'Hype Coaster',hi:'हाइप कोस्टर',file:'trust_coaster',poster:'poster_hype_coaster'}
  };
  const objects={}, ballMatrices=[], palette=['#833AB4','#E1306C','#ed896f','#FCAF45'];
  let curve,pod,coasterEye,coasterLook,festivalView,pitBalls,harness,fallChoice=0,dunkIndex=0,clawX=50,clawBusy=false;
  const claims=[
    {text:'I used it for 21 days. Here is my diary, the ingredient list and the irritation I noticed.',proof:true,why:'A bounded observation with a visible method and limitation helps viewers judge fit.'},
    {text:'Miracle overnight results. Works for absolutely everyone.',proof:false,why:'A universal result needs evidence across people. An enthusiastic caption cannot supply it.'},
    {text:'The creator, brand and five repost accounts repeat the same statistic.',proof:false,why:'Six repetitions can come from one source. Check independent evidence origins.'},
    {text:'A dated batch report supports the amount printed on this label.',proof:true,why:'A traceable report can support this label fact. It does not establish every health benefit.'}
  ];
  function note(id,text){window.TrustLabs.saveNote(id,text)}
  function group(name,x=0,z=0){const g=new c.THREE.Group();g.name=name;g.position.set(x,0,z);c.WORLD.add(g);return g}
  function solid(g,w,h,d,x,y,z,mat=c.MAT.metal){return c.mesh(c.rboxGeo(w,h,d,Math.min(.05,w/3,h/3,d/3),2),mat,g,x,y,z)}
  function tube(g,r,h,x,y,z,mat=c.MAT.alu){return c.mesh(c.cylGeo(r,r,h,12),mat,g,x,y,z)}
  function bar(g,a,b,r,mat=c.MAT.alu){
    const T=c.THREE,dir=new T.Vector3().subVectors(b,a),o=c.mesh(c.cylGeo(r,r,dir.length(),10),mat,g);
    o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());return o;
  }
  function sign(g,text,w,y,z,onClick,x=0){
    const s=new c.CanvasScreen({name:'ride_'+text,w,h:.48,ppm:250,interactive:false,draw:(ctx,W,H)=>{
      ctx.fillStyle='#211b29';ctx.fillRect(0,0,W,H);
      const gradient=ctx.createLinearGradient(0,0,W,0);palette.forEach((color,i)=>gradient.addColorStop(i/3,color));
      ctx.fillStyle=gradient;ctx.fillRect(0,H-5,W,5);
      c.txt(ctx,text,W/2,H*.53,H*.40,{align:'center',base:'middle',w:700,maxW:W-24});
    }});
    s.mesh.position.set(x,y,z);g.add(s.mesh);
    if(onClick)c.setInteractable(s.mesh,{cue:()=>text,onClick,reach:5,outline:false});
    return s.mesh;
  }
  function plaque(g,id,x,z){
    const p=points[id],texture=new c.THREE.TextureLoader().load('assets/rides/'+p.poster+'.webp');texture.colorSpace=c.THREE.SRGBColorSpace;
    const art=c.mesh(new c.THREE.PlaneGeometry(1.5,.837),new c.THREE.MeshBasicMaterial({map:texture}),g,x,1.18,z);
    solid(g,1.57,.91,.06,x,1.18,z-.04);tube(g,.026,.85,x,.56,z-.03);
    c.setInteractable(art,{cue:()=>p.label,onClick:()=>open(id),reach:4.6,outline:false});
  }
  function instances(g,n,r,name){
    const T=c.THREE,geo=new T.SphereGeometry(r,12,8),mat=new T.MeshStandardMaterial({roughness:.28,metalness:.10});
    const balls=new T.InstancedMesh(geo,mat,n);balls.name=name;g.add(balls);
    const matrix=new T.Matrix4();
    for(let i=0;i<n;i++){
      const angle=i*2.399963,rad=Math.sqrt((i+.5)/n);
      const v=name==='pit_balls'?new T.Vector3(Math.cos(angle)*rad*2.92,.27+(i%3)*.075,Math.sin(angle)*rad*2.92):
        new T.Vector3((i%9-4)*.142,.43+Math.floor(i/27)*.125,(Math.floor(i/9)%3-1)*.28);
      matrix.makeTranslation(v.x,v.y,v.z);balls.setMatrixAt(i,matrix);balls.setColorAt(i,new T.Color(palette[i%4]));
      if(name==='pit_balls')ballMatrices.push(v);
    }
    balls.instanceMatrix.setUsage(T.DynamicDrawUsage);return balls;
  }
  function cabinet(){
    const p=points.collab,g=group('ride_collab',p.x,p.z);objects.collab=g;
    const plum=c.std('#21172e',{roughness:.32,metalness:.44}),glass=c.std('#dbbae9',{transparent:true,opacity:.12,depthWrite:false,roughness:.18});
    solid(g,1.6,.80,1.6,0,.54,0,plum);solid(g,1.7,.28,1.7,0,2.66,0,plum);
    solid(g,1.62,.14,1.76,0,1.0,.07,c.MAT.metal);
    solid(g,1.5,1.30,.055,0,1.79,-.77,plum);
    const face=solid(g,1.44,1.30,.014,0,1.79,.77,glass);
    for(const x of [-.75,.75])for(const z of [-.75,.75]){
      tube(g,.035,1.45,x,1.80,z);solid(g,.018,1.4,.025,x,1.8,z+.02,c.std(palette[x<0?0:2],{emissive:palette[x<0?0:2],emissiveIntensity:.6}));
    }
    const balls=instances(g,90,.07,'collab_capsules');balls.position.y=.84;
    const claw=new c.THREE.Group();g.add(claw);claw.position.set(0,2.2,0);objects.claw=claw;
    tube(claw,.018,.24,0,.11,0);
    for(let i=0;i<3;i++){const a=i*Math.PI*2/3;bar(claw,new c.THREE.Vector3(),new c.THREE.Vector3(Math.cos(a)*.13,-.17,Math.sin(a)*.13),.015)}
    solid(g,.64,.24,.05,0,.52,.819,c.MAT.black);solid(g,.70,.05,.12,0,.39,.85,c.MAT.alu);
    tube(g,.025,.16,-.41,1.14,.64);c.mesh(new c.THREE.SphereGeometry(.062,12,8),c.MAT.cream,g,-.41,1.23,.64);
    const button=tube(g,.083,.028,.42,1.10,.64,c.MAT.bulb);
    c.setInteractable(button,{cue:()=> 'Play Collab Claw',onClick:()=>open('collab'),reach:4.5});
    c.setInteractable(face,{cue:()=> 'Play Collab Claw',onClick:()=>open('collab'),reach:4.5,outline:false});
    sign(g,'COLLAB CLAW',1.45,2.68,.86,()=>open('collab'));plaque(g,'collab',2,0);
    c.colBox(p.x-.84,p.z-.84,p.x+.84,p.z+.89,'collabCabinet');c.colCircle(p.x+2,p.z,.18,'ridePlaque');
    c.TRAVEL.collab={x:p.x,z:p.z+3.7,yaw:0};
  }
  function tower(){
    const p=points.fall,g=group('ride_fall',p.x,p.z);objects.fall=g;
    const pad=c.std('#a34179',{roughness:.8}),pink=c.std('#e6699d',{emissive:'#e6699d',emissiveIntensity:.5});
    solid(g,4.5,.35,4.5,0,.20,0,pad);solid(g,4.1,.09,4.1,0,.42,0,c.MAT.cream);
    for(const x of [-2,2])for(const z of [-1.6,1.6]){
      tube(g,.075,8.5,x,4.25,z);
      for(let y=.35;y<8.2;y+=.55)bar(g,new c.THREE.Vector3(x-.11,y,z),new c.THREE.Vector3(x+.11,y+.5,z),.018);
      tube(g,.018,8.2,x-.1,4.2,z,pink);
      c.colCircle(p.x+x,p.z+z,.17,'towerFoot');
    }
    solid(g,4.3,.22,3.5,0,8.5,0);sign(g,'TRUST FALL · CHOOSE YOUR CLAIM',4.25,8.9,1.8);
    for(const depth of [-1.6,1.6]){
      const arch=new c.THREE.CatmullRomCurve3([new c.THREE.Vector3(-2,5.2,depth),new c.THREE.Vector3(-1.8,7.8,depth),new c.THREE.Vector3(0,8.7,depth),new c.THREE.Vector3(1.8,7.8,depth),new c.THREE.Vector3(2,5.2,depth)]);
      c.mesh(new c.THREE.TubeGeometry(arch,32,.075,8),c.MAT.alu,g);
    }
    for(const x of [-.50,.50])tube(g,.008,7.1,x,4.7,0);
    harness=new c.THREE.Group();g.add(harness);harness.position.y=6.8;
    solid(harness,1.2,.17,.70,0,0,0,pad);solid(harness,1.2,.85,.14,0,.4,-.32,c.MAT.metal);
    for(const x of [-.45,.45])tube(harness,.025,.7,x,.36,.27,c.MAT.alu);
    plaque(g,'fall',0,3);c.TRAVEL.fall={x:p.x,z:p.z+5.1,yaw:0};c.addPlatform(p.x-2.25,p.z-2.25,p.x+2.25,p.z+2.25,.42);
  }
  function pit(){
    const p=points.pit,g=group('ride_pit',p.x,p.z);objects.pit=g;
    c.mesh(c.cylGeo(3.28,3.28,.16,64),c.MAT.rubber,g,0,.08,0);
    const wall=new c.THREE.CylinderGeometry(3.25,3.25,1.05,64,1,true,.35,Math.PI*2-.7);
    c.mesh(wall,c.std('#a570bc',{transparent:true,opacity:.19,side:c.THREE.DoubleSide,depthWrite:false,roughness:.24}),g,0,.65,0);
    const rim=c.mesh(new c.THREE.TorusGeometry(3.25,.13,8,72,Math.PI*2-.7),c.std('#be719b',{roughness:.49}),g,0,1.18,0);
    rim.rotation.set(Math.PI/2,0,.35);
    pitBalls=instances(g,350,.115,'pit_balls');
    for(const side of [-1,1]){
      const x=side*3.15;solid(g,.08,3.15,.08,x,1.58,0);
      const hoop=c.mesh(new c.THREE.TorusGeometry(.38,.035,8,32),c.MAT.bulb,g,x,2.4,0);hoop.rotation.x=Math.PI/2;
      solid(g,.84,.66,.045,x,2.85,-.35,c.MAT.cream);
      for(let j=0;j<12;j++){
        const a=j*Math.PI/6,next=a+.33;
        bar(g,new c.THREE.Vector3(x+Math.cos(a)*.35,2.38,Math.sin(a)*.35),new c.THREE.Vector3(x+Math.cos(next)*.22,1.9,Math.sin(next)*.22),.005,c.MAT.cream);
      }
      sign(g,side<0?'PROOF':'HYPE',1,3.4,.1,()=>open('pit'),x);
      c.colCircle(p.x+x,p.z,.14,'hoopPole');
    }
    // The entrance faces the lawn. Individual wall segments leave a walk-in opening.
    for(let i=0;i<24;i++){
      const a=.36+(i+.5)*(Math.PI*2-.72)/24;
      c.colCircle(p.x+Math.sin(a)*3.25,p.z+Math.cos(a)*3.25,.15,'pitRim');
    }
    plaque(g,'pit',4.2,1.6);c.TRAVEL.pit={x:0,z:-10.9,yaw:0};
    for(const person of Object.values(c.people))if(person!==c.self.p && Math.hypot(person.pos.x,person.pos.z+16)<4.1)person.teleport(person.pos.x<0?-5:5,person.pos.z,person.yaw);
  }
  function coaster(){
    const T=c.THREE,g=group('ride_coaster'),p=points.coaster,stations=[
      [p.x,3,-25.1],[-22,6,-28.7],[-20,14,-32],[-13,22,-34],[-4,24,-34],
      [5,20,-34],[13,11,-33],[20,5,-30],[21,5.5,-25],[15,12,-22.5],
      [6,17,-20.5],[-5,16,-20.5],[-15,8,-22]
    ];
    // The rear crest looks over the park. The front return clears the stage truss.
    curve=new T.CatmullRomCurve3(stations.map(p=>new T.Vector3(...p)),true,'centripetal',.3);
    coasterEye=new T.Vector3();coasterLook=new T.Vector3();festivalView=new T.Vector3(0,2,1);
    const metal=c.std('#8c8c99',{roughness:.32,metalness:.80}),accent=c.std('#b85297',{emissive:'#d76aaa',emissiveIntensity:.55,roughness:.4});
    c.mesh(new T.TubeGeometry(curve,260,.075,8,true),metal,g);
    const line=new T.CatmullRomCurve3(curve.getPoints(260).map(p=>p.clone().add(new T.Vector3(0,.09,0))),true);
    c.mesh(new T.TubeGeometry(line,260,.017,5,true),accent,g);
    const pillars=stations.filter((_,i)=>![0,5,6,8,10,11].includes(i));
    for(const [x,y,z] of pillars){tube(g,.07,y,x,y/2,z,metal);solid(g,.65,.14,.65,x,.07,z,c.MAT.concrete);c.colCircle(x,z,.25,'coasterFoot')}
    pod=new T.Group();pod.name='coasterPod';g.add(pod);
    const shell=c.std('#712a67',{roughness:.29,metalness:.48});
    solid(pod,1.45,.35,1.9,0,.24,0,shell);solid(pod,1.4,.68,.12,0,.66,-.72,shell);
    for(const x of [-.35,.35]){solid(pod,.55,.18,.9,x,.5,0,c.MAT.rubber);tube(pod,.024,.5,x,.9,-.40)}
    const station=group('coaster_station',p.x,p.z);
    solid(station,3,.16,2.6,0,.08,0,c.MAT.deck);
    plaque(station,'coaster',0,-.22);
    sign(station,'HYPE COASTER · BOARD HERE',2.75,2.05,-.2,()=>open('coaster'));
    c.addPlatform(p.x-1.5,p.z-1.3,p.x+1.5,p.z+1.3,.16);
    c.TRAVEL.coaster={x:p.x,z:p.z+2.9,yaw:0,ride:'coaster'};
  }
  function batchStatic(root, moving = []) {
    root.updateMatrixWorld(true);
    const inverse=root.matrixWorld.clone().invert(),batch=new c.Merger(),remove=[];
    root.traverse(mesh=>{
      if(!mesh.isMesh || mesh.isInstancedMesh || mesh.userData.interact || mesh.name.startsWith('ride_'))return;
      if(moving.some(node=>{for(let p=mesh;p;p=p.parent)if(p===node)return true;return false}))return;
      if(mesh.material.transparent)return;
      batch.add(mesh.geometry,mesh.material,new c.THREE.Matrix4().multiplyMatrices(inverse,mesh.matrixWorld));
      remove.push(mesh);
    });
    remove.forEach(mesh=>mesh.removeFromParent());
    batch.build(root,{name:'ride_architecture',shadow:false});
  }
  function panelUI(){
    const actions=document.createElement('div');actions.id='panelActions';actions.className='hidden';
    const listen=document.createElement('button');listen.className='btn';listen.id='listenPanel';listen.textContent='Listen to panel';
    listen.onclick=()=>{const on=c.listenPanel();listen.textContent=on?'Stop listening':'Listen to panel';listen.setAttribute('aria-pressed',String(on))};
    const ask=document.createElement('button');ask.className='btn';ask.id='askPanel';ask.textContent='Ask a question';
    const dialog=document.createElement('div');dialog.id='dlgPanel';dialog.className='modal hidden';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','panelTitle');
    dialog.innerHTML='<div class="card ride-card"><button class="x" aria-label="Close panel questions">×</button><img src="assets/banners/stage_led.webp" alt="" style="width:100%;border-radius:14px"><h2 id="panelTitle">Your turn at the mic</h2><p>Choose a question for a response from the panel.</p><div id="panelQuestions" class="ride-options"></div><p id="panelResponse" role="status"></p></div>';
    document.body.append(dialog);dialog.querySelector('.x').onclick=()=>c.closeModal('dlgPanel');
    c.panelQuestions.forEach((question,i)=>{const button=document.createElement('button');button.className='btn';button.textContent=c.L(question.q);button.onclick=()=>{$('panelResponse').textContent=c.panelAnswer(i)};$('panelQuestions').append(button)});
    ask.onclick=()=>c.openModal('dlgPanel');actions.append(listen,ask);document.body.append(actions);
  }
  function modal(){
    const el=document.createElement('div');el.id='dlgRide';el.className='modal hidden';
    el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','rideTitle');
    el.innerHTML='<div class="card ride-card"><button class="x" aria-label="Close ride">×</button><img id="rideArt" alt=""><p class="social-kicker">CREATOR NIGHT · PLAY WITH PERSPECTIVE</p><h2 id="rideTitle"></h2><div id="rideBody"></div></div>';
    document.body.append(el);el.querySelector('.x').onclick=()=>c.closeModal('dlgRide');
    el.addEventListener('click',e=>{if(e.target===el && !clawBusy)c.closeModal('dlgRide')});
    const exit=document.createElement('div');exit.id='rideHUD';exit.className='hidden';
    exit.innerHTML='<p id="rideCaption" role="status"></p><button class="btn" id="exitRide">Exit ride · Esc</button>';document.body.append(exit);$('exitRide').onclick=()=>stop();
    const launch=document.createElement('button');launch.id='rideLaunch';launch.className='btn pri hidden';document.body.append(launch);
    launch.onclick=()=>open(launch.dataset.ride);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active){e.preventDefault();e.stopImmediatePropagation();stop()}},true);
  }
  function open(id){
    if(clawBusy)return;
    stop();lastFocus=document.activeElement;c.openModal('dlgRide');
    $('rideTitle').textContent=points[id].label;$('rideArt').src='assets/rides/'+points[id].file+'.webp';
    const body=$('rideBody');
    if(id==='collab'){
      body.innerHTML='<p>Move the claw. Pick up a capsule. Decide which collaboration is worth your name.</p><div class="collab-game"><div class="collab-rail"></div><div id="collabArm"><i></i></div>'+Array.from({length:9},(_,i)=>'<span class="collab-ball" style="left:'+(8+i*10)+'%;--ball:'+palette[i%4]+'"></span>').join('')+'<div class="collab-hatch">PRIZE HATCH</div></div><label>Claw position<input id="collabPosition" type="range" min="10" max="90" value="'+clawX+'"></label><button class="btn pri" id="collabDrop">Drop claw</button><div id="collabResult" role="status"></div>';
      $('collabPosition').oninput=e=>{clawX=+e.target.value;$('collabArm').style.left=clawX+'%';objects.claw.position.x=(clawX-50)/60};
      $('collabDrop').onclick=drop;
    }else if(id==='fall'){
      body.innerHTML='<p>Pick the claim you would put your name behind. Then see what supports it.</p><div class="ride-options">'+claims.slice(0,3).map((v,i)=>'<button class="btn" data-claim="'+i+'" aria-pressed="'+(i===fallChoice)+'">'+v.text+'</button>').join('')+'</div><label class="toggle"><input type="checkbox" id="rideStill" '+(reduced()?'checked':'')+'>Use a still view with the explanation. The moving ride includes a drop and bounce.</label><button class="btn pri" id="startFall">Take the Trust Fall</button>';
      body.querySelectorAll('[data-claim]').forEach(b=>b.onclick=()=>{fallChoice=+b.dataset.claim;body.querySelectorAll('[data-claim]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
      $('startFall').onclick=()=>{const still=$('rideStill').checked;c.closeModal('dlgRide');note('fall','Trust Fall: '+claims[fallChoice].why);start('fall',still)};
    }else if(id==='pit'){renderDunk()}
    else {
      body.innerHTML='<p>Climb above the lights, take in the whole festival, then dive back toward the stage. The moving ride lasts 24 seconds.</p><div class="btnrow"><button class="btn pri" id="startCoaster">Start moving ride</button><button class="btn" id="previewCoaster">See the view without motion</button></div>';
      const board=still=>{c.closeModal('dlgRide');start('coaster',still)};
      $('startCoaster').onclick=()=>board(false);
      $('previewCoaster').onclick=()=>board(true);
      $(reduced()?'previewCoaster':'startCoaster').focus();
    }
  }
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,reduced()?40:ms));
  async function drop(){
    if(clawBusy)return;clawBusy=true;const button=$('collabDrop'),slider=$('collabPosition'),arm=$('collabArm');
    const balls=[...$('rideBody').querySelectorAll('.collab-ball')],ball=balls.reduce((a,b)=>Math.abs(parseFloat(a.style.left)-clawX)<Math.abs(parseFloat(b.style.left)-clawX)?a:b);
    button.disabled=slider.disabled=true;
    try{
      arm.style.left=ball.style.left;arm.classList.add('descend');objects.claw.position.y=1.55;c.Sound.play('select');await pause(650);
      ball.classList.add('caught');arm.classList.remove('descend');objects.claw.position.y=2.2;await pause(650);
      arm.style.left='86%';ball.classList.add('delivered');await pause(450);
      const dilemmas=[
        ['A brand asks you to hide #Gifted.','Keep disclosure visible','Pass on the collaboration','A gift is material context. Keep it clear, or decline the brief.'],
        ['A brand offers a bonus for a positive review before you try the product.','Ask for time to test it','Decline the promised praise','A fee can pay for your work. Your conclusion still needs your own experience.'],
        ['A travel brand wants to remove the renovation from your review.','Show the full context','Pass on this brief','Viewers need the conditions that could change their decision.']
      ],d=dilemmas[Math.floor((clawX-10)/27)%3];
      $('collabResult').innerHTML='<h3>'+d[0]+'</h3><div class="btnrow"><button class="btn" data-decision="0">'+d[1]+'</button><button class="btn" data-decision="1">'+d[2]+'</button></div>';
      $('collabResult').querySelectorAll('[data-decision]').forEach(b=>b.onclick=()=>{note('collab','Collab Claw: '+d[+b.dataset.decision+1]+'. '+d[3]);$('collabResult').textContent=d[3]+' Collaboration card saved in your Field Notes.';c.Sound.play('stamp')});
    }finally{clawBusy=false;button.disabled=slider.disabled=false}
  }
  function renderDunk(){
    const body=$('rideBody'),v=claims[dunkIndex%claims.length];
    body.innerHTML='<p>Send the claim toward the hoop its evidence can support.</p><div class="dunk-court"><div>PROOF</div><span id="dunkBall"></span><div>HYPE</div></div><p class="dunk-claim">'+v.text+'</p><div class="btnrow"><button class="btn" id="dunkProof">Dunk into PROOF</button><button class="btn" id="dunkHype">Dunk into HYPE</button></div><p id="dunkResult" role="status"></p><button class="btn hidden" id="nextDunk">Next claim</button>';
    const dunk=async proof=>{
      $('dunkProof').disabled=$('dunkHype').disabled=true;
      const ball=$('dunkBall');ball.style.setProperty('--target',proof?'-130px':'130px');ball.classList.add('shoot');c.Sound.play('select');
      objects.dunk={t:0,proof};
      if(!objects.projectile){objects.projectile=c.mesh(new c.THREE.SphereGeometry(.20,16,10),c.std('#f4ac78',{roughness:.28}),objects.pit)}
      objects.projectile.visible=true;
      await pause(850);$('dunkResult').textContent=(proof===v.proof?'Matched. ':'Try the '+(v.proof?'PROOF':'HYPE')+' hoop. ')+v.why;
      note('pit','Claim Dunk: '+v.why);$('nextDunk').classList.remove('hidden');
    };
    $('dunkProof').onclick=()=>dunk(true);$('dunkHype').onclick=()=>dunk(false);$('nextDunk').onclick=()=>{dunkIndex++;renderDunk()};
  }
  function start(id,still){
    c.stopMotion();c.S.ui.modal='ride-motion';active={id,still,fov:c.camera.fov};elapsed=0;
    $('exitRide').textContent=id==='fireworks'?'Return to festival · Esc':'Exit ride · Esc';
    $('rideHUD').classList.remove('hidden');$('rideLaunch').classList.add('hidden');
    if(id==='fireworks'){c.fireworks();c.Shot.enter([0,3,-12],[0,25,-34]);$('rideCaption').textContent='Creator Night · Fireworks and drone finale'}
    else if(id==='coaster'){
      c.camera.fov=76;c.camera.updateProjectionMatrix();
      if(still){
        c.Shot.enter([-4,25,-34],[0,2,1]);
        $('rideCaption').textContent='Creator Night from above · still view';
      }else{
        const seat=curve.getPointAt(0),ahead=curve.getPointAt(.016);
        c.Shot.enter([seat.x,seat.y+1.02,seat.z],[ahead.x,ahead.y+.8,ahead.z]);
        $('rideCaption').textContent='Climb · the festival is opening up below you';
      }
    }
    else if(still){c.Shot.enter([-17,2,-23],[0,3,-25]);$('rideCaption').textContent=claims[fallChoice].why}
    else {c.Shot.enter([-17,7.7,-28.6],[-16.3,5,-24]);}
    document.body.classList.add('riding');$('exitRide').focus();
  }
  function stop(){
    if(!active)return;
    const {id,fov}=active;active=null;c.Shot.exit();c.stopMotion();c.S.ui.modal=null;
    if(id==='coaster'){c.camera.fov=fov;c.camera.updateProjectionMatrix()}
    if(harness)harness.position.y=6.8;
    $('rideHUD').classList.add('hidden');document.body.classList.remove('riding');
    if(id==='coaster')note('coaster','Hype Coaster: emotional momentum creates interest. An evidence check supports a grounded decision.');
    window.TrustLabs.updateZoneTrigger(c.S.zone);lastFocus?.focus?.();
  }
  function contentSpots(){
    for(const [id,room] of Object.entries(c.REFS.pav)){
      const g=new c.THREE.Group();g.name='content_spot_'+id;g.position.set(-2.65,0,3.15);room.group.add(g);
      const frame=c.std('#c36198',{metalness:.45,roughness:.4});
      solid(g,1.65,.09,.10,0,2.75,0,frame);solid(g,1.65,.09,.10,0,.5,0,frame);
      for(const x of [-.78,.78])solid(g,.09,2.3,.10,x,1.62,0,frame);
      sign(g,'CREATE YOUR TAKE',1.5,3.13,.06,()=>c.captureSpot(),0);
      sign(g,'♡  ·  '+id.toUpperCase(),1.45,.71,.06,()=>c.captureSpot(),0);
    }
    const heart=group('heart_photo_spot');
    sign(heart,'THE HEART OF CREATOR NIGHT',2.5,1.0,10.8,()=>c.captureSpot(),-3.2);
    for(const x of [-4.2,-2.2])tube(heart,.025,.8,x,.4,10.75);
    const mark=c.mesh(new c.THREE.TorusGeometry(.5,.018,6,32),c.MAT.bulb,heart,0,.05,9.3);mark.rotation.x=Math.PI/2;
    c.setInteractable(mark,{cue:()=> 'Take a portrait with the heart',onClick:()=>c.captureSpot(),reach:4.5});
    const photo=document.createElement('button');photo.id='contentCapture';photo.className='btn hidden';photo.textContent='Frame this moment';photo.onclick=()=>c.captureSpot();document.body.append(photo);
    const rewards=document.createElement('div');rewards.id='pavilionReward';rewards.className='hidden';rewards.setAttribute('role','status');document.body.append(rewards);
    let prev='';
    setInterval(()=>{
      const zone=c.S.zone,room=!!c.REFS.pav[zone]||zone==='hub',shown=room&&c.S.started&&!c.S.ui.modal&&!active;
      photo.classList.toggle('hidden',!shown);
      const unlocked=shown&&!!c.REFS.pav[zone]&&c.S.stamps[zone];
      rewards.classList.toggle('hidden',!unlocked);
      if(unlocked&&prev!==zone){prev=zone;rewards.textContent='✓ '+zone[0].toUpperCase()+zone.slice(1)+' complete · virtual '+({fashion:'fabric swatch',beauty:'skincare mini',food:'tasting token',fitness:'grip-band trial',travel:'luggage tag',education:'workbook'}[zone])+' unlocked in your passport.'}
    },350);
  }
  function update(dt){
    if(!c)return;clock+=dt;
    const ridingCoaster=active?.id==='coaster'&&!active.still;
    const u=ridingCoaster?Math.min(1,elapsed/coasterDuration):(clock/32)%1;
    if(curve){
      const at=curve.getPointAt(u),next=curve.getPointAt((u+.008)%1);pod.position.copy(at);pod.lookAt(next);
      if(ridingCoaster){
        coasterEye.copy(at);coasterEye.y+=1.02;
        coasterLook.copy(curve.getPointAt((u+.018)%1));coasterLook.y+=.8;
        const scenic=c.THREE.MathUtils.smoothstep(at.y,14,22)*c.THREE.MathUtils.smoothstep(-at.z,27,33);
        coasterLook.sub(coasterEye).normalize().lerp(festivalView.clone().sub(coasterEye).normalize(),scenic*.94);
        c.camera.position.copy(coasterEye);
        c.camera.lookAt(coasterLook.add(coasterEye));
      }
    }
    // Keep ambient routes around the pit rim and away from its play floor.
    for(const person of Object.values(c.people)){
      if(person===c.self.p||!person.ok||person.onStage)continue;
      const distance=Math.hypot(person.pos.x,person.pos.z+16);
      if(distance<3.55){
        const dx=person.pos.x||.01,dz=person.pos.z+16,length=Math.hypot(dx,dz);
        person.pos.x=dx/length*3.6;person.pos.z=-16+dz/length*3.6;person.sync();
      }
    }
    const inside=Math.hypot(c.player.x,c.player.z+16)<3;
    if(pitBalls&&(inside||objects.dunk)){
      const matrix=new c.THREE.Matrix4(),amount=inside?.045:0;
      ballMatrices.forEach((v,i)=>{matrix.makeTranslation(v.x+Math.sin(clock*2+i)*amount,v.y+Math.abs(Math.sin(clock*2+i)) * amount,v.z);pitBalls.setMatrixAt(i,matrix)});pitBalls.instanceMatrix.needsUpdate=true;
      if(inside&&!active&&!c.S.ui.modal&&!reduced())c.camera.position.y+=Math.sin(clock*5)*Math.min(.045,Math.hypot(c.player.vx,c.player.vz)*.012);
    }
    if(objects.dunk){
      objects.dunk.t+=dt;const t=Math.min(objects.dunk.t/.85,1);
      objects.projectile.position.set((objects.dunk.proof?-3.15:3.15)*t,.5+1.9*t+Math.sin(t*Math.PI)*2,0);
      if(t>=1){objects.projectile.visible=false;objects.dunk=null}
    }
    if(active){
      elapsed+=dt;
      if(active.id==='fireworks'){if(elapsed>=33)stop()}
      else if(!active.still&&active.id==='fall'){
        const t=Math.min(elapsed/5,1),good=claims[fallChoice].proof;
        const y=t<.52?6.8-(good?4.4:5.9)*(t/.52)**2:(good?2.4:.9)+Math.sin((t-.52)/.48*Math.PI)* (good?2.4:.45);
        harness.position.y=y;c.camera.position.set(-17,y+1,-28.6);c.camera.lookAt(-16.3,y*.65,-24);
        $('rideCaption').textContent=elapsed<2?'What is holding up this claim?':claims[fallChoice].why;
        if(elapsed>=6.4)stop();
      }else if(active.id==='coaster'&&!active.still){
        const caption=elapsed<4?'Climb · the festival is opening up below you':elapsed<9?'The summit · take in Creator Night':elapsed<14?'The drop · hype makes everything feel bigger':'The return · look for the evidence behind the hype';
        if($('rideCaption').textContent!==caption)$('rideCaption').textContent=caption;
        if(elapsed>=coasterDuration)stop();
      }
    }
    $('panelActions').classList.toggle('hidden',(Math.abs(c.player.x)>7||c.player.z> -16.8||c.player.z< -25.5)||!c.S.started||!!c.S.ui.modal||!!active);
    let near,nearest=Infinity;
    for(const [id,p] of Object.entries(points)){
      const distance=Math.hypot(c.player.x-p.x,c.player.z-p.z);
      if(distance<(id==='pit'?5.8:6)&&distance<nearest){near=[id,p];nearest=distance}
    }
    document.body.classList.toggle('nearRide',!!near&&!active);
    const launch=$('rideLaunch');launch.classList.toggle('hidden',!near||!c.S.started||!!c.S.ui.modal||!!active);
    if(near&&launch.dataset.ride!==near[0]){
      launch.dataset.ride=near[0];
      launch.textContent=near[0]==='coaster'?'Board the Hype Coaster':near[1].label+' · play';
    }
  }
  function install(ctx){
    c=ctx;modal();panelUI();
    $('btnFireworks').onclick=()=>{if(c.S.ui.modal)return;stop();start('fireworks',true)};
    cabinet();tower();pit();coaster();contentSpots();
    batchStatic(objects.collab,[objects.claw]);batchStatic(objects.fall,[harness]);batchStatic(objects.pit);
    batchStatic(c.WORLD.getObjectByName('ride_coaster'),[pod]);
    for(const [id,p] of Object.entries(points)){c.PLACES[id]={en:p.label,hi:p.hi};c.ZONES.unshift({id,r:[p.x-3.4,p.z-3.4,p.x+3.4,p.z+3.4]})}
    c.rebuildTargets();
  }
  window.TrustRides={install,update,stop,open,pins:()=>Object.entries(points).map(([id,p])=>({id,x:p.x,z:p.z})),get active(){return active}};
})();
