export function resolveMedia(value, {autoplay = true} = {}) {
  if (typeof value !== 'string' || !value.trim()) return null;
  let url;
  try { url = new URL(value.trim()); } catch { return null; }
  if (url.protocol !== 'https:' || url.username || url.password) return null;
  const host = url.hostname.toLowerCase();
  let youtubeId;
  if (host === 'youtu.be') youtubeId = url.pathname.slice(1).split('/')[0];
  if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
    youtubeId = url.searchParams.get('v');
    if (!youtubeId) youtubeId = url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1];
  }
  if (youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(youtubeId)) return {type:'iframe',src:`https://www.youtube-nocookie.com/embed/${youtubeId}?${autoplay ? 'autoplay=1&' : ''}rel=0`};
  if (['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(host)) {
    const match = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/);
    if (match) {
      const hash = match[2] || url.searchParams.get('h');
      return {type:'iframe',src:`https://player.vimeo.com/video/${match[1]}?autoplay=${autoplay ? 1 : 0}${hash && /^[a-zA-Z0-9]+$/.test(hash) ? `&h=${hash}` : ''}`};
    }
  }
  if (/\.(mp4|webm)$/i.test(url.pathname)) return {type:'video',src:url.href};
  return null;
}
