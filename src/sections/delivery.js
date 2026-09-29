import { gsap } from '../core/motion.js';
import { split } from '../core/text.js';

/* ===== 4. DEPLOY ===== */
function deployScene() {
  const tl = gsap.timeline({ scrollTrigger: { trigger: '#deploy', start: 'top top', end: 'bottom bottom', scrub: .6 } });
  tl.to('#trackFill', { scaleX: 1, ease: 'none', duration: 1 }, 0);
  document.querySelectorAll('.phase').forEach((p, i) => {
    const w = split(p.querySelector('h3'), 'words'); gsap.set(w, { yPercent: 115 });
    tl.to(p, { opacity: 1, duration: .06 }, .05 + i * .24).to(w, { yPercent: 0, stagger: .01, duration: .08 }, .05 + i * .24);
  });
  tl.to({}, { duration: .15 });
}

/* ===== 4b. MODEL ===== */
function modelScene() {
  const svg = document.getElementById('modelSvg'), NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  const box = (x, y, t, s, hot) => { const g = mk('g', { opacity: 0 });
    mk('rect', { x, y, width: 260, height: 64, rx: 3, class: hot ? 'fill-char2 stroke-copper' : 'fill-char2 stroke-boxline' }, g);
    const a = mk('text', { x: x + 130, y: y + 28, 'text-anchor': 'middle', 'font-family': 'Archivo', 'font-weight': 600, 'font-size': 17, class: 'fill-hi', style: 'font-stretch:112%' }, g); a.textContent = t;
    const b = mk('text', { x: x + 130, y: y + 48, 'text-anchor': 'middle', 'font-family': 'IBM Plex Sans', 'font-size': 13, class: 'fill-steel' }, g); b.textContent = s; return g; };
  const ln = d => { const p = mk('path', { d, fill: 'none', class: 'stroke-copper', 'stroke-width': 1.6, pathLength: 1 }); p.style.strokeDasharray = 1; p.style.strokeDashoffset = 1; return p; };
  const pA = ln('M400 94 V140 H190 V180'), pB = ln('M400 94 V140 H610 V180'), pC = ln('M190 244 V300 H400 V340'), pD = ln('M610 244 V300 H400');
  const b0 = box(270, 30, 'SPARK', 'Hybrid operational model', true),
        b1 = box(60, 180, 'Elite strategic steering', 'Focused, high-level executive committee'),
        b2 = box(480, 180, 'Extended talent network', 'AI, robotics, cloud, certification'),
        b3 = box(270, 340, 'Scalable specialist pods', 'Mobilised on demand', true);
  gsap.timeline({ scrollTrigger: { trigger: '#model', start: 'top top', end: 'bottom bottom', scrub: .6 } })
    .fromTo(b0, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: .1 })
    .to([pA, pB], { strokeDashoffset: 0, duration: .15 })
    .fromTo([b1, b2], { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: .1 })
    .to([pC, pD], { strokeDashoffset: 0, duration: .15 })
    .fromTo(b3, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: .1 })
    .to({}, { duration: .3 });
}

export function initDelivery() {
  deployScene();
  modelScene();
}
