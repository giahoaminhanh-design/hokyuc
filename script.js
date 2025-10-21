
const state = { started:false, music:null, voice:null };
function $(s){return document.querySelector(s);}

async function initAudio(){
  state.music = new Audio('./assets/music_bg.mp3'); state.music.loop=true; state.music.volume=.35;
  state.voice = new Audio('./assets/voice_intro.mp3'); state.voice.volume=.9;
  state.voice.addEventListener('play', ()=>fade(state.music, .18, 600));
  state.voice.addEventListener('ended', ()=>fade(state.music, .35, 800));
}
function fade(a,target,ms){ if(!a) return; const s=a.volume, d=target-s, t0=performance.now(); 
  function tick(t){const k=Math.min(1,(t-t0)/ms); a.volume=s+d*k; if(k<1) requestAnimationFrame(tick);} requestAnimationFrame(tick);
}
async function startExp(){
  if(state.started) return; state.started=true; await initAudio();
  try{ await state.music.play(); }catch(e){}
  try{ await state.voice.play(); }catch(e){}
  document.querySelectorAll('.startBtn').forEach(b=>b.setAttribute('disabled','disabled'));
}
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.startBtn').forEach(b=>b.addEventListener('click', startExp));
  $('.musicVol').addEventListener('input', e=> state.music && (state.music.volume = e.target.value));
  $('.voiceVol').addEventListener('input', e=> state.voice && (state.voice.volume = e.target.value));
  $('.toggleMusic').addEventListener('click', ()=>{ if(!state.music) return; state.music.paused?state.music.play():state.music.pause(); });
  $('.replayVoice').addEventListener('click', ()=>{ if(!state.voice) return; state.voice.currentTime=0; state.voice.play(); });
});
