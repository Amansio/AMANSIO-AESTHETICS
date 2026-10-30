import React from 'react';
import {AbsoluteFill,Audio,Img,Sequence,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {frameSvg} from './rig';
import {validateScenes} from './scenes';
import type {FilmProps,Scene} from './types';
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
const asset=(path:string)=>staticFile(path);
export const Shot:React.FC<{scene:Scene}>=({scene})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps,u=t/scene.duration;
 const fade=Math.min(1,scene.transition? t/scene.transition:1,scene.transition?(scene.duration-t)/scene.transition:1);
 const c=scene.countdown;const count=Math.max(0,c.value-Math.floor(t-c.start));
 return <AbsoluteFill style={{backgroundColor:'#15121b',opacity:fade,overflow:'hidden'}}>
  <AbsoluteFill style={{transform:`translate(${mix(...scene.camera.x,u)}px,${mix(...scene.camera.y,u)}px) scale(${mix(...scene.camera.zoom,u)})`}}>
   <Img src={asset(scene.background)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
   <AbsoluteFill dangerouslySetInnerHTML={{__html:frameSvg(scene.actors,t)}}/>
  </AbsoluteFill>
  <AbsoluteFill style={{background:`linear-gradient(135deg,rgba(255,201,125,${scene.light}),transparent 60%),radial-gradient(ellipse at 50% 45%,transparent 35%,rgba(14,11,18,.65))`,pointerEvents:'none'}}/>
  <div style={{position:'absolute',top:190,left:80,color:'#f4efe6',fontFamily:'sans-serif',fontSize:24,letterSpacing:9}}>THE KITCHEN · 01</div>
  {scene.caption&&<div style={{position:'absolute',bottom:240,left:80,color:'#f4efe6',fontFamily:'sans-serif',fontSize:28}}>{scene.caption}</div>}
  {c.enabled&&t>=c.start&&t<c.end&&<div style={{position:'absolute',top:370,width:'100%',textAlign:'center',color:'#f4efe6',fontFamily:'sans-serif'}}><div style={{fontSize:26,letterSpacing:8}}>{c.label}</div><div style={{fontSize:140,fontWeight:800}}>{count.toString().padStart(2,'0')}</div></div>}
  {scene.voice&&<Sequence from={Math.round(scene.voice.start*fps)}><Audio src={asset(scene.voice.src)} volume={scene.voice.volume} trimBefore={Math.round((scene.voice.trimBefore??0)*fps)}/></Sequence>}
 </AbsoluteFill>;
};
export const Film:React.FC<FilmProps>=({scenes})=>{validateScenes(scenes);let offset=0;return <AbsoluteFill style={{backgroundColor:'#15121b'}}>{scenes.map(scene=>{const from=offset;offset+=Math.round(scene.duration*30);return <Sequence key={scene.id} from={from} durationInFrames={Math.round(scene.duration*30)}><Shot scene={scene}/></Sequence>;})}</AbsoluteFill>;};
