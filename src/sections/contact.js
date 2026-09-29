import { gsap } from '../core/motion.js';
import { split } from '../core/text.js';

/* ===== 5. VALUES: scrubbed word rise, then engagement contacts ===== */
export function initContact() {
  document.querySelectorAll('.why').forEach(w => {
    const words = split(w.querySelector('h3'), 'words');
    gsap.timeline({ scrollTrigger: { trigger: w, start: 'top 88%', end: 'top 40%', scrub: .5 } })
      .from(words, { yPercent: 115, rotate: 3, stagger: .1, duration: .5 })
      .from(w.querySelector('p'), { opacity: 0, y: 20, filter: 'blur(8px)', duration: .4 }, '-=.2');
  });
  gsap.from('#engage .ct', { opacity: 0, y: 30, stagger: .12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '#engage', start: 'top 55%', toggleActions: 'play none none reverse' } });
}
