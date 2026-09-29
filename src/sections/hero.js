import { gsap } from '../core/motion.js';
import { split, scramble } from '../core/text.js';
import { state } from '../core/particles.js';

/* ===== 1. HERO: intro + scroll ===== */
export function initHero() {
  const chars = split(document.getElementById('heroTitle'), 'chars');
  const tech = split(document.getElementById('heroTech'), 'chars');
  const sub = document.getElementById('heroSub'); sub.dataset.text = sub.textContent;
  const pts = document.querySelectorAll('#heroPts span');
  gsap.timeline({ delay: .3 })
    .from(chars, { yPercent: 115, rotate: 10, stagger: .07, duration: 1.2, ease: 'power4.out' })
    .from(tech, { yPercent: 115, stagger: .03, duration: .9, ease: 'power4.out' }, '-=.8')
    .add(() => scramble(sub), '-=.4')
    .from(pts, { opacity: 0, y: 14, filter: 'blur(8px)', stagger: .12, duration: .8, ease: 'power3.out' }, '-=.2');
  gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: .8 } })
    .to(state, { rot: Math.PI * 2, ease: 'none', duration: 1 }, 0)
    .to(state, { camZ: 4.6, scatter: .9, ease: 'power2.in', duration: .5 }, 0)
    .to(state, { camZ: 6.2, scatter: 0, ease: 'power2.out', duration: .5 }, .5)
    .to('#heroCopy', { opacity: 0, y: -60, filter: 'blur(10px)', ease: 'none', duration: .3 }, 0);
}
