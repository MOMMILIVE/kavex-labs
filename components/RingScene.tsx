'use client';
import { useEffect, useRef, useState } from 'react';
export type Configuration = { cut: 'Round'|'Oval'|'Emerald'|'Radiant'|'Pear'; carat: '1.0'|'1.5'|'2.0'|'custom'; metal: '18K White Gold'|'18K Yellow Gold'|'Platinum'; bandWidth: string; prongs: 'matching'|'white' };
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

function outline(cut: Configuration['cut'], t: number) {
  const x = Math.cos(t), z = Math.sin(t);
  if (cut === 'Oval') return [x * .82, z * 1.17];
  if (cut === 'Pear') {
    // A rounded heel tapering into a protected tip.
    return [x * (.70 - .23*z), z * 1.16];
  }
  if (cut === 'Emerald' || cut === 'Radiant') {
    const m = Math.max(Math.abs(x),Math.abs(z));
    return [x/m * .74, z/m * (cut === 'Emerald' ? 1.08 : .96)];
  }
  return [x*.95,z*.95];
}
function diamondGeometry(cut: Configuration['cut']) {
  const sides = cut === 'Emerald' || cut === 'Radiant' ? 8 : 16;
  const layers = [[.49,.43],[.86,.10],[1,0],[.92,-.10],[.36,-.55],[.015,-.73]];
  const positions: number[] = [];
  const point = (l: number, i: number) => {
    const a = 2*Math.PI*i/sides + (cut === 'Emerald' || cut === 'Radiant' ? Math.PI/8 : 0);
    const [x,z] = outline(cut,a);
    return [x*layers[l][0],layers[l][1],z*layers[l][0]];
  };
  for(let l=0;l<layers.length-1;l++) for(let i=0;i<sides;i++) {
    const a=point(l,i),b=point(l,i+1),c=point(l+1,i),d=point(l+1,i+1);
    positions.push(...a,...b,...c,...b,...d,...c);
  }
  for(let i=0;i<sides;i++) positions.push(0,layers[0][1],0,...point(0,i+1),...point(0,i));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3)); g.computeVertexNormals();
  return g;
}
export default function RingScene({config,angle}:{config:Configuration;angle:string}) {
  const host=useRef<HTMLDivElement>(null);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    if(!host.current) return;
    const el=host.current; let renderer:THREE.WebGLRenderer;
    try { renderer=new THREE.WebGLRenderer({antialias:true,alpha:true}); } catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
    el.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const pmrem=new THREE.PMREMGenerator(renderer);
    const room=new RoomEnvironment(); const env=pmrem.fromScene(room,.04);
    scene.environment=env.texture;
    const camera=new THREE.PerspectiveCamera(32,1,.1,100);
    if(angle==='Front') camera.position.set(0,3.3,9.4);
    else if(angle==='Profile') camera.position.set(8,3.4,2);
    else camera.position.set(5.3,4.4,8);
    const controls=new OrbitControls(camera,renderer.domElement);
    controls.target.set(0,.5,0); controls.enablePan=false; controls.enableZoom=false;
    controls.enableDamping=true; controls.minPolarAngle=.35; controls.maxPolarAngle=2.3;
    controls.autoRotate=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotateSpeed=.28;
    const group=new THREE.Group(); scene.add(group);
    group.rotation.z=-.12;
    const yellow=config.metal==='18K Yellow Gold';
    const metal=new THREE.MeshStandardMaterial({color:yellow?0xd6af59:0xd6d9df,metalness:1,roughness:.17});
    const prongMetal=new THREE.MeshStandardMaterial({color:config.prongs==='white'?0xe1e5ef:(yellow?0xd6af59:0xd6d9df),metalness:1,roughness:.13});
    const band=new THREE.Mesh(new THREE.TorusGeometry(1.72,.105,24,160),metal);
    band.scale.z=Number(config.bandWidth)/1.5; group.add(band);
    const stoneGroup=new THREE.Group();
    stoneGroup.position.set(0,1.88,0);
    const scale=Math.cbrt(Number(config.carat==='custom'?2:config.carat)/1.5)*.88;
    stoneGroup.scale.setScalar(scale); group.add(stoneGroup);
    const geo=diamondGeometry(config.cut);
    const stoneMaterial=new THREE.MeshPhysicalMaterial({color:0xf2f6ff,metalness:0,roughness:.045,transmission:.65,thickness:.7,ior:2.42,envMapIntensity:1.5,clearcoat:.6,flatShading:true,side:THREE.DoubleSide});
    stoneGroup.add(new THREE.Mesh(geo,stoneMaterial));
    const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geo,10),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.2}));
    stoneGroup.add(edges);
    const prongCount=config.cut==='Round'?6:4;
    for(let i=0;i<prongCount;i++){
      const t=Math.PI*2*i/prongCount + Math.PI/4;
      const [x,z]=outline(config.cut,t);
      const p=new THREE.Mesh(new THREE.CapsuleGeometry(.043,.48,4,8),prongMetal);
      p.position.set(x*.95,-.17,z*.95); p.rotation.z=-x*.15; stoneGroup.add(p);
      const bead=new THREE.Mesh(new THREE.SphereGeometry(.059,12,12),prongMetal);
      bead.position.set(x*.95,.12,z*.95); stoneGroup.add(bead);
    }
    if(config.cut==='Pear'){
      const v=new THREE.Mesh(new THREE.ConeGeometry(.095,.24,3),prongMetal);
      v.position.set(0,0,1.08); v.rotation.x=Math.PI/2; stoneGroup.add(v);
    }
    const basket=new THREE.Mesh(new THREE.TorusGeometry(.57,.036,10,60),prongMetal);
    basket.rotation.x=Math.PI/2; basket.position.y=-.45; stoneGroup.add(basket);
    const key=new THREE.DirectionalLight(0xffffff,4); key.position.set(4,6,3); scene.add(key);
    const cool=new THREE.DirectionalLight(0xc4d6ff,3); cool.position.set(-4,1,4); scene.add(cool);
    const warm=new THREE.DirectionalLight(0xffe0a5,2.4); warm.position.set(0,-1,-4); scene.add(warm);
    const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();};
    const observer=new ResizeObserver(resize);observer.observe(el);resize();
    let frame=0;const draw=()=>{frame=requestAnimationFrame(draw);controls.update();renderer.render(scene,camera);};draw();
    const stop=()=>{controls.autoRotate=false;};renderer.domElement.addEventListener('pointerdown',stop);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();controls.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh || o instanceof THREE.LineSegments){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});env.dispose();room.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();};
  },[config.cut,config.carat,config.metal,config.bandWidth,config.prongs,angle]);
  return <div className="ring-canvas" ref={host} role="img" aria-label={config.carat+' carat '+config.cut+' ring visualization in '+config.metal}>{failed&&<div className="webgl-fallback">Your design is saved. Explore the macro and design references below.</div>}</div>;
}
