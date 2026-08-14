
(() => {
  "use strict";

  // ---------------- STATE ----------------
  const defaultState = {
    spellCompleted:false,
    potionCompleted:false,
    portraitsCompleted:false,
    ambienceEnabled:false,
    sfxEnabled:true,
    volume:0.4,
    reducedMotion:false
  };
  let state = loadState();
  function loadState(){
    try{return {...defaultState, ...JSON.parse(localStorage.getItem("enchantedGroveV2") || "{}")};}
    catch{return {...defaultState};}
  }
  function saveState(){
    localStorage.setItem("enchantedGroveV2", JSON.stringify(state));
    updateHome();
  }

  // ---------------- DATA ----------------
  const spellStages = [
    {name:"Lantern Steps", tasks:[
      {answer:["My brother","goes","to school","every day."], chunks:["to school","every day.","goes","My brother"], focus:"Present Simple", hint:"Start with the subject. Then verb, place, time."},
      {answer:["We","usually","play football","after school."], chunks:["after school.","play football","We","usually"], focus:"Frequency adverbs", hint:"Usually goes before the main verb."},
      {answer:["Mia","has","breakfast","at seven."], chunks:["breakfast","at seven.","Mia","has"], focus:"Present Simple", hint:"Who? → action → object → time."}
    ]},
    {name:"Moon Bridge", tasks:[
      {answer:["She","is reading","a book","now."], chunks:["She","a book","is reading","now."], focus:"Present Continuous", hint:"Subject + am/is/are + verb-ing."},
      {answer:["The children","are","playing","in the garden."], chunks:["playing","The children","in the garden.","are"], focus:"Present Continuous", hint:"Plural subject uses are."},
      {answer:["Tom","isn't wearing","his jacket","today."], chunks:["his jacket","today.","Tom","isn't wearing"], focus:"Negative Present Continuous", hint:"Negative form: isn't + verb-ing."}
    ]},
    {name:"Whisper Gate", tasks:[
      {answer:["We","don't like","rainy weather."], chunks:["rainy weather.","We","don't like"], focus:"Negative Present Simple", hint:"Subject first, then don't like."},
      {answer:["Do","they","play","football","on Sundays?"], chunks:["football","they","Do","on Sundays?","play"], focus:"Present Simple questions", hint:"Question starts with Do."},
      {answer:["What","are","you","doing","now?"], chunks:["doing","What","you","are","now?"], focus:"Present Continuous questions", hint:"Question word + are + subject + verb-ing."},
      {answer:["She","always","reads","before bed."], chunks:["reads","She","before bed.","always"], focus:"Frequency adverbs", hint:"Always comes before the main verb."}
    ]}
  ];

  const potionRounds = [
    {stage:"Everyday Magic", clue:"Choose the chunk that means: school work you do at home.", target:["do","homework"], example:"I do my homework after dinner.", left:["do","make","have","take"], right:["homework","a mistake","breakfast","a photo"]},
    {stage:"Everyday Magic", clue:"Choose the phrase for the morning meal.", target:["have","breakfast"], example:"We have breakfast at seven.", left:["have","go","take","make"], right:["shopping","a photo","breakfast","a decision"]},
    {stage:"Everyday Magic", clue:"Choose the chunk that means: use a camera.", target:["take","a photo"], example:"Can you take a photo of us?", left:["make","take","be proud","go"], right:["a photo","of","shopping","a mistake"]},
    {stage:"Everyday Magic", clue:"Choose the phrase for a wrong action or error.", target:["make","a mistake"], example:"It's okay to make a mistake.", left:["make","do","take","listen"], right:["a mistake","to","a photo","homework"]},

    {stage:"People & Feelings", clue:"Choose the chunk that means: to like and care about a topic.", target:["be interested","in"], example:"I'm interested in space.", left:["be interested","be good","be kind","be afraid"], right:["at","to","of","in"]},
    {stage:"People & Feelings", clue:"Choose the phrase for a skill or talent.", target:["be good","at"], example:"Mia is good at drawing.", left:["be proud","be good","be kind","be afraid"], right:["to","of","at","in"]},
    {stage:"People & Feelings", clue:"Choose the phrase that means: scared of something.", target:["be afraid","of"], example:"He is afraid of spiders.", left:["be afraid","be good","be proud","be interested"], right:["to","at","of","in"]},
    {stage:"People & Feelings", clue:"Choose the chunk that means: treat others nicely.", target:["be kind","to"], example:"Please be kind to animals.", left:["be kind","be good","be proud","be interested"], right:["to","in","of","at"]},

    {stage:"Daily Adventures", clue:"Choose the chunk that means: search for something.", target:["look","for"], example:"I'm looking for my keys.", left:["ask","talk","look","wait"], right:["for","to","for","with"]},
    {stage:"Daily Adventures", clue:"Choose the phrase that means: stay until someone comes.", target:["wait","for"], example:"Please wait for me.", left:["go","wait","listen","look"], right:["to","for","shopping","with"]},
    {stage:"Daily Adventures", clue:"Choose the phrase that means: speak with a person.", target:["talk","to"], example:"I need to talk to my teacher.", left:["talk","ask","listen","look"], right:["to","for","to","with"]},
    {stage:"Daily Adventures", clue:"Choose the phrase that means: request help or information.", target:["ask","for"], example:"You can ask for help.", left:["ask","listen","look","get ready"], right:["to","for","with","at"]},

    {stage:"Grove Mastery", clue:"Choose the phrase that means: choose what to do.", target:["make","a decision"], example:"We need to make a decision.", left:["make","look forward","take care","get ready"], right:["with","for","a decision","of"]},
    {stage:"Grove Mastery", clue:"Choose the phrase that means: protect and help something or someone.", target:["take care","of"], example:"I take care of my little brother.", left:["take care","spend time","look forward","make"], right:["of","with","to","a decision"]},
    {stage:"Grove Mastery", clue:"Choose the phrase that means: feel happy about something in the future.", target:["look forward","to"], example:"I look forward to the holidays.", left:["get ready","look forward","spend time","take care"], right:["to","with","of","for"]},
    {stage:"Grove Mastery", clue:"Choose the chunk that means: be together with someone.", target:["spend time","with"], example:"I like to spend time with my friends.", left:["spend time","take care","look forward","be kind"], right:["at","with","of","to"]},
  ];

  const portraitPeople = [
    {id:"rowan", name:"Rowan", img:"assets/images/portrait_01.webp"},
    {id:"liora", name:"Liora", img:"assets/images/portrait_02.webp"},
    {id:"arlen", name:"Arlen", img:"assets/images/portrait_03.webp"},
    {id:"poppy", name:"Grandma Poppy", img:"assets/images/portrait_04.webp"},
    {id:"timble", name:"Timble", img:"assets/images/portrait_05.webp"},
    {id:"hootwell", name:"Professor Hootwell", img:"assets/images/portrait_06.webp"},
  ];

  const portraitRounds = [
    {speaker:"rowan", focus:"Meaning in context", text:"I usually wake up early, but today I'm still tired because I travelled all night.", question:"Why is Rowan tired today?", choices:["He travelled all night.","He is ill.","He lost his lantern.","He woke up late."], answer:"He travelled all night."},
    {speaker:"liora", focus:"Reading for detail", text:"I'm looking for my red book. I need it for the story circle tonight.", question:"What is Liora looking for?", choices:["A silver key.","Her red book.","A flower basket.","A moon map."], answer:"Her red book."},
    {speaker:"arlen", focus:"Present Simple vs Continuous", text:"Every Friday I play music by the river, but tonight I'm playing in the Moon Hall.", question:"Where is Arlen playing tonight?", choices:["By the river.","At school.","In the Moon Hall.","In the market."], answer:"In the Moon Hall."},
    {speaker:"poppy", focus:"Reading for detail", text:"The apple pies are in the oven now. I bake them every Sunday for the children.", question:"What is Grandma Poppy making now?", choices:["Soup.","Apple pies.","Pancakes.","Tea."], answer:"Apple pies."},
    {speaker:"timble", focus:"Prepositions", text:"I don't like loud places. I'm waiting behind the old oak until the festival becomes quieter.", question:"Where is Timble waiting?", choices:["Under the bridge.","Beside the lantern.","Behind the old oak.","In the Moon Hall."], answer:"Behind the old oak."},
    {speaker:"hootwell", focus:"Reading for gist", text:"I teach young explorers how to read maps. Today we're learning how to find north by the stars.", question:"What are they learning today?", choices:["How to bake bread.","How to find north by the stars.","How to paint portraits.","How to ride a horse."], answer:"How to find north by the stars."},
    {speaker:"liora", focus:"Simple vs continuous", text:"My sister usually visits me on Saturdays, but this weekend she's staying at home.", question:"Is Liora's sister visiting this weekend?", choices:["Yes, she is visiting today.","No, she is staying at home.","Yes, she visits every day.","No, she is travelling."], answer:"No, she is staying at home."},
    {speaker:"arlen", focus:"Prepositions of place", text:"Please listen carefully. The silver key is under the small blue box, not beside it.", question:"Where is the silver key?", choices:["Beside the box.","In the box.","Under the small blue box.","On the shelf."], answer:"Under the small blue box."},
    {speaker:"poppy", focus:"Functional language", text:"I need some honey for the cakes. Could you bring me the jar next to the flowers?", question:"What does Grandma Poppy need?", choices:["Milk.","Honey.","Sugar.","Jam."], answer:"Honey."},
    {speaker:"rowan", focus:"Frequency words", text:"I never fly through the dark valley alone. I usually take the lantern path.", question:"Which path does Rowan usually take?", choices:["The river path.","The dark valley path.","The lantern path.","The snow path."], answer:"The lantern path."},
    {speaker:"timble", focus:"Reading for purpose", text:"I'm carrying a little map because I want to find the hidden waterfall.", question:"Why is Timble carrying a map?", choices:["To buy a book.","To find the hidden waterfall.","To visit the market.","To learn music."], answer:"To find the hidden waterfall."},
    {speaker:"hootwell", focus:"Grammar awareness", text:"Remember: we use the present continuous for actions happening now.", question:"Which tense does Professor Hootwell mention?", choices:["Past Simple.","Future Simple.","Present Perfect.","Present Continuous."], answer:"Present Continuous."},
  ];

  // ---------------- HELPERS ----------------
  function qs(sel, root=document){return root.querySelector(sel);}
  function qsa(sel, root=document){return [...root.querySelectorAll(sel)];}
  function shuffle(arr){const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;}
  function completions(){ return [state.spellCompleted, state.potionCompleted, state.portraitsCompleted].filter(Boolean).length; }

  // ---------------- AUDIO ----------------
  const ambient = qs("#ambientAudio");
  const sfx = {
    click:"assets/audio/ui_click.wav",
    ok:"assets/audio/correct_magic.wav",
    no:"assets/audio/wrong_soft.wav",
    reward:"assets/audio/reward.wav",
    path:"assets/audio/path_restore.wav",
    bubble:"assets/audio/potion_bubble.wav",
    finale:"assets/audio/finale_cue.wav"
  };
  function playSfx(name, gain=1){
    if(!state.sfxEnabled) return;
    const src=sfx[name]; if(!src) return;
    const a=new Audio(src);
    a.volume=Math.max(0,Math.min(1,state.volume*gain));
    a.play().catch(()=>{});
  }
  function applyAudioState(){
    ambient.volume=state.volume*0.28;
    if(state.ambienceEnabled) ambient.play().catch(()=>{});
    else ambient.pause();
  }
  document.addEventListener("pointerdown",()=>applyAudioState(),{once:true});

  // ---------------- CURSOR ----------------
  function applyCursor(){
    const active = matchMedia("(pointer:fine)").matches && !state.reducedMotion && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.toggle("custom-cursor", active);
    qs("#magicCursor").style.display = active ? "block":"none";
    qs("#cursorTrail").style.display = active ? "block":"none";
  }
  window.addEventListener("mousemove", e => {
    if(!document.body.classList.contains("custom-cursor")) return;
    qs("#magicCursor").style.left = e.clientX + "px";
    qs("#magicCursor").style.top = e.clientY + "px";
    qs("#cursorTrail").style.left = e.clientX + "px";
    qs("#cursorTrail").style.top = e.clientY + "px";
  });
  applyCursor();

  // ---------------- MODAL ----------------
  const modalBackdrop = qs("#modalBackdrop");
  const modalBody = qs("#modalBody");
  function openModal(html){
    modalBody.innerHTML = html;
    modalBackdrop.hidden = false;
    qs("#modalClose").focus();
  }
  function closeModal(){
    modalBackdrop.hidden = true;
    modalBody.innerHTML = "";
  }
  qs("#modalClose").addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", e => { if(e.target === modalBackdrop) closeModal(); });
  document.addEventListener("keydown", e => { if(e.key === "Escape" && !modalBackdrop.hidden) closeModal(); });

  function openInfo(which){
    const copy = {
      home:`<h2>How the Grove works</h2>
      <p>This version focuses on richer visuals and clearer educational gameplay.</p>
      <ul>
        <li><b>Spell Path</b> — build complete English sentences from chunks.</li>
        <li><b>Potion of Words</b> — choose the correct halves of natural English chunks and collocations.</li>
        <li><b>Whispering Portraits</b> — read character whispers and answer elegant clue-based questions.</li>
      </ul>
      <p>Every finished game returns a magical relic to the Moon Tree.</p>`,
      spell:`<h2>Spell Path</h2>
      <p>Arrange the chunks so they become a natural English sentence.</p>
      <ul>
        <li>Click a chunk to place it in the next slot.</li>
        <li>Click a filled slot to remove that chunk.</li>
        <li>Press <b>Restore the path</b> to check the sentence.</li>
        <li>Correct answers light the road and grow the Grove.</li>
      </ul>`,
      potion:`<h2>Potion of Words</h2>
      <p>Each round gives you a clue. Choose the right first half and the right second half to brew the target chunk.</p>
      <ul>
        <li>Pick one button on the left and one button on the right.</li>
        <li>Press <b>Brew potion</b>.</li>
        <li>Correct answers fill a bottle on the shelf and show an example sentence.</li>
      </ul>
      <p>This version removes the broken inactive-second-half problem by rebuilding the mechanic into clear, round-based recipes.</p>`,
      portraits:`<h2>Whispering Portraits</h2>
      <p>This version turns the activity into a more elegant reading-and-clue game, without the auto-voice that felt annoying.</p>
      <ul>
        <li>Read the whisper on the scroll.</li>
        <li>Answer the question from what you understood.</li>
        <li>Correct answers awaken the portrait and light the gallery.</li>
      </ul>`
    };
    openModal(copy[which]);
  }

  function openSettings(){
    openModal(`<h2>Settings</h2>
      <div class="setting-row"><label>Forest ambience</label><button class="toggle-btn" id="toggleAmbience">${state.ambienceEnabled ? "On":"Off"}</button></div>
      <div class="setting-row"><label>Sound effects</label><button class="toggle-btn" id="toggleSfx">${state.sfxEnabled ? "On":"Off"}</button></div>
      <div class="setting-row"><label>Volume</label><input type="range" id="volRange" min="0" max="1" step="0.05" value="${state.volume}"></div>
      <div class="setting-row"><label>Reduced motion</label><button class="toggle-btn" id="toggleMotion">${state.reducedMotion ? "On":"Off"}</button></div>
      <div class="setting-row"><label>Progress</label><button class="toggle-btn" id="resetProgressBtn">Reset all</button></div>`);
    qs("#toggleAmbience").onclick = () => { state.ambienceEnabled=!state.ambienceEnabled; saveState(); applyAudioState(); openSettings(); };
    qs("#toggleSfx").onclick = () => { state.sfxEnabled=!state.sfxEnabled; saveState(); openSettings(); };
    qs("#volRange").oninput = (e) => { state.volume = +e.target.value; saveState(); applyAudioState(); };
    qs("#toggleMotion").onclick = () => { state.reducedMotion=!state.reducedMotion; saveState(); applyCursor(); openSettings(); };
    qs("#resetProgressBtn").onclick = () => {
      state.spellCompleted = false; state.potionCompleted = false; state.portraitsCompleted = false;
      saveState(); closeModal(); show("home");
      spell.started = false; potion.started = false; portraits.started = false;
    };
  }

  // ---------------- NAV ----------------
  const screens = {
    home: qs("#homeScreen"),
    spell: qs("#spellScreen"),
    potion: qs("#potionScreen"),
    portraits: qs("#portraitsScreen"),
    finale: qs("#finaleScreen")
  };
  function show(name){
    Object.entries(screens).forEach(([k,el]) => el.classList.toggle("is-active", k===name));
    if(name==="spell") initSpell(false);
    if(name==="potion") initPotion(false);
    if(name==="portraits") initPortraits(false);
    if(name==="finale") playSfx("finale",0.9);
    window.scrollTo({top:0, behavior: state.reducedMotion ? "auto":"smooth"});
    applyAudioState();
  }

  document.addEventListener("click", e => {
    const nav = e.target.closest("[data-nav]");
    if(nav){ playSfx("click",0.6); show(nav.dataset.nav); return; }
    const start = e.target.closest("[data-start]");
    if(start){ playSfx("click",0.6); show(start.dataset.start); return; }
    const info = e.target.closest("[data-info]");
    if(info){ openInfo(info.dataset.info); return; }
    const reset = e.target.closest("[data-reset]");
    if(reset){ 
      if(reset.dataset.reset==="spell"){ spell.started=false; initSpell(true); }
      if(reset.dataset.reset==="potion"){ potion.started=false; initPotion(true); }
      if(reset.dataset.reset==="portraits"){ portraits.started=false; initPortraits(true); }
      playSfx("click",0.5);
      return;
    }
    const act = e.target.closest("[data-action]");
    if(act){
      if(act.dataset.action==="settings") openSettings();
      if(act.dataset.action==="finale-preview") show("finale");
      return;
    }
    const scroll = e.target.closest("[data-scroll]");
    if(scroll){ document.getElementById(scroll.dataset.scroll).scrollIntoView({behavior:"smooth", block:"start"}); }
  });

  qs("#restartAllBtn").onclick = () => {
    state.spellCompleted = false; state.potionCompleted = false; state.portraitsCompleted = false;
    saveState();
    spell.started=false; potion.started=false; portraits.started=false;
    show("home");
  };

  // ---------------- HOME ----------------
  function updateHome(){
    const n = completions();
    qs("#homeTreeImage").src = `assets/images/tree${n}.webp`;
    qs("#homeTreeLabel").textContent = `${n} / 3 relics returned`;
    qs("#homeTreeStatus").textContent = [
      "The Grove still sleeps.",
      "A first light is flowing back.",
      "The roots are glowing with magic.",
      "The Moon Tree is fully awake."
    ][n];
    qs("#tokenSpell").classList.toggle("earned", state.spellCompleted);
    qs("#tokenPotion").classList.toggle("earned", state.potionCompleted);
    qs("#tokenPortraits").classList.toggle("earned", state.portraitsCompleted);
    qs('[data-card="spell"]').classList.toggle("done", state.spellCompleted);
    qs('[data-card="potion"]').classList.toggle("done", state.potionCompleted);
    qs('[data-card="portraits"]').classList.toggle("done", state.portraitsCompleted);
  }

  function maybeFinishGame(which){
    if(which==="spell") state.spellCompleted = true;
    if(which==="potion") state.potionCompleted = true;
    if(which==="portraits") state.portraitsCompleted = true;
    saveState();
    const reward = {
      spell:{img:"assets/images/firefly_ember.png", title:"Firefly Ember restored", text:"Your sentence magic repaired the road and returned the first relic."},
      potion:{img:"assets/images/moon_drop.png", title:"Moon Drop brewed", text:"Your lexical potions restored the second relic to the Moon Tree."},
      portraits:{img:"assets/images/whisper_leaf.png", title:"Whisper Leaf awakened", text:"Your clue solving and reading magic restored the final relic."},
    }[which];
    playSfx("reward",0.95);
    openModal(`<h2>${reward.title}</h2><p>${reward.text}</p><p style="text-align:center"><img src="${reward.img}" style="height:180px;margin:0 auto;filter:drop-shadow(0 0 24px rgba(255,205,100,.28))" alt=""></p><div class="hero-buttons"><button class="btn btn-primary" id="returnToGrove">Return to the Grove</button></div>`);
    qs("#returnToGrove").onclick = () => { closeModal(); if(completions()===3) show("finale"); else show("home"); };
  }

  // ---------------- SPELL PATH ----------------
  let spell = {started:false, index:0, placed:[], blooms:0};
  const allSpellTasks = () => spellStages.flatMap(stage => stage.tasks.map(t => ({...t, stageName:stage.name})));
  function initSpell(force){
    if(spell.started && !force) return;
    spell = {started:true, index:0, placed:[], blooms:0};
    renderSpell();
  }
  function renderSpell(){
    const tasks = allSpellTasks();
    const t = tasks[spell.index];
    if(!t){ maybeFinishGame("spell"); return; }
    spell.placed = Array(t.answer.length).fill(null);
    qs("#spellStageName").textContent = t.stageName;
    qs("#spellFocus").textContent = t.focus;
    qs("#spellBar").style.width = `${spell.index / tasks.length * 100}%`;
    qs("#spellLabel").textContent = `${spell.index} / ${tasks.length} sentences restored`;
    qs("#spellRestored").textContent = spell.index;
    qs("#spellBloomed").textContent = spell.blooms;
    qs("#spellFeedback").className = "feedback-box";
    qs("#spellFeedback").textContent = "Put the chunks in a natural English order.";

    // path
    const ribbon = qs("#pathRibbon");
    ribbon.innerHTML = "";
    tasks.forEach((_,i) => {
      const d = document.createElement("div");
      d.className = "path-stone";
      if(i < spell.index) d.classList.add("done");
      if(i === spell.index) d.classList.add("current");
      ribbon.appendChild(d);
    });

    const slots = qs("#spellSlots");
    slots.innerHTML = "";
    t.answer.forEach((_,i) => {
      const b = document.createElement("button");
      b.className = "answer-slot";
      b.textContent = String(i + 1);
      b.onclick = () => {
        if(spell.placed[i] !== null){
          spell.placed[i] = null;
          updateSpellView();
        }
      };
      slots.appendChild(b);
    });

    const bank = qs("#spellChunkBank");
    bank.innerHTML = "";
    shuffle(t.chunks).forEach(chunk => {
      const b = document.createElement("button");
      b.className = "chunk-btn";
      b.textContent = chunk;
      b.onclick = () => {
        const empty = spell.placed.indexOf(null);
        if(empty === -1) return;
        if(spell.placed.includes(chunk)) return;
        spell.placed[empty] = chunk;
        updateSpellView();
      };
      bank.appendChild(b);
    });

    updateSpellView();
  }
  function updateSpellView(){
    const t = allSpellTasks()[spell.index];
    qsa("#spellSlots .answer-slot").forEach((slot,i) => {
      const val = spell.placed[i];
      slot.textContent = val || String(i+1);
      slot.classList.toggle("filled", !!val);
    });
    qsa("#spellChunkBank .chunk-btn").forEach(btn => {
      btn.classList.toggle("used", spell.placed.includes(btn.textContent));
    });
  }
  qs("#spellHintBtn").onclick = () => {
    const t = allSpellTasks()[spell.index];
    qs("#spellFeedback").className = "feedback-box";
    qs("#spellFeedback").textContent = t.hint;
    playSfx("click",0.45);
  };
  qs("#spellCheckBtn").onclick = () => {
    const t = allSpellTasks()[spell.index];
    if(spell.placed.includes(null)){
      qs("#spellFeedback").className = "feedback-box error";
      qs("#spellFeedback").textContent = "Complete all slots before restoring the path.";
      playSfx("no",0.7);
      return;
    }
    const ok = t.answer.every((x,i) => x === spell.placed[i]);
    if(ok){
      spell.blooms += 1;
      qs("#spellFeedback").className = "feedback-box success";
      qs("#spellFeedback").textContent = `Beautiful. “${t.answer.join(" ")}” sounds natural and lights the path.`;
      playSfx("path",0.92);
      spell.index++;
      setTimeout(renderSpell, 950);
    } else {
      qs("#spellFeedback").className = "feedback-box error";
      qs("#spellFeedback").textContent = "Almost — the words are useful, but the order is not natural yet. Try again.";
      playSfx("no",0.75);
    }
  };

  // ---------------- POTION ----------------
  let potion = {started:false, index:0, left:null, right:null, solved:[]};
  function initPotion(force){
    if(potion.started && !force) return;
    potion = {started:true, index:0, left:null, right:null, solved:[]};
    renderPotion();
  }
  function renderPotion(){
    const r = potionRounds[potion.index];
    if(!r){ maybeFinishGame("potion"); return; }
    qs("#potionLevelBadge").textContent = r.stage;
    qs("#potionPrompt").textContent = "Choose the chunk that matches the clue.";
    qs("#potionClue").textContent = r.clue;
    qs("#potionLabel").textContent = `${potion.index} / ${potionRounds.length} potions brewed`;
    qs("#potionBar").style.width = `${potion.index / potionRounds.length * 100}%`;
    qs("#potionFeedback").className = "feedback-box";
    qs("#potionFeedback").textContent = "Select one half from each column.";
    qs("#potionExampleBox").textContent = "After a correct brew, you will see a natural example sentence.";
    qs("#selectedLeft").textContent = potion.left || "First half";
    qs("#selectedRight").textContent = potion.right || "Second half";
    qs("#selectedLeft").classList.toggle("active", !!potion.left);
    qs("#selectedRight").classList.toggle("active", !!potion.right);
    qs("#cauldronLiquid").className = `liquid power-${Math.min(4, Math.floor(potion.index / 4) + 1)}`;

    // shelf
    const shelf = qs("#potionShelf");
    shelf.innerHTML = "";
    for(let i=0;i<12;i++){
      const d=document.createElement("div");
      d.className="bottle";
      if(i < potion.index) d.classList.add("filled");
      shelf.appendChild(d);
    }

    // options
    const leftHost = qs("#potionLeftOptions");
    const rightHost = qs("#potionRightOptions");
    leftHost.innerHTML = ""; rightHost.innerHTML = "";
    r.left.forEach((word, idx) => {
      const b=document.createElement("button");
      b.className="option-btn";
      if(potion.left===word) b.classList.add("selected");
      b.textContent = word;
      b.onclick = () => { potion.left = word; renderPotion(); };
      leftHost.appendChild(b);
    });
    r.right.forEach((word, idx) => {
      const b=document.createElement("button");
      b.className="option-btn";
      if(potion.right===word) b.classList.add("selected");
      b.textContent = word;
      b.onclick = () => { potion.right = word; renderPotion(); };
      rightHost.appendChild(b);
    });
  }
  qs("#potionHintBtn").onclick = () => {
    const r = potionRounds[potion.index];
    qs("#potionFeedback").className = "feedback-box";
    qs("#potionFeedback").textContent = `Hint: say the full chunk aloud. The target begins with “${r.target[0]} ...”.`;
    playSfx("click",0.45);
  };
  qs("#potionBrewBtn").onclick = () => {
    const r = potionRounds[potion.index];
    if(!potion.left || !potion.right){
      qs("#potionFeedback").className = "feedback-box error";
      qs("#potionFeedback").textContent = "Choose one half from each column first.";
      playSfx("no",0.7);
      return;
    }
    const ok = potion.left === r.target[0] && potion.right === r.target[1];
    if(ok){
      qs("#potionFeedback").className = "feedback-box success";
      qs("#potionFeedback").textContent = `Excellent. “${r.target[0]} ${r.target[1]}” is the natural chunk.`;
      qs("#potionExampleBox").textContent = r.example;
      playSfx("bubble",0.85);
      setTimeout(()=>playSfx("ok",0.85), 180);
      potion.index++;
      potion.left = null; potion.right = null;
      setTimeout(renderPotion, 1050);
    } else {
      qs("#potionFeedback").className = "feedback-box error";
      qs("#potionFeedback").textContent = `That combination sounds wrong in this clue. Try a different partner.`;
      playSfx("no",0.75);
    }
  };

  // ---------------- PORTRAITS ----------------
  let portraits = {started:false, index:0, solved:new Set()};
  function initPortraits(force){
    if(portraits.started && !force) return;
    portraits = {started:true, index:0, solved:new Set()};
    renderPortraits();
  }
  function renderPortraitGrid(activeId){
    const grid=qs("#portraitGrid");
    grid.innerHTML="";
    portraitPeople.forEach(p => {
      const card=document.createElement("div");
      card.className="portrait-card";
      if(activeId===p.id) card.classList.add("active");
      if(portraits.solved.has(p.id)) card.classList.add("solved");
      card.innerHTML=`<img src="${p.img}" alt="${p.name}"><div class="name">${p.name}</div>`;
      grid.appendChild(card);
    });
  }
  function renderPortraits(){
    const r = portraitRounds[portraits.index];
    if(!r){ maybeFinishGame("portraits"); return; }
    renderPortraitGrid(r.speaker);
    qs("#portraitsBar").style.width = `${portraits.index / portraitRounds.length * 100}%`;
    qs("#portraitsLabel").textContent = `${portraits.index} / ${portraitRounds.length} clues solved`;
    qs("#portraitsFocus").textContent = r.focus;
    qs("#portraitQuestion").textContent = r.question;
    qs("#portraitText").textContent = r.text;
    qs("#portraitFeedback").className = "feedback-box";
    qs("#portraitFeedback").textContent = "Read carefully. Then choose the best answer.";
    const host = qs("#portraitChoices");
    host.innerHTML = "";
    r.choices.forEach(choice => {
      const b=document.createElement("button");
      b.className="answer-btn";
      b.textContent = choice;
      b.onclick = () => checkPortrait(choice, b);
      host.appendChild(b);
    });
  }
  function checkPortrait(choice, btn){
    const r = portraitRounds[portraits.index];
    if(choice === r.answer){
      btn.classList.add("correct");
      portraits.solved.add(r.speaker);
      qs("#portraitFeedback").className = "feedback-box success";
      qs("#portraitFeedback").textContent = `Correct. ${r.answer}`;
      playSfx("ok",0.82);
      portraits.index++;
      setTimeout(renderPortraits, 980);
    } else {
      btn.classList.add("wrong");
      qs("#portraitFeedback").className = "feedback-box error";
      qs("#portraitFeedback").textContent = "Not quite. Go back to the whisper and look for the key detail.";
      playSfx("no",0.72);
      setTimeout(() => btn.classList.remove("wrong"), 600);
    }
  }

  // ---------------- INIT ----------------
  updateHome();
  applyAudioState();

})();
