import type {Scene} from './types';
export const kitchen:Scene={
 id:'kitchen',duration:7,background:'backgrounds/kitchen.png',
 camera:{zoom:[1,1.025],x:[0,-6],y:[0,-8]},light:0.18,transition:0.22,
 countdown:{enabled:true,start:4.2,end:7,value:7,label:'7 DAYS'},
 narration:'You walk into the kitchen. Then you see it. You freeze.',
 actors:[
  {id:'hoodie',skin:'hoodie',s:3.8,keys:[
   {t:0,x:-170,y:1180,pose:'standing',expr:'neutral',face:1,gaze:0},
   {t:0.75,x:40,move:'walk'},
   {t:1.5,x:214,move:'walk'},
   {t:2.25,x:352,move:'walk'},
   {t:2.45,x:352,pose:'standing'},
   {t:2.7,gaze:1},
   {t:3.0,turn:0.35},
   {t:3.55,pose:'think',expr:'worried'},
   {t:4.82,x:352,turn:0.45},
   {t:4.85,expr:'surprised',pose:'shrug',x:340,turn:0.5},
   {t:5.9,pose:'think',x:348,turn:0.5},
   {t:7}]},
  {id:'mother',skin:'mother',s:3.65,keys:[
   {t:0,x:795,y:1158,pose:'holding',expr:'neutral',face:1,gaze:0,turn:0,wiggle:{a:4,p:1.5}},
   {t:2.7,pose:'standing',wiggle:{a:0,p:1.5}},
   {t:3.3,gaze:-1},
   {t:3.6,turn:-0.6},
   {t:4.0,turn:-0.7,expr:'happy'},
   {t:4.95,expr:'worried'},
   {t:6.0,turn:-0.85},
   {t:7}]}
 ]
};
// Editable storyboard slots, not twenty finished scenes. Replace each slot with its own actors/assets/audio.
export const storyboard:Scene[]=Array.from({length:20},(_,i)=>({...structuredClone(kitchen),id:`scene-${String(i+1).padStart(2,'0')}`,caption:`STORYBOARD SLOT ${i+1} / 20`}));
export function validateScenes(scenes:Scene[]){
 if(!scenes.length)throw new Error('At least one scene required');
 for(const s of scenes){
  if(!Number.isFinite(s.duration)||s.duration<=0)throw new Error('Invalid duration');
  if(s.narration && (!/\byou\b/i.test(s.narration)||/\bhoodie\b/i.test(s.narration)))throw new Error('Narration must address you, never Hoodie');
  for(const a of s.actors){if(!a.keys.length||a.keys[0].t!==0||a.keys[0].x===undefined||a.keys[0].y===undefined)throw new Error('Actor needs initial position');
   if(a.keys.some((k,i)=>k.t<0||k.t>s.duration||(i>0&&k.t<=a.keys[i-1].t)))throw new Error('Keys must be ordered within scene');}
 }
}
