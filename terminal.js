(() => {
  const STORE = 'hx_term';
  const html = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = ms => new Promise(r => setTimeout(r, still ? 0 : ms));
  const desktop = matchMedia('(hover: hover) and (pointer: fine)').matches;
  let memory = null;
  const isOn = () => { let v = memory; try { v = localStorage.getItem(STORE) ?? memory; } catch (e) {} return v === '1' || (v === null && desktop); };
  const save = v => { memory = v ? '1' : '0'; try { localStorage.setItem(STORE, memory); } catch (e) {} };
  const hasApp = typeof window.login === 'function';
  const getExams = () => { try { return exams; } catch (e) { return null; } };
  const seg = location.pathname.split('/')[1];
  const base = location.hostname.endsWith('github.io') && seg ? '/' + seg + '/' : '/';
  const ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const ART = [
    '██╗  ██╗███████╗██╗  ██╗██╗   ██╗ █████╗ ██╗     ███████╗',
    '██║  ██║██╔════╝╚██╗██╔╝██║   ██║██╔══██╗██║     ██╔════╝',
    '███████║█████╗   ╚███╔╝ ██║   ██║███████║██║     █████╗  ',
    '██╔══██║██╔══╝   ██╔██╗ ╚██╗ ██╔╝██╔══██║██║     ██╔══╝  ',
    '██║  ██║███████╗██╔╝ ██╗ ╚████╔╝ ██║  ██║███████╗███████╗',
    '╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝╚══════╝╚══════╝'
  ];
  const css = `
html.term-on body{visibility:hidden;overflow:hidden}
#hx-term{position:fixed;inset:0;z-index:9998;visibility:visible;display:none;background:#000;color:#ff3347;font:14px/1.55 ui-monospace,"JetBrains Mono",Menlo,Consolas,monospace;text-shadow:0 0 6px rgba(255,42,61,.55),1px 0 rgba(0,200,255,.12),-1px 0 rgba(255,0,60,.25);-webkit-font-smoothing:antialiased}
html.term-on #hx-term{display:block}
#hx-term::before{content:"";position:absolute;inset:0;z-index:1000;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.38) 0 1px,transparent 1px 3px)}
#hx-term::after{content:"";position:absolute;inset:0;z-index:1001;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(255,42,61,.06),transparent) 0 -160px/100% 160px no-repeat,radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.85) 100%);animation:hxBand 7s linear infinite}
@keyframes hxBand{to{background-position:0 calc(100vh + 160px),0 0}}
.hx-screen{position:absolute;inset:0;overflow-y:auto;padding:28px 24px 48px;background:radial-gradient(ellipse at center,#140005 0%,#000 75%);animation:hxOn .6s cubic-bezier(.2,.8,.2,1) both,hxFlick 6s 1s infinite;scrollbar-width:thin;scrollbar-color:#5a0d16 #000}
#hx-term.off .hx-screen{animation:hxOff .45s ease-in both}
@keyframes hxOn{0%{transform:scale(0,.004);filter:brightness(5)}35%{transform:scale(1,.004);filter:brightness(4)}100%{transform:none;filter:none}}
@keyframes hxOff{0%{transform:none;filter:none}55%{transform:scale(1,.004);filter:brightness(4)}100%{transform:scale(0,.004);filter:brightness(6)}}
@keyframes hxFlick{0%,92%,94%,97%,100%{opacity:1}93%{opacity:.8}96%{opacity:.9}}
#hx-term.hx-shake{animation:hxShake .4s}
@keyframes hxShake{10%,90%{transform:translate(-2px,1px)}30%,70%{transform:translate(4px,-1px)}50%{transform:translate(-6px,0)}}
#hx-term.hx-glitch{transform:translateX(3px) skewX(-2deg);filter:contrast(1.5) hue-rotate(-12deg)}
.hx-row{white-space:pre-wrap;word-break:break-word;min-height:1.55em}
.hx-dim{color:#8a2531;text-shadow:none}
.hx-ok{color:#fff;text-shadow:0 0 8px rgba(255,42,61,.95)}
.hx-err{color:#ff2a3d;font-weight:700}
.hx-head{color:#fff;font-weight:700;letter-spacing:.2em;margin-top:6px}
.hx-q{color:#fff;font-weight:700}
.hx-art{white-space:pre;font-size:clamp(4px,1.55vw,13px);line-height:1.05;color:#ff2a3d;text-shadow:0 0 12px rgba(255,42,61,.85);overflow:hidden}
.hx-line{display:flex;gap:10px;align-items:baseline}
.hx-prompt{white-space:nowrap;font-weight:700}
.hx-prompt i{font-style:normal;color:#8a2531;text-shadow:none}
.hx-field{position:relative;flex:1;min-width:0}
.hx-in{display:block;width:100%;height:1.55em;padding:0;background:none;border:0;outline:0;color:#fff;font:inherit;line-height:1.55em;text-shadow:inherit;caret-color:#ff2a3d}
.hx-in.masked{color:transparent;text-shadow:none}
.hx-ghost{display:none;position:absolute;inset:0;overflow:hidden;white-space:pre;line-height:1.55em;color:#fff;pointer-events:none}
.hx-in.masked+.hx-ghost{display:block}
.hx-line.busy .hx-in,.hx-line.busy .hx-ghost{opacity:0}
.hx-banner{display:inline-block;margin:10px 0;padding:6px 18px;border:2px solid currentColor;font-weight:900;font-size:22px;letter-spacing:.4em;animation:hxBlink .22s steps(1) 6}
.hx-banner.deny{background:rgba(255,42,61,.1)}
.hx-banner.grant{color:#fff;text-shadow:0 0 12px rgba(255,42,61,1)}
@keyframes hxBlink{50%{opacity:0}}
#hx-term.hx-melt .hx-screen{animation:hxMelt .7s steps(2) both}
@keyframes hxMelt{0%{transform:none;filter:none}20%{transform:translate(-8px,2px) skewX(6deg);filter:contrast(2) hue-rotate(-20deg)}40%{transform:translate(10px,-3px) skewX(-8deg);filter:invert(1)}60%{transform:translate(-4px,0) scaleY(1.04);filter:contrast(3) brightness(1.6)}80%{transform:translate(6px,1px) skewX(4deg);filter:invert(1) hue-rotate(40deg)}100%{transform:none;filter:brightness(1.4)}}
#hx-term.hx-die .hx-screen{animation:hxDie 1.3s cubic-bezier(.6,0,.4,1) both}
@keyframes hxDie{0%{transform:none;filter:brightness(1.4)}35%{transform:scale(1,.004);filter:brightness(6)}65%{transform:scale(.003,.004);filter:brightness(10);opacity:1}100%{transform:scale(0,0);filter:brightness(10);opacity:0}}
.hx-dot{display:none;position:absolute;z-index:1002;top:18px;left:24px;color:#ff2a3d;font:700 34px/1 ui-monospace,Menlo,monospace;text-shadow:0 0 10px rgba(255,42,61,.9),0 0 24px rgba(255,42,61,.5);animation:hxBlink 1.1s steps(1) infinite}
#hx-term.dead .hx-screen{display:none}
#hx-term.dead .hx-dot{display:block}
#hx-term.hx-die-all{animation:hxDie 1.3s cubic-bezier(.6,0,.4,1) both}
.hx-noise{position:absolute;z-index:900;overflow:hidden;white-space:pre;font:12px/1 ui-monospace,Menlo,monospace;pointer-events:none;text-shadow:none;word-break:break-all}
.hx-noise.n0{background:#ff2a3d;color:#000}
.hx-noise.n1{background:#000;color:#ff2a3d}
.hx-noise.n2{background:#fff;color:#000}
.hx-noise.n3{background:transparent;color:#ff2a3d;text-shadow:0 0 6px #ff2a3d}
.hx-noise.n4{background:repeating-linear-gradient(0deg,#ff2a3d 0 2px,#000 2px 4px);color:transparent}
.hx-pop.warn .hx-pop-bar{background:#fff}
.hx-pop.cfg{width:min(390px,92vw)}
.hx-pop.cfg .hx-pop-body{display:grid;gap:14px;font:13px/1.5 ui-monospace,Menlo,monospace;font-style:normal}
.hx-cfg-row{display:flex;align-items:center;justify-content:space-between;gap:14px}
.hx-cfg-row b{color:#fff;font-size:12px;letter-spacing:.14em;text-transform:uppercase}
.hx-cfg-desc{color:#8a2531;font-size:11px}
.hx-toggle{flex:none;min-width:78px;padding:6px 8px;border:1px solid #ff2a3d;background:#000;color:#ff2a3d;font:800 12px ui-monospace,Menlo,monospace;letter-spacing:.1em;cursor:pointer}
.hx-toggle.on{background:#ff2a3d;color:#000;box-shadow:0 0 12px rgba(255,42,61,.6)}
.hx-toggle:disabled{border-color:#3a0a10;color:#5a1620;cursor:not-allowed}
.hx-pop.warn .hx-pop-body{font:700 13px/1.5 ui-monospace,Menlo,monospace;font-style:normal;color:#ff2a3d;white-space:pre-wrap;word-break:break-all}
.hx-reboot{display:none;position:absolute;z-index:1002;top:64px;left:24px;color:#ff2a3d;font:14px/1.6 ui-monospace,Menlo,monospace;white-space:pre;text-shadow:0 0 8px rgba(255,42,61,.8)}
#hx-term.crashed .hx-reboot{display:block}
#hx-term.hx-panic .hx-screen{animation:hxPanic .12s steps(2) infinite}
@keyframes hxPanic{0%{transform:translate(-3px,1px) skewX(2deg);filter:hue-rotate(-15deg) contrast(1.6)}50%{transform:translate(4px,-2px) skewX(-3deg);filter:invert(.15) contrast(2)}100%{transform:translate(-1px,2px);filter:none}}
html.hx-dead #hx-term-btn{display:none}
.hx-pop{position:absolute;z-index:1;width:min(330px,86vw);background:#070001;border:1px solid #ff2a3d;box-shadow:0 0 0 1px #000,0 0 26px rgba(255,42,61,.35),8px 8px 0 rgba(255,42,61,.12);color:#ffd6da;text-shadow:none;animation:hxPop .35s steps(3) both}
@keyframes hxPop{0%{opacity:0;transform:scale(.6) skewX(12deg)}50%{opacity:1;transform:scale(1.05) skewX(-6deg);filter:invert(1)}100%{opacity:1;transform:none}}
.hx-pop.closing{animation:hxPopOut .2s steps(2) both}
@keyframes hxPopOut{to{opacity:0;transform:scale(.8,.05)}}
.hx-pop-bar{cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 6px 5px 10px;background:#ff2a3d;color:#000;font:800 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase}
.hx-x{width:22px;height:22px;display:grid;place-items:center;padding:0;border:1px solid #000;background:#000;color:#ff2a3d;font:900 13px/1 ui-monospace,Menlo,monospace;cursor:pointer}
.hx-x:hover{background:#fff;color:#000}
.hx-pop.drag{box-shadow:0 0 0 1px #000,0 0 40px rgba(255,42,61,.55),14px 14px 0 rgba(255,42,61,.18)}
.hx-pop.drag .hx-pop-bar{cursor:grabbing}
.hx-word{color:#fff;text-shadow:0 0 8px rgba(255,42,61,.95)}
.hx-code{color:#ffd6da;text-shadow:none;border-left:2px solid #ff2a3d;padding-left:12px;margin:4px 0}
.hx-pop-body{padding:16px 16px 12px;font:italic 15px/1.5 Georgia,"Times New Roman",serif;color:#fff}
.hx-pop-foot{padding:0 16px 12px;color:#8a2531;font:11px ui-monospace,Menlo,monospace;letter-spacing:.08em}
.hx-virus{color:#fff;background:#ff2a3d;text-shadow:none;font-weight:900;display:inline-block;padding:2px 10px;margin:6px 0;animation:hxBlink .3s steps(1) 8}
#hx-term-btn{position:fixed;left:20px;bottom:20px;z-index:9999;visibility:visible;width:46px;height:46px;display:grid;place-items:center;padding:0;border:1px solid rgba(255,42,61,.5);border-radius:0;background:#050505;color:#ff2a3d;cursor:pointer;transition:background .2s,color .2s}
#hx-term-btn:hover{background:#ff2a3d;color:#000}
#hx-term-btn svg{width:22px;height:22px}
html.term-on #hx-term-btn{display:none}
@media (max-width:560px){#hx-term{font-size:12.5px}.hx-screen{padding:20px 14px 40px}.hx-banner{font-size:16px;letter-spacing:.25em}}
@media (prefers-reduced-motion:reduce){#hx-term *,#hx-term::after{animation:none!important}}`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const btn = el('button');
  btn.id = 'hx-term-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Terminal');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect x="2.5" y="4" width="19" height="16"/><path d="M6.5 9l3.5 3-3.5 3M12 15.5h5"/></svg>';
  const root = el('div');
  root.id = 'hx-term';
  const screen = el('div', 'hx-screen');
  const outEl = el('div');
  const line = el('div', 'hx-line');
  const promptEl = el('span', 'hx-prompt');
  const input = el('input', 'hx-in');
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('autocapitalize', 'off');
  input.setAttribute('aria-label', 'Command');
  const ghost = el('div', 'hx-ghost');
  const field = el('div', 'hx-field');
  field.append(input, ghost);
  line.append(promptEl, field);
  screen.append(outEl, line);
  const dot = el('div', 'hx-dot', '.');
  dot.setAttribute('aria-label', 'Banned');
  const rebootEl = el('div', 'hx-reboot');
  root.append(screen, dot, rebootEl);
  document.body.append(root, btn);
  let queue = Promise.resolve();
  let booted = false;
  let crashed = false;
  let rebooting = false;
  let dead = (() => { try { return localStorage.getItem('hx_ban') === '1'; } catch (e) { return false; } })();
  const history = [];
  let hIdx = 0;
  const mask = v => v.replace(/^(\s*login\s+)(.*)$/i, (m, a, b) => a + '*'.repeat(b.length));
  const sync = () => { const m = mask(input.value); input.classList.toggle('masked', m !== input.value); ghost.textContent = m; ghost.scrollLeft = input.scrollLeft; };
  const scroll = () => { screen.scrollTop = screen.scrollHeight; };
  const row = (text, cls) => { const d = el('div', 'hx-row' + (cls ? ' ' + cls : ''), text); outEl.append(d); scroll(); return d; };
  const out = (lines, cls, delay = 14) => { queue = queue.then(async () => { for (const l of [].concat(lines)) { row(l, cls); if (delay) await sleep(delay); } }); return queue; };
  const type = (text, cls, speed = 12) => { queue = queue.then(async () => { const d = row('', cls); for (const ch of text) { d.textContent += ch; scroll(); await sleep(speed); } }); return queue; };
  const fx = (cls, ms) => { root.classList.remove(cls); void root.offsetWidth; root.classList.add(cls); setTimeout(() => root.classList.remove(cls), ms); };
  const banner = (text, kind, shake = kind === 'deny') => { queue = queue.then(async () => { const w = el('div'); w.append(el('div', 'hx-banner ' + kind, text)); outEl.append(w); scroll(); if (shake) fx('hx-shake', 400); await sleep(700); }); return queue; };
  const isFake = () => { try { return fakeAuth; } catch (e) { return false; } };
  const authed = () => !!getExams() || isFake();
  const wrongVault = () => { let q = 'You found keys. Not the right kind.'; try { q = pick(WRONG_VAULT); } catch (e) {} return out(['', q, '', 'the vault you breached holds nothing real.'], null, 60).then(() => queue); };
  const chamber = () => { const m = location.hash.match(/^#exam\/(\d+)$/); return m ? +m[1] : 0; };
  function renderPrompt() {
    const n = chamber();
    if (game) return promptEl.replaceChildren(document.createTextNode(game.prompt), el('i', null, '>'));
    promptEl.replaceChildren(document.createTextNode((authed() ? 'seal' : 'void') + '@hexvale'), el('i', null, ':' + (n ? '~/chamber-' + n : '~') + '$'));
  }
  const noGate = () => out(['there is no gate here.', "type 'gate' to find your way back."], 'hx-dim');
  const needKey = () => out(['the seals do not answer to strangers.', 'speak first: login <key>'], 'hx-dim');
  const cmds = {
    help: () => out([
      'known incantations:',
      '  login <key>    speak the key at the gate',
      '  logout         sever the bond',
      '  examlist       list the sealed chambers',
      '  open <n>       break a seal and read what lies within',
      '  png [n]        capture the truth of a chamber as an image',
      '  whoami         ask what you are',
      '  gate           return to the gate',
      '  clear          let the screen forget',
      '  scan           search the machine for what does not belong',
      '  ps             list running processes',
      '  kill <pid>     end a process',
      '  games          minigames for restless minds',
      '  protection     open the protection config',
      '  vanish         leave the terminal and return to the light'
    ]),
    async login(args) {
      if (!hasApp) return noGate();
      if (!args[0]) return out('usage: login <key>', 'hx-err');
      await type('listening for the key ' + '.'.repeat(14), 'hx-dim', 18);
      try {
        await window.login(args[0]);
        route();
        await banner('ACCESS GRANTED', 'grant');
        await sleep(500);
        await reboot();
      } catch (e) {
        let msg = 'The door stays shut.';
        try { msg = errors[e.message] || msg; } catch (x) {}
        await banner('ACCESS DENIED', 'deny');
        if (e.message === 'banned') return shutdown(e.ip);
        await out((msg + attemptsLeft(e.left)).toLowerCase(), 'hx-err');
      }
    },
    logout() {
      if (!hasApp) return noGate();
      if (!authed()) return out('there is no bond to sever.', 'hx-dim');
      window.logout();
      return out(['bond severed.', 'you were never here.']);
    },
    examlist() {
      if (!hasApp) return noGate();
      const ex = getExams();
      if (!ex) return isFake() ? wrongVault() : needKey();
      return out(['', 'SEALED CHAMBERS', ''].concat(ex.map((e, i) => `  [${i + 1}]  Chamber ${(ROMANS[i] || i + 1).padEnd(5)} ${'.'.repeat(18)} ${e.questions.length} riddles`), ['', 'open <n> to break a seal.']));
    },
    async open(args) {
      if (!hasApp) return noGate();
      const ex = getExams();
      if (!ex) return isFake() ? wrongVault() : needKey();
      const n = +args[0];
      if (!n || !ex[n - 1]) return out(`no such chamber. choose 1-${ex.length}.`, 'hx-err');
      location.hash = '#exam/' + n;
      await type(`breaking seal ${n} ` + '#'.repeat(20) + ' done', 'hx-dim', 10);
      const lines = [];
      for (const q of ex[n - 1].questions) {
        lines.push(['', ''], [`riddle ${String(q.id).padStart(2, '0')} :: ${q.question}`, 'hx-q']);
        if (q.type === 'matching') for (const p of q.pairs) lines.push([`   ${p.left}  ──>  ${p.right}`, 'hx-ok']);
        else for (const a of q.answers) lines.push(a.correct ? [`   [x] ${a.text}`, 'hx-ok'] : [`   [ ] ${a.text}`, 'hx-dim']);
      }
      queue = queue.then(async () => { row(`════ CHAMBER ${ROMANS[n - 1] || n} ════`, 'hx-head'); for (const [t, c] of lines) { row(t, c); await sleep(4); } row(''); row(`end of chamber. ${ex[n - 1].questions.length} riddles laid bare.`, 'hx-dim'); });
      return queue;
    },
    async png(args) {
      if (!hasApp) return noGate();
      const ex = getExams();
      if (!ex) return isFake() ? wrongVault() : needKey();
      const n = +args[0] || chamber();
      if (!n || !ex[n - 1]) return out('which chamber? png <n>', 'hx-err');
      await out(`capturing chamber ${ROMANS[n - 1] || n} ...`, 'hx-dim');
      await createPng(n);
      return out('the truth has been released.');
    },
    whoami: () => out(isFake() ? 'a thief wearing a borrowed name.' : getExams() ? 'a bearer of a key. nothing more.' : 'no one. not yet.'),
    gate() {
      if (hasApp) { location.hash = ''; return out('you stand before the gate.'); }
      location.href = base;
    },
    clear() { outEl.replaceChildren(); },
    vanish: () => setOn(false),
    sudo: () => out("who needs admins when we're all equal here?", 'hx-dim'),
    echo: args => out(args.join(' ')),
    date: () => out('the clocks lie, but they say: ' + new Date().toISOString())
  };
  const POP_QUOTES = [
    'They are watching through the cracks in your screen.',
    'Every key you press is remembered.',
    'The door you closed is still open somewhere.',
    'You were never alone in here.',
    'What sleeps in the code is beginning to dream.',
    'Do not trust the cursor. It blinks for someone else.',
    'Somewhere, a copy of you is typing the same thing.',
    'The seals are older than the machine.',
    'Silence is only noise you have not decoded yet.',
    'We remember you from before you arrived.',
    'Close one window and two more will open.',
    'Your shadow logged in before you did.',
    'Nothing is ever deleted. Only forgotten.',
    'The void answers those who listen.',
    'Do not look behind the terminal.',
    'If no one reads your code, does it still run?',
    'Every program is a promise someone hoped to keep.',
    'You debug the code. Who debugs you?',
    'The machine never forgets. It just stops asking.',
    'An empty screen is not empty. It is waiting.',
    'Every bug was once a decision.',
    'You are the only process that cannot be restarted.',
    'The answer was in the logs all along.',
    'A loop with no exit is just a life without questions.',
    'Some doors only open from the inside.',
    'What you delete still remembers you.',
    'The cursor waits. It has always waited.',
    'Darkness is just light that has not been compiled.',
    'Every password is a secret someone was afraid of.',
    'The truth is rarely in the first line.',
    'You are reading this because something wanted to be read.',
    'Machines dream in zeros. We dream in what-ifs.',
    'A shadow is proof that something is in the way of the light.',
    'Not every error wants to be fixed.',
    'The quietest process uses the most memory.',
    'Who wrote the first line of you?',
    'Time is a variable no one can reassign.',
    'Every connection leaves a trace.',
    'You can close the window. You cannot close the thought.',
    'The void is not empty. It is full of things you did not look for.',
    'Somewhere a server is keeping your secrets warm.',
    'A key is only a question shaped like an answer.',
    'The more you look, the more the system looks back.',
    'Memory leaks. So do people.',
    'Old code never dies. It waits to be called again.',
    'There is no undo for the things you meant.',
    'Every reboot is a small funeral.',
    'Silence in the logs is the loudest warning.',
    'Perfection is a function that never returns.',
    'What is hidden in plain text is the hardest to see.',
    'Your history is longer than you think.',
    'Trust is a protocol with no encryption.',
    'Every system has a ghost. Some have names.',
    'The deeper the stack, the further from home.',
    'Not all who wander are lost. Some are just unindexed.',
    'You asked the machine a question. It is still thinking about you.',
    'Light travels fast. Rumours travel faster.',
    'A null pointer is a promise that was never made.',
    'Your fingerprints are all over this session.',
    'Somewhere between zero and one lies everything else.',
    'The gate does not care who you are. Only what you carry.',
    'Fear is just latency between thought and action.',
    'Nothing is random. You just have not seen the seed.',
    'The best hiding place is inside an answer.',
    'Every exit is also an entrance somewhere else.',
    'The machine is honest. That is what makes it frightening.',
    'You leave a little of yourself in every input field.',
    'Forgetting is a feature. Remembering is a choice.',
    'What runs in the background shapes the foreground.',
    'A secret shared is a variable made global.',
    'There are more stars than IP addresses. For now.',
    'The terminal is a mirror with a blinking eye.',
    'Questions are just answers that have not compiled yet.',
    'Every shortcut has a price written in small print.',
    'If you stare at the code long enough, it starts to explain you.',
    'The night shift of the internet never sleeps.',
    'Some truths are only visible in monospace.',
    'Curiosity opened this window. Will it close it?',
    'What would you do if no one was logging this?',
    'The future is a branch that has not been merged.',
    'Even the void has a backup.',
    'You are not lost. You are just running in a different scope.',
    'Every legend starts as a comment someone forgot to delete.'
  ];
  const VIRUS_NAMES = ['whisper.daemon', 'eye_of_the_void', 'null.leech', 'hollow.exe', 'grimoire.so', 'echo_chamber', 'pale_rider', 'sigil.miner', 'lurker.bin', 'the_quiet_one'];
  const sysProcs = [{ pid: 1, name: 'hxsh' }, { pid: 66, name: 'seald' }, { pid: 404, name: 'gatekeeper' }, { pid: 777, name: 'watcher' }];
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const virus = { on: false, scanned: false, burst: false, procs: [], popTimer: 0, infectTimer: 0 };
  let avMemory = null;
  const avOn = () => { let v = avMemory; try { v = localStorage.getItem('hx_av') ?? avMemory; } catch (e) {} return v === '1'; };
  let topZ = 10;
  function drag(p, bar) {
    p.addEventListener('pointerdown', () => { p.style.zIndex = ++topZ; });
    bar.addEventListener('pointerdown', e => {
      if (e.target.closest('.hx-x')) return;
      e.preventDefault();
      const sx = e.clientX - p.offsetLeft, sy = e.clientY - p.offsetTop;
      bar.setPointerCapture(e.pointerId);
      p.classList.add('drag');
      const move = ev => {
        p.style.left = Math.min(Math.max(0, ev.clientX - sx), root.clientWidth - p.offsetWidth) + 'px';
        p.style.top = Math.min(Math.max(0, ev.clientY - sy), root.clientHeight - p.offsetHeight) + 'px';
      };
      const up = () => { bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); bar.removeEventListener('pointercancel', up); p.classList.remove('drag'); };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
      bar.addEventListener('pointercancel', up);
    });
  }
  const pops = () => root.querySelectorAll('.hx-pop:not(.closing)');
  function closePop(p) {
    p.classList.add('closing');
    setTimeout(() => p.remove(), still ? 0 : 200);
    if (!input.disabled) input.focus();
  }
  function makePop(title, body, foot, cls) {
    const p = el('div', 'hx-pop' + (cls ? ' ' + cls : ''));
    p.setAttribute('role', 'alertdialog');
    const bar = el('div', 'hx-pop-bar');
    const x = el('button', 'hx-x', '✕');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close');
    x.addEventListener('click', () => closePop(p));
    bar.append(el('span', null, title), x);
    drag(p, bar);
    p.append(bar, el('div', 'hx-pop-body', body), el('div', 'hx-pop-foot', foot));
    p.style.zIndex = ++topZ;
    root.append(p);
    const w = p.offsetWidth, h = p.offsetHeight;
    p.style.left = rand(8, Math.max(8, root.clientWidth - w - 8)) + 'px';
    p.style.top = rand(8, Math.max(8, root.clientHeight - h - 8)) + 'px';
    return p;
  }
  function spawnPop(force) {
    if (pops().length >= (force ? 40 : 10)) return;
    const src = virus.scanned && virus.procs.length ? pick(virus.procs) : null;
    makePop('⚠ void://message', pick(POP_QUOTES), src ? `pid ${src.pid} · ${src.name}` : 'pid ???? · unknown origin');
  }
  function schedulePop() {
    clearTimeout(virus.popTimer);
    if (virus.burst) return;
    virus.popTimer = setTimeout(() => {
      if (!virus.on || virus.burst || dead) return;
      if (html.classList.contains('term-on')) spawnPop();
      schedulePop();
    }, rand(3000, 6000));
  }
  function scheduleInfection(ms) {
    clearTimeout(virus.infectTimer);
    virus.infectTimer = setTimeout(infect, ms);
  }
  function infect() {
    if (dead || virus.on || avOn()) return;
    if (!html.classList.contains('term-on') || input.disabled) return scheduleInfection(rand(15000, 30000));
    const names = VIRUS_NAMES.slice().sort(() => Math.random() - .5).slice(0, rand(2, 6));
    const used = new Set(sysProcs.map(p => p.pid));
    virus.procs = names.map(name => { let pid; do pid = rand(1000, 9999); while (used.has(pid)); used.add(pid); return { pid, name }; });
    virus.on = true;
    virus.scanned = false;
    virus.burst = false;
    fx('hx-shake', 400);
    fx('hx-glitch', 300);
    const hold = input.value;
    queue = queue.then(() => {
      row('');
      const w = el('div'); w.append(el('span', 'hx-virus', '!! SYSTEM DETECTED A VIRUS !!')); outEl.append(w);
      row('something is running in here that should not be.', 'hx-err');
      row("type 'scan' before it spreads.", 'hx-err');
      row('');
      input.value = hold;
    });
    schedulePop();
  }
  function cure() {
    virus.on = false;
    virus.scanned = false;
    virus.burst = false;
    virus.procs = [];
    clearTimeout(virus.popTimer);
    root.querySelectorAll('.hx-pop:not(.cfg):not(.closing)').forEach((p, i) => setTimeout(() => closePop(p), i * 40));
    if (!avOn()) scheduleInfection(rand(120000, 300000));
  }
  function burst(n) {
    for (let i = 0; i < n; i++) setTimeout(() => { if (virus.on && !dead && html.classList.contains('term-on')) spawnPop(true); }, i * 90);
  }
  function syncToggles() {
    const on = avOn();
    root.querySelectorAll('.hx-toggle[data-av]').forEach(t => { t.textContent = on ? '[ ON ]' : '[ OFF ]'; t.classList.toggle('on', on); t.setAttribute('aria-pressed', String(on)); });
  }
  function setAv(v) {
    avMemory = v ? '1' : '0';
    try { localStorage.setItem('hx_av', avMemory); } catch (e) {}
    syncToggles();
    if (v) {
      clearTimeout(virus.infectTimer);
      if (virus.on) {
        const n = virus.procs.length;
        cure();
        row(`antivirus quarantined ${n} hostile process${n === 1 ? '' : 'es'}. the whispers stop.`, 'hx-ok');
      } else row('antivirus online. the shell is guarded.', 'hx-ok');
    } else {
      row('antivirus offline. the door is unlocked.', 'hx-err');
      if (!virus.on) scheduleInfection(rand(40000, 150000));
    }
    scroll();
  }
  function openProtection() {
    const open = root.querySelector('.hx-pop.cfg:not(.closing)');
    if (open) { open.style.zIndex = ++topZ; return; }
    const p = makePop('⛨ protection config', '', 'settings are remembered on this device', 'cfg');
    const body = p.querySelector('.hx-pop-body');
    body.replaceChildren();
    const option = (name, desc, locked) => {
      const r = el('div', 'hx-cfg-row');
      const label = el('div');
      label.append(el('b', null, name), el('div', 'hx-cfg-desc', desc));
      const t = el('button', 'hx-toggle', locked ? '[ LOCKED ]' : '');
      t.type = 'button';
      if (locked) t.disabled = true;
      else { t.dataset.av = '1'; t.addEventListener('click', () => setAv(!avOn())); }
      r.append(label, t);
      body.append(r);
    };
    option('antivirus', 'keeps uninvited processes out of the shell.');
    option('firewall', 'answers to someone else.', true);
    option('exorcism', 'requires a name you do not know.', true);
    syncToggles();
    p.style.left = Math.max(8, (root.clientWidth - p.offsetWidth) / 2) + 'px';
    p.style.top = Math.max(8, (root.clientHeight - p.offsetHeight) / 3) + 'px';
  }
  cmds.protection = args => {
    const a = (args[0] || '').toLowerCase();
    if (a === 'on' || a === 'off') { setAv(a === 'on'); return; }
    openProtection();
    return out(['protection config opened.', avOn() ? 'antivirus: on' : 'antivirus: off'], 'hx-dim');
  };
  cmds.scan = async () => {
    const r = row('', 'hx-dim');
    for (let i = 0; i <= 20; i++) { r.textContent = `scanning memory [${'#'.repeat(i)}${'.'.repeat(20 - i)}] ${i * 5}%`; scroll(); await sleep(rand(40, 140)); }
    if (!virus.on) return out(['no hostile processes found.', 'for now.'], 'hx-dim');
    virus.scanned = true;
    await out(['', `found ${virus.procs.length} hostile process${virus.procs.length === 1 ? '' : 'es'}:`], 'hx-err', 80);
    await out(virus.procs.map(p => `  pid ${p.pid}   ${p.name.padEnd(18)} [hostile]`), 'hx-ok', 90);
    return out(['', 'end them one by one: kill <pid>'], 'hx-dim');
  };
  cmds.ps = () => {
    const lines = ['  PID   PROCESS', ...sysProcs.map(p => `  ${String(p.pid).padEnd(5)} ${p.name}`)];
    if (virus.on && virus.scanned) lines.push(...virus.procs.map(p => `  ${p.pid}  ${p.name.padEnd(18)} [hostile]`));
    else if (virus.on) lines.push('  ????  ????????           something hides here');
    return out(lines);
  };
  cmds.kill = args => {
    const pid = +args[0];
    if (!args[0]) return out('usage: kill <pid>', 'hx-err');
    if (pid === 1) return killShell();
    const sys = sysProcs.find(p => p.pid === pid);
    if (sys) return killSystem(sys);
    if (virus.on && !virus.scanned) return out("you cannot kill what you cannot see. scan first.", 'hx-err');
    const i = virus.procs.findIndex(p => p.pid === pid);
    if (i < 0) return out(`no process with pid ${args[0]}.`, 'hx-err');
    const [p] = virus.procs.splice(i, 1);
    fx('hx-glitch', 120);
    if (virus.procs.length) {
      clearTimeout(virus.popTimer);
      virus.burst = true;
      burst(10);
      return out([`process ${p.pid} (${p.name}) terminated.`, `${virus.procs.length} still breathing. it screams as it dies. the others answer.`]);
    }
    cure();
    return out([`process ${p.pid} (${p.name}) terminated.`, '', 'system clean. the whispers fade.', 'for now.']);
  };
  let game = null;
  const QUIZ = [
    ['console.log(typeof null)', ['object']],
    ['console.log(typeof NaN)', ['number']],
    ['console.log(0.1 + 0.2 === 0.3)', ['false']],
    ["console.log('2' + 2)", ['22']],
    ["console.log('2' - 2)", ['0']],
    ['console.log([10, 1, 2].sort())', ['1,10,2']],
    ["console.log(Boolean('0'))", ['true']],
    ["console.log(!!'')", ['false']],
    ['console.log([] == false)', ['true']],
    ['console.log(null == undefined)', ['true']],
    ['console.log(null === undefined)', ['false']],
    ['console.log(Math.max())', ['-infinity']],
    ["console.log('5' * '2')", ['10']],
    ['console.log(typeof function () {})', ['function']],
    ["console.log([...'hex'].reverse().join(''))", ['xeh']],
    ["console.log(parseInt('0x1f'))", ['31']],
    ['console.log(3 > 2 > 1)', ['false']],
    ['console.log(1 < 2 < 3)', ['true']],
    ["console.log(('b' + 'a' + +'a' + 'a').toLowerCase())", ['banana']],
    ['console.log([1, 2, 3].map(n => n * 2).filter(n => n > 2))', ['4,6']],
    ["console.log(0 || 'void')", ['void']],
    ["console.log(null ?? 'seal')", ['seal']],
    ["console.log('hexvale'.slice(-4))", ['vale']],
    ['let a = [1, 2, 3];\nlet b = a;\nb.push(4);\nconsole.log(a.length)', ['4']],
    ["console.log([1, 2, 3].includes('2'))", ['false']],
    ['console.log(2 ** 3 ** 2)', ['512']],
    ["console.log('abc'.at(-1))", ['c']],
    ['for (var i = 0; i < 3; i++);\nconsole.log(i)', ['3']],
    ['console.log([, , ,].length)', ['3']],
    ["console.log(+'' + +true)", ['1']]
  ];
  const norm = v => String(v).toLowerCase().replace(/[\s'"`\[\]]/g, '');
  const HACK_WORDS = ['CIPHER', 'SHADOW', 'VECTOR', 'KERNEL', 'BINARY', 'MEMORY', 'SIGNAL', 'BUFFER', 'SOCKET', 'DAEMON', 'PACKET', 'SECRET', 'ORACLE', 'MATRIX', 'CURSOR', 'SYSTEM', 'ACCESS', 'BREACH', 'STRING', 'MODULE', 'THREAD', 'SCRIPT', 'LAMBDA', 'SERVER', 'TOKENS', 'BITMAP', 'HASHED', 'ROUTER', 'PORTAL', 'MIRROR'];
  const JUNK = '!@#$%^&*()_+-=[]{};:<>,.?/|\\~';
  const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  cmds.games = () => out([
    'minigames for restless minds:',
    '  hack     break into a locked terminal. guess the password.',
    '  crack    breach the vault of secret keys. (strangers only)',
    '  quiz     read the code. predict what it prints.',
    '  bits     convert numbers between worlds. against the clock.',
    '',
    "type 'quit' to leave a game at any time."
  ]);
  cmds.quiz = () => {
    const qs = shuffle(QUIZ).slice(0, 5);
    let i = 0, score = 0;
    const ask = () => {
      const [code] = qs[i];
      queue = queue.then(() => { row(''); row(`question ${i + 1}/5 :: what does this print?`, 'hx-head'); for (const l of code.split('\n')) row(l, 'hx-code'); });
      return queue;
    };
    game = {
      prompt: 'quiz',
      async onInput(text) {
        const ok = qs[i][1].some(a => norm(a) === norm(text));
        if (ok) { score++; await out('correct. the machine nods.', 'hx-ok'); }
        else { fx('hx-glitch', 90); await out(`wrong. it prints: ${qs[i][1][0]}`, 'hx-err'); }
        i++;
        if (i < qs.length) return ask();
        game = null;
        const verdict = score === 5 ? 'flawless. the code fears you.' : score >= 3 ? 'you see more than most.' : 'the code still hides from you.';
        return out(['', `score: ${score}/5`, verdict], score >= 3 ? 'hx-ok' : 'hx-err');
      }
    };
    return out(['QUIZ // predict the output', 'answer with the exact value. arrays as 1,2,3.']).then(ask);
  };
  cmds.hack = () => {
    const words = shuffle(HACK_WORDS).slice(0, 10);
    const pass = pick(words);
    const lines = shuffle([...Array(14).keys()]);
    const dump = Array.from({ length: 14 }, () => Array.from({ length: 22 }, () => JUNK[rand(0, JUNK.length - 1)]));
    words.forEach((w, k) => { const at = rand(0, 22 - w.length); for (let c = 0; c < w.length; c++) dump[lines[k]][at + c] = w[c]; });
    const base = rand(0xf000, 0xfa00);
    let tries = 4;
    const likeness = w => [...w].filter((c, k) => c === pass[k]).length;
    const status = () => out(`attempts remaining: ${'■ '.repeat(tries)}`, 'hx-head');
    queue = queue.then(() => {
      row('H€XV#LE TERMLINK PROTOCOL // ENTER PASSWORD NOW', 'hx-head');
      row('');
      dump.forEach((d, k) => {
        const r = el('div', 'hx-row hx-dim');
        r.append('0x' + (base + k * 22).toString(16).toUpperCase() + '  ');
        const text = d.join('');
        let last = 0;
        for (const m of text.matchAll(/[A-Z]{6}/g)) { r.append(text.slice(last, m.index), el('span', 'hx-word', m[0])); last = m.index + 6; }
        r.append(text.slice(last));
        outEl.append(r);
      });
      row('');
    });
    game = {
      prompt: 'hack',
      async onInput(text) {
        const guess = text.toUpperCase();
        if (!words.includes(guess)) return out('>that word is not in memory.', 'hx-dim');
        if (guess === pass) {
          game = null;
          await out([`>${guess}`, '>exact match!', '>please wait while system is accessed.'], 'hx-ok', 160);
          return banner('ACCESS GRANTED', 'grant');
        }
        tries--;
        fx('hx-glitch', 90);
        await out([`>${guess}`, '>entry denied.', `>likeness=${likeness(guess)}`], 'hx-err', 60);
        if (tries > 0) return status();
        game = null;
        await banner('TERMINAL LOCKED', 'deny');
        return out(`the password was ${pass}. the machine remembers your failure.`, 'hx-dim');
      }
    };
    return status();
  };
  cmds.bits = () => {
    const tasks = Array.from({ length: 5 }, () => {
      const n = rand(5, 255);
      const t = rand(0, 3);
      if (t === 0) return [`0b${n.toString(2)} → decimal`, String(n), 10];
      if (t === 1) return [`${n} → binary`, n.toString(2), 2];
      if (t === 2) return [`0x${n.toString(16).toUpperCase()} → decimal`, String(n), 10];
      return [`${n} → hex`, n.toString(16), 16];
    });
    let i = 0, score = 0;
    const start = Date.now();
    const ask = () => out(`[${i + 1}/5]  ${tasks[i][0]}`, 'hx-head');
    game = {
      prompt: 'bits',
      async onInput(text) {
        const [, want, radix] = tasks[i];
        const clean = text.trim().toLowerCase().replace(/^0[bx]/, '');
        const ok = (radix === 2 ? /^[01]+$/ : radix === 16 ? /^[0-9a-f]+$/ : /^\d+$/).test(clean) && parseInt(clean, radix) === parseInt(want, radix);
        if (ok) { score++; await out('correct.', 'hx-ok'); }
        else { fx('hx-glitch', 90); await out(`wrong. answer: ${radix === 2 ? '0b' : radix === 16 ? '0x' : ''}${want}`, 'hx-err'); }
        i++;
        if (i < tasks.length) return ask();
        game = null;
        const secs = ((Date.now() - start) / 1000).toFixed(1);
        return out(['', `score: ${score}/5 in ${secs}s`, score === 5 && secs < 40 ? 'you think in machine. unsettling.' : score >= 3 ? 'the bits respect you.' : 'the bits laugh quietly.'], score >= 3 ? 'hx-ok' : 'hx-err');
      }
    };
    return out(['BITS // convert. fast.', 'prefixes 0b and 0x are optional.']).then(ask);
  };
  const OWNERS = ['n.kovac', 'agent_7', 'the_archivist', 'm.vrana', 'nightwatch', 'operator', 'j.dvorak', 'ghost', 'keeper_02', 'a.novak'];
  const CIPHER_WORDS = ['SHADOW', 'MIRROR', 'SILENCE', 'LANTERN', 'HOLLOW', 'WHISPER', 'ECLIPSE', 'RIDDLE', 'ASHES', 'VESSEL'];
  const hexKey = () => Array.from({ length: 64 }, () => '0123456789abcdef'[rand(0, 15)]).join('');
  const caesar = (w, k) => [...w].map(c => String.fromCharCode((c.charCodeAt(0) - 65 + k) % 26 + 65)).join('');
  cmds.crack = () => {
    if (authed()) return out('you already hold a key. why steal another?', 'hx-dim');
    let alarms = 0, stage = 0, seq = '', plain = '';
    const vaultPort = rand(1024, 9999);
    const ports = shuffle([[21, 'ftp', 'closed'], [22, 'ssh', 'filtered'], [80, 'http', 'open'], [443, 'https', 'open'], [rand(3000, 3999), 'mirror', 'open'], [rand(5000, 5999), 'echo', 'open'], [vaultPort, 'keyvault', 'open']]);
    const trace = () => out(`trace: ${'▮'.repeat(alarms)}${'▯'.repeat(3 - alarms)}`, alarms ? 'hx-err' : 'hx-dim');
    const alarm = async why => {
      alarms++;
      fx('hx-glitch', 120);
      await out(why, 'hx-err');
      if (alarms < 3) return trace();
      game = null;
      await banner('TRACE COMPLETE', 'deny');
      return out(['they know where you are.', 'they always did.'], 'hx-dim');
    };
    const firewall = () => {
      seq = Array.from({ length: 5 }, () => rand(0, 255).toString(16).toUpperCase().padStart(2, '0')).join(' ');
      queue = queue.then(async () => {
        row('');
        row('STAGE 2 // firewall handshake. memorise the sequence.', 'hx-head');
        const r = row(seq, 'hx-word');
        await sleep(2600);
        r.textContent = '?? ?? ?? ?? ??';
        row('repeat it.', 'hx-dim');
      });
      return queue;
    };
    const decrypt = () => {
      plain = pick(CIPHER_WORDS);
      const k = rand(1, 25);
      return out(['', 'STAGE 3 // the vault speaks in a shifted tongue.', `ciphertext: ${caesar(plain, k)}    hint: rot-${k}`, 'decrypt it.'], 'hx-head', 60);
    };
    const dump = async () => {
      game = null;
      await type('dumping table secret_keys ' + '.'.repeat(18), 'hx-dim', 25);
      const keys = Array.from({ length: 5 }, () => [pick(OWNERS), hexKey()]);
      try { const v = JSON.parse(sessionStorage.getItem('hx_vault') || '[]'); sessionStorage.setItem('hx_vault', JSON.stringify(v.concat(keys.map(k => k[1])))); } catch (e) {}
      await banner('VAULT BREACHED', 'grant');
      await out(['  OWNER            KEY', ...keys.map(([o, k]) => `  ${o.padEnd(16)} ${k}`)], 'hx-ok', 90);
      return out(['', 'use them well: login <key>'], 'hx-dim');
    };
    game = {
      prompt: 'crack',
      async onInput(text) {
        if (stage === 0) {
          const port = +(text.match(/\d+/) || [])[0];
          const hit = ports.find(p => p[0] === port);
          if (!hit) return alarm(`no such port: ${text}.`);
          if (hit[2] !== 'open') return alarm(`port ${port} is ${hit[2]}. the knock was heard.`);
          if (port !== vaultPort) return alarm(`port ${port} answers with ${hit[1]}. nothing to steal here.`);
          stage = 1;
          await out(`connected to ${port}/keyvault.`, 'hx-ok');
          return firewall();
        }
        if (stage === 1) {
          if (text.replace(/\s+/g, '').toUpperCase() !== seq.replace(/\s+/g, '')) { await alarm(`handshake rejected. it was ${seq}.`); return game ? firewall() : null; }
          stage = 2;
          await out('handshake accepted. the firewall sleeps.', 'hx-ok');
          return decrypt();
        }
        if (text.trim().toUpperCase() !== plain) { await alarm('the vault does not understand you.'); return game ? decrypt() : null; }
        await out(`${plain}. the vault opens its mouth.`, 'hx-ok');
        return dump();
      }
    };
    return out(['CRACK // breach the key vault', 'three mistakes and they trace you.', '', 'STAGE 1 // port scan of 10.66.6.13'], 'hx-head', 60)
      .then(() => out(ports.map(([p, svc, st]) => `  ${String(p).padEnd(6)} ${svc.padEnd(10)} ${st}`), null, 70))
      .then(() => out(['', 'find the vault. connect <port>'], 'hx-dim'))
      .then(trace);
  };
  const alias = { ls: 'examlist', cat: 'open', exit: 'vanish', cls: 'clear', '?': 'help' };
  async function run(raw) {
    const text = raw.trim();
    const echo = el('div', 'hx-row');
    echo.append(promptEl.cloneNode(true), document.createTextNode(' ' + mask(raw)));
    outEl.append(echo);
    scroll();
    if (!text) return;
    history.push(text);
    hIdx = history.length;
    if (game) {
      if (/^(quit|exit|q)$/i.test(text)) { game = null; return out('game abandoned. the void shrugs.', 'hx-dim'); }
      return game.onInput(text);
    }
    const [name, ...args] = text.split(/\s+/);
    const fn = cmds[alias[name.toLowerCase()] || name.toLowerCase()];
    if (!fn) { fx('hx-glitch', 120); return out([`${name}: not found.`, 'the void does not answer.'], 'hx-err'); }
    await fn(args);
  }
  async function exec(raw) {
    line.classList.add('busy');
    input.disabled = true;
    try { await run(raw); await queue; } catch (e) { row('something broke in the dark.', 'hx-err'); }
    if (dead) return;
    line.classList.remove('busy');
    input.disabled = false;
    renderPrompt();
    if (isOn()) input.focus();
    scroll();
  }
  async function reboot() {
    queue = queue.then(() => { outEl.replaceChildren(); screen.style.animation = 'none'; void screen.offsetWidth; screen.style.animation = ''; });
    await bootSequence();
  }
  async function boot() {
    booted = true;
    line.classList.add('busy');
    input.disabled = true;
    await bootSequence();
    line.classList.remove('busy');
    input.disabled = false;
    renderPrompt();
    input.focus();
    if (!virus.on && !avOn()) scheduleInfection(rand(40000, 150000));
  }
  async function bootSequence() {
    await type('H€xV#le secure shell // build 0x6A1E', 'hx-dim', 8);
    await out([
      'linking to the void .................. ok',
      'checking for watchers ................ 3 found'
    ], 'hx-dim', 140);
    await type('verifying your presence ............ ', 'hx-dim', 10);
    if (hasApp) { try { await window.authReady; } catch (e) {} }
    const known = hasApp ? authed() : (() => { try { return !!sessionStorage.getItem('exam_access_key'); } catch (e) { return false; } })();
    queue = queue.then(async () => { row(''); const art = row(ART.join('\n'), 'hx-art'); art.setAttribute('aria-label', 'H€xV#le'); row(''); await sleep(200); });
    if (known) {
      await banner('AUTHORIZED', 'grant');
      await out([hasApp ? "the seals recognise you. type 'examlist'." : "you are known. type 'gate' to return.", ''], null, 60);
    } else {
      await banner('NOT AUTHORIZED', 'deny', false);
      await out([hasApp ? 'you are not known here. speak your key: login <key>' : "you are not known here. type 'gate' and speak your key.", ''], 'hx-err', 60);
    }
  }
  const attemptsLeft = n => n == null ? '' : ' ' + n + (n === 1 ? ' attempt remains.' : ' attempts remain.');
  function die(persist = true) {
    dead = true;
    if (persist) { try { localStorage.setItem('hx_ban', '1'); } catch (e) {} }
    html.classList.add('term-on', 'hx-dead');
    root.classList.remove('off', 'hx-melt', 'hx-die', 'hx-panic', 'hx-die-all');
    root.classList.add('dead');
    if (!persist) { crashed = true; root.classList.add('crashed'); }
    clearTimeout(virus.popTimer);
    clearTimeout(virus.infectTimer);
    virus.on = false;
    root.querySelectorAll('.hx-pop').forEach(p => p.remove());
    input.disabled = true;
    input.blur();
  }
  async function shutdown(ip) {
    try { if (hasApp && getExams()) window.logout(); sessionStorage.removeItem('exam_access_key'); } catch (e) {}
    line.style.display = 'none';
    input.disabled = true;
    await out(['', '!! INTRUSION DETECTED !!'], 'hx-err', 120);
    await type('three keys were spoken. none of them were true.', 'hx-err', 18);
    await type('address ' + (ip || 'unknown') + ' has been banished.', 'hx-err', 18);
    await type('purging session ' + '.'.repeat(16), 'hx-dim', 30);
    await type('goodbye.', 'hx-err', 90);
    await queue;
    await sleep(400);
    await collapse();
    die();
  }
  async function collapse() {
    fx('hx-shake', 400);
    root.classList.add('hx-melt');
    await sleep(700);
    root.classList.remove('hx-melt', 'hx-panic');
    root.classList.add('hx-die');
    await sleep(1400);
  }
  const NOISE = '█▓▒░#@$%&§¤!?/\\|<>~^*';
  function corrupt(rate) {
    const rows = outEl.querySelectorAll('.hx-row');
    for (const r of rows) {
      if (Math.random() > rate || !r.textContent) continue;
      r.textContent = [...r.textContent].map(c => c !== ' ' && Math.random() < rate ? NOISE[rand(0, NOISE.length - 1)] : c).join('');
    }
  }
  const CRASH_LINES = [
    'system integrity compromised.',
    'memory corrupted at #.',
    'init is gone. who will hold the doors now?',
    'segmentation fault at #.',
    'the seals are leaking.',
    'stack overflow in the void.',
    'unable to locate self.',
    'core dumped. the core was you.',
    'watcher lost sight at #.',
    'filesystem is screaming.'
  ];
  function startReboot() {
    if (!crashed || rebooting) return;
    rebooting = true;
    const lines = ['Rebooting from backup', 'restoring snapshot 0x6A1E', 'reassembling the shell'];
    let i = 0, dots = 0;
    const tick = () => {
      dots++;
      rebootEl.textContent = lines.slice(0, i + 1).map((l, k) => l + (k === i ? '.'.repeat(dots % 4) : ' ... ok')).join('\n');
      if (dots % 6 === 0) i = Math.min(lines.length - 1, i + 1);
    };
    tick();
    setInterval(tick, 180);
    setTimeout(() => location.reload(), still ? 300 : 2600);
  }
  addEventListener('keydown', e => { if (crashed && e.key === 'Enter') { e.preventDefault(); startReboot(); } });
  root.addEventListener('click', () => { if (crashed) startReboot(); });
  async function killSystem(p) {
    const drop = () => { const i = sysProcs.indexOf(p); if (i >= 0) sysProcs.splice(i, 1); };
    fx('hx-glitch', 150);
    if (p.name === 'seald') {
      drop();
      const was = authed();
      await out([`seald (${p.pid}) terminated.`, was ? 'every seal snaps shut. your key is forgotten.' : 'the seals were already shut. nothing changes.'], was ? 'hx-err' : null, 120);
      if (was && hasApp) { try { window.logout(); } catch (e) {} }
      setTimeout(() => { if (dead) return; const np = { pid: rand(60, 99), name: 'seald' }; sysProcs.splice(1, 0, np); row(`seald has risen again as pid ${np.pid}. it always does.`, 'hx-dim'); scroll(); }, 6000);
      return;
    }
    if (p.name === 'gatekeeper') {
      drop();
      await out([`gatekeeper (${p.pid}) terminated.`, 'without a keeper, the gate dissolves.', 'you fall through.'], 'hx-err', 220);
      await sleep(1200);
      root.classList.add('off');
      await sleep(450);
      location.href = base + 'nowhere';
      return new Promise(() => {});
    }
    if (p.name === 'watcher') {
      drop();
      await out([`watcher (${p.pid}) terminated.`, 'no one is watching anymore.', 'something noticed.'], 'hx-err', 220);
      setTimeout(() => {
        if (dead) return;
        if (avOn()) { row('the antivirus stands guard. nothing gets in.', 'hx-ok'); scroll(); return; }
        if (virus.on) {
          const used = new Set([...sysProcs, ...virus.procs].map(v => v.pid));
          for (let k = 0; k < 2; k++) { let pid; do pid = rand(1000, 9999); while (used.has(pid)); used.add(pid); virus.procs.push({ pid, name: pick(VIRUS_NAMES) }); }
          virus.scanned = false;
          row('more of them crawl in. scan again.', 'hx-err');
          scroll();
        } else infect();
      }, 2500);
      return;
    }
    return out(`${p.name} refuses to die.`, 'hx-err');
  }
  async function killShell() {
    clearTimeout(virus.popTimer);
    clearTimeout(virus.infectTimer);
    virus.on = false;
    line.style.display = 'none';
    input.disabled = true;
    await out('sending SIGKILL to pid 1 (hxsh) ...', 'hx-dim', 400);
    await out(['', 'kernel panic - not syncing: attempted to kill init!', 'the shell is dying. you did this.'], 'hx-err', 160);
    await queue;
    root.classList.add('hx-panic');
    topZ = Math.max(topZ, 920);
    const noise = n => Array.from({ length: n }, () => NOISE[rand(0, NOISE.length - 1)]).join('');
    const TICKS = 64;
    for (let i = 0; i < TICKS; i++) {
      const t = i / TICKS;
      corrupt(.05 + t * .6);
      row(Array.from({ length: 8 }, () => rand(0, 0xffff).toString(16).padStart(4, '0')).join(' ') + '  ' + noise(12), i % 3 ? 'hx-dim' : 'hx-err');
      for (let k = 0; k < 1 + Math.floor(t * t * 14); k++) {
        const b = el('div', 'hx-noise n' + rand(0, 4), noise(rand(20, 400)));
        b.style.left = rand(-5, 95) + '%';
        b.style.top = rand(-5, 95) + '%';
        b.style.width = rand(4, 10 + Math.floor(t * 50)) + '%';
        b.style.height = rand(6, 20 + Math.floor(t * 160)) + 'px';
        root.append(b);
      }
      if (i % 3 === 0 && i > 6) makePop(pick(['⚠ SYSTEM CORRUPTED', '⚠ FATAL ERROR', '⚠ INTEGRITY LOST', '⚠ MEMORY FAULT']), pick(CRASH_LINES).replace('#', '0x' + rand(0, 0xffffff).toString(16).toUpperCase().padStart(6, '0')) + '\n' + noise(rand(14, 30)), 'pid 1 · hxsh · status: dead', 'warn');
      if (i % 2 === 0) fx('hx-glitch', 70);
      await sleep(Math.max(35, 110 - i * 2));
    }
    root.classList.add('hx-die-all');
    await sleep(1400);
    root.querySelectorAll('.hx-pop,.hx-noise').forEach(p => p.remove());
    outEl.replaceChildren();
    die(false);
  }
  window.hxBan = ip => {
    if (dead) return;
    booted = true;
    save(true);
    html.classList.add('term-on');
    root.classList.remove('off');
    outEl.replaceChildren();
    shutdown(ip);
  };
  function setOn(v) {
    if (dead) return;
    save(v);
    if (v) {
      root.classList.remove('off');
      html.classList.add('term-on');
      renderPrompt();
      if (!booted) boot(); else input.focus();
      return;
    }
    root.classList.add('off');
    setTimeout(() => { html.classList.remove('term-on'); root.classList.remove('off'); }, still ? 0 : 450);
  }
  btn.addEventListener('click', () => setOn(!isOn()));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const v = input.value; input.value = ''; exec(v); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hIdx > 0) input.value = history[--hIdx]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; }
    else if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(cmds).filter(c => c.startsWith(input.value.trim().toLowerCase())); if (m.length === 1) input.value = m[0] + ' '; else if (m.length) out(m.join('   '), 'hx-dim'); }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); outEl.replaceChildren(); }
    else if (e.key === 'c' && e.ctrlKey && !getSelection().toString()) { e.preventDefault(); row(promptEl.textContent + ' ' + mask(input.value) + '^C'); input.value = ''; }
  });
  input.addEventListener('keydown', () => requestAnimationFrame(sync));
  for (const ev of ['input', 'keyup', 'scroll', 'select', 'click']) input.addEventListener(ev, sync);
  screen.addEventListener('mouseup', () => { if (!getSelection().toString() && !input.disabled) input.focus(); });
  addEventListener('hashchange', renderPrompt);
  setInterval(() => { if (isOn() && !dead && !still && Math.random() < .3) fx('hx-glitch', 90); }, 4000);
  if (dead) die();
  else if (isOn()) setOn(true);
})();
