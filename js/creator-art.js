/* Reference-led illustrated characters in the navigable 3D festival. */
(() => {
  const roster=[
    {id:'ananya',name:'Ananya Panday',handle:'@ananyapanday',model:'Female_Party_02',file:'creators-four.webp',col:0,row:1,cols:2,rows:2,aspect:1},
    {id:'orry',name:'Orry',handle:'@orry1',model:'Male_Adult_04',file:'creators-four.webp',col:1,row:1,cols:2,rows:2,aspect:1},
    {id:'rebel',name:'The Rebel Kid',handle:'@the.rebel.kid',model:'Female_Adult_12',file:'creators-four.webp',col:0,row:0,cols:2,rows:2,aspect:1},
    {id:'vriddhi',name:'Vriddhi Patwa',handle:'@vriddhipatwa',model:'Female_Adult_15',file:'creators-four.webp',col:1,row:0,cols:2,rows:2,aspect:1},
    {id:'taneesho',name:'Taneesho',handle:'@taneesho',model:'Female_Adult_08',file:'creators-two.webp',col:0,row:0,cols:2,rows:1,aspect:.75},
    {id:'shivprizz',name:'Shivprizz',handle:'@shivprizzz',model:'Male_Adult_09',file:'creators-two.webp',col:1,row:0,cols:2,rows:1,aspect:.75}
  ];
  let c,materials={},time=0;
  const crew={reel_dancer_1:'ananya',reel_dancer_2:'orry',reel_camera:'rebel',reel_vlogger:'taneesho',reel_reviewer:'shivprizz',reel_stylist:'vriddhi'};
  function apply(person,id){
    if(!person?.ok||person.artId===id)return;
    if(person.artFigure)person.artFigure.removeFromParent();
    const item=roster.find(row=>row.id===id)||roster[0],T=c.THREE;
    const root=new T.Group();root.name='illustrated_'+item.id;root.userData.illustrated=true;
    const face=new T.Mesh(new T.PlaneGeometry(2*item.aspect,2),materials[item.id]);
    face.position.y=.98;root.add(face);person.group.add(root);
    person.model.traverse(mesh=>{if(mesh.isSkinnedMesh)mesh.visible=false});
    if(person.def.self)root.traverse(mesh=>mesh.layers.set(c.selfLayer));
    person.artFigure=root;person.artId=id;
    const props=[];person.model.traverse(node=>{if(node.name==='held_content_prop')props.push(node)});
    for(const prop of props){root.add(prop);prop.scale.setScalar(1);prop.position.set(.24,.91,.08);prop.quaternion.identity()}

  }
  function clone(person){
    if(!person?.artFigure)return null;
    const copy=person.artFigure.clone(true);copy.rotation.set(0,0,0);copy.scale.setScalar(1);return copy;
  }
  async function install(ctx){
    c=ctx;const T=c.THREE,loader=new T.TextureLoader(),cache={};
    await Promise.all(['creators-four.webp','creators-two.webp'].map(async file=>{const texture=await loader.loadAsync('assets/characters/'+file);texture.colorSpace=T.SRGBColorSpace;cache[file]=texture}));
    for(const item of roster){
      const tex=cache[item.file].clone();tex.repeat.set(1/item.cols,1/item.rows);tex.offset.set(item.col/item.cols,item.row/item.rows);tex.needsUpdate=true;
      materials[item.id]=new T.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.70,side:T.DoubleSide,depthWrite:true,toneMapped:false});
    }
    c.S.characterId=roster.some(x=>x.id===c.S.characterId)?c.S.characterId:'ananya';
    const grid=document.getElementById('avatarGrid');grid.replaceChildren();
    for(const item of roster){
      const b=document.createElement('button');b.type='button';b.dataset.av=item.model;b.dataset.character=item.id;b.title=item.name+' · illustrated avatar';b.setAttribute('aria-label','Choose '+item.name);
      const canvas=document.createElement('canvas');canvas.width=180;canvas.height=220;const q=canvas.getContext('2d'),image=cache[item.file].image;
      const w=image.width/item.cols,h=image.height/item.rows,x=item.col*w,y=(item.rows-1-item.row)*h;
      q.fillStyle='#2c2035';q.fillRect(0,0,180,220);q.drawImage(image,x+w*.16,y,w*.68,h*.50,0,0,180,220);
      b.append(canvas);const label=document.createElement('span');label.className='look-label';label.textContent=item.name;b.append(label);
      b.onclick=()=>{
        c.S.characterId=item.id;c.S.avatar=item.model;
        grid.querySelectorAll('button').forEach(button=>{const on=button===b;button.classList.toggle('on',on);button.setAttribute('aria-pressed',String(on))});
        c.persist();
      };grid.append(b);if(item.id===c.S.characterId)b.click();
    }
    const hint=document.createElement('p');hint.className='fine';hint.textContent='Illustrated creator avatars · unofficial fan concept';grid.after(hint);
    for(const [key,id] of Object.entries(crew))apply(c.people[key],id);
    update(0);
  }
  function update(dt){
    if(!c||!Object.keys(materials).length)return;
    time+=dt;apply(c.self.p,c.S.characterId);
    const eye=c.camera.getWorldPosition(new c.THREE.Vector3());
    for(const p of Object.values(c.people)){
      if(!p.artFigure)continue;
      p.group.updateWorldMatrix(true,false);
      const facing=new c.THREE.Quaternion().setFromAxisAngle(new c.THREE.Vector3(0,1,0),Math.atan2(eye.x-p.pos.x,eye.z-p.pos.z));
      p.artFigure.quaternion.copy(p.group.getWorldQuaternion(new c.THREE.Quaternion())).invert().multiply(facing);
      const moving=p.path||p.base==='dance'||(p.def.self&&c.player.moving);
      p.artFigure.position.y=moving?Math.sin(time*5)*.018:0;
      p.artFigure.visible=p.def.self||p.model.visible;
    }
  }
  window.TrustIllustrations={install,update,clone,roster};
})();
