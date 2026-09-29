import { gsap, ScrollTrigger, reduce, LOGOS } from '../core/motion.js';
import { split, scramble } from '../core/text.js';
import { state } from '../core/particles.js';

/* ===== 3a. TWO STRATEGIC PARTNERS: SPARK in the middle, linked to CMI and CENTEXS ===== */
function splitScene() {
  const svg = document.getElementById('splitSvg'), NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  const line = d => { const p = mk('path', { d, fill: 'none', class: 'stroke-copper', 'stroke-width': 2, pathLength: 1 }); p.style.strokeDasharray = 1; p.style.strokeDashoffset = 1; return p; };
  // display = Archivo semi-wide (names); otherwise IBM Plex Sans (descriptions). cls = Tailwind fill-* colour
  const txt = (parent, x, y, s, display, size, cls, weight = 400) => {
    mk('text', { x, y, 'text-anchor': 'middle', 'font-family': display ? 'Archivo' : 'IBM Plex Sans', 'font-size': size, class: cls, 'font-weight': weight, style: display ? 'font-stretch:112%' : '' }, parent).textContent = s;
  };
  const spark = mk('g', { opacity: 0 });
  mk('circle', { cx: 500, cy: 150, r: 74, class: 'fill-char stroke-copper', 'stroke-width': 1.5 }, spark);
  mk('image', { href: LOGOS.spark, x: 460, y: 102, width: 80, height: 96 }, spark);
  txt(spark, 500, 262, 'SPARK Technologies', true, 22, 'fill-hi', 700);
  const l1 = line('M426 150 H250'), l2 = line('M574 150 H750');
  const cmi = mk('g', { opacity: 0 });
  mk('circle', { cx: 180, cy: 150, r: 70, fill: '#fff', class: 'disc' }, cmi);   // white logo disc, same as CENTEXS
  mk('image', { href: LOGOS.cmi, x: 122, y: 132, width: 116, height: 36 }, cmi);
  txt(cmi, 180, 262, 'China Mobile International', true, 19, 'fill-hi', 600);
  txt(cmi, 180, 290, 'Enterprise Infrastructure, IoT & Connectivity', false, 14, 'fill-steel');
  const cx = mk('g', { opacity: 0 });
  mk('circle', { cx: 820, cy: 150, r: 70, fill: '#fff', class: 'disc' }, cx);
  mk('image', { href: LOGOS.centexs, x: 770, y: 108, width: 100, height: 84 }, cx);
  txt(cx, 820, 262, 'CENTEXS', true, 19, 'fill-hi', 600);
  txt(cx, 820, 290, 'Training, Upskilling & Certification', false, 14, 'fill-steel');
  const h = split(document.getElementById('splitH'), 'words');
  gsap.timeline({ scrollTrigger: { trigger: '#split', start: 'top top', end: 'bottom bottom', scrub: .6 } })
    .from(h, { yPercent: 115, stagger: .03, duration: .12 })
    .from('#splitP', { opacity: 0, y: 20, filter: 'blur(10px)', duration: .12 }, '<.05')
    .to(spark, { opacity: 1, duration: .1 })
    .to([l1, l2], { strokeDashoffset: 0, duration: .2 })
    .add(() => [l1, l2].forEach(l => l.classList.add('flow')))
    .fromTo(cmi, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: .12 })
    .fromTo(cx, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .12 })
    .to({}, { duration: .35 });
}

/* ===== 3b. CMI ===== */
function cmiScene() {
  const big = split(document.getElementById('cmiBig'), 'chars');
  const name = split(document.getElementById('cmiName'), 'words');
  const label = document.getElementById('cmiLabel'); label.dataset.text = label.textContent;
  const text = document.getElementById('cmiText');
  let scr = false;
  gsap.timeline({ scrollTrigger: { trigger: '#cmi', start: 'top top', end: 'bottom bottom', scrub: .6,
      onUpdate: s => { if (s.progress > .02 && !scr) { scr = true; scramble(label); } if (s.progress < .01) scr = false; } } })
    .from(label, { opacity: 0, duration: .05 })
    .from('#cmiLogo', { opacity: 0, y: 20, filter: 'blur(8px)', duration: .05 }, '<')
    .from(big, { yPercent: 115, rotate: 10, stagger: .04, duration: .16, ease: 'power4.out' })
    .from(name, { yPercent: 115, stagger: .02, duration: .1 }, '-=.06')
    .from(text, { opacity: 0, y: 24, filter: 'blur(10px)', duration: .12 })
    .to('#cmi .chip', { opacity: 1, stagger: .06, duration: .08 }, '-=.05')
    .to({}, { duration: .3 })
    .to(['#cmiLogo', label, text, '#cmi .chip'], { opacity: 0, duration: .08 })
    .to(big, { yPercent: -115, stagger: .02, duration: .1 }, '<')
    .to(name, { yPercent: -115, stagger: .01, duration: .08 }, '<');
}

/* ===== 3c. CENTEXS + ORBIT ===== */
// k = key in LOGOS (public/logos/); w = text tile for partners without a logo file yet
const INNER = [
  { k: 'aws', n: 'AWS', c: 'USA' }, { k: 'huawei', n: 'Huawei', c: 'China' }, { k: 'eon', n: 'EON Reality', c: 'USA' },
  { k: 'keysight', n: 'Keysight', c: 'USA' }, { k: 'bosch', n: 'Bosch Rexroth', c: 'Germany' }, { w: 'DMI', n: 'DMI', c: 'Ireland' },
  { k: 'intertek', n: 'Intertek', c: 'UK' }, { k: 'ros', n: 'ROS2', c: '' } ];
const OUTER = [
  { k: 'slb', n: 'SLB' }, { k: 'dynamik', n: 'Dynamik Technologies' }, { k: 'gamuda', n: 'Gamuda Technologies' }, { k: 'avitek', n: 'AVITEK' },
  { k: 'solarvest', n: 'Solarvest' }, { k: 'eiu', n: 'Electrical Inspectorate Unit' }, { k: 'cswip', n: 'CSWIP' }, { k: 'twi', n: 'TWI' },
  { k: 'kga', n: 'Knowledge Grid Academy' }, { k: 'kgi', n: 'Knowledge Grid International' }, { k: 'ethos', n: 'EthosConnect' }, { k: 'hrd', n: 'HRD Corp' } ];

const tileFace = p => p.k
  ? `<img src="${LOGOS[p.k]}" alt="${p.n}" class="max-h-[34px] max-w-full object-contain">`
  : `<span class="font-display semi font-bold text-[15px] text-[#1d1f22] tracking-tight leading-none text-center">${p.w}</span>`;

const SHRINK = { scale: .2, y: 118 };   // CENTEXS title tucked under the logo once the orbit forms

/* The concept's ring radii (and 128×58 tiles), shrunk only as far as needed so no tile, anywhere on
   its turn, goes under the nav or off-screen, or touches the ring labels, the caption, the CENTEXS
   logo/title or the other ring. Boxes are stage-relative {l,t,r,b}; cy = ring centre. */
function fitRings(w, h, cy, outerAvoid, innerAvoid) {
  const cx = w / 2, base = [[Math.min(w * .25, 470), h * .27], [Math.min(w * .43, 820), h * .38]];
  const ring = (j, k) => Array.from({ length: 96 }, (_, i) => { const a = i / 96 * Math.PI * 2; return [cx + Math.cos(a) * base[j][0] * k, cy + Math.sin(a) * base[j][1] * k]; });
  for (const ts of [1, .92, .85, .78, .7]) {
    const tw = 64 * ts + 8, th = 29 * ts + 8;   // tile half-size + gap
    const clear = (P, boxes) => P.every(([x, y]) => boxes.every(b => x + tw <= b.l || x - tw >= b.r || y + th <= b.t || y - th >= b.b));
    const apart = (A, B) => A.every(([x1, y1]) => B.every(([x2, y2]) => Math.abs(x1 - x2) >= 2 * tw || Math.abs(y1 - y2) >= 2 * th));
    for (let ko = 1; ko > .6; ko -= .02) {
      const O = ring(1, ko); if (!clear(O, outerAvoid)) continue;
      for (let ki = 1; ki > .6; ki -= .02) {
        const I = ring(0, ki);
        if (!clear(I, innerAvoid)) break;   // any smaller only moves it further into the centre
        if (apart(I, O)) return { R: [[base[0][0] * ki, base[0][1] * ki], [base[1][0] * ko, base[1][1] * ko]], ts, cy };
      }
    }
  }
  return { R: base, ts: .7, cy };
}

function centexsScene() {
  // tablet/mobile logo grid
  const gridBlock = (title, arr) => `<p class="text-sm text-copperl mt-8 mb-3">${title}</p><div class="grid grid-cols-2 sm:grid-cols-4 gap-3">${
    arr.map(p => `<div class="h-16 rounded-lg bg-white grid place-items-center px-3">${tileFace(p)}</div>`).join('')}</div>`;
  document.getElementById('pgrid').innerHTML = gridBlock('Accredited in partnership with', INNER) + gridBlock('Strategic partner ecosystem', OUTER);

  const big = split(document.getElementById('cxBig'), 'chars');
  const mm = gsap.matchMedia();
  mm.add('(min-width:1024px)', () => {
    const $ = id => document.getElementById(id);
    const stage = $('cxStage'), orbit = $('orbit'), nav = document.querySelector('nav');
    const logoWrap = $('cxLogoWrap'), cxInner = $('cxInner'), caption = $('orbitCap'), labels = [$('rlInner'), $('rlOuter'), caption];

    const chips = []; let paused = false;
    const make = (p, ring, i, n) => {
      const el = document.createElement('div');
      el.className = 'tile absolute left-0 top-0 w-[128px] h-[58px] opacity-0 cursor-default'; el.tabIndex = 0;
      el.innerHTML = `<div class="w-full h-full rounded-xl bg-white grid place-items-center px-3 ${ring === 0 ? 'ring-1 ring-copper/70' : ''}">${tileFace(p)}</div>
        <span class="tip absolute left-1/2 top-full mt-2 whitespace-nowrap text-[12px] text-fg bg-char2 border border-line4 rounded px-2 py-1">${p.n}${p.c ? ' (' + p.c + ')' : ''}</span>`;
      orbit.appendChild(el);
      ['pointerenter', 'focus'].forEach(ev => el.addEventListener(ev, () => { paused = true; el.style.zIndex = 5; }));
      ['pointerleave', 'blur'].forEach(ev => el.addEventListener(ev, () => { paused = false; el.style.zIndex = ''; }));
      const c = { el, ring, a0: (i / n) * Math.PI * 2 - Math.PI / 2 + (ring ? Math.PI / n : 0), p: 0 }; chips.push(c); return c;
    };
    const innerC = INNER.map((p, i) => make(p, 0, i, INNER.length));
    const outerC = OUTER.map((p, i) => make(p, 1, i, OUTER.length));

    /* fit the rings to this stage; re-run on resize, nav height change, or ScrollTrigger refresh (fonts loaded) */
    let fitted, fitFor = '';
    const refit = () => { fitFor = ''; };
    ScrollTrigger.addEventListener('refresh', refit);
    const box = (el, m = 8) => ({ l: el.offsetLeft - m, t: el.offsetTop - m, r: el.offsetLeft + el.offsetWidth + m, b: el.offsetTop + el.offsetHeight + m });
    const fit = (w, h) => {
      const nh = nav.offsetHeight, E = 1e4;
      const lw = logoWrap.offsetWidth, tw = cxInner.offsetWidth * SHRINK.scale, th = cxInner.offsetHeight * SHRINK.scale;
      // logo (-translate-y-[62%]) + shrunk title form a cluster; anchor it (--cx-y) mid-way between the nav and the caption
      const up = lw * .62 + 8, down = SHRINK.y + th / 2 + 8, cy = (nh + caption.offsetTop - 8) / 2, my = cy - (down - up) / 2;
      stage.style.setProperty('--cx-y', my + 'px');
      const logo = { l: w / 2 - lw / 2 - 8, t: my - up, r: w / 2 + lw / 2 + 8, b: my + lw * .38 + 8 };
      const title = { l: w / 2 - tw / 2 - 8, t: my + SHRINK.y - th / 2 - 8, r: w / 2 + tw / 2 + 8, b: my + down };
      const edges = [{ l: -E, t: -E, r: E, b: nh }, { l: -E, t: -E, r: 4, b: E }, { l: w - 4, t: -E, r: E, b: E }, { l: -E, t: h - 4, r: E, b: E }];
      fitted = fitRings(w, h, cy, [...edges, ...labels.map(el => box(el))], [logo, title]);
    };

    let rin = 0, rout = 0, last = performance.now(), raf;
    const ease = t => 1 - Math.pow(1 - t, 3);
    (function loop(now = performance.now()) {
      const dt = Math.min((now - last) / 1000, .05); last = now;
      const allIn = outerC[outerC.length - 1].p > .99;
      if (!paused && !reduce && allIn) { rin += dt * .08; rout -= dt * .05; }
      const w = stage.clientWidth, h = stage.clientHeight, key = `${w}x${h}x${nav.offsetHeight}`;
      if (fitFor !== key) { fitFor = key; fit(w, h); }
      const cx = w / 2, cy = fitted.cy;
      chips.forEach(c => {
        const a = c.a0 + (c.ring ? rout : rin), [rx, ry] = fitted.R[c.ring], e = ease(c.p);
        const tx = cx + Math.cos(a) * rx, ty = cy + Math.sin(a) * ry, sx = cx + Math.cos(a) * w, sy = cy + Math.sin(a) * h;   // on the ring / flying in from off-screen
        const hov = c.el.matches(':hover,:focus') ? 1.15 : 1;
        c.el.style.opacity = Math.min(c.p * 1.5, 1);
        c.el.style.transform = `translate(${sx + (tx - sx) * e}px,${sy + (ty - sy) * e}px) translate(-50%,-50%) scale(${(.55 + .45 * e) * fitted.ts * hov})`;
      });
      raf = requestAnimationFrame(loop);
    })();

    gsap.timeline({ scrollTrigger: { trigger: '#centexs', start: 'top top', end: 'bottom bottom', scrub: .6 } })
      .from('#cxLabel', { opacity: 0, y: 20, duration: .04 })
      .from(big, { yPercent: 115, rotate: 10, stagger: .015, duration: .08, ease: 'power4.out' })
      .from('#cxDetails > *', { opacity: 0, y: 24, filter: 'blur(8px)', stagger: .03, duration: .06 })
      .to({}, { duration: .1 })
      .to('#cxDetails', { opacity: 0, y: 20, duration: .05 })
      .to('#cxLabel', { opacity: 0, duration: .04 }, '<')
      .to('#cxInner', { ...SHRINK, duration: .12, ease: 'power2.inOut' })
      .to(state, { y: .2, duration: .12 }, '<')
      .fromTo('#cxLogoWrap', { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .08, ease: 'back.out(1.6)' }, '-=.05')
      .to(innerC, { p: 1, duration: .05, stagger: .025, ease: 'none' })
      .to('#rlInner', { opacity: 1, duration: .04 }, '<.05')
      .to(outerC, { p: 1, duration: .05, stagger: .018, ease: 'none' })
      .to('#rlOuter, #orbitCap', { opacity: 1, duration: .05 })
      .to({}, { duration: .2 });
    return () => { cancelAnimationFrame(raf); ScrollTrigger.removeEventListener('refresh', refit); stage.style.removeProperty('--cx-y'); orbit.innerHTML = ''; };
  });
  mm.add('(max-width:1023px)', () => {
    gsap.from(big, { yPercent: 115, stagger: .04, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: '#centexs', start: 'top 70%' } });
    gsap.from('#cxDetails, #pgrid', { opacity: 0, y: 30, stagger: .15, duration: 1, scrollTrigger: { trigger: '#centexs', start: 'top 60%' } });
  });
}

export function initPartners() {
  splitScene();
  cmiScene();
  centexsScene();
}
