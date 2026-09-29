import { gsap } from '../core/motion.js';
import { split } from '../core/text.js';
import { setForm } from '../core/particles.js';

/* ===== 2. CAPABILITIES: pillar swap ===== */
export function initCapabilities() {
  const pls = [...document.querySelectorAll('#capabilities .pl')];
  const f = ['mech', 'grid', 'network', 'map'];
  const bars = document.querySelectorAll('#plIndex i'), labels = document.querySelectorAll('#plIndex p');
  const parts = pls.map(p => ({ num: p.querySelector('.plnum'), t: split(p.querySelector('.plt'), 'words'), s: p.querySelector('.pls'), b: p.querySelectorAll('.plb li') }));
  parts.forEach(p => { gsap.set(p.t, { yPercent: 115 }); gsap.set([p.num, p.s, ...p.b], { opacity: 0, y: 16 }); });
  let active = -1;
  const tl = gsap.timeline({ scrollTrigger: { trigger: '#capabilities', start: 'top top', end: 'bottom bottom', scrub: .6,
    onUpdate: s => { const i = Math.min(3, Math.floor(s.progress * 4)); if (i !== active) { active = i; setForm(f[i]);
      labels.forEach((l, k) => { l.style.color = k === i ? 'rgb(var(--c-fg4))' : ''; }); } } } });
  parts.forEach((p, i) => {
    const st = i * 1;
    tl.to(p.num, { opacity: 1, y: 0, duration: .08 }, st + .02)
      .to(p.t, { yPercent: 0, stagger: .025, duration: .16, ease: 'power3.out' }, st + .04)
      .to(p.s, { opacity: 1, y: 0, duration: .1 }, st + .16)
      .to(p.b, { opacity: 1, y: 0, stagger: .05, duration: .1 }, st + .22)
      .to(bars[i], { scaleX: 1, ease: 'none', duration: .9 }, st);
    if (i < parts.length - 1) tl.to(p.t, { yPercent: -115, stagger: .015, duration: .12, ease: 'power3.in' }, st + .82)
      .to([p.num, p.s, ...p.b], { opacity: 0, y: -12, duration: .1 }, st + .82);
  });
}
