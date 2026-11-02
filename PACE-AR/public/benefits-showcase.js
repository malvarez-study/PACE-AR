const observer = new MutationObserver(installShowcase);
function installShowcase() {
  const grid = document.querySelector('.dl-benefit-grid');
  if (!grid || grid.classList.contains('video-showcase')) return;
  grid.classList.add('video-showcase');
  const cards = [...grid.children];
  cards.forEach((card, index) => {
    if (index === 4) { card.hidden = true; return; }
    const column = index < 2 ? 1 : index < 4 ? 9 : (index - 5) * 2 + 1;
    const row = index < 4 ? index % 2 + 1 : 3;
    card.style.setProperty('--card-column', `${column} / span 2`);
    card.style.setProperty('--card-row', String(row));
  });
  const panel = document.createElement('div');
  panel.className = 'benefits-video-panel';
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'none';
  video.poster = '/assets/pace-ar-promo-poster-hq.png';
  video.setAttribute('aria-label', 'PACE AR promotional video');
  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'benefits-video-play';
  play.textContent = '▶';
  play.setAttribute('aria-label', 'Play PACE AR promo video');
  let loading;
  const loadVideo = () => {
    if (loading) return loading;
    play.disabled = true;
    play.textContent = '…';
    play.setAttribute('aria-label', 'Loading video');
    // The static host ignores byte ranges; a complete Blob enables reliable seeking.
    loading = fetch('/assets/pace-ar-promo.mp4').then(response => {
      if (!response.ok) throw new Error('Video download failed');
      return response.blob();
    }).then(blob => {
      const url = URL.createObjectURL(blob);
      video.src = url;
      video.preload = 'auto';
      video.load();
      play.disabled = false;
      play.textContent = '▶';
  play.setAttribute('aria-label', 'Play PACE AR promo video');
      window.addEventListener('pagehide', event => {
        if (!event.persisted) URL.revokeObjectURL(url);
      }, { once: true });
    }).catch(() => {
      loading = undefined;
      play.disabled = false;
      play.textContent = 'Retry loading video';
      throw new Error('Video download failed');
    });
    return loading;
  };
  play.addEventListener('click', async () => {
    try {
      await loadVideo();
      await video.play();
    } catch {
      // Keep the button available for a download retry or browser playback permission.
    }
  });
  const badge = document.createElement('button');
  badge.type = 'button';
  badge.className = 'benefits-video-badge';
  badge.textContent = '▶ Watch Preview (0:46)';
  badge.addEventListener('click', () => play.click());
  video.addEventListener('play', () => { play.hidden = true; panel.classList.add('is-playing'); });
  video.addEventListener('pause', () => { play.hidden = false; panel.classList.remove('is-playing'); });
  video.addEventListener('ended', () => { play.hidden = false; panel.classList.remove('is-playing'); });
  const caption = document.createElement('div');
  caption.className = 'benefits-video-caption';
  const label = document.createElement('strong');
  label.textContent = '05 / SCANNABLE AR FITNESS QUESTS';
  const detail = document.createElement('span');
  detail.textContent = 'Turn any place into your next challenge.';
  caption.append(label, detail);
  panel.append(video, play, badge, caption);
  const nearVideo = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    nearVideo.disconnect();
    loadVideo().catch(() => {});
  }, { rootMargin: '300px' });
  nearVideo.observe(panel);
  grid.append(panel);
}
observer.observe(document.getElementById('root'), { childList: true, subtree: true });
installShowcase();
