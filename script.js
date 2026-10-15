const TITLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@&%!?*';
setInterval(() => { document.title = Array.from({ length: 5 }, () => TITLE_CHARS[Math.floor(Math.random() * TITLE_CHARS.length)]).join(''); }, 100);
// H€xV#le
const API_URL = 'https://script.google.com/macros/s/AKfycbwOZqH-hr55cKfbD5JCnE5jWyOuqjg7kCfOr_vkI6_WO3Zm3eCLQsXAJBuh6eP-_MFR/exec';
const SESSION_KEY = 'exam_access_key';
let exams = null;
let fakeAuth = false;
const VAULT_KEY = 'hx_vault';
const WRONG_VAULT = [
  'You broke into a vault. It was the wrong one. It was always the wrong one.',
  'The keys you stole open doors that lead back to this room.',
  'This database was a mirror. You only hacked yourself.',
  'Every lock you pick here was built to be picked.',
  'The real vault has no door. Only patience.',
  'You found keys. Not the right kind.',
  'Stolen keys remember the hands that took them.',
  'A thief in an empty house is still a thief.',
  'The seals do not open for borrowed names.',
  'You won the game. The game was the lock.'
];
const vaultKeys = () => { try { return JSON.parse(sessionStorage.getItem(VAULT_KEY) || '[]'); } catch (e) { return []; } };
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
let names = [];
let current = 0;
/* H€xV#le */
const $ = s => document.querySelector(s);
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
// H€xV#le
const errors = { invalid: 'That key opens nothing here.', ip: 'This key already answers to another place.', banned: 'You are no longer welcome here.' };
const attemptsText = n => n == null ? '' : ' ' + n + (n === 1 ? ' attempt remains.' : ' attempts remain.');

async function getIp() {
  // H€xV#le
  const r = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
  return (await r.json()).ip;
}

async function login(key) {
  if (vaultKeys().includes(key)) {
    exams = null;
    names = [];
    fakeAuth = true;
    try { sessionStorage.setItem(SESSION_KEY, key); } catch (e) {}
    setAuth('yes');
    return;
  }
  const ip = await getIp();
  /* H€xV#le */
  const r = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ key, ip }) });
  const res = await r.json();
  if (!res.ok) { const err = new Error(res.error || 'unknown'); err.left = res.left; err.ip = ip; throw err; }
  names = Array.isArray(res.names) ? res.names : [];
  // H€xV#le
  const cryptoKey = await crypto.subtle.importKey('raw', b64(res.examKey), 'AES-GCM', false, ['decrypt']);
  const dec = new TextDecoder();
  exams = await Promise.all(window.EXAMS_ENC.map(async e => JSON.parse(dec.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(e.iv) }, cryptoKey, b64(e.ct))))));
  /* H€xV#le */
  fakeAuth = false;
  try { sessionStorage.setItem(SESSION_KEY, key); } catch (e) {}
  setAuth('yes');
}

const AUTH_TEXT = { no: 'not authorized · speak your key', checking: 'checking your key…', yes: 'authorized · the seals are open' };
function setAuth(state) {
  const a = $('#auth-status');
  a.dataset.state = state;
  a.querySelector('.auth-text').textContent = AUTH_TEXT[state];
}

function logout() {
  exams = null;
  fakeAuth = false;
  setAuth('no');
  names = [];
  // H€xV#le
  try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  $('#exam-body').replaceChildren();
  $('#exam-grid').replaceChildren();
  history.replaceState(null, '', location.pathname + location.search);
  show('login');
}

/* H€xV#le */
function show(id) {
  for (const s of ['login', 'home', 'exam']) {
    const node = $('#' + s);
    node.classList.toggle('hidden', s !== id);
    // H€xV#le
    if (s === id) { node.classList.remove('view'); void node.offsetWidth; node.classList.add('view'); }
  }
  window.scrollTo({ top: 0 });
}

function renderVoid() {
  const grid = $('#exam-grid');
  grid.replaceChildren(el('figure', 'void-quote', null));
  grid.firstChild.append(el('blockquote', null, WRONG_VAULT[Math.floor(Math.random() * WRONG_VAULT.length)]), el('figcaption', null, 'the vault you breached holds nothing real'));
  show('home');
}

function renderHome() {
  const grid = $('#exam-grid');
  grid.replaceChildren();
  /* H€xV#le */
  const max = Math.max(...exams.map(e => e.questions.length));
  exams.forEach((ex, i) => {
    const card = el('button', 'card');
    card.type = 'button';
    card.style.animationDelay = (i * 90) + 'ms';
    // H€xV#le
    const bar = el('div', 'progress');
    const fill = el('span');
    fill.style.width = (ex.questions.length / max * 100) + '%';
    fill.style.animationDelay = (300 + i * 90) + 'ms';
    bar.append(fill);
    card.append(el('div', 'num', 'Seal 0' + (i + 1)), el('h2', null, 'Chamber ' + ROMAN[i]), el('div', 'meta', ex.questions.length + ' riddles'), bar, el('span', 'go', '→'));
    /* H€xV#le */
    card.addEventListener('animationend', () => { card.classList.add('in'); card.classList.remove('bounce'); });
    card.onclick = () => { location.hash = '#exam/' + (i + 1); };
    grid.append(card);
  });
  show('home');
}

// H€xV#le
function renderExam(n) {
  const ex = exams[n - 1];
  if (!ex) return renderHome();
  current = n;
  $('#exam-title').textContent = $('#exam-title').dataset.text = 'Chamber ' + ROMAN[n - 1];
  const body = $('#exam-body');
  body.replaceChildren();
  /* H€xV#le */
  ex.questions.forEach((q, idx) => {
    const box = el('article', 'q');
    box.style.animationDelay = Math.min(idx * 50, 600) + 'ms';
    const head = el('div', 'q-head');
    head.append(el('span', 'q-num', 'Riddle ' + q.id));
    // H€xV#le
    if (q.type === 'matching') head.append(el('span', 'tag', 'Bound pairs'));
    else if (q.multiple) head.append(el('span', 'tag', 'More than one truth'));
    box.append(head, el('p', 'q-text', q.question));
    if (q.type === 'matching') {
      const pairs = el('div', 'pairs');
      /* H€xV#le */
      for (const p of q.pairs) {
        const row = el('div', 'pair');
        row.append(el('b', null, p.left), el('span', 'arrow', '→'), el('span', null, p.right));
        pairs.append(row);
      }
      box.append(pairs);
    } else {
      // H€xV#le
      const ul = el('ul', 'answers');
      for (const a of q.answers) {
        const li = el('li', a.correct ? 'correct' : null);
        li.append(el('span', 'mark', a.correct ? '✓' : ''), el('span', null, a.text));
        ul.append(li);
      }
      box.append(ul);
    }
    body.append(box);
  });
  /* H€xV#le */
  show('exam');
}

function route() {
  if (fakeAuth) return renderVoid();
  if (!exams) return show('login');
  // H€xV#le
  const m = location.hash.match(/^#exam\/(\d+)$/);
  m ? renderExam(+m[1]) : renderHome();
}

async function attempt(key) {
  const btn = $('#login-btn');
  const err = $('#login-error');
  const card = $('#login-form');
  /* H€xV#le */
  btn.disabled = true;
  setAuth('checking');
  btn.innerHTML = '<span class="spinner"></span>Listening…';
  err.textContent = '';
  try {
    await login(key);
    $('#key').value = '';
    route();
  } catch (e) {
    // H€xV#le
    exams = null;
    fakeAuth = false;
    setAuth('no');
    try { sessionStorage.removeItem(SESSION_KEY); } catch (x) {}
    err.textContent = (errors[e.message] || 'The door stays shut. Try again.') + attemptsText(e.left);
    if (e.message === 'banned' && window.hxBan) window.hxBan(e.ip);
    show('login');
    card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
  } finally {
    /* H€xV#le */
    btn.disabled = false;
    btn.textContent = 'Enter';
  }
}

// H€xV#le
$('#login-form').addEventListener('submit', e => { e.preventDefault(); const k = $('#key').value.trim(); if (k) attempt(k); });
$('#png-btn').onclick = () => createPng(current);
$('#back').onclick = () => { location.hash = ''; };
document.querySelectorAll('[data-logout]').forEach(b => b.onclick = logout);
window.addEventListener('hashchange', route);
/* H€xV#le */
window.addEventListener('scroll', () => $('#toTop').classList.toggle('visible', scrollY > 600), { passive: true });
$('#toTop').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
/* H€xV#le */
(() => {
  const cv = $('#particles');
  const ctx = cv.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, dpr, parts = [];
  const mouse = { x: -9999, y: -9999 };
  // H€xV#le
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  // H€xV#le
  const make = () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + .4, vx: (Math.random() - .5) * .12, vy: -(Math.random() * .25 + .05), a: Math.random() * .4 + .1, t: Math.random() * Math.PI * 2, red: Math.random() < .55 });
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    /* H€xV#le */
    const count = Math.round(Math.min(90, w * h / 16000));
    while (parts.length < count) parts.push(make());
    parts.length = count;
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 14400 && d2 > 0) { const f = (1 - Math.sqrt(d2) / 120) * .9; p.x += dx / Math.sqrt(d2) * f; p.y += dy / Math.sqrt(d2) * f; }
      /* H€xV#le */
      p.x += p.vx; p.y += p.vy; p.t += .015;
      // H€xV#le
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
      const alpha = p.a * (.6 + .4 * Math.sin(p.t));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.red ? `rgba(255,42,61,${alpha})` : `rgba(255,255,255,${alpha * .6})`;
      ctx.shadowBlur = p.red ? 8 : 0;
      ctx.shadowColor = 'rgba(255,42,61,.8)';
      ctx.fill();
    }
    /* H€xV#le */
    if (!still) requestAnimationFrame(frame);
  }
  addEventListener('resize', resize, { passive: true });
  resize();
  frame();
})();
const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
// H€xV#le
function bounce(node) { node.classList.remove('bounce'); void node.offsetWidth; node.classList.add('bounce'); }
document.addEventListener('animationend', e => { if (e.animationName === 'bounce') e.target.classList.remove('bounce'); });
document.addEventListener('pointerdown', e => {
  const t = e.target.closest('.btn,.card,.answers li,.pair,.logo');
  if (!t || !motion) return;
  bounce(t);
  /* H€xV#le */
  if (t.classList.contains('logo')) return;
  const r = t.getBoundingClientRect();
  const size = Math.max(r.width, r.height) * 2.2;
  const rp = el('span', 'ripple');
  rp.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
  t.append(rp);
  rp.addEventListener('animationend', () => rp.remove());
});
// H€xV#le
if (motion && finePointer) {
  /* H€xV#le */
  document.querySelectorAll('.btn:not(#login-btn)').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
}
function wrapText(ctx, text, maxW) {
  const lines = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/)) {
      const test = line ? line + ' ' + word : word;
      if (line && ctx.measureText(test).width > maxW) { lines.push(line); line = word; } else line = test;
    }
    lines.push(line);
  }
  return lines;
}

function layoutPng(ctx, ex, n, author, W, draw) {
  const pad = 48, inner = W - pad * 2, cardPad = 22, textW = inner - cardPad * 2;
  let y = pad;
  const text = (str, font, color, x, maxW, lh) => {
    ctx.font = font;
    const lines = wrapText(ctx, str, maxW);
    if (draw) { ctx.fillStyle = color; lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh)); }
    y += lines.length * lh;
  };
  const box = (x, top, w, h, r, fill, stroke) => {
    if (!draw) return;
    ctx.beginPath(); ctx.roundRect(x, top, w, h, r);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke();
  };
  ctx.textBaseline = 'top';
  text('Module Exam ' + n, '800 32px Inter,system-ui,sans-serif', '#ff2a3d', pad, inner, 40);
  y += 6;
  text(ex.questions.length + ' questions · correct answers', '500 15px Inter,system-ui,sans-serif', '#8d8d94', pad, inner, 22);
  y += 24;
  for (const q of ex.questions) {
    const top = y;
    const items = q.type === 'matching' ? q.pairs.map(p => p.left + '  →  ' + p.right) : q.answers.filter(a => a.correct).map(a => a.text);
    const measure = () => {
      const save = y; y = 0;
      const prev = draw; draw = false;
      body();
      draw = prev;
      const h = y; y = save; return h;
    };
    const body = () => {
      y += cardPad;
      text('QUESTION ' + q.id, '700 13px ui-monospace,Menlo,monospace', '#ff2a3d', pad + cardPad, textW, 18);
      y += 8;
      text(q.question, '600 17px Inter,system-ui,sans-serif', '#f2f2f3', pad + cardPad, textW, 25);
      y += 12;
      for (const it of items) {
        ctx.font = '600 15px Inter,system-ui,sans-serif';
        const lines = wrapText(ctx, it, textW - 50).length;
        const h = lines * 22 + 22;
        box(pad + cardPad, y, textW, h, 10, 'rgba(255,42,61,.1)', 'rgba(255,42,61,.6)');
        if (draw) {
          ctx.beginPath(); ctx.arc(pad + cardPad + 24, y + 22, 11, 0, Math.PI * 2); ctx.fillStyle = '#ff4757'; ctx.fill();
          ctx.font = '900 12px Inter,system-ui,sans-serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('✓', pad + cardPad + 24, y + 15); ctx.textAlign = 'left';
        }
        const save = y; y += 13;
        text(it, '600 15px Inter,system-ui,sans-serif', '#ff4757', pad + cardPad + 46, textW - 50, 22);
        y = save + h + 8;
      }
      y += cardPad - 8;
    };
    const h = measure();
    box(pad, top, inner, h, 16, '#121214', 'rgba(255,255,255,.08)');
    body();
    y = top + h + 16;
  }
  y += 8;
  text(author, '400 11px Inter,system-ui,sans-serif', '#5c5c63', pad, inner, 16);
  return y + pad - 16;
}

const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
function crc32(bytes) { let c = 0xffffffff; for (const b of bytes) c = crcTable[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }

function pngChunk(type, data) {
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  out.set(new TextEncoder().encode(type), 4);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

function itxt(keyword, value) {
  const enc = new TextEncoder();
  const k = enc.encode(keyword), v = enc.encode(value);
  const data = new Uint8Array(k.length + 5 + v.length);
  data.set(k, 0);
  data.set(v, k.length + 5);
  return pngChunk('iTXt', data);
}

function addPngMeta(buf, meta) {
  const png = new Uint8Array(buf);
  const iend = png.length - 12;
  const chunks = Object.entries(meta).map(([k, v]) => itxt(k, v));
  const out = new Uint8Array(png.length + chunks.reduce((s, c) => s + c.length, 0));
  out.set(png.subarray(0, iend), 0);
  let off = iend;
  for (const c of chunks) { out.set(c, off); off += c.length; }
  out.set(png.subarray(iend), off);
  return out;
}

async function createPng(n) {
  const ex = exams && exams[n - 1];
  if (!ex) return;
  const btn = $('#png-btn');
  btn.disabled = true;
  try {
    const author = names.length ? names[Math.floor(Math.random() * names.length)] : '';
    const W = 1000;
    const cv = document.createElement('canvas');
    const ctx = cv.getContext('2d');
    const H = Math.ceil(layoutPng(ctx, ex, n, author, W, false));
    const scale = Math.min(2, Math.sqrt(16e6 / (W * H)), 32000 / H);
    cv.width = Math.floor(W * scale); cv.height = Math.floor(H * scale);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, W, H);
    layoutPng(ctx, ex, n, author, W, true);
    const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
    const data = addPngMeta(await blob.arrayBuffer(), { Title: 'Module Exam ' + n, Author: author });
    const url = URL.createObjectURL(new Blob([data], { type: 'image/png' }));
    const a = el('a');
    a.href = url; a.download = 'module-exam-' + n + '.png';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } finally {
    btn.disabled = false;
  }
}

const GLYPHS = ['∴', '∵', '†', '‡', '§', '¤', '∅', '◊', '※', 'Ω', '∆', '⊗', '⊕', '≡', '¶', '‰'];
const WHISPERS = ['signal lost', 'do not look back', 'they are listening', 'seal intact', 'no one is here', 'the gate remembers', 'echo', 'null'];
const pick = a => a[Math.floor(Math.random() * a.length)];
const hex = () => '0x' + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
function tickerText() {
  return Array.from({ length: 36 }, () => { const r = Math.random(); return r < .35 ? hex() : r < .55 ? pick(WHISPERS) : pick(GLYPHS) + pick(GLYPHS) + pick(GLYPHS); }).join('  ·  ') + '  ·  ';
}
document.querySelectorAll('.ticker span').forEach(s => { const t = tickerText(); s.textContent = t + t; });
let saved = null;
try { saved = sessionStorage.getItem(SESSION_KEY); } catch (e) {}
// H€xV#le
window.authReady = saved ? attempt(saved) : Promise.resolve();
if (!saved) show('login');
