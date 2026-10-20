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
// Pause decorative animation offscreen and when the tab is hidden.
const sectionMotion = new IntersectionObserver(entries => {
 for (const entry of entries) {
  entry.target.toggleAttribute('data-motion-paused', !entry.isIntersecting || document.hidden);
  entry.target.toggleAttribute('data-motion-visible', entry.isIntersecting);
 }
}, { rootMargin: '80px 0px', threshold: 0 });
const connectSections = () => {
 document.querySelectorAll('.desktop-landing section:not([data-motion-tracked])').forEach(section => {
  section.setAttribute('data-motion-tracked', '');
  sectionMotion.observe(section);
 });
};
connectSections();
new MutationObserver(connectSections).observe(document.getElementById('root'), {childList:true, subtree:true});
document.addEventListener('visibilitychange', () => {
 document.querySelectorAll('section[data-motion-tracked]').forEach(section => {
  section.toggleAttribute('data-motion-paused', document.hidden || !section.hasAttribute('data-motion-visible'));
 });
});
