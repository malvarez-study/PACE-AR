// Replay the progress presentation each time it returns to view.
const momentumObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    entry.target.toggleAttribute('data-momentum-in-view', entry.isIntersecting);
  }
}, { threshold: 0.15 });
const connectMomentum = () => {
  const panel = document.querySelector('.dl-editorial-card.progress');
  if (panel && !panel.hasAttribute('data-motion-observed')) {
    panel.setAttribute('data-motion-observed', '');
    momentumObserver.observe(panel);
  }
};
connectMomentum();
new MutationObserver(connectMomentum).observe(document.getElementById('root'), { childList: true, subtree: true });