import {portfolio} from './portfolio.js';
import {resolveMedia} from './media.js';

const $ = selector => document.querySelector(selector);
const videoDialog = $('#video-dialog');
let lastVideoTrigger;

function openVideo(project, trigger) {
  const media = resolveMedia(project.source);
  if (!media) return;
  lastVideoTrigger = trigger;
  $('#video-title').textContent = project.title;
  $('#video-error').hidden = true;
  const container = $('#video-container');
  container.replaceChildren();
  container.className = project.format === 'vertical' ? 'player-vertical' : '';
  const player = document.createElement(media.type === 'video' ? 'video' : 'iframe');
  player.src = media.src;
  if (media.type === 'video') {
    player.controls = true;
    player.autoplay = true;
    player.playsInline = true;
    player.addEventListener('error', () => { $('#video-error').hidden = false; });
  } else {
    player.title = project.title;
    player.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
  }
  container.append(player);
  videoDialog.showModal();
}

function validPoster(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try { const url = new URL(value, location.href); return (url.protocol === 'https:' || (url.protocol === 'http:' && url.origin === location.origin)) && !url.username && !url.password ? url.href : null; } catch { return null; }
}

function createCard(project, index) {
  const playable = Boolean(resolveMedia(project.source));
  const card = document.createElement('article');
  card.className = 'project-card';
  const preview = document.createElement(playable ? 'button' : 'div');
  preview.className = `project-preview ${project.format}${playable ? ' playable' : ''}`;
  if (playable) {
    preview.type = 'button';
    preview.setAttribute('aria-label', `Play ${project.title}`);
    preview.addEventListener('click', () => openVideo(project, preview));
  }
  const poster = validPoster(project.poster);
  if (poster) {
    const img = document.createElement('img');
    img.src = poster; img.alt = ''; img.loading = 'lazy';
    img.addEventListener('error', () => img.remove());
    preview.append(img);
  }
  const ratio = project.format === 'horizontal' ? '16:9' : '9:16';
  const format = document.createElement('span'); format.className = 'preview-format'; format.textContent = ratio;
  const center = document.createElement('span'); center.className = 'preview-center';
  const mark = document.createElement('span'); mark.className = playable ? 'play-mark' : 'empty-mark'; mark.setAttribute('aria-hidden','true');
  if(playable) mark.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>'; else mark.textContent = '+';
  const label = document.createElement('span'); label.className = 'preview-label'; label.textContent = playable ? 'Play video' : 'Video placeholder';
  center.append(mark, label);
  preview.append(center);
  if(!poster) preview.prepend(format);
  if(project.duration) { const duration = document.createElement('span'); duration.className = 'preview-duration'; duration.textContent = project.duration; preview.append(duration); }
  const metadata = document.createElement('div'); metadata.className = 'project-meta';
  const text = document.createElement('div');
  const title = document.createElement('h4'); title.textContent = project.title;
  text.append(title);
  if(project.category) { const category = document.createElement('p'); category.textContent = project.category; text.append(category); }
  const marker = document.createElement('span'); marker.className = 'project-format'; marker.textContent = ratio;
  metadata.append(text, marker); card.append(preview,metadata);
  if(playable && mediaIsYouTube(project.source)) { const link = document.createElement('a'); link.className='youtube-link'; link.href=project.source; link.textContent='Watch on YouTube ↗'; link.target='_blank'; link.rel='noopener noreferrer'; card.append(link); }
  return card;
}

function mediaIsYouTube(source) { const media=resolveMedia(source); return media?.type === 'iframe' && media.src.startsWith('https://www.youtube-nocookie.com/'); }

const formats = new Set(portfolio.projects.map(project => project.format));
const collection = $('.project-collection');
collection.classList.toggle('paired', formats.size > 1);
collection.classList.toggle('multiple', portfolio.projects.length > 1);
for(const format of ['horizontal','vertical']) { $(`#${format}-projects`).classList.toggle('multiple', portfolio.projects.filter(project=>project.format===format).length > 1); }
$('.filters').hidden = formats.size < 2;
document.querySelectorAll('[data-group]').forEach(group => { group.hidden = !formats.has(group.dataset.group); });

portfolio.projects.forEach((project,index) => {
  const grid = project.format === 'vertical' ? $('#vertical-projects') : $('#horizontal-projects');
  grid.append(createCard(project,index));
});
const seconds = portfolio.projects.reduce((total, project) => { const match = /^(\d+):([0-5]\d)$/.exec(project.duration || ''); return match ? total + Number(match[1]) * 60 + Number(match[2]) : total; }, 0);
if(seconds) { const meta = $('#work-meta'); const count = portfolio.projects.length; meta.innerHTML = `${count} ${count === 1 ? 'project' : 'projects'} · <strong>${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}</strong> total runtime`; meta.hidden = false; }
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('selected',active); item.setAttribute('aria-pressed',String(active)); });
    document.querySelectorAll('[data-group]').forEach(group => { group.hidden = !formats.has(group.dataset.group) || (button.dataset.filter !== 'all' && group.dataset.group !== button.dataset.filter); });
    collection.classList.toggle('paired', formats.size > 1 && button.dataset.filter === 'all');
  });
});

document.querySelectorAll('[data-profile-name]').forEach(item => { item.textContent = portfolio.name; });
document.title = `${portfolio.name} — Video Editor`;
$('#year').textContent = new Date().getFullYear();

const socialHosts = {twitter:['twitter.com','www.twitter.com','x.com','www.x.com'],discord:['discord.com','www.discord.com','discord.gg','discordapp.com']};
let activeSocials = 0;
for(const [platform,hosts] of Object.entries(socialHosts)) {
  if(!portfolio[platform]) continue;
  try {
    const url = new URL(portfolio[platform]);
    if(url.protocol !== 'https:' || url.username || url.password || !hosts.includes(url.hostname) || url.pathname === '/') continue;
    const link = $(`#${platform}-link`);
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.removeAttribute('aria-disabled');
    link.removeAttribute('title');
    activeSocials++;
  } catch {}
}
if(activeSocials === 2) $('#social-note').hidden = true;
else if(activeSocials === 1) $('#social-note').textContent = 'More profile links coming soon.';

$('[data-close-video]').addEventListener('click', () => videoDialog.close());
videoDialog.addEventListener('close', () => { $('#video-container').replaceChildren(); lastVideoTrigger?.focus(); });
videoDialog.addEventListener('click',event => { if(event.target === videoDialog) { const rect=videoDialog.getBoundingClientRect(); if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) videoDialog.close(); } });
