
// audio
const music = new Audio('./assets/music_bg.mp3');
const voice = new Audio('./assets/voice_intro.mp3');
music.loop = true; music.volume = 0.35; voice.volume = 0.9;
voice.addEventListener('play', ()=> { music.volume = 0.18; });
voice.addEventListener('ended', ()=> { music.volume = 0.35; });

// helpers
const $ = s => document.querySelector(s);
function toast(msg){
  const t = $('.toast'); t.textContent = msg; t.style.display='block';
  setTimeout(()=>{ t.classList.add('fadeOut'); setTimeout(()=>{t.style.display='none'; t.classList.remove('fadeOut')}, 500); }, 1800);
}

// start button -> show form section
document.addEventListener('DOMContentLoaded', ()=>{
  $('.startBtn').addEventListener('click', async ()=>{
    $('.hero').classList.add('fadeOut');
    try{ await music.play(); }catch(e){}
    try{ await voice.play(); }catch(e){}
    setTimeout(()=>{
      $('.center').style.display='none';
      $('.main').style.display='block';
      $('#letter').focus();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 480);
  });

  // handle submit (local only for now)
  $('#form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = $('#email').value.trim();
    const text = $('#letter').value.trim();
    const consent = $('#consent').checked;
    if(!text){ toast('Viết điều bạn muốn thả xuống hồ đã nha.'); return; }
    // Save locally as a placeholder. Backend hookup will replace this.
    const item = { email, text, createdAt: Date.now() };
    const all = JSON.parse(localStorage.getItem('lake_letters_demo')||'[]'); all.push(item);
    localStorage.setItem('lake_letters_demo', JSON.stringify(all));
    $('#letter').value=''; if(email) $('#email').value='';
    toast('Đã thả xuống hồ (lưu cục bộ). Gửi mail sẽ cấu hình ở bước sau.');
  });
});
