
(() => {
  "use strict";

  // -------- CONTENT --------
  const spellStages = [
    {name:"Lantern Steps", tasks:[
      {chunks:["every day.","to school","My brother","goes"], answer:["My brother","goes","to school","every day."], focus:"Present Simple", hint:"Start with the person. Then use the verb, place and time."},
      {chunks:["usually","We","after school.","play football"], answer:["We","usually","play football","after school."], focus:"Frequency adverbs", hint:"Frequency adverbs often go before the main verb."},
      {chunks:["breakfast","at seven.","has","Mia"], answer:["Mia","has","breakfast","at seven."], focus:"Present Simple", hint:"Who? → action → object → time."}
    ]},
    {name:"Moon Bridge", tasks:[
      {chunks:["a book","is reading","now.","She"], answer:["She","is reading","a book","now."], focus:"Present Continuous", hint:"Present Continuous: subject + am/is/are + verb-ing."},
      {chunks:["are","in the garden.","The children","playing"], answer:["The children","are","playing","in the garden."], focus:"Present Continuous", hint:"Plural subject → are + verb-ing."},
      {chunks:["today.","isn't wearing","Tom","his jacket"], answer:["Tom","isn't wearing","his jacket","today."], focus:"Negative Present Continuous", hint:"Negative: subject + isn't/aren't + verb-ing."}
    ]},
    {name:"Whisper Gate", tasks:[
      {chunks:["rainy weather.","don't like","We"], answer:["We","don't like","rainy weather."], focus:"Negative Present Simple", hint:"Subject + don't/doesn't + base verb."},
      {chunks:["on Sundays?","football","Do","they","play"], answer:["Do","they","play","football","on Sundays?"], focus:"Present Simple question", hint:"Questions begin with Do/Does, then subject, then base verb."},
      {chunks:["doing","What","you","are","now?"], answer:["What","are","you","doing","now?"], focus:"Present Continuous question", hint:"Question word + am/is/are + subject + verb-ing."},
      {chunks:["always","before bed.","reads","She"], answer:["She","always","reads","before bed."], focus:"Frequency adverbs", hint:"Always usually comes before the main verb."}
    ]}
  ];

  const potionLevels = [
    {name:"Everyday Magic", pairs:[["do","homework"],["have","breakfast"],["take","a photo"],["make","a mistake"],["go","shopping"]]},
    {name:"People & Feelings", pairs:[["be good","at"],["be interested","in"],["be afraid","of"],["be proud","of"],["be kind","to"]]},
    {name:"Daily Adventures", pairs:[["look","for"],["listen","to"],["wait","for"],["talk","to"],["ask","for"]]},
    {name:"Grove Mastery", pairs:[["make","a decision"],["take care","of"],["look forward","to"],["get ready","for"],["spend time","with"]]}
  ];

  const phraseExamples = {
    "do homework":"I do my homework after dinner.",
    "have breakfast":"We have breakfast at seven.",
    "take a photo":"Can you take a photo of us?",
    "make a mistake":"It's okay to make a mistake.",
    "go shopping":"We go shopping on Saturdays.",
    "be good at":"Mia is good at drawing.",
    "be interested in":"I'm interested in space.",
    "be afraid of":"He is afraid of spiders.",
    "be proud of":"She is proud of her project.",
    "be kind to":"Please be kind to animals.",
    "look for":"I'm looking for my keys.",
    "listen to":"We listen to music after school.",
    "wait for":"Please wait for me.",
    "talk to":"I need to talk to my teacher.",
    "ask for":"You can ask for help.",
    "make a decision":"We need to make a decision.",
    "take care of":"I take care of my little brother.",
    "look forward to":"I look forward to the holidays.",
    "get ready for":"Let's get ready for school.",
    "spend time with":"I like to spend time with my friends."
  };

  const portraitCharacters = [
    {id:"rowan", name:"Rowan", trait:"forest messenger", img:"assets/images/portrait_01.webp", pitch:.88, rate:.92},
    {id:"liora", name:"Liora", trait:"storykeeper", img:"assets/images/portrait_02.webp", pitch:1.16, rate:.96},
    {id:"arlen", name:"Arlen", trait:"travelling musician", img:"assets/images/portrait_03.webp", pitch:.94, rate:1.02},
    {id:"poppy", name:"Grandma Poppy", trait:"baker", img:"assets/images/portrait_04.webp", pitch:1.04, rate:.88},
    {id:"timble", name:"Timble", trait:"young explorer", img:"assets/images/portrait_05.webp", pitch:1.24, rate:1.0},
    {id:"hootwell", name:"Professor Hootwell", trait:"scholar", img:"assets/images/portrait_06.webp", pitch:.76, rate:.86}
  ];

  const portraitTasks = [
    {speaker:"rowan", line:"I usually wake up early, but today I'm still tired because I travelled all night.", question:"Why is Rowan tired today?", answer:"He travelled all night.", focus:"Listening for detail"},
    {speaker:"liora", line:"I'm looking for my red book. I need it for the story circle tonight.", question:"What is Liora looking for?", answer:"Her red book.", focus:"Listening for detail"},
    {speaker:"arlen", line:"Every Friday I play music by the river, but tonight I'm playing in the Moon Hall.", question:"Where is Arlen playing tonight?", answer:"In the Moon Hall.", focus:"Present Simple vs Continuous"},
    {speaker:"poppy", line:"The apple pies are in the oven now. I bake them every Sunday for the children.", question:"What is Grandma Poppy making now?", answer:"Apple pies.", focus:"Listening for detail"},
    {speaker:"timble", line:"I don't like loud places. I'm waiting behind the old oak until the festival becomes quieter.", question:"Where is Timble waiting?", answer:"Behind the old oak.", focus:"Prepositions of place"},
    {speaker:"hootwell", line:"I teach young explorers how to read maps. Today we're learning how to find north by the stars.", question:"What are they learning today?", answer:"How to find north by the stars.", focus:"Listening for gist"},
    {speaker:"liora", line:"My sister usually visits me on Saturdays, but this weekend she's staying at home.", question:"Is Liora's sister visiting this weekend?", answer:"No, she is staying at home.", focus:"Present Simple vs Continuous"},
    {speaker:"arlen", line:"Please listen carefully. The silver key is under the small blue box, not beside it.", question:"Where is the silver key?", answer:"Under the small blue box.", focus:"Prepositions of place"},
    {speaker:"poppy", line:"I need some honey for the cakes. Could you bring me the jar next to the flowers?", question:"What does Grandma Poppy need?", answer:"Honey.", focus:"Everyday vocabulary"},
    {speaker:"rowan", line:"I never fly through the dark valley alone. I usually take the lantern path.", question:"Which path does Rowan usually take?", answer:"The lantern path.", focus:"Frequency adverbs"},
    {speaker:"timble", line:"I'm carrying a little map because I want to find the hidden waterfall.", question:"Why is Timble carrying a map?", answer:"To find the hidden waterfall.", focus:"Listening for purpose"},
    {speaker:"hootwell", line:"Remember: we use the present continuous for actions happening now.", question:"Which tense does Professor Hootwell mention?", answer:"The present continuous.", focus:"Grammar awareness"}
  ];

  const screens = {
    home: document.getElementById("homeScreen"),
    spell: document.getElementById("spellScreen"),
    potion: document.getElementById("potionScreen"),
    portraits: document.getElementById("portraitsScreen"),
    finale: document.getElementById("finaleScreen")
  };

  // -------- STATE --------
  const defaultState = {
    spellCompleted:false, potionCompleted:false, portraitsCompleted:false,
    musicEnabled:true, sfxEnabled:true, masterVolume:.55, reducedMotion:false
  };
  let state = loadState();
  let currentScreen = "home";
  let lastFocus = null;

  function loadState(){
    try { return {...defaultState, ...JSON.parse(localStorage.getItem("enchantedGroveState") || "{}")}; }
    catch { return {...defaultState}; }
  }
  function saveState(){
    localStorage.setItem("enchantedGroveState", JSON.stringify(state));
    updateHomeProgress();
  }

  // -------- AUDIO --------
  const ambient = document.getElementById("ambientAudio");
  ambient.volume = state.masterVolume * .45;
  const sfxFiles = {
    click:"assets/audio/ui_click.wav",
    correct:"assets/audio/correct_magic.wav",
    wrong:"assets/audio/wrong_soft.wav",
    reward:"assets/audio/reward.wav",
    path:"assets/audio/path_restore.wav",
    bubble:"assets/audio/potion_bubble.wav",
    speak:"assets/audio/portrait_speaking.wav",
    finale:"assets/audio/finale_cue.wav"
  };
  const audioCache = {};
  function playSfx(name, volume=1){
    if(!state.sfxEnabled) return;
    const src=sfxFiles[name]; if(!src) return;
    let a = new Audio(src);
    a.volume = Math.max(0, Math.min(1, state.masterVolume * volume));
    a.play().catch(()=>{});
  }
  function ensureAmbient(){
    ambient.volume = state.masterVolume * .42;
    if(state.musicEnabled){
      ambient.play().catch(()=>{});
    } else ambient.pause();
  }
  document.addEventListener("pointerdown", () => ensureAmbient(), {once:true});

  // -------- CURSOR --------
  const magicCursor=document.getElementById("magicCursor"), trail=document.getElementById("cursorTrail");
  function applyMotionPref(){
    const custom = matchMedia("(pointer:fine)").matches && !state.reducedMotion && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.toggle("custom-cursor", custom);
    magicCursor.style.display = custom ? "block" : "none";
    trail.style.display = custom ? "block" : "none";
  }
  window.addEventListener("mousemove", e=>{
    if(!document.body.classList.contains("custom-cursor")) return;
    magicCursor.style.left=e.clientX+"px"; magicCursor.style.top=e.clientY+"px";
    trail.style.left=e.clientX+"px"; trail.style.top=e.clientY+"px";
  });
  applyMotionPref();

  // -------- NAVIGATION --------
  function showScreen(name){
    speechSynthesis.cancel();
    Object.entries(screens).forEach(([k,el])=>el.classList.toggle("is-active", k===name));
    currentScreen=name;
    document.getElementById("topbar").style.display = name==="finale" ? "none" : "";
    window.scrollTo({top:0,behavior: state.reducedMotion?"auto":"smooth"});
    if(name==="spell") startSpell(false);
    if(name==="potion") startPotion(false);
    if(name==="portraits") startPortraits(false);
    if(name==="finale"){ playSfx("finale",.9); }
    ensureAmbient();
  }

  document.addEventListener("click", e=>{
    const home=e.target.closest('[data-action="home"]'); if(home){ playSfx("click",.7); showScreen("home"); return; }
    const settings=e.target.closest('[data-action="settings"]'); if(settings){ openSettings(); return; }
    const hhome=e.target.closest('[data-action="how-home"]'); if(hhome){ openHow("home"); return; }
    const start=e.target.closest("[data-start-game]"); if(start){ playSfx("click",.8); showScreen(start.dataset.startGame); return; }
    const how=e.target.closest("[data-how]"); if(how){ openHow(how.dataset.how); return; }
    const restart=e.target.closest("[data-restart]"); if(restart){ confirmRestart(restart.dataset.restart); return; }
    const scroll=e.target.closest("[data-scroll-games]"); if(scroll){ document.getElementById("gamesShowcase").scrollIntoView({behavior:"smooth",block:"center"}); playSfx("click",.8); }
  });

  // -------- MODAL --------
  const modalBackdrop=document.getElementById("modalBackdrop");
  const modalBody=document.getElementById("modalBody");
  const modalClose=document.getElementById("modalClose");
  function openModal(html){
    lastFocus=document.activeElement;
    modalBody.innerHTML=html; modalBackdrop.hidden=false; modalClose.focus(); playSfx("click",.6);
  }
  function closeModal(){ modalBackdrop.hidden=true; modalBody.innerHTML=""; if(lastFocus) lastFocus.focus(); }
  modalClose.addEventListener("click",closeModal);
  modalBackdrop.addEventListener("click",e=>{ if(e.target===modalBackdrop) closeModal(); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&!modalBackdrop.hidden) closeModal(); });

  function openHow(game){
    const copy = {
      home:`<h2>How the Grove works</h2><p>Each game trains a different English skill. When you finish a game, its magical reward restores one part of the Moon Tree.</p><ul><li><b>Spell Path:</b> build sentences from chunks.</li><li><b>Potion of Words:</b> learn natural collocations and lexical chunks.</li><li><b>Whispering Portraits:</b> listen for meaning and details.</li></ul><p>Your progress is saved on this device.</p>`,
      spell:`<h2>Spell Path</h2><p>Your English literally rebuilds the road.</p><ul><li>Choose or drag the sentence chunks into the empty slots.</li><li>Build the sentence in natural English word order.</li><li>Press <b>Restore Path</b>.</li><li>If you're stuck, use Hint. After a correct answer, another stone lights up and the path grows.</li></ul>`,
      potion:`<h2>Potion of Words</h2><p>Natural English is made of chunks that often appear together.</p><ul><li>Choose one card from the first column and one from the second.</li><li>If they make a natural collocation, the cauldron reacts.</li><li>Read the example sentence after every correct pair.</li><li>Master five phrases to unlock the next recipe level.</li></ul>`,
      portraits:`<h2>Whispering Portraits</h2><p>Listen first — don't read first.</p><ul><li>Press Listen Again to hear the line.</li><li>Answer the question from what you understood.</li><li>Use Transcript Hint only if you need support.</li><li>Every solved story awakens another portrait.</li></ul>`
    };
    openModal(copy[game]);
  }

  function openSettings(){
    openModal(`<h2>Settings</h2>
      <div class="settings-grid">
        <div class="setting-row"><span>Music</span><button class="btn btn-ghost toggle" id="setMusic">${state.musicEnabled?"On":"Off"}</button></div>
        <div class="setting-row"><span>Sound effects</span><button class="btn btn-ghost toggle" id="setSfx">${state.sfxEnabled?"On":"Off"}</button></div>
        <div class="setting-row"><span>Volume</span><input id="setVolume" type="range" min="0" max="1" step=".05" value="${state.masterVolume}"></div>
        <div class="setting-row"><span>Reduced motion</span><button class="btn btn-ghost toggle" id="setMotion">${state.reducedMotion?"On":"Off"}</button></div>
        <hr style="border-color:rgba(242,202,115,.16);width:100%">
        <button class="btn btn-ghost" id="resetAllProgress">Reset game progress</button>
      </div>`);
    const b=modalBody;
    b.querySelector("#setMusic").onclick=()=>{state.musicEnabled=!state.musicEnabled;b.querySelector("#setMusic").textContent=state.musicEnabled?"On":"Off";saveState();ensureAmbient();};
    b.querySelector("#setSfx").onclick=()=>{state.sfxEnabled=!state.sfxEnabled;b.querySelector("#setSfx").textContent=state.sfxEnabled?"On":"Off";saveState();};
    b.querySelector("#setVolume").oninput=e=>{state.masterVolume=+e.target.value;saveState();ambient.volume=state.masterVolume*.42;};
    b.querySelector("#setMotion").onclick=()=>{state.reducedMotion=!state.reducedMotion;b.querySelector("#setMotion").textContent=state.reducedMotion?"On":"Off";saveState();applyMotionPref();};
    b.querySelector("#resetAllProgress").onclick=()=>{state.spellCompleted=state.potionCompleted=state.portraitsCompleted=false;saveState();closeModal();showScreen("home");};
  }

  function confirmRestart(game){
    openModal(`<h2>Restart ${game==="spell"?"Spell Path":game==="potion"?"Potion of Words":"Whispering Portraits"}?</h2><p>Your completion badge will stay saved, but the current run will start from the beginning.</p><div class="hero-actions"><button class="btn btn-primary" id="doRestart">Restart</button><button class="btn btn-ghost" id="cancelRestart">Cancel</button></div>`);
    modalBody.querySelector("#cancelRestart").onclick=closeModal;
    modalBody.querySelector("#doRestart").onclick=()=>{closeModal(); if(game==="spell") startSpell(true); if(game==="potion") startPotion(true); if(game==="portraits") startPortraits(true);};
  }

  // -------- HOME PROGRESS --------
  function completions(){ return [state.spellCompleted,state.potionCompleted,state.portraitsCompleted].filter(Boolean).length; }
  function updateHomeProgress(){
    const n=completions();
    document.getElementById("moonTreeImg").src=`assets/images/tree${n}.webp`;
    document.getElementById("treeProgressText").textContent=`${n} / 3 lights restored`;
    document.getElementById("treeStatusText").textContent=[
      "The Grove is waiting for you.",
      "A first light has returned.",
      "Magic is flowing through the roots.",
      "The Moon Tree is fully awake."
    ][n];
    document.querySelector('[data-reward="spell"]').classList.toggle("is-earned",state.spellCompleted);
    document.querySelector('[data-reward="potion"]').classList.toggle("is-earned",state.potionCompleted);
    document.querySelector('[data-reward="portraits"]').classList.toggle("is-earned",state.portraitsCompleted);
    document.querySelector('[data-game-card="spell"]').classList.toggle("is-complete",state.spellCompleted);
    document.querySelector('[data-game-card="potion"]').classList.toggle("is-complete",state.potionCompleted);
    document.querySelector('[data-game-card="portraits"]').classList.toggle("is-complete",state.portraitsCompleted);
  }

  function maybeFinale(){
    if(completions()===3){ setTimeout(()=>showScreen("finale"),500); }
    else showScreen("home");
  }

  function rewardModal(game){
    const cfg = {
      spell:{title:"Firefly Ember restored",img:"assets/images/firefly_ember.png",text:"Your sentences rebuilt the Spell Path. The first light returns to the Moon Tree."},
      potion:{title:"Moon Drop created",img:"assets/images/moon_drop.png",text:"You mastered natural English chunks. The second light flows back into the Grove."},
      portraits:{title:"Whisper Leaf awakened",img:"assets/images/whisper_leaf.png",text:"You listened for meaning and detail. The final light is ready to return."}
    }[game];
    playSfx("reward",.9);
    openModal(`<div class="reward-modal"><img src="${cfg.img}" alt=""><h2>${cfg.title}</h2><p>${cfg.text}</p><button class="btn btn-primary" id="claimReward">Return to the Grove</button></div>`);
    modalBody.querySelector("#claimReward").onclick=()=>{closeModal();maybeFinale();};
  }

  // -------- SPELL PATH --------
  let spell = {};
  const spellFeedback=document.getElementById("spellFeedback");
  function allSpellTasks(){ return spellStages.flatMap((s,si)=>s.tasks.map(t=>({...t,stage:s.name,stageIndex:si}))); }
  function startSpell(force){
    if(currentScreen!=="spell") return;
    if(!spell.started || force){
      spell={started:true,index:0,attempts:0,placed:[]};
      renderPathNodes();
      renderSpellTask();
    }
  }
  function renderPathNodes(){
    const host=document.getElementById("pathVisual"); host.innerHTML="";
    for(let i=0;i<10;i++){ const d=document.createElement("div"); d.className="path-node"; if(i<spell.index)d.classList.add("is-lit"); host.appendChild(d); }
  }
  function renderSpellTask(){
    const tasks=allSpellTasks(), t=tasks[spell.index];
    if(!t){ finishSpell(); return; }
    spell.placed=[];
    document.getElementById("spellStageBadge").textContent=t.stage;
    document.getElementById("spellFocus").textContent=t.focus;
    const pct=spell.index/tasks.length*100;
    document.getElementById("spellProgressBar").style.width=pct+"%";
    document.getElementById("spellProgressLabel").textContent=`${spell.index} / ${tasks.length} path stones restored`;
    spellFeedback.className="feedback";spellFeedback.textContent="";
    const slots=document.getElementById("answerSlots"), bank=document.getElementById("chunkBank");
    slots.innerHTML="";bank.innerHTML="";
    t.answer.forEach((_,i)=>{
      const s=document.createElement("button");s.className="answer-slot";s.dataset.slot=i;s.textContent=`${i+1}`;s.onclick=()=>removeFromSlot(i);s.ondragover=e=>e.preventDefault();s.ondrop=e=>{e.preventDefault(); const text=e.dataTransfer.getData("text/plain"); placeChunk(text,i);};slots.appendChild(s);
    });
    shuffle([...t.chunks]).forEach((text,i)=>{
      const b=document.createElement("button");b.className="chunk";b.textContent=text;b.draggable=true;b.dataset.text=text;
      b.onclick=()=>placeFirstAvailable(text,b);b.ondragstart=e=>e.dataTransfer.setData("text/plain", text);bank.appendChild(b);
    });
    updateSpellSlots();
  }
  function placeFirstAvailable(text,button){
    const idx=spell.placed.findIndex(x=>x==null);
    const slotIndex=idx===-1?spell.placed.length:idx;
    if(slotIndex>=allSpellTasks()[spell.index].answer.length) return;
    spell.placed[slotIndex]=text; button.disabled=true; updateSpellSlots();
  }
  function placeChunk(textOrIndex,slot){
    let text=typeof textOrIndex==="string"?textOrIndex:null;
    if(text==null)return;
    const existing=spell.placed.indexOf(text); if(existing>=0)spell.placed[existing]=null;
    spell.placed[slot]=text;
    [...document.querySelectorAll("#chunkBank .chunk")].forEach(b=>b.disabled=spell.placed.includes(b.textContent));
    updateSpellSlots();
  }
  function removeFromSlot(i){
    if(spell.placed[i]==null)return;
    spell.placed[i]=null;
    [...document.querySelectorAll("#chunkBank .chunk")].forEach(b=>b.disabled=spell.placed.includes(b.textContent));
    updateSpellSlots();
  }
  function updateSpellSlots(){
    [...document.querySelectorAll(".answer-slot")].forEach((s,i)=>{const val=spell.placed[i];s.textContent=val||`${i+1}`;s.classList.toggle("filled",!!val);});
  }
  document.getElementById("checkSpellBtn").onclick=()=>{
    const t=allSpellTasks()[spell.index];
    const clean=spell.placed.filter(x=>x!=null);
    if(clean.length!==t.answer.length){spellFeedback.className="feedback error";spellFeedback.textContent="Complete all the slots first.";playSfx("wrong",.55);return;}
    const ok=t.answer.every((x,i)=>x===spell.placed[i]);
    if(ok){
      spellFeedback.className="feedback success";spellFeedback.textContent=`Yes — “${t.answer.join(" ")}”`;
      playSfx("path",.9); spell.index++;spell.attempts=0;renderPathNodes();
      document.getElementById("spellProgressBar").style.width=(spell.index/allSpellTasks().length*100)+"%";
      document.getElementById("spellProgressLabel").textContent=`${spell.index} / ${allSpellTasks().length} path stones restored`;
      setTimeout(renderSpellTask,1100);
    }else{
      spell.attempts++;spellFeedback.className="feedback error";
      spellFeedback.textContent=spell.attempts>=2?`Not yet. Think about: ${t.hint}`:"The words are right, but the order isn't natural yet. Try again.";
      playSfx("wrong",.8);document.querySelector(".spell-workbench").classList.add("shake");setTimeout(()=>document.querySelector(".spell-workbench").classList.remove("shake"),420);
    }
  };
  document.getElementById("spellHintBtn").onclick=()=>{
    const t=allSpellTasks()[spell.index];spellFeedback.className="feedback";spellFeedback.textContent=t.hint;playSfx("click",.5);
  };
  function finishSpell(){
    state.spellCompleted=true;saveState();
    document.getElementById("spellProgressBar").style.width="100%";
    document.getElementById("spellProgressLabel").textContent="10 / 10 path stones restored";
    rewardModal("spell");
  }

  // -------- POTION --------
  let potion={};
  function startPotion(force){
    if(currentScreen!=="potion")return;
    if(!potion.started||force){
      potion={started:true,level:0,mastered:[],left:null,right:null,hints:0};
      renderPotionLevel();
    }
  }
  function currentPairs(){return potionLevels[potion.level].pairs;}
  function renderPotionLevel(){
    if(potion.level>=potionLevels.length){finishPotion();return;}
    potion.left=potion.right=null;
    const level=potionLevels[potion.level];
    document.getElementById("potionLevelTitle").textContent=level.name;
    renderPotionBanks();
    updatePotionHUD();
    document.getElementById("potionFeedback").className="feedback potion-feedback";
    document.getElementById("potionFeedback").textContent="Choose one card from each column.";
    updateMixSlots();
  }
  function renderPotionBanks(){
    const left=document.getElementById("leftWords"),right=document.getElementById("rightWords");left.innerHTML="";right.innerHTML="";
    shuffle(currentPairs().map(p=>p[0])).forEach(w=>left.appendChild(makeWordChip(w,"left")));
    shuffle(currentPairs().map(p=>p[1])).forEach(w=>right.appendChild(makeWordChip(w,"right")));
  }
  function makeWordChip(w,side){
    const b=document.createElement("button");b.className="word-chip";b.textContent=w;
    const matching=currentPairs().find(p=>side==="left"?p[0]===w:p[1]===w);
    if(matching && potion.mastered.includes(matching[0]+"|"+matching[1])) b.classList.add("is-mastered");
    b.onclick=()=>selectPotionWord(side,w,b);return b;
  }
  function selectPotionWord(side,w,b){
    if(side==="left")potion.left=w;else potion.right=w;
    const host=side==="left"?document.getElementById("leftWords"):document.getElementById("rightWords");
    [...host.children].forEach(x=>x.classList.toggle("is-selected",x===b));updateMixSlots();
    if(potion.left&&potion.right)setTimeout(checkPotionPair,250);
  }
  function updateMixSlots(){
    const l=document.getElementById("mixLeft"),r=document.getElementById("mixRight");
    l.textContent=potion.left||"Choose first part";r.textContent=potion.right||"Choose second part";
    l.classList.toggle("has-word",!!potion.left);r.classList.toggle("has-word",!!potion.right);
  }
  function checkPotionPair(){
    const key=potion.left+" "+potion.right;
    const pair=currentPairs().find(p=>p[0]===potion.left&&p[1]===potion.right);
    const fb=document.getElementById("potionFeedback");
    if(pair){
      playSfx("bubble",.72);setTimeout(()=>playSfx("correct",.8),180);
      potion.mastered.push(pair[0]+"|"+pair[1]);
      fb.className="feedback potion-feedback success";
      fb.textContent=`${pair[0]} ${pair[1]} — ${phraseExamples[key]||"Great English chunk!"}`;
      speakText(phraseExamples[key]||key,{rate:.92,pitch:1.02});
      const done=currentPairs().filter(p=>potion.mastered.includes(p[0]+"|"+p[1])).length;
      document.getElementById("potionLiquid").className=`potion-liquid power-${Math.min(4,potion.level+1)}`;
      potion.left=potion.right=null;renderPotionBanks();updateMixSlots();updatePotionHUD();
      if(done===currentPairs().length){
        setTimeout(()=>{potion.level++;renderPotionLevel();},1500);
      }
    }else{
      playSfx("wrong",.65);fb.className="feedback potion-feedback error";fb.textContent=`“${potion.left} ${potion.right}” isn't the natural combination here. Try a different partner.`;
      potion.left=potion.right=null;[...document.querySelectorAll(".word-chip")].forEach(x=>x.classList.remove("is-selected"));updateMixSlots();
    }
  }
  function updatePotionHUD(){
    const level=potionLevels[potion.level]; if(!level)return;
    const done=level.pairs.filter(p=>potion.mastered.includes(p[0]+"|"+p[1])).length;
    const totalDone=potion.mastered.length;
    document.getElementById("potionProgressLabel").textContent=`${level.name} · ${done} / ${level.pairs.length}`;
    document.getElementById("potionProgressBar").style.width=((potion.level*5+done)/20*100)+"%";
    document.getElementById("pairsMastered").textContent=`${totalDone} / 20`;
  }
  document.getElementById("potionHintBtn").onclick=()=>{
    const remaining=currentPairs().filter(p=>!potion.mastered.includes(p[0]+"|"+p[1]));
    if(!remaining.length)return;
    const p=remaining[0];document.getElementById("potionFeedback").className="feedback potion-feedback";
    document.getElementById("potionFeedback").textContent=`Hint: “${p[0]}” naturally goes with “${p[1]}”. Say the whole phrase aloud.`;playSfx("click",.5);
  };
  function finishPotion(){state.potionCompleted=true;saveState();document.getElementById("potionProgressBar").style.width="100%";rewardModal("potion");}

  // -------- PORTRAITS --------
  let portraits={};
  function startPortraits(force){
    if(currentScreen!=="portraits")return;
    if(!portraits.started||force){
      portraits={started:true,index:0,wrongAttempts:0,awakened:new Set()};
      renderPortraitGrid();renderPortraitTask();
    }
  }
  function renderPortraitGrid(){
    const host=document.getElementById("portraitGrid");host.innerHTML="";
    portraitCharacters.forEach(c=>{
      const card=document.createElement("article");card.className="portrait-card";card.dataset.id=c.id;
      card.innerHTML=`<img src="${c.img}" alt="${c.name}, ${c.trait}"><div class="portrait-name">${c.name}</div>`;host.appendChild(card);
    });
  }
  function renderPortraitTask(){
    if(portraits.index>=portraitTasks.length){finishPortraits();return;}
    speechSynthesis.cancel();
    const t=portraitTasks[portraits.index];
    document.getElementById("portraitFocus").textContent=t.focus;
    document.getElementById("portraitQuestion").textContent=t.question;
    const trans=document.getElementById("transcriptBox");trans.textContent=t.line;trans.classList.add("is-hidden");
    document.getElementById("listeningState").textContent="Listen first. The transcript is hidden.";
    document.getElementById("portraitFeedback").className="feedback";document.getElementById("portraitFeedback").textContent="";
    document.getElementById("portraitProgressBar").style.width=(portraits.index/portraitTasks.length*100)+"%";
    document.getElementById("portraitProgressLabel").textContent=`${portraits.index} / ${portraitTasks.length} stories understood`;
    renderPortraitChoices(t);
    setTimeout(()=>playPortraitLine(t),500);
  }
  function renderPortraitChoices(t){
    const host=document.getElementById("portraitChoices");host.innerHTML="";
    const speakerQuestion=portraits.index%4===0;
    const correct=speakerQuestion?portraitCharacters.find(c=>c.id===t.speaker).name:t.answer;
    if(speakerQuestion) document.getElementById("portraitQuestion").textContent="Who is speaking?";
    let pool;
    if(speakerQuestion) pool=portraitCharacters.map(c=>c.name);
    else pool=portraitTasks.map(x=>x.answer);
    const choices=[correct,...shuffle(pool.filter(x=>x!==correct)).slice(0,3)];
    shuffle(choices).forEach(ch=>{
      const b=document.createElement("button");b.className="answer-choice";b.textContent=ch;
      b.onclick=()=>checkPortraitAnswer(b,ch,correct,t);host.appendChild(b);
    });
  }
  function checkPortraitAnswer(btn,choice,correct,t){
    const buttons=[...document.querySelectorAll(".answer-choice")];buttons.forEach(b=>b.disabled=true);
    if(choice===correct){
      btn.classList.add("correct");playSfx("correct",.8);
      portraits.awakened.add(t.speaker);const card=document.querySelector(`.portrait-card[data-id="${t.speaker}"]`);if(card)card.classList.add("is-awake");
      document.getElementById("portraitFeedback").className="feedback success";
      document.getElementById("portraitFeedback").textContent=`Correct. ${portraits.index%4===0?portraitCharacters.find(c=>c.id===t.speaker).name+" was speaking.":t.answer}`;
      portraits.index++;portraits.wrongAttempts=0;
      document.getElementById("portraitProgressBar").style.width=(portraits.index/portraitTasks.length*100)+"%";
      document.getElementById("portraitProgressLabel").textContent=`${portraits.index} / ${portraitTasks.length} stories understood`;
      setTimeout(renderPortraitTask,1300);
    }else{
      btn.classList.add("wrong");playSfx("wrong",.65);portraits.wrongAttempts++;
      document.getElementById("portraitFeedback").className="feedback error";
      document.getElementById("portraitFeedback").textContent=portraits.wrongAttempts>=2?"Listen again and use the transcript hint if you need it.":"Not this time. Listen for the key detail and try again.";
      setTimeout(()=>buttons.forEach(b=>{b.disabled=false;b.classList.remove("wrong")}),750);
    }
  }
  function playPortraitLine(t){
    const c=portraitCharacters.find(x=>x.id===t.speaker);
    document.querySelectorAll(".portrait-card").forEach(x=>x.classList.remove("is-speaking"));
    const card=document.querySelector(`.portrait-card[data-id="${t.speaker}"]`);
    document.getElementById("audioOrb").classList.add("is-playing");
    document.getElementById("listeningState").textContent="A portrait is speaking...";
    if(card)card.classList.add("is-speaking");
    playSfx("speak",.45);
    speakText(t.line,{rate:c.rate,pitch:c.pitch,onend:()=>{
      document.getElementById("audioOrb").classList.remove("is-playing");if(card)card.classList.remove("is-speaking");document.getElementById("listeningState").textContent="Choose the best answer.";
    }});
  }
  document.getElementById("listenAgainBtn").onclick=()=>{if(portraits.index<portraitTasks.length)playPortraitLine(portraitTasks[portraits.index]);};
  document.getElementById("subtitleHintBtn").onclick=()=>{
    const box=document.getElementById("transcriptBox");box.classList.remove("is-hidden");document.getElementById("listeningState").textContent="Transcript support is now visible.";playSfx("click",.5);
  };
  function finishPortraits(){state.portraitsCompleted=true;saveState();document.getElementById("portraitProgressBar").style.width="100%";rewardModal("portraits");}

  function speakText(text,opts={}){
    if(!("speechSynthesis" in window)) { if(opts.onend)opts.onend(); return; }
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);u.lang="en-GB";u.rate=opts.rate||.94;u.pitch=opts.pitch||1;u.volume=Math.min(1,state.masterVolume*1.4);
    const voices=speechSynthesis.getVoices();const preferred=voices.find(v=>/en-GB/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));if(preferred)u.voice=preferred;
    if(opts.onend)u.onend=opts.onend;speechSynthesis.speak(u);
  }

  // -------- FINALE / RESET --------
  document.getElementById("playAgainAll").onclick=()=>{
    state.spellCompleted=state.potionCompleted=state.portraitsCompleted=false;saveState();
    spell.started=potion.started=portraits.started=false;showScreen("home");
  };

  // -------- GLOBAL UI --------
  document.getElementById("musicBtn").onclick=()=>{state.musicEnabled=!state.musicEnabled;saveState();ensureAmbient();updateTopButtons();};
  document.getElementById("sfxBtn").onclick=()=>{state.sfxEnabled=!state.sfxEnabled;saveState();updateTopButtons();};
  function updateTopButtons(){
    document.getElementById("musicBtn").style.opacity=state.musicEnabled?"1":".42";
    document.getElementById("sfxBtn").style.opacity=state.sfxEnabled?"1":".42";
  }
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

  updateHomeProgress();updateTopButtons();ensureAmbient();
})();
