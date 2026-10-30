import React from 'react';
import {AbsoluteFill,Audio,Img,Sequence,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {frameSvg,sample} from './rig';
import {validateScenes} from './scenes';
import type {FilmProps,Scene} from './types';
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
const easeOut=(u:number)=>1-Math.pow(1-u,3);
const asset=(path:string)=>staticFile(path);
export const Shot:React.FC<{scene:Scene}>=({scene})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps,u=t/scene.duration;
 const fade=Math.min(1,scene.transition? t/scene.transition:1,scene.transition?(scene.duration-t)/scene.transition:1);
 const c=scene.countdown;
 // Only one visible text overlay: "7 DAYS", tracked to the mother's head every frame.
 const mother=scene.actors.find(a=>a.skin==='mother');
 const ms=mother?sample(mother,t):null;
 const headR=18*((ms?.sc??1));
 const mx=ms?ms.s.x+ms.p.head[0]*ms.fc*ms.sc:540;
 const my=ms?(ms.s.y+ms.bobY-ms.hop*ms.sc)+ms.p.head[1]*ms.sc:960;
 // Camera matches Shot's CSS transform: translate(tx,ty) scale(s) around comp centre (540,960).
 const sCam=1+0.025*u, txCam=-6*u, tyCam=-8*u;
 const headScreenY=960+(my-960)*sCam+tyCam;
 const headScreenR=headR*sCam;
 const headScreenX=540+(mx-540)*sCam+txCam;
 // Box height estimate: single line at font 64px (~1.22 line height) + 26px vertical padding.
 const boxH=64*1.22+26;
 const reveal=c.enabled&&t>=c.start&&t<c.end?Math.min(1,(t-c.start)/0.6):0;
 const lift=reveal?(1-easeOut(reveal))*20:0;
 // Box bottom clears the head top edge by a 20px gap; box sits fully above the head.
 const top0=headScreenY-headScreenR-20-boxH;
 const clampedX=Math.min(Math.max(headScreenX,150),930);
 return <AbsoluteFill style={{backgroundColor:'#15121b',opacity:fade,overflow:'hidden'}}>
  <AbsoluteFill style={{transform:`translate(${mix(...scene.camera.x,u)}px,${mix(...scene.camera.y,u)}px) scale(${mix(...scene.camera.zoom,u)})`}}>
   <Img src={asset(scene.background)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
   <AbsoluteFill dangerouslySetInnerHTML={{__html:frameSvg(scene.actors,t)}}/>
   {reveal>0&&<div style={{position:'absolute',left:Math.round(clampedX),top:Math.round(top0+lift),transform:'translate(-50%,0)',opacity:reveal,pointerEvents:'none'}}>
    <div style={{display:'inline-block',whiteSpace:'nowrap',lineHeight:1,background:'rgba(14,11,18,0.65)',backdropFilter:'blur(8px)',padding:'14px 30px',borderRadius:'14px',border:'1px solid rgba(255,255,255,0.4)',color:'#f4efe6',fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,"Sego UI",Roboto,sans-serif',fontSize:'64px',fontWeight:'900',letterSpacing:'4px',textShadow:'0 4px 16px rgba(0,0,0,0.7)'}}>{c.label}</div>
   </div>}
  </AbsoluteFill>
  <AbsoluteFill style={{background:`linear-gradient(135deg,rgba(255,201,125,${scene.light}),transparent 60%),radial-gradient(ellipse at 50% 45%,transparent 35%,rgba(14,11,18,.65))`,pointerEvents:'none'}}/>
  {scene.caption&&<div style={{position:'absolute',bottom:240,left:80,color:'#f4efe6',fontFamily:'sans-serif',fontSize:28}}>{scene.caption}</div>}
  {scene.voice&&<Sequence from={Math.round(scene.voice.start*fps)}><Audio src={asset(scene.voice.src)} volume={scene.voice.volume} trimBefore={Math.round((scene.voice.trimBefore??0)*fps)}/></Sequence>}
 </AbsoluteFill>;
};
export const Film:React.FC<FilmProps>=({scenes})=>{validateScenes(scenes);let offset=0;return <AbsoluteFill style={{backgroundColor:'#15121b'}}>{scenes.map(scene=>{const from=offset;offset+=Math.round(scene.duration*30);return <Sequence key={scene.id} from={from} durationInFrames={Math.round(scene.duration*30)}><Shot scene={scene}/></Sequence>;})}</AbsoluteFill>;};
