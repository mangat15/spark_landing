import { gsap, ScrollTrigger, reduce } from './motion.js';

/* ---------- text animation helpers ---------- */
export function split(el, mode) {
  const parts = [];
  const walk = node => { [...node.childNodes].forEach(ch => {
    if (ch.nodeType === 3) {
      const frag = document.createDocumentFragment();
      ch.textContent.split(/(\s+)/).forEach(tok => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
        const mask = document.createElement('span'); mask.className = 'sp-mask';
        if (mode === 'chars') { const w = document.createElement('span'); w.className = 'sp-word';
          [...tok].forEach(c => { const s = document.createElement('span'); s.className = 'sp-in'; s.textContent = c; w.appendChild(s); parts.push(s); }); mask.appendChild(w); }
        else { const s = document.createElement('span'); s.className = 'sp-in'; s.textContent = tok; mask.appendChild(s); parts.push(s); }
        frag.appendChild(mask);
      });
      ch.replaceWith(frag);
    } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
  }); };
  walk(el); return parts;
}

const SC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/&#';
export function scramble(el) {
  const final = el.dataset.text || el.textContent; el.dataset.text = final;
  if (reduce) { el.textContent = final; return; }
  const t0 = performance.now(), dur = 900;
  (function step(now) { const p = Math.min((now - t0) / dur, 1), n = Math.floor(p * final.length); let s = final.slice(0, n);
    for (let i = n; i < final.length; i++) s += final[i] === ' ' ? ' ' : SC[(Math.random() * SC.length) | 0];
    el.textContent = s; if (p < 1) requestAnimationFrame(step); })(t0);
}

/* auto reveals for [data-scramble] [data-split] [data-blur]; text a section animates itself is marked data-manual */
export function initText() {
  document.querySelectorAll('[data-scramble]').forEach(el => {
    el.dataset.text = el.textContent;
    ScrollTrigger.create({ trigger: el, start: 'top 88%', onEnter: () => scramble(el), onEnterBack: () => scramble(el) });
  });
  document.querySelectorAll('[data-split]:not([data-manual])').forEach(el => {
    const parts = split(el, el.dataset.split);
    gsap.from(parts, { yPercent: 115, rotate: el.dataset.split === 'chars' ? 8 : 3, duration: 1, ease: 'power4.out', stagger: el.dataset.split === 'chars' ? .025 : .06,
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' } });
  });
  document.querySelectorAll('[data-blur]:not([data-manual])').forEach(el => {
    gsap.from(el, { opacity: 0, y: 24, filter: 'blur(12px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
  });
}
