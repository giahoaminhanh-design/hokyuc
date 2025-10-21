
// Simple audio orchestrator with a user-gesture gate
const state = {
  started: false,
  music: null,
  voice: null
};

function $(s){ return document.querySelector(s); }

async function initAudio(){
  state.music = new Audio('./assets/music_bg.mp3');
  state.music.loop = true;
  state.music.volume = 0.35;

  state.voice = new Audio('./assets/voice_intro.mp3');
  state.voice.volume = 0.9;

  // When voice starts, gently duck music
  state.voice.addEventListener('play', ()=>{
    fadeVolume(state.music, 0.18, 600);
  });
  // When voice ends, bring music back up
  state.voice.addEventListener('ended', ()=>{
    fadeVolume(state.music, 0.35, 800);
  });
}

function fadeVolume(audio, target, ms){
  const start = audio.volume;
  const diff = target - start;
  const t0 = performance.now();
  function tick(t){
    const k = Math.min(1, (t - t0)/ms);
    audio.volume = start + diff*k;
    if(k<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

async function startExperience(){
  if(state.started) return;
  state.started = true;

  await initAudio();

  // Try play after gesture
  try {
    await state.music.play();
  } catch (e) {
    console.warn('Music play blocked: ', e);
  }
  try {
    await state.voice.play();
  } catch (e) {
    console.warn('Voice play blocked: ', e);
  }

  // UI transitions
  document.querySelectorAll('.startBtn').forEach(b=>b.setAttribute('disabled','disabled'));
  document.querySelector('.overlay').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', ()=>{
  // wire up controls
  document.querySelectorAll('.startBtn').forEach(b=>b.addEventListener('click', startExperience));

  // Volume sliders
  const musicVol = document.querySelector('.musicVol');
  const voiceVol = document.querySelector('.voiceVol');
  musicVol.addEventListener('input', e => state.music && (state.music.volume = e.target.value));
  voiceVol.addEventListener('input', e => state.voice && (state.voice.volume = e.target.value));

  // Play/pause
  document.querySelector('.toggleMusic').addEventListener('click', ()=>{
    if(!state.music) return;
    if(state.music.paused){ state.music.play(); } else { state.music.pause(); }
  });
  document.querySelector('.replayVoice').addEventListener('click', ()=>{
    if(!state.voice) return;
    state.voice.currentTime = 0; state.voice.play();
  });
});
