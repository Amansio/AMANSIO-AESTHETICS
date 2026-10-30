import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {kitchen,storyboard} from './scenes';
import type {FilmProps} from './types';
const duration=({props}:{props:FilmProps})=>({durationInFrames:props.scenes.reduce((n,s)=>n+Math.round(s.duration*30),0)});
export const Root=()=> <>
 <Composition id="Kitchen" component={Film} width={1080} height={1920} fps={30} durationInFrames={210} defaultProps={{scenes:[kitchen]}} calculateMetadata={duration}/>
 <Composition id="Story20" component={Film} width={1080} height={1920} fps={30} durationInFrames={4200} defaultProps={{scenes:storyboard}} calculateMetadata={duration}/>
</>;
