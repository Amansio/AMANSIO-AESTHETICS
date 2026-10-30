export type Key = {t:number;x?:number;y?:number;face?:number;pose?:string;expr?:string;move?:'walk'|'run';rot?:number;gaze?:number;turn?:number;wiggle?:{a:number;p:number}};
export type Actor = {id:string;skin:'hoodie'|'mother'|'guest';s:number;shirt?:string;keys:Key[]};
export type Scene = {id:string;duration:number;background:string;actors:Actor[];camera:{zoom:[number,number];x:[number,number];y:[number,number]};countdown:{enabled:boolean;start:number;end:number;value:number;label:string};caption?:string;voice?:{src:string;start:number;volume:number;trimBefore?:number};narration?:string;transition:number;light:number};
export type FilmProps = {scenes:Scene[]};
