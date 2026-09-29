import { gsap } from '../core/motion.js';
import { split } from '../core/text.js';
import { setForm } from '../core/particles.js';

/* ===== 1b. INTERSECTION: words swap, particles morph =====
   (executive summary + vision/mission use the auto reveals in text.js) */
export function initAbout() {
  const words = [...document.querySelectorAll('#inter .iw')].map(el => split(el, 'chars'));
  const lead = split(document.getElementById('interLead'), 'words');
  const tail = split(document.getElementById('interTail'), 'words');
  const f = ['grid', 'mech', 'network', 'nodes'];
  words.forEach(w => gsap.set(w, { yPercent: 115 }));
  gsap.set(tail, { yPercent: 115 });
  const tl = gsap.timeline({ scrollTrigger: { trigger: '#inter', start: 'top top', end: 'bottom bottom', scrub: .6,
    onUpdate: s => setForm(f[Math.min(3, Math.floor(s.progress * 4.4))]) } });
  tl.from(lead, { yPercent: 115, stagger: .02, duration: .08 });
  words.forEach((w, i) => {
    tl.to(w, { yPercent: 0, stagger: .008, duration: .12, ease: 'power3.out' });
    tl.to({}, { duration: .1 });
    if (i < words.length - 1) tl.to(w, { yPercent: -115, stagger: .006, duration: .1, ease: 'power3.in' });
  });
  tl.to(tail, { yPercent: 0, stagger: .015, duration: .1 }).to({}, { duration: .12 });
}
