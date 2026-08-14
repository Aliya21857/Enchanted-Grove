
(() => {
"use strict";

const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const screens={home:$("#home"),spell:$("#spell"),potion:$("#potion"),portrait:$("#portrait"),finale:$("#finale")};

const defaults={spell:false,potion:false,portrait:false,sfx:true,volume:.5,reduced:false};
let state=load();
function load(){try{return {...defaults,...JSON.parse(localStorage.getItem("egArcadeV3")||"{}")}}catch{return {...defaults}}}
function save(){localStorage.setItem("egArcadeV3",JSON.stringify(state));updateHome()}
function countDone(){return [state.spell,state.potion,state.portrait].filter(Boolean).length}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}

const sfx={
 click:"assets/audio/ui_click.wav", ok:"assets/audio/correct_magic.wav", no:"assets/audio/wrong_soft.wav",
 path:"assets/audio/path_restore.wav", bubble:"assets/audio/potion_bubble.wav", reward:"assets/audio/reward.wav", finale:"assets/audio/finale_cue.wav"
};
function sound(name,gain=1){
 if(!state.sfx)return;
 const src=sfx[name]; if(!src)return;
 const a=new Audio(src);a.volume=clamp(state.volume*gain,0,1);a.play().catch(()=>{});
}

// cursor
function applyCursor(){
 const active=matchMedia("(pointer:fine)").matches&&!state.reduced&&!matchMedia("(prefers-reduced-motion: reduce)").matches;
 document.body.classList.toggle("custom-cursor",active);
 $("#cursorCore").style.display=active?"block":"none";$("#cursorGlow").style.display=active?"block":"none";
}
window.addEventListener("mousemove",e=>{if(!document.body.classList.contains("custom-cursor"))return;$("#cursorCore").style.left=e.clientX+"px";$("#cursorCore").style.top=e.clientY+"px";$("#cursorGlow").style.left=e.clientX+"px";$("#cursorGlow").style.top=e.clientY+"px"});
applyCursor();

// modal
const backdrop=$("#modalBackdrop"),body=$("#modalBody");
function modal(html){body.innerHTML=html;backdrop.hidden=false;$("#modalX").focus()}
function closeModal(){backdrop.hidden=true;body.innerHTML=""}
$("#modalX").onclick=closeModal;backdrop.onclick=e=>{if(e.target===backdrop)closeModal()};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!backdrop.hidden)closeModal()});

function show(name){
 Object.entries(screens).forEach(([k,v])=>v.classList.toggle("active",k===name));
 if(name==="spell")startSpell(false);
 if(name==="potion")startPotion(false);
 if(name==="portrait")startPortrait(false);
 if(name==="finale")sound("finale",.9);
 window.scrollTo({top:0,behavior:state.reduced?"auto":"smooth"})
}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-nav]");if(nav){sound("click",.5);show(nav.dataset.nav);return}
 const start=e.target.closest("[data-start]");if(start){sound("click",.6);show(start.dataset.start);return}
 const info=e.target.closest("[data-info]");if(info){openInfo(info.dataset.info);return}
 const set=e.target.closest('[data-action="settings"]');if(set){openSettings();return}
 const reset=e.target.closest("[data-reset]");if(reset){
   if(reset.dataset.reset==="spell"){spell.started=false;startSpell(true)}
   if(reset.dataset.reset==="potion"){potion.started=false;startPotion(true)}
   if(reset.dataset.reset==="portrait"){portrait.started=false;startPortrait(true)}
   return
 }
 const scroll=e.target.closest("[data-scroll]");if(scroll)document.getElementById(scroll.dataset.scroll).scrollIntoView({behavior:"smooth"})
});

function openInfo(which){
 const html={
  home:`<h2>Three different game genres</h2><p>This version removes the “website inside the website” references and turns English into active gameplay.</p><ul><li><b>Rune Run:</b> move through a maze and physically collect sentence chunks in order.</li><li><b>Potion Rush:</b> catch the correct lexical orbs against a timer.</li><li><b>Portrait Hunt:</b> remember a short whisper, then find the object that proves you understood it.</li></ul>`,
  spell:`<h2>Rune Run</h2><p>Move with <b>WASD</b> or the arrow keys. Collect the glowing word runes in the correct English order. Wrong runes cost a heart. When the sentence is complete, reach the purple gate.</p>`,
  potion:`<h2>Potion Rush</h2><p>Each 15-second round gives a clue. Word-orbs appear in the arena. Catch the correct first half and second half of a natural English chunk before time runs out. Wrong catches reduce potion purity.</p>`,
  portrait:`<h2>Portrait Hunt</h2><p>A portrait whisper appears for a few seconds. Remember the key detail. When the scroll fades, click the correct hidden-object card. No synthetic voice — this game trains fast reading, memory and meaning.</p>`
 }[which];modal(html)
}
function openSettings(){
 modal(`<h2>Settings</h2>
 <div class="setting-row"><label>Sound effects</label><button class="top-btn" id="mSfx">${state.sfx?"On":"Off"}</button></div>
 <div class="setting-row"><label>Volume</label><input id="mVol" type="range" min="0" max="1" step=".05" value="${state.volume}"></div>
 <div class="setting-row"><label>Reduced motion</label><button class="top-btn" id="mMotion">${state.reduced?"On":"Off"}</button></div>
 <div class="setting-row"><label>Progress</label><button class="top-btn" id="mReset">Reset all</button></div>`);
 $("#mSfx").onclick=()=>{state.sfx=!state.sfx;save();openSettings()};
 $("#mVol").oninput=e=>{state.volume=+e.target.value;save()};
 $("#mMotion").onclick=()=>{state.reduced=!state.reduced;save();applyCursor();openSettings()};
 $("#mReset").onclick=()=>{state.spell=state.potion=state.portrait=false;save();spell.started=potion.started=portrait.started=false;closeModal();show("home")}
}

$("#sfxToggle").onclick=()=>{state.sfx=!state.sfx;save();$("#sfxToggle").style.opacity=state.sfx?"1":".45"};
$("#sfxToggle").style.opacity=state.sfx?"1":".45";

function updateHome(){
 const n=countDone();$("#treeImage").src=`assets/images/tree${n}.webp`;$("#treeCount").textContent=`${n} / 3 relics restored`;
 $("#treeStatus").textContent=["The Grove is sleeping.","The first roots are glowing.","Magic is flowing through the branches.","The Moon Tree is fully awake."][n];
 $("#relicSpell").classList.toggle("earned",state.spell);$("#relicPotion").classList.toggle("earned",state.potion);$("#relicPortrait").classList.toggle("earned",state.portrait);
}
function reward(which){
 state[which]=true;save();sound("reward",.9);
 const data={
  spell:["Firefly Ember restored","assets/images/firefly_ember.png","Your sentence runes reopened the forest road."],
  potion:["Moon Drop brewed","assets/images/moon_drop.png","Your natural English chunks stabilized the Moon Drop."],
  portrait:["Whisper Leaf awakened","assets/images/whisper_leaf.png","Your memory and reading unlocked the final relic."]
 }[which];
 modal(`<h2>${data[0]}</h2><p>${data[2]}</p><img src="${data[1]}" style="height:170px;margin:auto;object-fit:contain;filter:drop-shadow(0 0 24px rgba(255,211,99,.3))"><div style="text-align:center;margin-top:15px"><button class="primary" id="claim">Return to Grove</button></div>`);
 $("#claim").onclick=()=>{closeModal();countDone()===3?show("finale"):show("home")}
}

// ---------- RUNE RUN ----------
const spellLevels=[
 {focus:"Present Simple",answer:["My brother","goes","to school","every day."],chunks:["My brother","goes","to school","every day."]},
 {focus:"Frequency adverbs",answer:["We","usually","play football","after school."],chunks:["We","usually","play football","after school."]},
 {focus:"Present Continuous",answer:["She","is reading","a book","now."],chunks:["She","is reading","a book","now."]},
 {focus:"Questions",answer:["Do","they","play","football"],chunks:["Do","they","play","football"]},
 {focus:"Negative Present",answer:["We","don't like","rainy weather","today"],chunks:["We","don't like","rainy weather","today"]}
];
const baseMap=[
 "############",
 "#..........#",
 "#.##..##...#",
 "#..........#",
 "#..###.....#",
 "#..........#",
 "############"
];
let spell={started:false,level:0,x:1,y:1,hearts:3,seq:[],wrong:0,runes:[],gate:{x:10,y:5},hazards:[]};
function startSpell(force){
 if(spell.started&&!force)return;
 spell={started:true,level:0,x:1,y:1,hearts:3,seq:[],wrong:0,runes:[],gate:{x:10,y:5},hazards:[]};setupSpellLevel()
}
function freeCells(){
 let arr=[];for(let y=1;y<6;y++)for(let x=1;x<11;x++)if(baseMap[y][x]==="."&&!(x===1&&y===1)&&!(x===10&&y===5))arr.push({x,y});return arr
}
function setupSpellLevel(){
 if(spell.level>=spellLevels.length){reward("spell");return}
 spell.x=1;spell.y=1;spell.seq=[];spell.hearts=3;
 let cells=shuffle(freeCells());
 spell.runes=spellLevels[spell.level].chunks.map((text,i)=>({...cells[i],text,index:i,collected:false}));
 spell.hazards=cells.slice(6,10).map(c=>({...c}));
 renderMaze();updateSpellUI();setTimeout(()=>$("#maze").focus(),80)
}
function renderMaze(){
 const host=$("#maze");host.innerHTML="";
 for(let y=0;y<7;y++)for(let x=0;x<12;x++){
   const c=document.createElement("div");c.className="cell "+(baseMap[y][x]==="#"?"wall":"path");c.dataset.x=x;c.dataset.y=y;
   if(spell.hazards.some(h=>h.x===x&&h.y===y))c.classList.add("hazard");
   const rune=spell.runes.find(r=>r.x===x&&r.y===y&&!r.collected);
   if(rune){let d=document.createElement("div");d.className="word-rune";if(rune.index===spell.seq.length)d.classList.add("next");d.textContent=rune.text;c.appendChild(d)}
   if(x===spell.gate.x&&y===spell.gate.y){let g=document.createElement("div");g.className="gate"+(spell.seq.length===spellLevels[spell.level].answer.length?" open":"");c.appendChild(g)}
   if(x===spell.x&&y===spell.y){let p=document.createElement("div");p.className="player";c.appendChild(p)}
   host.appendChild(c)
 }
}
function updateSpellUI(){
 const lev=spellLevels[spell.level];$("#spellFocus").textContent=lev.focus;$("#spellStageText").textContent=`Stage ${spell.level+1} / ${spellLevels.length}`;
 $("#spellProgress").style.width=`${spell.level/spellLevels.length*100}%`;$("#spellCorrect").textContent=spell.seq.length;$("#spellWrong").textContent=spell.wrong;
 const strip=$("#collectedStrip");strip.innerHTML="";spell.seq.forEach(s=>{let el=document.createElement("span");el.textContent=s;strip.appendChild(el)});
 const hearts=$("#spellHearts");hearts.innerHTML="";for(let i=0;i<3;i++){let h=document.createElement("i");h.className="heart"+(i>=spell.hearts?" lost":"");hearts.appendChild(h)}
}
function moveSpell(dx,dy){
 let nx=spell.x+dx,ny=spell.y+dy;if(baseMap[ny]?.[nx]!=="." )return;
 spell.x=nx;spell.y=ny;
 if(spell.hazards.some(h=>h.x===nx&&h.y===ny)){spell.hearts--;spell.wrong++;sound("no",.6);$("#spellFeedback").textContent="Cursed tile! You lost one heart.";if(spell.hearts<=0){$("#spellFeedback").textContent="The curse reset this stage.";setTimeout(setupSpellLevel,700);renderMaze();updateSpellUI();return}}
 const rune=spell.runes.find(r=>r.x===nx&&r.y===ny&&!r.collected);
 if(rune){
   const expected=spell.seq.length;
   if(rune.index===expected){rune.collected=true;spell.seq.push(rune.text);sound("ok",.7);$("#spellFeedback").textContent="Correct rune. The path remembers your English."}
   else{spell.hearts--;spell.wrong++;sound("no",.6);$("#spellFeedback").textContent="Wrong order. Find the glowing next rune.";if(spell.hearts<=0){setTimeout(setupSpellLevel,700)}}
 }
 if(nx===spell.gate.x&&ny===spell.gate.y&&spell.seq.length===spellLevels[spell.level].answer.length){sound("path",.85);spell.level++;$("#spellFeedback").textContent="Gate opened! Next stage...";setTimeout(setupSpellLevel,700)}
 renderMaze();updateSpellUI()
}
window.addEventListener("keydown",e=>{if(!screens.spell.classList.contains("active"))return;let m={ArrowUp:[0,-1],w:[0,-1],W:[0,-1],ArrowDown:[0,1],s:[0,1],S:[0,1],ArrowLeft:[-1,0],a:[-1,0],A:[-1,0],ArrowRight:[1,0],d:[1,0],D:[1,0]}[e.key];if(m){e.preventDefault();moveSpell(...m)}});
$$("[data-move]").forEach(b=>b.onclick=()=>{const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[b.dataset.move];moveSpell(...d)});

// ---------- POTION RUSH ----------
const potionRounds=[
 ["school work you do at home",["do","homework"],["do","make","have","take","homework","a mistake","breakfast","a photo"],"I do my homework after dinner."],
 ["the morning meal",["have","breakfast"],["have","take","make","go","breakfast","a photo","a decision","shopping"],"We have breakfast at seven."],
 ["use a camera",["take","a photo"],["take","make","do","go","a photo","a mistake","homework","shopping"],"Can you take a photo of us?"],
 ["make a wrong action or error",["make","a mistake"],["make","take","have","do","a mistake","a photo","breakfast","homework"],"It's okay to make a mistake."],
 ["be curious about a topic",["be interested","in"],["be interested","be good","be afraid","be kind","in","at","of","to"],"I'm interested in space."],
 ["have a skill or talent",["be good","at"],["be good","be proud","be afraid","be interested","at","of","in","to"],"Mia is good at drawing."],
 ["search for something",["look","for"],["look","wait","listen","talk","for","to","with","at"],"I'm looking for my keys."],
 ["speak with a person",["talk","to"],["talk","ask","look","listen","to","for","with","at"],"I need to talk to my teacher."],
 ["choose what to do",["make","a decision"],["make","take care","look forward","get ready","a decision","of","to","for"],"We need to make a decision."],
 ["be together with someone",["spend time","with"],["spend time","take care","look forward","be kind","with","of","to","at"],"I like to spend time with my friends."]
];
let potion={started:false,round:0,timer:15,interval:null,selected:[],purity:3,combo:0,positions:[]};
function startPotion(force){
 if(potion.started&&!force)return;
 clearInterval(potion.interval);potion={started:true,round:0,timer:15,interval:null,selected:[],purity:3,combo:0,positions:[]};setupPotionRound()
}
function setupPotionRound(){
 clearInterval(potion.interval);
 if(potion.round>=potionRounds.length){reward("potion");return}
 potion.timer=15;potion.selected=[];potion.purity=3;$("#brewSlotA").textContent="Catch first half";$("#brewSlotB").textContent="Catch second half";
 const r=potionRounds[potion.round];$("#recipeClue").textContent=`Find the chunk that means: ${r[0]}.`;$("#potionRoundText").textContent=`Round ${potion.round+1} / ${potionRounds.length}`;
 $("#potionProgress").style.width=`${potion.round/potionRounds.length*100}%`;$("#potionFeedback").textContent="Catch the correct two orbs.";$("#exampleToast").textContent="Correct chunk → natural example.";
 renderPurity();renderBottles();spawnOrbs(r[2]);$("#potionTimer").textContent=potion.timer;
 potion.interval=setInterval(()=>{potion.timer--;$("#potionTimer").textContent=potion.timer;if(potion.timer<=0){clearInterval(potion.interval);potion.combo=0;$("#comboCount").textContent=potion.combo;sound("no",.65);$("#potionFeedback").textContent="Time faded. Restarting this potion...";setTimeout(setupPotionRound,850)}},1000)
}
function spawnOrbs(words){
 const host=$("#orbField");host.innerHTML="";
 const positions=[[8,16],[32,10],[58,14],[78,22],[14,40],[38,34],[64,38],[80,48]];
 shuffle(words).forEach((w,i)=>{let b=document.createElement("button");b.className="word-orb";b.textContent=w;b.style.left=positions[i][0]+"%";b.style.top=positions[i][1]+"%";b.style.setProperty("--dx",((i%2?1:-1)*(12+(i%3)*7))+"px");b.style.setProperty("--dy",((i%3?1:-1)*(9+(i%4)*5))+"px");b.style.animationDelay=(-i*.31)+"s";b.onclick=()=>catchOrb(w,b);host.appendChild(b)})
}
function catchOrb(word,btn){
 if(potion.selected.includes(word)||potion.selected.length>=2)return;
 potion.selected.push(word);btn.classList.add("caught");setTimeout(()=>btn.remove(),260);
 if(potion.selected.length===1)$("#brewSlotA").textContent=word;else $("#brewSlotB").textContent=word;
 if(potion.selected.length===2)setTimeout(checkPotion,160)
}
function checkPotion(){
 const r=potionRounds[potion.round],ok=potion.selected[0]===r[1][0]&&potion.selected[1]===r[1][1];
 if(ok){clearInterval(potion.interval);potion.combo++;$("#comboCount").textContent=potion.combo;sound("bubble",.8);setTimeout(()=>sound("ok",.75),130);$("#potionFeedback").textContent=`Perfect: ${r[1][0]} ${r[1][1]}`;$("#exampleToast").textContent=r[3];$("#brewLiquid").style.filter=`hue-rotate(${potion.round*24}deg) saturate(1.3) brightness(1.1)`;potion.round++;setTimeout(setupPotionRound,1100)}
 else{potion.purity--;potion.combo=0;$("#comboCount").textContent=0;sound("no",.65);$("#potionFeedback").textContent="Wrong combination — potion purity dropped.";renderPurity();potion.selected=[];$("#brewSlotA").textContent="Catch first half";$("#brewSlotB").textContent="Catch second half";if(potion.purity<=0){clearInterval(potion.interval);setTimeout(setupPotionRound,750)}else spawnOrbs(r[2])}
}
function renderPurity(){const h=$("#purityMeter");h.innerHTML="";for(let i=0;i<3;i++){let el=document.createElement("i");if(i>=potion.purity)el.classList.add("lost");h.appendChild(el)}}
function renderBottles(){const h=$("#bottleGrid");h.innerHTML="";for(let i=0;i<potionRounds.length;i++){let d=document.createElement("div");d.className="bottle"+(i<potion.round?" full":"");h.appendChild(d)}}

// ---------- PORTRAIT HUNT ----------
const objectSVG={
 book:`<svg viewBox="0 0 64 64"><path fill="#d7b46c" d="M10 12h20c6 0 10 3 12 6 2-3 6-6 12-6v40c-7 0-11 2-12 5-2-3-6-5-12-5H10z"/><path fill="#6a3d30" d="M14 17h14v29H14zm36 0H36v29h14z"/></svg>`,
 key:`<svg viewBox="0 0 64 64"><circle cx="20" cy="24" r="10" fill="none" stroke="#e0bd70" stroke-width="6"/><path d="M28 30l24 24m-8-8l7-7m-14 0l7-7" stroke="#e0bd70" stroke-width="6" fill="none"/></svg>`,
 honey:`<svg viewBox="0 0 64 64"><path fill="#d79a34" d="M18 18h28l4 9-4 28H18l-4-28z"/><rect x="21" y="9" width="22" height="10" rx="3" fill="#b88b53"/><path d="M23 33c6-6 12 6 18 0" stroke="#ffe28f" stroke-width="3" fill="none"/></svg>`,
 map:`<svg viewBox="0 0 64 64"><path fill="#dec58d" d="M8 12l16 6 16-7 16 6v36l-16-6-16 7-16-6z"/><path d="M24 18v36m16-43v36" stroke="#9c7446" stroke-width="3"/><path d="M14 34c8-9 16 8 26-5" stroke="#8b4c3f" stroke-width="3" fill="none"/></svg>`,
 pie:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="46" rx="24" ry="9" fill="#b97939"/><path fill="#e8b65f" d="M11 43c4-18 38-18 42 0z"/><path d="M20 35l24 8m-24 0l24-8" stroke="#9d5e35" stroke-width="3"/></svg>`,
 lantern:`<svg viewBox="0 0 64 64"><path d="M22 14h20l5 10v26H17V24z" fill="#7a5b3b" stroke="#e0b66b" stroke-width="3"/><path fill="#ffd875" d="M23 27h18v17H23z"/><path d="M25 14c0-8 14-8 14 0" fill="none" stroke="#e0b66b" stroke-width="3"/></svg>`,
 stars:`<svg viewBox="0 0 64 64"><path fill="#f4d37d" d="M32 6l5 14 15-2-12 9 6 14-14-8-13 8 5-14-12-9 15 2z"/><circle cx="50" cy="11" r="3" fill="#a8c7ff"/><circle cx="12" cy="47" r="3" fill="#a8c7ff"/></svg>`,
 tree:`<svg viewBox="0 0 64 64"><path fill="#705038" d="M27 36h10v23H27z"/><circle cx="22" cy="29" r="14" fill="#547a46"/><circle cx="41" cy="27" r="16" fill="#5e8d50"/><circle cx="33" cy="17" r="14" fill="#6b985a"/></svg>`,
 river:`<svg viewBox="0 0 64 64"><path d="M4 20c14 12 26-12 56 3M4 34c16 12 30-12 56 2M4 48c18 10 31-10 56 1" fill="none" stroke="#6ab8da" stroke-width="7" stroke-linecap="round"/></svg>`
};
const portraitRounds=[
 {speaker:"Rowan",portrait:0,text:"I never fly through the dark valley alone. I usually take the lantern path.",q:"Which object matches Rowan's usual path?",answer:"lantern",opts:["lantern","map","book","pie","key","river"]},
 {speaker:"Liora",portrait:1,text:"I'm looking for my red book. I need it for the story circle tonight.",q:"What is Liora looking for?",answer:"book",opts:["book","key","map","honey","tree","lantern"]},
 {speaker:"Arlen",portrait:2,text:"Every Friday I play music by the river, but tonight I'm playing in the Moon Hall.",q:"Which place is part of Arlen's usual Friday routine?",answer:"river",opts:["river","tree","lantern","map","book","stars"]},
 {speaker:"Grandma Poppy",portrait:3,text:"The apple pies are in the oven now. I bake them every Sunday for the children.",q:"What is in the oven now?",answer:"pie",opts:["pie","honey","book","key","map","lantern"]},
 {speaker:"Timble",portrait:4,text:"I'm carrying a little map because I want to find the hidden waterfall.",q:"What is Timble carrying?",answer:"map",opts:["map","book","key","lantern","pie","tree"]},
 {speaker:"Professor Hootwell",portrait:5,text:"Today we're learning how to find north by the stars.",q:"What helps the explorers find north?",answer:"stars",opts:["stars","map","river","tree","book","key"]},
 {speaker:"Arlen",portrait:2,text:"The silver key is under the small blue box, not beside it.",q:"Which object is hidden under the blue box?",answer:"key",opts:["key","book","honey","map","lantern","pie"]},
 {speaker:"Grandma Poppy",portrait:3,text:"I need some honey for the cakes. Could you bring me the jar next to the flowers?",q:"What ingredient does Grandma Poppy need?",answer:"honey",opts:["honey","pie","book","key","map","stars"]}
];
const portraitImgs=["portrait_01.webp","portrait_02.webp","portrait_03.webp","portrait_04.webp","portrait_05.webp","portrait_06.webp"];
let portrait={started:false,round:0,streak:0,solved:new Set(),timer:null};
function startPortrait(force){
 if(portrait.started&&!force)return;
 clearInterval(portrait.timer);portrait={started:true,round:0,streak:0,solved:new Set(),timer:null};setupPortraitRound()
}
function renderGallery(active){
 const h=$("#galleryWall");h.innerHTML="";
 portraitImgs.forEach((img,i)=>{let f=document.createElement("div");f.className="frame"+(i===active?" glow":"")+(portrait.solved.has(i)?" solved":"");f.innerHTML=`<img src="assets/images/${img}" alt=""><div class="frame-name">${["Rowan","Liora","Arlen","Grandma Poppy","Timble","Professor Hootwell"][i]}</div>`;h.appendChild(f)})
}
function setupPortraitRound(){
 clearInterval(portrait.timer);if(portrait.round>=portraitRounds.length){reward("portrait");return}
 const r=portraitRounds[portrait.round];renderGallery(r.portrait);$("#portraitRoundText").textContent=`Mystery ${portrait.round+1} / ${portraitRounds.length}`;$("#portraitProgress").style.width=`${portrait.round/portraitRounds.length*100}%`;
 $("#memoryScroll").classList.remove("hidden");$("#huntPanel").classList.add("hidden");$("#whisperSpeaker").textContent=`${r.speaker} whispers...`;$("#whisperText").textContent=r.text;
 let t=6;$("#memoryTime").textContent=t;portrait.timer=setInterval(()=>{t--;$("#memoryTime").textContent=t;if(t<=0){clearInterval(portrait.timer);showHunt()}},1000)
}
function showHunt(){
 const r=portraitRounds[portrait.round];$("#memoryScroll").classList.add("hidden");$("#huntPanel").classList.remove("hidden");$("#huntQuestion").textContent=r.q;$("#portraitStreak").textContent=portrait.streak;$("#portraitFeedback").textContent="Choose the object that proves you understood the whisper.";
 const h=$("#objectGrid");h.innerHTML="";shuffle(r.opts).forEach(key=>{let b=document.createElement("button");b.className="object-card";b.innerHTML=`${objectSVG[key]}<span>${({book:"Red book",key:"Silver key",honey:"Honey jar",map:"Map",pie:"Apple pie",lantern:"Lantern",stars:"Stars",tree:"Old oak",river:"River"})[key]}</span>`;b.onclick=()=>checkPortrait(key,b);h.appendChild(b)})
}
function checkPortrait(key,btn){
 const r=portraitRounds[portrait.round];if(key===r.answer){btn.classList.add("correct");portrait.streak++;portrait.solved.add(r.portrait);sound("ok",.75);$("#portraitFeedback").textContent="Correct — you remembered the key detail.";portrait.round++;setTimeout(setupPortraitRound,850)}
 else{btn.classList.add("wrong");portrait.streak=0;$("#portraitStreak").textContent=0;sound("no",.6);$("#portraitFeedback").textContent="Not that object. The whisper will return for 3 seconds.";setTimeout(()=>{btn.classList.remove("wrong");$("#huntPanel").classList.add("hidden");$("#memoryScroll").classList.remove("hidden");$("#memoryTime").textContent="3";setTimeout(showHunt,3000)},700)}
}

$("#playAgain").onclick=()=>{state.spell=state.potion=state.portrait=false;save();spell.started=potion.started=portrait.started=false;show("home")};

updateHome();
})();
