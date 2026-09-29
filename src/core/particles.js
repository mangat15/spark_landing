import { WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute, CanvasTexture, PointsMaterial, Points, Group, AdditiveBlending, NormalBlending, LinearSRGBColorSpace } from 'three';
import { gsap, ScrollTrigger, reduce, mobile, theme, LOGOS } from './motion.js';

/* ---------- particles (real SPARK mark) ---------- */
const N = mobile() ? 2400 : 4600;
let seed = 7;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd());
const F = () => new Float32Array(N * 3);
const forms = {};
const raw = new Float32Array(N * 3), colors = new Float32Array(N * 3);   // the mark's pixel colours / as drawn
// light mode: darker points read better on the page; dark modes brighten them a touch (as in the concept)
const paint = light => { const k = light ? .8 : 1.15; for (let i = 0; i < N * 3; i++) colors[i] = Math.min(raw[i] * k, 1); };

function buildForms(markImg) {
  const W = markImg.naturalWidth, H = markImg.naturalHeight;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); x.drawImage(markImg, 0, 0);
  const d = x.getImageData(0, 0, W, H).data, pool = [];
  for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) { const i = (py * W + px) * 4; if (d[i + 3] > 140) pool.push([px, py, d[i] / 255, d[i + 1] / 255, d[i + 2] / 255]); }
  const a = F(), sc = 2.9 / H;
  for (let i = 0; i < N; i++) {
    const p = pool[(rnd() * pool.length) | 0];
    a[i*3] = (p[0] - W / 2 + rnd() - .5) * sc; a[i*3+1] = -(p[1] - H / 2 + rnd() - .5) * sc; a[i*3+2] = (rnd() - .5) * .25;
    raw[i*3] = p[2]; raw[i*3+1] = p[3]; raw[i*3+2] = p[4];
  }
  forms.logo = a;
}
function otherForms() {
  { const a = F(), s = Math.ceil(Math.cbrt(N));
    for (let i = 0; i < N; i++) { const ix = i % s, iy = Math.floor(i / s) % s, iz = Math.floor(i / (s * s));
      a[i*3] = (ix / (s - 1) - .5) * 2.8; a[i*3+1] = (iy / (s - 1) - .5) * 2.8; a[i*3+2] = (iz / (s - 1) - .5) * 2.8; } forms.grid = a; }
  { const a = F(), teeth = 14;
    for (let i = 0; i < N; i++) { const r = rnd(); let z = (rnd() - .5) * .3, th, rad;
      if (r < .52) { th = rnd() * 6.2832; rad = 1.35 + (rnd() - .5) * .25; }
      else if (r < .77) { th = Math.floor(rnd() * teeth) / teeth * 6.2832 + (rnd() - .5) * .16; rad = 1.5 + rnd() * .35; }
      else if (r < .87) { th = rnd() * 6.2832; rad = .32 + (rnd() - .5) * .1; }
      else { th = Math.floor(rnd() * 6) / 6 * 6.2832 + (rnd() - .5) * .04; rad = .38 + rnd() * .9; }
      a[i*3] = Math.cos(th) * rad; a[i*3+1] = Math.sin(th) * rad; a[i*3+2] = z; } forms.mech = a; }
  { const a = F(), R = 1.9, M = Math.floor(N * .72), pts = [];
    for (let i = 0; i < M; i++) { const y = 1 - (i / (M - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996; pts.push([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R]); }
    for (let i = 0; i < N; i++) { let p; if (i < M) p = pts[i]; else { const A = pts[(rnd() * M) | 0], B = pts[(rnd() * M) | 0], t = rnd(); p = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]; }
      a[i*3] = p[0]; a[i*3+1] = p[1]; a[i*3+2] = p[2]; } forms.network = a; }
  { const a = F(), C = []; for (let k = 0; k < 16; k++) C.push([(rnd() - .5) * 3.8, (rnd() - .5) * 3.2, (rnd() - .5) * 2.2]);
    for (let i = 0; i < N; i++) { let p;
      if (rnd() < .68) { const c = C[(rnd() * C.length) | 0]; p = [c[0] + gauss() * .09, c[1] + gauss() * .09, c[2] + gauss() * .09]; }
      else { const k = (rnd() * C.length) | 0, A = C[k], B = C[(k + 1 + ((rnd() * 2) | 0)) % C.length], t = rnd(); p = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]; }
      a[i*3] = p[0]; a[i*3+1] = p[1]; a[i*3+2] = p[2]; } forms.nodes = a; }
  { const a = F(), rings = [.45, .95, 1.45, 1.95, 2.4];
    for (let i = 0; i < N; i++) { let r, th;
      if (rnd() < .72) { r = rings[(rnd() * rings.length) | 0] + (rnd() - .5) * .03; th = rnd() * 6.2832; } else { th = Math.floor(rnd() * 8) / 8 * 6.2832; r = rnd() * 2.4; }
      a[i*3] = Math.cos(th) * r; a[i*3+1] = Math.sin(th) * r * .42; a[i*3+2] = Math.sin(th) * r * .9; } forms.map = a; }
  { const a = F(); for (let i = 0; i < N; i++) { a[i*3] = gauss() * .045; a[i*3+1] = gauss() * .045; a[i*3+2] = gauss() * .045; } forms.point = a; }
}

/* point sprite (its rgb is multiplied by the vertex colour): a soft glow, or in light mode a solid core with a
   drop-shadow so the shapes read on silver */
function sprite(light) {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const disc = (x, y, r, stops) => { const rg = g.createRadialGradient(x, y, 0, x, y, r); stops.forEach(([o, s]) => rg.addColorStop(o, s)); g.fillStyle = rg; g.fillRect(0, 0, 64, 64); };
  if (light) {
    disc(32, 38, 26, [[0, 'rgba(0,0,0,.45)'], [1, 'rgba(0,0,0,0)']]);
    disc(32, 29, 17, [[0, 'rgba(255,255,255,1)'], [.6, 'rgba(255,255,255,.95)'], [1, 'rgba(255,255,255,0)']]);
  } else disc(32, 32, 32, [[0, 'rgba(255,255,255,1)'], [.4, 'rgba(255,255,255,.6)'], [1, 'rgba(255,255,255,0)']]);
  return new CanvasTexture(c);
}

export const state = { x: 0, y: .95, rot: 0, scatter: 0, camZ: 6.2, dim: 1 };
let target = null, formName = 'logo';
export const setForm = n => { if (n !== formName && forms[n]) { formName = n; target = forms[n]; } };

function startGL() {
  const canvas = document.getElementById('gl');
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.outputColorSpace = LinearSRGBColorSpace; // the concept ran three r128, which output linear (no sRGB conversion)
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new Scene(), camera = new PerspectiveCamera(45, innerWidth / innerHeight, .1, 100);
  const geo = new BufferGeometry(), pos = F(), cur = Float32Array.from(forms.logo), dirs = F(), speed = new Float32Array(N);
  for (let i = 0; i < N; i++) { const v = [gauss(), gauss(), gauss()], l = Math.hypot(...v) || 1, m = .5 + rnd();
    dirs[i*3] = v[0] / l * m; dirs[i*3+1] = v[1] / l * m; dirs[i*3+2] = v[2] / l * m; speed[i] = .035 + rnd() * .04; }
  target = forms[formName] || forms.logo;
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('color', new BufferAttribute(colors, 3));
  const mat = new PointsMaterial({ vertexColors: true, transparent: true, depthWrite: false });
  let light;
  const style = () => {   // per mode: sprite, size (light points are bigger to fit their shadow), blending (additive glow vanishes on a light page), colours
    light = theme() === 'light';
    mat.map?.dispose(); mat.map = sprite(light);
    mat.size = light ? (mobile() ? .07 : .058) : (mobile() ? .05 : .04);
    mat.blending = light ? NormalBlending : AdditiveBlending; mat.needsUpdate = true;
    paint(light); geo.attributes.color.needsUpdate = true;
  };
  style(); document.addEventListener('spark:theme', style);
  const group = new Group(); group.add(new Points(geo, mat)); scene.add(group);
  const resize = () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); };
  addEventListener('resize', resize); resize();
  const t0 = performance.now(); // stands in for THREE.Clock (deprecated): elapsed time from the first frame
  (function frame() {
    const t = (performance.now() - t0) / 1000;
    for (let i = 0; i < N * 3; i++) { cur[i] += (target[i] - cur[i]) * speed[(i / 3) | 0]; pos[i] = cur[i] + dirs[i] * state.scatter * 2.4; }
    geo.attributes.position.needsUpdate = true;
    group.position.set(state.x, state.y, 0);
    group.rotation.y = state.rot + (reduce ? 0 : Math.sin(t * .25) * .35);
    group.rotation.x = reduce ? 0 : Math.sin(t * .3) * .1;
    camera.position.z = state.camZ; mat.opacity = light ? Math.min(1, state.dim * 1.3) : state.dim;
    renderer.render(scene, camera); requestAnimationFrame(frame);
  })();
}

export function initParticles() {
  const markImg = new Image();
  markImg.onload = () => { buildForms(markImg); otherForms(); startGL(); };
  markImg.src = LOGOS.spark;

  /* section → object state */
  document.querySelectorAll('[data-form]').forEach(el => {
    ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onToggle: s => { if (!s.isActive) return;
      setForm(el.dataset.form);
      let x = parseFloat(el.dataset.x || 0), dim = el.dataset.dim !== undefined ? parseFloat(el.dataset.dim) : 1;
      if (mobile() && x !== 0) { x = 0; dim *= .35; }
      gsap.to(state, { x, y: parseFloat(el.dataset.y || 0), dim, duration: 1.4, ease: 'power3.out', overwrite: 'auto' });
    } });
  });
}
