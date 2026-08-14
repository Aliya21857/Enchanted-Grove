const KEY='enchantedGrove.v1';
export const defaults={fireflyFlightCompleted:false,moonlightPotionCompleted:false,whisperingWoodsCompleted:false,moonTreeAwakened:false,musicEnabled:true,sfxEnabled:true,musicVolume:.32,sfxVolume:.65,reducedMotion:false};
export function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}}
export function save(state){localStorage.setItem(KEY,JSON.stringify(state))}
export function resetProgress(state){return {...state,fireflyFlightCompleted:false,moonlightPotionCompleted:false,whisperingWoodsCompleted:false,moonTreeAwakened:false}}
