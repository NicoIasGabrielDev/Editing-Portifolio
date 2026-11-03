import {portfolio} from './portfolio.js';
import {resolveMedia} from './media.js';

const $ = selector => document.querySelector(selector);

function safeUrl(value, hosts) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim(), location.href);
    if (url.username || url.password) return null;
    if (hosts) return url.protocol === 'https:' && hosts.includes(url.hostname) && url.pathname !== '/' ? url.href : null;
    return url.protocol === 'https:' || (url.protocol === 'http:' && url.origin === location.origin) ? url.href : null;
  } catch { return null; }
}

function createPlayer(project) {
  const media = resolveMedia(project.source, {autoplay: false});
  const frame = document.createElement('div');
  frame.className = `video-frame ${project.format}`;
  if (!media) {
    frame.classList.add('empty');
    frame.textContent = 'Video coming soon';
    return frame;
  }
  const player = document.createElement(media.type === 'video' ? 'video' : 'iframe');
  player.src = media.src;
  if (media.type === 'video') {
    player.controls = true;
    player.playsInline = true;
    player.preload = 'metadata';
  } else {
    player.title = project.title;
    player.loading = 'lazy';
    player.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
  }
  frame.append(player);
  return frame;
}

function createCard(project) {
  const card = document.createElement('article');
  card.className = 'video-card';
  const meta = document.createElement('div'); meta.className = 'video-meta';
  const title = document.createElement('h4'); title.textContent = project.title;
  meta.append(title);
  if (project.duration) { const duration = document.createElement('span'); duration.className = 'video-duration'; duration.textContent = project.duration; meta.append(duration); }
  card.append(createPlayer(project), meta);
  return card;
}

// Videos
for (const format of ['horizontal', 'vertical']) {
  const projects = portfolio.projects.filter(project => project.format === format);
  $(`[data-group="${format}"]`).hidden = projects.length === 0;
  const grid = $(`#${format}-projects`);
  projects.forEach(project => grid.append(createCard(project)));
  grid.classList.toggle('odd', projects.length % 2 === 1);
}

// Profile text
document.querySelectorAll('[data-profile-name]').forEach(item => { item.textContent = portfolio.name; });
if (portfolio.role) $('[data-role]').textContent = portfolio.role;
if (portfolio.bio) $('#bio').textContent = portfolio.bio;
if (portfolio.contactCta) $('#contact-cta').textContent = portfolio.contactCta;
document.title = `${portfolio.name} — Video Editor`;

// Clients
const clients = (portfolio.clients || []).filter(client => client && client.name);
if (clients.length) {
  const grid = $('#client-grid');
  for (const client of clients) {
    const item = document.createElement('li');
    const href = safeUrl(client.url);
    const card = document.createElement(href ? 'a' : 'div');
    card.className = 'client-card';
    if (href) { card.href = href; card.target = '_blank'; card.rel = 'noopener noreferrer'; }
    const avatar = document.createElement('span'); avatar.className = 'client-avatar';
    const image = safeUrl(client.image);
    if (image) { const img = document.createElement('img'); img.src = image; img.alt = ''; img.loading = 'lazy'; img.addEventListener('error', () => { img.remove(); avatar.textContent = client.name.trim()[0].toUpperCase(); }); avatar.append(img); }
    else avatar.textContent = client.name.trim()[0].toUpperCase();
    const name = document.createElement('span'); name.className = 'client-name'; name.textContent = client.name;
    card.append(avatar, name);
    if (client.subscribers) { const subs = document.createElement('span'); subs.className = 'client-subs'; subs.textContent = `${client.subscribers} subscribers`; card.append(subs); }
    item.append(card); grid.append(item);
  }
  $('#clients').hidden = false;
}

// Contact
if (typeof portfolio.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(portfolio.email.trim())) {
  const email = $('#email-link'); email.href = `mailto:${portfolio.email.trim()}`; email.hidden = false;
}
const twitterUrl = safeUrl(portfolio.twitter, ['twitter.com','www.twitter.com','x.com','www.x.com']);
if (twitterUrl) { const link = $('#twitter-link'); link.href = twitterUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.hidden = false; }

const discordLink = $('#discord-link');
const discordName = typeof portfolio.discordUsername === 'string' ? portfolio.discordUsername.trim() : '';
const discordUrl = safeUrl(portfolio.discord, ['discord.com','www.discord.com','discord.gg','discordapp.com']);
if (discordName) {
  const button = document.createElement('button');
  button.type = 'button'; button.className = discordLink.className; button.id = 'discord-link';
  button.append(...discordLink.childNodes);
  const label = button.querySelector('.button-label');
  const text = `Discord: ${discordName}`;
  label.textContent = text;
  let timer;
  button.addEventListener('click', async () => {
    let copied = false;
    try { await navigator.clipboard.writeText(discordName); copied = true; } catch {}
    label.textContent = copied ? 'Copied!' : text;
    $('#copy-status').textContent = copied ? `Copied ${discordName} to the clipboard.` : `Couldn't copy automatically. My Discord username is ${discordName}.`;
    clearTimeout(timer);
    timer = setTimeout(() => { label.textContent = text; $('#copy-status').textContent = ''; }, 2000);
  });
  discordLink.replaceWith(button);
} else if (discordUrl) {
  discordLink.href = discordUrl; discordLink.target = '_blank'; discordLink.rel = 'noopener noreferrer'; discordLink.hidden = false;
}

// Mobile menu
const menuButton = $('.menu-toggle');
const nav = $('#main-nav');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav.classList.toggle('open', open);
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuButton.focus(); } });
