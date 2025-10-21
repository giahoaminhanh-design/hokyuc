
const music = new Audio('./assets/music_bg.mp3');
const voice = new Audio('./assets/voice_intro.mp3');
music.loop = true; music.volume = 0.35; voice.volume = 0.9;

document.querySelector('button').addEventListener('click', async () => {
  try { await music.play(); } catch(e){}
  try { await voice.play(); } catch(e){}
  document.querySelector('button').disabled = true;
});
