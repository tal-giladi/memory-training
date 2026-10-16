// Shared playful layer: bubbles, a mascot that reacts to answers, confetti.
// Pages call fun.cheer() on a correct answer and fun.oops() on a wrong one.
window.fun = (() => {
  const ANIMALS = ['🦊', '🐼', '🐨', '🐰', '🐹', '🦉', '🐧', '🐱', '🐶', '🐢'];
  const CHEERS = ['Yay!', 'Brilliant!', 'Nailed it!', 'Memory master!', 'So good!', 'Woohoo!', 'Sharp mind!', 'Keep going!'];
  const OOPS = ['Almost!', "You'll get it next time", 'Shake it off!', 'Practice makes perfect', 'Nearly there!'];
  const IDLE = ['Hi! Ready to train?', 'Pat me 🙂', 'Deep breath… focus!', 'Picture it vividly!', 'Make it silly, make it stick!'];
  const pick = a => a[Math.floor(Math.random() * a.length)];

  const bubbles = document.createElement('div');
  bubbles.className = 'fun-bubbles';
  for (let i = 0; i < 14; i++) {
    const b = document.createElement('span');
    const size = 20 + Math.random() * 70;
    Object.assign(b.style, {
      width: size + 'px', height: size + 'px', left: Math.random() * 100 + 'vw',
      animationDuration: 14 + Math.random() * 18 + 's', animationDelay: -Math.random() * 30 + 's'
    });
    b.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
    bubbles.appendChild(b);
  }

  let animal = pick(ANIMALS);
  try { animal = localStorage.getItem('fun.animal') || animal; } catch {}
  const mascot = document.createElement('div');
  mascot.className = 'mascot'; mascot.textContent = animal; mascot.title = 'Click me (double-click to swap friend)';
  const speech = document.createElement('div');
  speech.className = 'speech';

  document.addEventListener('DOMContentLoaded', () => document.body.append(bubbles, mascot, speech));
  if (document.readyState !== 'loading') document.body.append(bubbles, mascot, speech);

  let speechTimer;
  function say(text, ms = 1800) {
    speech.textContent = text; speech.classList.add('show');
    clearTimeout(speechTimer); speechTimer = setTimeout(() => speech.classList.remove('show'), ms);
  }
  function mood(cls) {
    mascot.classList.remove('happy', 'sad'); void mascot.offsetWidth; mascot.classList.add(cls);
    mascot.addEventListener('animationend', () => mascot.classList.remove(cls), { once: true });
  }
  function confetti(n = 18) {
    const r = mascot.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const c = document.createElement('span');
      c.className = 'confetti'; c.textContent = pick(['✨', '🎉', '⭐', '💖', '🌟', '🎊']);
      c.style.left = r.left + r.width / 2 + 'px'; c.style.top = r.top + 'px';
      c.style.setProperty('--x', (Math.random() * -360 + 40) + 'px');
      c.style.setProperty('--y', (Math.random() * -320 - 40) + 'px');
      c.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 1400);
    }
  }

  mascot.onclick = () => { mood('happy'); say(pick(IDLE)); };
  mascot.ondblclick = () => {
    animal = pick(ANIMALS.filter(a => a !== animal)); mascot.textContent = animal;
    try { localStorage.setItem('fun.animal', animal); } catch {}
    say('New friend!');
  };
  setTimeout(() => say(pick(IDLE), 2500), 800);

  return {
    cheer(big) { mood('happy'); say(pick(CHEERS)); confetti(big ? 30 : 14); },
    oops(el) { mood('sad'); say(pick(OOPS)); if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); } }
  };
})();
