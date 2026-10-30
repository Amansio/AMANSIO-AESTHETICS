// Figures supplies the actual articulated skeleton, IK walk, spring poses, blink and facial blend.
import Figures from '../vendor/figures/figures.cjs';
import type {Actor} from './types';
export const INK='#0e0b12',CREAM='#f4efe6',BLUE='#1e56a0';
const n=(v:number)=>Number(v.toFixed(3));
type Point=number[];
const pt=(p:Point)=>`${n(p[0])} ${n(p[1])}`;
export function sample(actor:Actor,t:number){return Figures.actorState(actor,t);}
export function skinSvg(actor:Actor,t:number):string{
 const st=sample(actor,t);const {p,s,sc,fc,bobY,hop,X,blink}=st;
 const color=actor.shirt??(actor.skin==='hoodie'?BLUE:actor.skin==='mother'?'#aa625e':'#687c70');
 const line=(points:Point[],c:string,w:number)=>`<polyline points="${points.map(pt).join(' ')}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 let g=`<ellipse cx="${n(s.x)}" cy="${n(s.y+53*sc)}" rx="100" ry="17" fill="${INK}" opacity=".16"/>`;
 let body=line([[0,0],...p.ll],INK,5)+line([[0,0],...p.rl],INK,5);
 body+=`<path d="M ${p.neck[0]-13} ${p.neck[1]+6} Q ${p.neck[0]} ${p.neck[1]-9} ${p.neck[0]+13} ${p.neck[1]+6} L 16 3 Q 0 8 -16 3 Z" fill="${color}" stroke="${INK}" stroke-width="1.5"/>`;
 // Sleeves follow shoulder/elbow/wrist, rather than a static clothing image.
 for(const arm of [p.la,p.ra]){body+=line([p.sh,...arm],INK,10)+line([p.sh,...arm],color,8);body+=`<circle cx="${arm[1][0]}" cy="${arm[1][1]}" r="3.5" fill="${INK}"/>`;}
 if(actor.skin==='hoodie')body+=`<path d="M -9 -9 L -11 -1 L 11 -1 L 9 -9 M -4 -33 L -5 -24 M 4 -33 L 5 -24" fill="none" stroke="#143d74" stroke-width="1.4" stroke-linecap="round"/>`;
 if(actor.skin==='mother')body+=`<path d="M -10 -28 L -16 6 Q 0 12 16 6 L 10 -28 Z" fill="#e2bf94"/><path d="M -8 -25 Q 0 -18 8 -25" fill="none" stroke="#aa625e"/>`;
 // Head remains perfectly circular; head-turn is expressed by facial displacement, not squashing the skull.
 const [hx,hy]=p.head; const turn=s.turn??0;const gaze=s.gaze??0;
 body+=`<circle cx="${hx}" cy="${hy}" r="18" fill="${INK}"/>`;
 if(actor.skin==='mother')body+=`<circle cx="${hx-15}" cy="${hy-9}" r="8" fill="${INK}"/><path d="M ${hx-16} ${hy-10} Q ${hx} ${hy-29} ${hx+17} ${hy-8}" fill="none" stroke="#594354" stroke-width="3"/>`;
 body+=`<g transform="translate(${hx+turn*5} ${hy}) rotate(${turn*7})">${Figures.face2(X.F,CREAM,[gaze*2,0],blink)}</g>`;
 if(X.name==='surprised')body+=`<path d="M -29 -88 L -34 -99 M -11 -95 L -12 -107 M 12 -94 L 17 -105" fill="none" stroke="${CREAM}" stroke-width="3" stroke-linecap="round"/>`;
 g+=`<g transform="translate(${n(s.x)} ${n(s.y+bobY-hop*sc)}) scale(${n(fc*sc)} ${n(sc)}) rotate(${s.rot??0})">${body}</g>`;
 return g;
}
export function frameSvg(actors:Actor[],t:number){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920">${actors.map(a=>skinSvg(a,t)).join('')}</svg>`;}
