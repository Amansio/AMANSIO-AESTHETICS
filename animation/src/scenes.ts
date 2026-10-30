import type {Scene} from './types';
export const kitchen:Scene={
 id:'kitchen',duration:7,background:'backgrounds/kitchen.png',
 camera:{zoom:[1,1.045],x:[0,-10],y:[0,-12]},light:0.18,transition:0.22,
 countdown:{enabled:true,start:4.5,end:7,value:3,label:'SECONDS LEFT'},
 narration:'You walk into the kitchen. Then you see it. You freeze.',
 actors:[
  {id:'hoodie',skin:'hoodie',s:3.8,keys:[
   {t:0,x:-170,y:1180,pose:'standing',expr:'neutral',face:1,gaze:0},
   {t:2.3,x:365,y:1180,move:'walk'},
   {t:2.8,pose:'standing',gaze:1,turn:0.6},
   {t:3.7,pose:'think',expr:'worried'},
   {t:4.55,pose:'arms_raised',expr:'surprised',rot:-7,turn:0,gaze:0},
   {t:5.2,pose:'shrug',rot:-3},{t:7}]},
  {id:'mother',skin:'mother',s:3.65,keys:[
   {t:0,x:795,y:1158,pose:'holding',expr:'neutral',face:1,gaze:1,turn:0.8},
   {t:2.8,pose:'standing',face:-1,gaze:0,turn:0},
   {t:4.2,pose:'hands_hips',expr:'worried'}, {t:7}]}
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
