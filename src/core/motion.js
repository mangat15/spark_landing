import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const mobile = () => innerWidth < 820;
/* Theme: 'metal' (dark mode) | 'light' (light mode) with the new logo, or '' = the original concept palette
   (?theme=concept). The inline script in index.html picks it before first paint; applyTheme() switches live. */
export const theme = () => document.documentElement.dataset.theme || '';
export function applyTheme(t) {
  const root = document.documentElement;
  if (!reduce) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 500); }
  root.dataset.theme = t;
  document.dispatchEvent(new CustomEvent('spark:theme', { detail: t }));   // particles.js re-styles the point cloud
}

/* logo files in public/logos/, by key */
const L = f => `${import.meta.env.BASE_URL}logos/${f}`;
export const LOGOS = {
  aws: L('aws.png'),
  slb: L('slb.png'),
  dynamik: L('dynamik-technologies.png'),
  gamuda: L('gamuda-technologies.png'),
  avitek: L('avitek.png'),
  solarvest: L('solarvest.png'),
  huawei: L('huawei.png'),
  eon: L('eon-reality.jpg'),
  keysight: L('keysight.svg'),
  bosch: L('bosch-rexroth.svg'),
  intertek: L('intertek.svg'),
  eiu: L('electrical-inspectorate-unit.png'),
  cswip: L('cswip.png'),
  twi: L('twi.png'),
  kga: L('knowledge-grid-academy.png'),
  kgi: L('knowledge-grid-international.png'),
  hrd: L('hrd-corp.png'),
  ethos: L('ethosconnect.png'),
  centexs: L('centexs.png'),
  cmi: L('china-mobile.svg'),
  spark: L(theme() ? 'spark-mark-new.png' : 'spark-mark-full.png'),   // both modes share the new mark
  ros: L('ros2.svg')
};
document.querySelectorAll('img[data-logo]').forEach(i => { i.src = LOGOS[i.dataset.logo]; });

/* ---------- smooth scroll ---------- */
const lenis = reduce ? null : new Lenis({ lerp: 0.09 });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- nav: anchors, progress bar, active link ---------- */
export function initNav() {
  // --nav-h: the fixed nav's height, so full-screen scenes can keep their content below it
  const nav = document.querySelector('nav');
  const setNavH = () => document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  new ResizeObserver(setNavH).observe(nav); setNavH();

  // light / dark button: the visitor's choice is remembered; until they choose, follow the system setting live
  const btn = document.getElementById('modeToggle'), sys = matchMedia('(prefers-color-scheme: light)');
  const fixed = new URLSearchParams(location.search).has('theme');   // review links pin a theme
  const label = () => btn.setAttribute('aria-label', theme() === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  const saved = () => { try { return localStorage.getItem('spark-mode'); } catch { return null; } };
  btn.addEventListener('click', () => {
    const t = theme() === 'light' ? 'metal' : 'light';
    try { localStorage.setItem('spark-mode', t === 'light' ? 'light' : 'dark'); } catch { /* private mode: just switch */ }
    applyTheme(t); label();
  });
  sys.addEventListener('change', e => { if (theme() && !fixed && !saved()) { applyTheme(e.matches ? 'light' : 'metal'); label(); } });
  label();

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); lenis ? lenis.scrollTo(t, { duration: 2 }) : t.scrollIntoView();
  }));
  gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .3 } });
  ['about', 'capabilities', 'partners', 'delivery', 'contact'].forEach(id => {
    const link = document.querySelector(`.navlink[href="#${id}"]`);
    ScrollTrigger.create({ trigger: '#' + id, start: 'top 50%', end: 'bottom 50%', onToggle: s => link.classList.toggle('active', s.isActive) });
  });
}
