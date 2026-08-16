import{read,write,clearProgress}from'./storage.js?v=3';
import{Sound}from'./audio.js?v=3';

const app=document.querySelector('#app'),toast=document.querySelector('#toast');
let data,state=read(),view='home',dispose=()=>{},sound=new Sound(state);
const gameNames={spell:'Fairy Run',potion:'Potion of Words',portraits:'Whispering Duel'};

try{data=await fetch('./docs/GAME_CONTENT.json?v=3',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(`content ${r.status}`);
return r.json()})}catch(error){console.error(error);
app.innerHTML=`<div class="loading">The Grove could not open its story book. ${error.message}</div>`}
function count(){return['spellPathCompleted','potionOfWordsCompleted','whisperingPortraitsCompleted'].filter(k=>state[k]).length}function persist(){state.moonTreeState=count();
write(state)}
function top(game=false){return`<header class="topbar"><button class="btn" data-home>${game?'BACK TO GROVE':'ENCHANTED GROVE'}</button><div class="wordmark">WORDS HOLD MAGIC</div><div class="tools"><button class="btn sound-toggle" data-sound aria-label="Turn all sound ${state.soundEnabled?'off':'on'}"><span aria-hidden="true">${state.soundEnabled?'🔊':'🔇'}</span><span class="text">SOUND ${state.soundEnabled?'ON':'OFF'}</span></button><button class="btn" data-settings><span class="text">SETTINGS</span><span aria-hidden="true">⋯</span></button>${game?'<button class="btn" data-restart><span class="text">RESTART</span></button>':''}</div></header>`}
function render(){dispose();
dispose=()=>{};
document.body.classList.toggle('reduce',state.reducedMotion);
({home,spell,potion,portraits,finale})[view]();
common()}
function home(){const n=count();
app.innerHTML=`<main class="screen home"><div class="fireflies">${fireflies(18+n*8)}</div>${top()}<section class="hero"><div class="hero-fairy"><img src="./assets/character/fairy_canonical_fullbody.png" alt="Aurelia, guardian fairy of the Grove"></div><div class="hero-copy"><div class="kicker">A MAGICAL ENGLISH ADVENTURE</div><h1 class="logo">ENCHANTED<br>GROVE</h1><p class="tagline">Three magical games. One enchanted adventure.</p><p class="story">Run through a living forest, brew true phrases, and duel with whispering portraits to awaken the Moon Tree.</p><button class="btn gold hero-cta" data-scroll><span>BEGIN THE JOURNEY</span><i aria-hidden="true">↓</i></button><div class="adventure-map" aria-label="Adventure overview"><div><strong>03</strong><span>MAGICAL TRIALS</span></div><div><strong>∞</strong><span>TRIES TO LEARN</span></div><div><strong>${n}/3</strong><span>GROVE LIGHTS</span></div></div></div><aside class="tree-panel" style="--light:${n}"><img src="./assets/moon_tree/moon_tree_${n}of3.webp" alt="Moon Tree restored ${n} of 3"><div class="tree-count">GROVE LIGHT · ${n}/3</div></aside></section><section class="portal-section" id="games"><div class="section-heading"><div><span class="kicker">THE THREE REALMS</span><h2 class="section-title">CHOOSE YOUR PATH</h2></div><p>Every realm has its own controls, risks and reward.</p></div><div class="portals">${portal('spell','01','spell_path.webp','firefly_ember.png','Run, jump and land on the right answers to rebuild the forest.','Platforming · grammar · five checkpoints',state.spellPathCompleted)}${portal('potion','02','potion_of_words.webp','moon_drop.png','Match ingredients, build a combo and clear every recipe.','Matching · collocations · streaks',state.potionOfWordsCompleted)}${portal('portraits','03','whispering_portraits.webp','whisper_leaf.png','Listen for meaning and win a tactical duel against the gallery.','Listening · strategy · spoken English',state.whisperingPortraitsCompleted)}</div></section></main>`}
function portal(id,index,bg,reward,desc,learn,done){const launch=id==='spell'?'data-runner':`data-play="${id}"`;return`<article class="portal" style="background-image:url('./assets/backgrounds/${bg}')"><span class="portal-index">${index}</span>${done?'<span class="complete-ribbon">RESTORED</span>':''}<img class="relic-thumb" src="./assets/rewards/${reward}" alt=""><div class="portal-content"><span class="portal-type">${id==='spell'?'ACTION QUEST':id==='potion'?'WORD ALCHEMY':'LISTENING DUEL'}</span><h2>${gameNames[id]}</h2><p>${desc}</p><p class="learning-focus">${learn}</p><div class="portal-actions"><button class="btn gold" ${launch}>${done?'PLAY AGAIN':'ENTER REALM'}</button><button class="btn" data-how="${id}" aria-label="How to play ${gameNames[id]}">?</button></div></div></article>`}
function shell(cls,title,kicker,inner){app.innerHTML=`<main class="screen ${cls}">${top(true)}<div class="game-shell"><aside class="guide"><h1>${title}</h1><p>${kicker}</p><div class="stage-nav" id="stageNav"></div><button class="btn" data-how="${cls}">HOW TO PLAY</button><img class="guide-fairy" src="./assets/character/fairy_halfbody.png" alt="Aurelia offers guidance"></aside><section class="play-area">${inner}</section></div></main>`}
function spell(){const stages=data.spellPath.stages,all=stages.flatMap((s,stage)=>s.tasks.map(t=>({...t,stage,stageName:s.name})));
let idx=0,attempt=0,placed=[];
shell('spell','Spell Path','Build each sentence. Every true sentence rebuilds the road.',`<header class="game-title"><span class="kicker" id="stageName"></span><h2>RESTORE THE SPELL PATH</h2><span class="focus-pill" id="focus"></span></header><div class="path-scene"><img class="path-fairy" src="./assets/character/fairy_canonical_fullbody.png" alt="Aurelia crossing the restored path">${all.map(()=>'<div class="path-piece"><i></i></div>').join('')}</div><div class="workbench"><p class="instruction">Arrange the glowing rune-stones in the correct order.</p><div class="sentence" id="sentence" aria-label="Your sentence"></div><div class="chunk-bank" id="bank"></div><div class="feedback" id="feedback" aria-live="polite"></div><div class="controls"><button class="btn" id="clear">CLEAR RUNES</button><button class="btn gold" id="check">RESTORE THIS STEP</button></div></div>`);
const bank=q('#bank'),sentence=q('#sentence'),feedback=q('#feedback');

 const nav=()=>q('#stageNav').innerHTML=stages.map((s,i)=>`<div class="stage-dot ${i<=all[idx]?.stage?'on':''}" title="${s.name}"></div>`).join('');
const setup=()=>{attempt=0;
placed=[];
const t=all[idx];
q('#stageName').textContent=`STAGE ${t.stage+1} · ${t.stageName} · ${idx+1}/${all.length}`;
q('#focus').textContent=t.focus;
feedback.textContent='';
feedback.className='feedback';
bank.innerHTML='';
sentence.innerHTML='';
shuffle([...t.chunks]).forEach((text,i)=>bank.append(chunk(text,i)));
nav()};

 const chunk=(text,id)=>{const b=document.createElement('button');
b.className='chunk';
b.textContent=text;
b.draggable=true;
b.dataset.id=id;
b.onclick=()=>moveChunk(b);
b.ondragstart=e=>e.dataTransfer.setData('text/plain',id);
return b};
const moveChunk=b=>{if(b.parentElement===bank){sentence.append(b);
placed.push(b.textContent)}else{bank.append(b);
placed=placed.filter((_,i)=>i!==[...sentence.children,b].indexOf(b))}sound.play('click')};
sentence.ondragover=e=>e.preventDefault();
sentence.ondrop=e=>{e.preventDefault();
const b=bank.querySelector(`[data-id="${e.dataTransfer.getData('text/plain')}"]`);
if(b)moveChunk(b)};
bank.ondragover=e=>e.preventDefault();
bank.ondrop=e=>{e.preventDefault();
const b=sentence.querySelector(`[data-id="${e.dataTransfer.getData('text/plain')}"]`);
if(b)moveChunk(b)};

 q('#clear').onclick=()=>{[...sentence.children].forEach(b=>bank.append(b));
placed=[]};
q('#check').onclick=()=>{const chosen=[...sentence.children].map(b=>b.textContent),answer=all[idx].answer;
if(chosen.join('|')===answer.join('|')){sound.play('correct');
sound.play('path');
qAll('.path-piece')[idx].classList.add('on');q('.path-scene').style.setProperty('--restored',idx+1);q('.path-fairy').style.left=`${4+idx*8.2}%`;
feedback.textContent=`The words are true. ${answer.join(' ')}`;
spark(innerWidth*.65,innerHeight*.55);
idx++;
setTimeout(()=>idx===all.length?reward('spell'):setup(),800)}else{attempt++;
sound.play('wrong');
feedback.className='feedback bad';
if(chosen.length!==answer.length)feedback.textContent='The spell is incomplete. Place every chunk on the path.';
else if(attempt<2){const first=chosen.findIndex((x,i)=>x!==answer[i]);
feedback.textContent=`The order changes near “${chosen[Math.max(0,first)]}”. Look for subject, action, then details.`}else feedback.textContent=`Scaffold: begin with “${answer[0]}”. Focus on ${all[idx].focus}.`}};
setup()}
function potion(){const total=levelsTotal(data.potionOfWords.levels),levels=data.potionOfWords.levels;
let idx=0,level=0,left=null,right=null,leftButton=null,rightButton=null,attempt=0,combo=0,remaining=[];
const hues=['#d28b38','#779ee8','#65c990','#b36cd8'];
shell('potion','Potion of Words','Natural word partnerships make the strongest magic.',`<header class="game-title"><span class="kicker" id="levelName"></span><h2>BREW A TRUE PHRASE</h2><span class="focus-pill">Choose one gold part and one violet part</span><div class="potion-score"><span>COMBO <b id="potionCombo">×0</b></span><span>REMAINING <b id="potionRemaining">5</b></span></div></header><div class="alchemy"><div class="word-bank left"><h3>FIRST INGREDIENT</h3><div id="leftWords"></div></div><div class="brew-center"><div class="seals">${levels.map(()=>'<div class="seal"></div>').join('')}</div><div class="cauldron" id="cauldron"></div><div class="mix" id="mix">Select two word ingredients</div><div class="feedback" id="feedback"></div><button class="btn gold" id="brew" disabled>BREW PHRASE</button></div><div class="word-bank right"><h3>SECOND INGREDIENT</h3><div id="rightWords"></div></div></div>`);
const selectIngredient=(b,text,side)=>{qAll(`.word-bank.${side} .wordcard`).forEach(x=>x.classList.remove('selected'));
b.classList.add('selected');
if(side==='left'){left=text;leftButton=b}else{right=text;rightButton=b}
q('#mix').textContent=`${left||'…'} + ${right||'…'}`;
q('#brew').disabled=!(left&&right);
sound.play('click')};
const make=(text,side,token)=>{const b=document.createElement('button');
b.className='wordcard';
b.textContent=text;
b.draggable=true;
b.dataset.token=token;
b.onclick=()=>selectIngredient(b,text,side);
b.ondragstart=e=>{e.dataTransfer.setData('text/plain',token);b.classList.add('dragging')};
b.ondragend=()=>b.classList.remove('dragging');
return b};

const cauldron=q('#cauldron');
cauldron.ondragover=e=>{e.preventDefault();cauldron.classList.add('ready')};
cauldron.ondragleave=()=>cauldron.classList.remove('ready');
cauldron.ondrop=e=>{e.preventDefault();cauldron.classList.remove('ready');const token=e.dataTransfer.getData('text/plain'),ingredient=q(`[data-token="${token}"]`);if(ingredient)ingredient.click();if(left&&right)q('#brew').click()};

 const updateStatus=()=>{q('#levelName').textContent=`RECIPE ${level+1} · ${levels[level].name} · ${Math.min(idx+1,total)}/${total}`;
q('#cauldron').style.cssText=`--brew:${hues[level]};
--energy:${idx%5+1}`};
const clearChoice=()=>{qAll('.wordcard').forEach(x=>x.classList.remove('selected'));
left=right=leftButton=rightButton=null;
q('#brew').disabled=true;
q('#mix').textContent='Select two word ingredients'};
const setup=()=>{remaining=levels[level].pairs.map((pair,pairIndex)=>({pair,pairIndex}));
updateStatus();
q('#potionRemaining').textContent=remaining.length;
q('#leftWords').innerHTML='';
q('#rightWords').innerHTML='';
shuffle([...remaining]).forEach(({pair,pairIndex})=>q('#leftWords').append(make(pair[0],'left',`left-${level}-${pairIndex}`)));
shuffle([...remaining]).forEach(({pair,pairIndex})=>q('#rightWords').append(make(pair[1],'right',`right-${level}-${pairIndex}`)));
qAll('.seal').forEach((s,i)=>s.classList.toggle('on',i<level));
q('#feedback').textContent='';
q('#feedback').className='feedback';
attempt=0;
clearChoice()};
q('#brew').onclick=()=>{const match=remaining.findIndex(({pair})=>left===pair[0]&&right===pair[1]);
if(match!==-1){const phrase=remaining[match].pair.join(' ');
remaining.splice(match,1);
combo++;
q('#potionCombo').textContent=`×${combo}`;
q('#potionRemaining').textContent=remaining.length;
sound.play('potion');
sound.play('correct');
q('#feedback').className='feedback';
q('#feedback').textContent=`The potion accepts “${phrase}”.`;
spark(innerWidth*.55,innerHeight*.5);
leftButton?.remove();
rightButton?.remove();
idx++;
updateStatus();
clearChoice();
setTimeout(()=>{if(idx===total)reward('potion');else if(!remaining.length){level++;setup()}},750)}else{attempt++;
sound.play('wrong');
combo=0;
q('#potionCombo').textContent='×0';
q('#feedback').className='feedback bad';
const hint=remaining.find(({pair})=>pair[0]===left)||remaining[0];
q('#feedback').textContent=attempt<2?`“${left} ${right}” is not one of the remaining partnerships. Try a different combination.`:`Scaffold: “${hint.pair[0]} …” — find its natural partner among the remaining chunks.`;
clearChoice();
q('#mix').textContent='The ingredients separated — try again'} };
setup()}
function levelsTotal(levels){return levels.reduce((sum,level)=>sum+level.pairs.length,0)}
function portraits(){const chars=data.whisperingPortraits.characters,tasks=data.whisperingPortraits.tasks;
let idx=0,correct=0,activeCell=-1,activeTask=null,locked=false,voiceTimer,roundTimer;
const cast=chars.slice(0,6),answers=tasks.map(t=>t.answer);
shell('portraits','Whispering Duel','Hear the meaning, claim three sigils, and outwit the shadow gallery.',`<header class="game-title"><span class="kicker">LISTENING DUEL · <span id="portraitProgress">0</span> CORRECT</span><h2>CLAIM THREE SIGILS IN A ROW</h2></header><div class="portrait-duel"><div class="duel-gallery">${cast.map((c,i)=>`<div class="portrait-card" data-person="${c.id}"><img src="./assets/portraits/portrait_0${i+1}.webp" alt="Portrait of ${c.name}"><span>${c.name}</span></div>`).join('')}</div><div class="duel-center"><div class="duel-status" id="duelStatus">Choose an empty frame to begin a listening challenge.</div><div class="whisper-board" aria-label="Listening duel board">${Array.from({length:9},(_,i)=>`<button class="whisper-cell" data-cell="${i}" aria-label="Duel square ${i+1}"></button>`).join('')}</div></div><div class="listen-panel"><div class="kicker" id="speaker">THE GALLERY IS WAITING</div><p class="question" id="question">Choose a square. Listen to the portrait, then answer for meaning.</p><p class="transcript" id="transcript"></p><div class="controls"><button class="btn" id="listen" disabled>LISTEN AGAIN</button><button class="btn" id="hint" disabled>SUBTITLE HINT</button></div><div class="answers" id="answers"></div><div class="feedback" id="feedback" aria-live="polite"></div></div></div>`);
let board=Array(9).fill('');
const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const hasWon=mark=>wins.some(line=>line.every(i=>board[i]===mark));
const paint=()=>qAll('.whisper-cell').forEach((cell,i)=>{cell.textContent=board[i]==='X'?'✦':board[i]==='O'?'◆':'';cell.className=`whisper-cell ${board[i]==='X'?'light':board[i]==='O'?'shadow':''}`;cell.disabled=locked||!!board[i]});
const speak=()=>{if(!activeTask)return;sound.play('speak');sound.speak(activeTask.line,idx%tasks.length)};
const resetRound=message=>{board=Array(9).fill('');locked=false;activeCell=-1;activeTask=null;q('#duelStatus').textContent=message;q('#speaker').textContent='THE GALLERY IS WAITING';q('#question').textContent='Choose another square to begin a listening challenge.';q('#answers').innerHTML='';q('#transcript').classList.remove('show');q('#listen').disabled=q('#hint').disabled=true;paint()};
const finishTurn=mark=>{paint();if(hasWon(mark)){locked=true;if(mark==='X'){q('#duelStatus').textContent='Three light sigils! The gallery yields.';spark(innerWidth*.55,innerHeight*.4);roundTimer=setTimeout(()=>reward('portraits'),900)}else{q('#duelStatus').textContent='The shadows made a line. The board is reforming…';roundTimer=setTimeout(()=>resetRound('New round. Choose a frame and listen closely.'),1300)}return true}if(board.every(Boolean)){locked=true;q('#duelStatus').textContent='A draw. The enchanted board is reforming…';roundTimer=setTimeout(()=>resetRound('New round. Choose a frame and claim the light.'),1300);return true}return false};
const shadowMove=()=>{const empty=board.map((v,i)=>v?'':i).filter(v=>v!=='');if(!empty.length)return;const winning=empty.find(i=>{board[i]='O';const win=hasWon('O');board[i]='';return win}),blocking=empty.find(i=>{board[i]='X';const win=hasWon('X');board[i]='';return win}),choice=winning??blocking??empty[Math.floor(Math.random()*empty.length)];board[choice]='O';sound.play('wrong');if(!finishTurn('O')){locked=false;q('#duelStatus').textContent='Your turn. Choose another empty frame.';paint()}};
const choose=a=>{if(!activeTask)return;qAll('.answer').forEach(b=>b.disabled=true);const good=a===activeTask.answer,person=cast.find(c=>c.id===activeTask.speaker);idx++;q('#portraitProgress').textContent=correct+(good?1:0);if(good){correct++;board[activeCell]='X';sound.play('correct');q(`.portrait-card[data-person="${person.id}"]`)?.classList.add('awake');q('#feedback').className='feedback';q('#feedback').textContent='Correct — the light sigil is yours.';if(!finishTurn('X'))roundTimer=setTimeout(shadowMove,650)}else{board[activeCell]='O';sound.play('wrong');q('#transcript').classList.add('show');q('#feedback').className='feedback bad';q('#feedback').textContent=`The gallery claimed this frame. The answer was “${activeTask.answer}”.`;if(!finishTurn('O')){locked=false;roundTimer=setTimeout(()=>{q('#duelStatus').textContent='Choose another frame and listen again.';paint()},650)}}};
const begin=cell=>{if(locked||board[cell])return;locked=true;activeCell=cell;activeTask=tasks[idx%tasks.length];const person=cast.find(c=>c.id===activeTask.speaker);q('#duelStatus').textContent=`Frame ${cell+1} is listening…`;q('#speaker').textContent=`${person.name.toUpperCase()} SPEAKS · ${activeTask.focus}`;q('#question').textContent=activeTask.question;q('#transcript').textContent=activeTask.line;q('#transcript').classList.remove('show');q('#feedback').textContent='';q('#listen').disabled=q('#hint').disabled=false;qAll('.portrait-card').forEach(p=>p.classList.toggle('speaker',p.dataset.person===activeTask.speaker));const alts=shuffle([...new Set([activeTask.answer,...answers.filter(a=>a!==activeTask.answer)])]).slice(0,3);if(!alts.includes(activeTask.answer))alts[0]=activeTask.answer;q('#answers').innerHTML='';shuffle(alts).forEach(a=>{const b=document.createElement('button');b.className='btn answer';b.textContent=a;b.onclick=()=>choose(a);q('#answers').append(b)});paint();clearTimeout(voiceTimer);voiceTimer=setTimeout(speak,300)};
qAll('.whisper-cell').forEach(cell=>cell.onclick=()=>begin(+cell.dataset.cell));
q('#listen').onclick=speak;
q('#hint').onclick=()=>q('#transcript').classList.toggle('show');
paint();
dispose=()=>{clearTimeout(voiceTimer);clearTimeout(roundTimer);
sound.stopVoice()}}
function reward(game){const info={spell:['spellPathCompleted','firefly_ember.png','Firefly Ember','The restored sentences have relit the forest path.'],potion:['potionOfWordsCompleted','moon_drop.png','Moon Drop','Every true word partnership has filled the Moon Drop.'],portraits:['whisperingPortraitsCompleted','whisper_leaf.png','Whisper Leaf','The portraits entrusted their voices to the Whisper Leaf.']}[game];
state[info[0]]=true;
persist();
sound.play('reward');
app.innerHTML=`<main class="screen home"><div class="reward-screen"><div class="reward-card"><div class="kicker">A LIGHT RETURNS TO THE MOON TREE</div><img src="./assets/rewards/${info[1]}" alt="${info[2]}"><h1>${info[2]}</h1><p>${info[3]}</p><button class="btn gold" id="claim">${state.moonTreeState===3?'AWAKEN THE GROVE':'RETURN TO THE GROVE'}</button></div></div></main>`;
q('#claim').onclick=()=>{view=state.moonTreeState===3?'finale':'home';
render()}}
function finale(){sound.play('finale');
app.innerHTML=`<main class="screen finale"><div class="fireflies">${fireflies(45)}</div><section class="final-content"><div><div class="kicker">ALL THREE LIGHTS RESTORED</div><h1>THE GROVE<br>IS AWAKE</h1><p>You restored the magic of the Enchanted Grove.</p><div class="controls"><button class="btn red" id="again">PLAY AGAIN</button><button class="btn gold" data-home>BACK TO THE GROVE</button></div></div></section></main>`;
q('#again').onclick=()=>{state=clearProgress(state);
persist();
view='home';
render()}}
function how(id){const list={spell:['Move with A/D or the arrow keys; jump with W, Up or Space.','Land on, bump or fly into the answer that completes the sentence.','Correct choices physically rebuild bridges and open forest gates.','Reach the final Moon Portal to return the Firefly Ember.'],potion:['Choose any natural gold-and-violet word partnership.','Correct ingredients disappear and increase your combo.','A wrong mixture breaks the combo but never removes a chunk.','Clear five phrases in every recipe to seal the Moon Drop.'],portraits:['Choose an empty square to hear a portrait speak.','Answer correctly to place a light sigil; a wrong answer gives the square to the shadows.','The gallery makes a strategic move after each correct answer.','Claim three light sigils in a row to win the Whisper Leaf.']}[id];
modal(`How to Play · ${gameNames[id]}`,list)}
function settings(){modal('Settings',[],`<label class="setting">Forest ambience<input id="music" type="checkbox" ${state.musicEnabled?'checked':''}></label><label class="setting">Music volume<input id="musicVol" type="range" min="0" max="1" step=".05" value="${state.musicVolume}"></label><label class="setting">Sound effects<input id="sfx" type="checkbox" ${state.sfxEnabled?'checked':''}></label><label class="setting">Effects volume<input id="sfxVol" type="range" min="0" max="1" step=".05" value="${state.sfxVolume}"></label><label class="setting">Voice volume<input id="voiceVol" type="range" min="0" max="1" step=".05" value="${state.voiceVolume}"></label><label class="setting">Master volume<input id="vol" type="range" min="0" max="1" step=".05" value="${state.volume}"></label><label class="setting">Reduced motion<input id="motion" type="checkbox" ${state.reducedMotion?'checked':''}></label><button class="btn red" id="reset">RESET PROGRESS</button>`,()=>{state.musicEnabled=q('#music').checked;
state.sfxEnabled=q('#sfx').checked;
state.musicVolume=+q('#musicVol').value;
state.sfxVolume=+q('#sfxVol').value;
state.voiceVolume=+q('#voiceVol').value;
state.volume=+q('#vol').value;
state.reducedMotion=q('#motion').checked;
persist();
sound.state=state;
sound.sync();
render()});
setTimeout(()=>q('#reset').onclick=()=>{state=clearProgress(state);
persist();
document.querySelector('.modal-back').remove();
view='home';
render();
say('Grove progress reset. Sound preferences were kept.')},0)}
function modal(title,items,extra='',done=()=>{}){const back=document.createElement('div');
back.className='modal-back';
back.innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><h2 id="modalTitle">${title}</h2>${extra}<ol>${items.map(x=>`<li>${x}</li>`).join('')}</ol><div class="modal-actions"><button class="btn gold" data-close>DONE</button></div></section>`;
document.body.append(back);
back.querySelector('[data-close]').onclick=()=>{done();
back.remove()};
back.querySelector('[data-close]').focus()}
function common(){qAll('[data-play]').forEach(b=>b.onclick=()=>{view=b.dataset.play;
render()});
qAll('[data-runner]').forEach(b=>b.onclick=()=>{location.href='./fairy-run.html'});
qAll('[data-how]').forEach(b=>b.onclick=()=>how(b.dataset.how));
qAll('[data-home]').forEach(b=>b.onclick=()=>{view='home';
render()});
qAll('[data-settings]').forEach(b=>b.onclick=settings);
qAll('[data-restart]').forEach(b=>b.onclick=render);
qAll('[data-sound]').forEach(b=>b.onclick=()=>{state.soundEnabled=!state.soundEnabled;
persist();
sound.state=state;
sound.sync();
render()});
q('[data-scroll]')?.addEventListener('click',()=>q('#games').scrollIntoView({behavior:state.reducedMotion?'auto':'smooth'}))}
function fireflies(n){return Array.from({length:n},(_,i)=>`<i class="firefly" style="left:${(i*37)%98}%;
top:${(i*61)%90}%;
animation-delay:-${i%7}s"></i>`).join('')}function spark(x,y){if(state.reducedMotion)return;
for(let i=0;
i<12;
i++){const p=document.createElement('i');
p.className='spark';
p.style.left=x+'px';
p.style.top=y+'px';
p.style.setProperty('--x',(Math.random()-.5)*180+'px');
p.style.setProperty('--y',(Math.random()-.5)*180+'px');
document.body.append(p);
setTimeout(()=>p.remove(),800)}}function shuffle(a){for(let i=a.length-1;
i;
i--){const j=Math.floor(Math.random()*(i+1));
[a[i],a[j]]=[a[j],a[i]]}return a}function say(t){toast.textContent=t;
toast.classList.add('show');
setTimeout(()=>toast.classList.remove('show'),2400)}const q=s=>document.querySelector(s),qAll=s=>document.querySelectorAll(s);

addEventListener('pointerdown',()=>sound.start(),{once:true});
addEventListener('pointermove',e=>{const c=q('#cursor');
if(c){c.style.left=e.clientX+'px';
c.style.top=e.clientY+'px'}});
if(data)render();
