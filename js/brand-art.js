/* User-supplied banners and stall artwork. Names and research controls stay live. */
(() => {
  async function mount({THREE,REFS,WORLD,SCREENS,drawMark,Person}) {
    const loader=new THREE.TextureLoader(),cache=new Map();
    const load=file=>{if(!cache.has(file))cache.set(file,loader.loadAsync(file).then(t=>{t.colorSpace=THREE.SRGBColorSpace;return t}));return cache.get(file)};
    const manifest=await (await fetch('assets/brands/BRAND_STALLS_MANIFEST.json')).json();
    const fitted=(c,w,h,img)=>{c.fillStyle='#201524';c.fillRect(0,0,w,h);const k=Math.min(w/img.width,h/img.height);c.drawImage(img,(w-img.width*k)/2,(h-img.height*k)/2,img.width*k,img.height*k)};
    const mappings={arch_sign:'entry_arch',chai_menu:'matcha_caffeine_bar_menu'};
    for(const id of ['fashion','beauty','food','fitness','travel','education'])mappings['pav_back_'+id]='pav_'+id;
    await Promise.all(Object.entries(mappings).map(async([name,file])=>{const tex=await load('assets/banners/'+file+'.webp'),s=SCREENS.find(s=>s.name===name);if(s){s.drawFn=(c,w,h)=>fitted(c,w,h,tex.image);s.invalidate()}}));
    const back=REFS.booth.children.find(o=>o.geometry?.type==='CylinderGeometry'&&o.material?.side===THREE.BackSide);
    if(back){const t=await load('assets/banners/photobooth_backdrop.webp');t.wrapS=THREE.RepeatWrapping;t.repeat.x=-1;t.offset.x=1;back.material.map=t;back.material.emissiveMap=t;back.material.emissiveIntensity=.25;back.material.needsUpdate=true}
    // The supplied stage art is a backdrop below the live show display, preserving live captions.
    const stage=await load('assets/banners/stage_led.webp');const oldLED=REFS.led.drawFn;REFS.led.drawFn=(c,w,h,s,t)=>{const seg=window.TrustArcade?.Show.seg?.id;if(['dj','interval','finale'].includes(seg))fitted(c,w,h,stage.image);else oldLED(c,w,h,s,t)};REFS.led.invalidate();
    const welcome=await load('assets/banners/welcome_totem.webp');const poster=new THREE.Mesh(new THREE.PlaneGeometry(1.66,2.475),new THREE.MeshBasicMaterial({map:welcome}));poster.name='welcome_brand_poster';poster.position.set(10.5,1.8,28);poster.rotation.y=-.3;WORLD.add(poster);
    for(const record of manifest.stalls){const group=record.category==='caffeine'&&record.brand.startsWith('Caffeine')?REFS.chai:WORLD.getObjectByName('market_'+record.brand.toUpperCase())||WORLD.getObjectByName('market_'+record.brand);if(!group)continue;
      const t=await load(record.file.replace(/\.jpg$/,'.webp')),plane=new THREE.Mesh(new THREE.PlaneGeometry(2.85,2.85*record.height_px/record.width_px),new THREE.MeshBasicMaterial({map:t}));plane.name='supplied_brand_backdrop';plane.position.set(record.brand.startsWith('Caffeine')?2.6:0,1.9,record.brand.startsWith('Caffeine')?-3.94:-.74);group.add(plane);const oldSign=group.getObjectByName('social_'+record.brand)||group.getObjectByName('social_'+record.brand.toUpperCase());if(oldSign)oldSign.visible=false;
      if(record.brand.startsWith('Caffeine'))plane.position.y=2.15;
    }
    let preview=document.getElementById('marketArt');if(!preview){preview=document.createElement('img');preview.id='marketArt';preview.alt='Concept brand stall artwork';preview.style.cssText='width:100%;aspect-ratio:1376/768;object-fit:contain;border-radius:14px;margin:8px 0';document.getElementById('marketItem').before(preview)}
    const title=document.getElementById('marketBrand');new MutationObserver(()=>{const name=title.textContent.split(' · ')[0].toLowerCase();const found=manifest.stalls.find(x=>x.brand.toLowerCase()===name);if(found)preview.src=found.file.replace(/\.jpg$/,'.webp')}).observe(title,{childList:true,subtree:true});
    // A visible DJ at the deck, using an existing animated character asset.
    const dj=new Person({key:'festival_dj',name:'DJ Nikhil',model:'Male_Adult_09',x:0,z:-27.9,ry:0,base:'dance'});dj.onStage=true;
    return {banners:Object.keys(mappings).length+3,brandStalls:manifest.stalls.length};
  }
  window.TrustBrandArt={mount};
})();


