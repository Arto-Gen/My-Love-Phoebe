import { content } from './content.js';
import { mountExtras } from './extras.js';
import { createMusicPlayer } from './music.js';

// Compact inline line icons, so there is no icon font or runtime to download.
const paths = {
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  'arrow-left': '<path d="M20 12H4m6-6-6 6 6 6"/>',
  'chevron-right': '<path d="m9 5 7 7-7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  'book-open': '<path d="M12 5v16m0-16C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z"/>',
  camera: '<path d="M9 4 7 7H3v13h18V7h-4l-2-3Z"/><circle cx="12" cy="13" r="4"/>',
  sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5Z"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13m0-13H7a3 3 0 1 1 3-3Zm0 0h5a3 3 0 1 0-3-3Z"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5m-4-4a8 8 0 0 1 13-3l2 2M4 17l2 2a8 8 0 0 0 13-3"/>',
  utensils: '<path d="M4 3v5a3 3 0 0 0 6 0V3M7 3v18M20 3c-4 0-5 7-5 10h5m0-10v18"/>',
  film: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
};
function icon(name, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.heart}</svg>`;
}
const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
document.querySelectorAll('[data-name]').forEach(el => { el.textContent = content.name; });
document.querySelectorAll('[data-full-name]').forEach(el => { el.textContent = content.fullName; });
document.querySelectorAll('[data-from]').forEach(el => { el.textContent = content.from; });
document.title = `Us, always — For ${content.name}, from ${content.from}`;
document.querySelector('#anniversary-label').textContent = content.anniversaryLabel;

const storage = {
  get(key, fallback) { try { const value = localStorage.getItem(`us-always:${key}`); return value === null ? fallback : JSON.parse(value); } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(`us-always:${key}`, JSON.stringify(value)); return true; } catch { return false; } },
};
let toastTimeout;
function toast(message) {
  const el = document.querySelector('#toast');
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('visible'), 4400);
}
let confettiTimeout;
function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.querySelector('#celebration');
  root.replaceChildren();
  clearTimeout(confettiTimeout);
  const colors = ['#bc7e87','#752e42','#bd9c69','#d1a9a3','#a98277'];
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 35; i++) {
    const item = document.createElement('span');
    item.className = 'confetti';
    item.textContent = i % 3 === 0 ? '♡' : '✧';
    item.style.cssText = `--left:${Math.random()*100}%;--size:${11+Math.random()*14}px;--color:${colors[i%colors.length]};--duration:${2.2+Math.random()*1.6}s;--delay:${Math.random()*.4}s;--drift:${(Math.random()-.5)*180}px;--spin:${(Math.random()-.5)*540}deg`;
    fragment.append(item);
  }
  root.append(fragment);
  confettiTimeout = setTimeout(() => root.replaceChildren(), 4400);
}

// The timer counts UP from our anniversary, including Philippine time.
const anniversary = new Date(content.anniversary).getTime();
const timerNodes = ['days','hours','minutes','seconds'].map(id => document.querySelector(`#timer-${id}`));
function tick() {
  const elapsed = Math.max(0, Math.floor((Date.now() - anniversary) / 1000));
  const parts = [Math.floor(elapsed/86400), Math.floor(elapsed/3600)%24, Math.floor(elapsed/60)%60, elapsed%60];
  timerNodes.forEach((el, i) => {
    const value = i === 0 ? parts[i].toLocaleString('en-US') : String(parts[i]).padStart(2,'0');
    if (el.textContent !== value) el.textContent = value;
  });
}
let clockInterval;
function startClock() { clearInterval(clockInterval); tick(); if (!document.hidden) clockInterval = setInterval(tick, 1000); }
startClock();
document.addEventListener('visibilitychange', startClock);

const heroPhoto = document.querySelector('#hero-photo');
heroPhoto.src = content.hero.src;
heroPhoto.alt = content.hero.alt;
const smallPhoto = document.querySelector('#hero-small-photo');
smallPhoto.src = content.hero.smallSrc;
smallPhoto.alt = content.hero.smallAlt;

document.querySelector('#timeline').innerHTML = content.story.map((item, i) => `
  <article class="timeline-item">
    <p class="timeline-date">${escape(item.date)}</p>
    <div class="timeline-copy"><h3><button class="milestone-button" id="milestone-${i}" aria-expanded="${i<2}" aria-controls="milestone-description-${i}"><span>${escape(item.title)}</span>${icon('plus')}</button></h3><p class="milestone-description" id="milestone-description-${i}" ${i<2?'':'hidden'}>${escape(item.description)}</p></div>
    <figure class="timeline-photo"><img src="${escape(item.src)}" alt="${escape(item.alt)}" width="156" height="100" loading="lazy" decoding="async"><figcaption>${escape(item.caption)}</figcaption></figure>
  </article>`).join('');
document.querySelectorAll('.milestone-button').forEach(button => button.addEventListener('click', () => {
  const expanded = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(expanded));
  document.getElementById(button.getAttribute('aria-controls')).hidden = !expanded;
}));

let filter = 'All';
let currentMemory = 0;
let memorySet = content.memories.map((_,i)=>i);
const gallery = document.querySelector('#gallery');
function renderGallery() {
  const rotations = [-3,2,-2,2,-2.5,3];
  gallery.innerHTML = content.memories.map((memory, i) => (filter === 'All' || memory.tag === filter) ? `<button class="memory-card" data-memory="${i}" style="--rotation:${rotations[i%6]}deg" aria-label="Open ${escape(memory.title)}" aria-haspopup="dialog"><img src="${escape(memory.src)}" alt="${escape(memory.alt)}" width="350" height="245" loading="lazy" decoding="async"><span class="memory-caption">${escape(memory.title)}</span><span class="memory-heart" aria-hidden="true">♡</span></button>` : '').join('');
  memorySet = content.memories.flatMap((memory,i) => filter === 'All' || memory.tag === filter ? [i] : []);
}
renderGallery();
document.querySelector('[data-filter="All"] span').textContent = content.memories.length;
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(el => { el.classList.toggle('active',el===button);el.setAttribute('aria-pressed',String(el===button)); });
  renderGallery();
}));

const memoryDialog = document.querySelector('#memory-dialog');
memoryDialog.setAttribute('aria-labelledby', 'memory-title');
memoryDialog.setAttribute('aria-describedby', 'memory-note');
const letterDialog = document.querySelector('#letter-dialog');
function openDialog(dialog) { dialog.showModal(); document.body.classList.add('modal-open'); }
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
function showMemory(index) {
  currentMemory = index;
  const memory = content.memories[index];
  const img = document.querySelector('#memory-image');
  img.src = memory.src; img.alt = memory.alt;
  document.querySelector('#memory-title').textContent = memory.title;
  document.querySelector('#memory-note').textContent = memory.note;
  document.querySelector('#memory-count').textContent = `${memorySet.indexOf(index)+1} / ${memorySet.length}`;
}
gallery.addEventListener('click', event => {
  const button = event.target.closest('[data-memory]');
  if (!button) return;
  showMemory(Number(button.dataset.memory)); openDialog(memoryDialog);
});
function changeMemory(direction) {
  showMemory(memorySet[(memorySet.indexOf(currentMemory)+direction+memorySet.length)%memorySet.length]);
}
document.querySelector('#previous-memory').addEventListener('click', () => changeMemory(-1));
document.querySelector('#next-memory').addEventListener('click', () => changeMemory(1));
memoryDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); changeMemory(event.key==='ArrowRight'?1:-1); }
});

const letterBody = document.querySelector('#letter-paragraphs');
content.letter.forEach(paragraph => { const p = document.createElement('p'); p.textContent = paragraph; letterBody.append(p); });
const envelope = document.querySelector('#open-letter');
let letterOpening = false;
envelope.addEventListener('click', () => {
  if (letterOpening) return;
  letterOpening = true;
  envelope.classList.add('is-opening');
  setTimeout(() => {
    openDialog(letterDialog);
    letterDialog.scrollTop = 0;
    envelope.classList.remove('is-opening');
    letterOpening = false;
  }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450);
});
document.querySelector('#keep-letter').addEventListener('click', () => { letterDialog.close(); celebrate(); toast('Always here, whenever you need a little love. ♡'); });

mountExtras({ data: content, icon, celebrate, toast, storage });
createMusicPlayer(document.querySelector('#music-toggle'), { onError: () => toast('Our soundtrack couldn’t start. Please try again in a browser with audio support.') });

const menuButton = document.querySelector('#menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu() { navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation'); navigation.classList.toggle('is-open',open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
document.addEventListener('keydown', event => { if(event.key==='Escape' && navigation.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });

// One tiny scroll indicator. No continuous canvas or animation loop.
let framePending = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.reading-progress').style.transform = `scaleX(${max>0 ? Math.min(1, window.scrollY/max) : 0})`;
  framePending = false;
}
document.addEventListener('scroll', () => { if (!framePending) { framePending = true; requestAnimationFrame(updateProgress); } }, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
