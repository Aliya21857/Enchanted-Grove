const KEY='enchantedGroveRebuild.v1';
export const base={spellPathCompleted:false,potionOfWordsCompleted:false,whisperingPortraitsCompleted:false,moonTreeState:0,soundEnabled:true,musicEnabled:true,sfxEnabled:true,volume:.6,musicVolume:.35,sfxVolume:.7,voiceVolume:.9,reducedMotion:false};
export function read(){try{return{...base,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return{...base}}}
export function write(s){localStorage.setItem(KEY,JSON.stringify(s))}
export function clearProgress(s){return{...s,spellPathCompleted:false,potionOfWordsCompleted:false,whisperingPortraitsCompleted:false,moonTreeState:0}}
