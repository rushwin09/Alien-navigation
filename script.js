/* ============================================
   ALIEN EARTH GUIDE — INTERACTIVITY ENGINE
   Hyperstudio-inspired dot-matrix aesthetic
   ============================================ */

// ---- Dot-Matrix Particles (Hyperstudio globe-style) ----
(function initDotMatrix() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let dots = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createDots();
  }

  function createDots() {
    dots = [];
    const spacing = 28;
    const cols = Math.ceil(canvas.width / spacing);
    const rows = Math.ceil(canvas.height / spacing);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing + spacing / 2;
        const y = j * spacing + spacing / 2;

        // Create Earth-like sphere shape in center
        const cx = canvas.width * 0.65;
        const cy = canvas.height * 0.5;
        const radius = Math.min(canvas.width, canvas.height) * 0.35;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const inSphere = dist < radius;

        // Continental shape hints using noise-like distribution
        const angle = Math.atan2(y - cy, x - cx);
        const normalDist = dist / radius;

        let baseOpacity = 0;
        let baseSize = 1.2;

        if (inSphere) {
          // Sphere surface with varying opacity for continent effect
          const edgeFade = 1 - Math.pow(normalDist, 2);
          const noise = Math.sin(x * 0.02 + y * 0.015) * Math.cos(y * 0.025 - x * 0.01);
          const continentMask = noise > -0.2 ? 1 : 0.3;

          baseOpacity = edgeFade * continentMask * 0.7;
          baseSize = 1.5 + edgeFade * 0.8;
        } else {
          // Scattered dots outside the sphere
          if (Math.random() > 0.85) {
            baseOpacity = Math.random() * 0.12;
            baseSize = 1;
          }
        }

        if (baseOpacity > 0.01) {
          dots.push({
            x, y,
            baseX: x, baseY: y,
            opacity: baseOpacity,
            baseOpacity: baseOpacity,
            size: baseSize,
            baseSize: baseSize,
            inSphere
          });
        }
      }
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  resize();
  window.addEventListener('resize', resize);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const dot of dots) {
      const dx = mouse.x - dot.x;
      const dy = mouse.y - dot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 120;

      if (dist < maxDist) {
        const force = (1 - dist / maxDist);
        dot.opacity = dot.baseOpacity + force * 0.5;
        dot.size = dot.baseSize + force * 1.5;
      } else {
        dot.opacity += (dot.baseOpacity - dot.opacity) * 0.08;
        dot.size += (dot.baseSize - dot.size) * 0.08;
      }

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();


// ---- Starfield in Hero ----
(function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    const hero = canvas.closest('.hero');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.2 + 0.3;
      this.twinkleSpeed = Math.random() * 0.015 + 0.003;
      this.brightness = Math.random();
      this.maxBrightness = Math.random() * 0.5 + 0.2;
      this.increasing = true;
    }
    update() {
      if (this.increasing) {
        this.brightness += this.twinkleSpeed;
        if (this.brightness >= this.maxBrightness) this.increasing = false;
      } else {
        this.brightness -= this.twinkleSpeed;
        if (this.brightness <= 0.05) this.increasing = true;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 100; i++) {
    stars.push(new Star());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.update();
      s.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
})();


// ---- Navbar Scroll Effect ----
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link tracking
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
})();


// ---- Mobile Menu ----
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
})();


// ---- Scroll Reveal ----
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
})();


// ---- Translator Logic ----
(function initTranslator() {
  const input = document.getElementById('translator-input');
  const output = document.getElementById('output-text');
  const translateBtn = document.getElementById('translate-btn');
  const phraseChips = document.querySelectorAll('.phrase-chip');
  const alienLang = document.getElementById('alien-lang');

  const alienAlphabets = {
    zorblax: {
      map: {
        a: 'ξ', b: 'β', c: 'ζ', d: 'δ', e: 'ε', f: 'φ', g: 'γ', h: 'η', i: 'ι', j: 'ϳ', k: 'κ', l: 'λ', m: 'μ',
        n: 'ν', o: 'θ', p: 'π', q: 'ψ', r: 'ρ', s: 'σ', t: 'τ', u: 'υ', v: 'ω', w: 'ϡ', x: 'χ', y: 'ϝ', z: 'ζ',
        ' ': ' ', '.': '•', ',': '⸴', '?': '⁇', '!': '⁈', "'": "'"
      },
      name: 'Zorblaxian'
    },
    xenith: {
      map: {
        a: 'ᗩ', b: 'ᗷ', c: 'ᑕ', d: 'ᗪ', e: 'ᗴ', f: 'ᖴ', g: 'Ǥ', h: 'ᕼ', i: 'Ꭵ', j: 'ᒍ', k: 'Ƙ', l: 'ᒪ', m: 'ᗰ',
        n: 'ᑎ', o: 'ᗝ', p: 'ᑭ', q: 'ᑫ', r: 'ᖇ', s: 'Ꮥ', t: '꓄', u: 'ᑌ', v: 'ᐯ', w: 'ᗯ', x: '᙭', y: 'Ƴ', z: 'Ꮓ',
        ' ': ' ', '.': '⊙', ',': '⸴', '?': '⁇', '!': '⁈', "'": "'"
      },
      name: 'Xenithian'
    },
    nebular: {
      map: {
        a: '𐐃', b: '𐐒', c: '𐐝', d: '𐐔', e: '𐐇', f: '𐐙', g: '𐐘', h: '𐐐', i: '𐐆', j: '𐐖', k: '𐐗', l: '𐐢', m: '𐐣',
        n: '𐐥', o: '𐐄', p: '𐐑', q: '𐐚', r: '𐐡', s: '𐐝', t: '𐐓', u: '𐐅', v: '𐐚', w: '𐐎', x: '𐐧', y: '𐐏', z: '𐐞',
        ' ': ' ', '.': '◦', ',': '⸴', '?': '⁇', '!': '⁈', "'": "'"
      },
      name: 'Nebular Common'
    },
    quantum: {
      map: {
        a: '∀', b: 'ℬ', c: 'ℂ', d: '∂', e: '∃', f: 'Ƒ', g: 'ℊ', h: 'ℋ', i: 'ℑ', j: 'ⅉ', k: '₭', l: 'ℒ', m: 'ℳ',
        n: 'ℕ', o: '⊕', p: 'ℙ', q: 'ℚ', r: 'ℝ', s: '∫', t: '⊤', u: '∪', v: '∨', w: '⋈', x: '⊗', y: '⑂', z: 'ℤ',
        ' ': ' ', '.': '⨀', ',': '⸴', '?': '⁇', '!': '⁈', "'": "'"
      },
      name: 'Quantum Speak'
    }
  };

  function translateToAlien(text, lang) {
    const alphabet = alienAlphabets[lang];
    if (!alphabet) return text;
    return text.split('').map(c => {
      const lower = c.toLowerCase();
      return alphabet.map[lower] || c;
    }).join('');
  }

  function translateToHuman(text, lang) {
    const alphabet = alienAlphabets[lang];
    if (!alphabet) return text;
    const reverseMap = {};
    Object.entries(alphabet.map).forEach(([k, v]) => {
      reverseMap[v] = k;
    });
    return text.split('').map(c => reverseMap[c] || c).join('');
  }

  function typewriterEffect(text, element, speed = 25) {
    element.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  translateBtn.addEventListener('click', () => {
    const inputText = input.value.trim();
    if (!inputText) return;

    const lang = alienLang.value;
    const hasAlienChars = /[^\x00-\x7F]/.test(inputText);

    let result;
    if (hasAlienChars) {
      result = translateToHuman(inputText, lang);
    } else {
      result = translateToAlien(inputText, lang);
    }

    typewriterEffect(result, output);
  });

  phraseChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const phrase = chip.getAttribute('data-phrase');
      input.value = phrase;
      const lang = alienLang.value;
      const result = translateToAlien(phrase, lang);
      typewriterEffect(result, output);
    });
  });

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const text = input.value.trim();
      if (!text) { output.textContent = ''; return; }
      const lang = alienLang.value;
      const hasAlienChars = /[^\x00-\x7F]/.test(text);
      const result = hasAlienChars ? translateToHuman(text, lang) : translateToAlien(text, lang);
      output.textContent = result;
    }, 300);
  });
})();


// ---- Cultural Guide Modal ----
(function initCultureModal() {
  const modal = document.getElementById('culture-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const cultureCards = document.querySelectorAll('.culture-card');

  const cultureData = {
    greetings: {
      title: 'Greetings & Physical Contact',
      body: `<p>Humans have a bewildering array of greeting rituals:</p>
      <p><strong>Handshake:</strong> Clasp right hands and move up and down 2-3 times. Firm grip = confidence. Limp grip = suspicious.</p>
      <p><strong>Hugging:</strong> Wrapping arms around each other. Reserved for close relationships. Do NOT hug strangers.</p>
      <p><strong>Waving:</strong> Move your hand side to side from a distance. This is the safest option for newcomers.</p>
      <p><strong>Bowing:</strong> Common in East Asia. Tilt your upper body forward. Depth = level of respect.</p>
      <div class="tip-box"><h4>Pro Tip</h4><p>When in doubt, just wave and say "Hello!" with a smile. Humans respond well to smiling (showing teeth is friendly, not aggressive).</p></div>`
    },
    food: {
      title: 'Human Food & Cuisine',
      body: `<p>Humans have developed over 10,000 distinct cuisines. They eat 3 main meals per day:</p>
      <p><strong>Breakfast</strong> (morning): Usually cereals, eggs, bread, fruits</p>
      <p><strong>Lunch</strong> (midday): Sandwiches, salads, soups, rice dishes</p>
      <p><strong>Dinner</strong> (evening): The largest meal. Often social and elaborate.</p>
      <p>Humans also consume "snacks" between meals and a stimulant liquid called "coffee" that they are strangely dependent on.</p>
      <div class="tip-box"><h4>Pro Tip</h4><p>If offered food, accept it. Refusing food can be seen as rude. If unsure what to eat, "pizza" is accepted universally by humans.</p></div>`
    },
    emotions: {
      title: 'Emotions & Expression',
      body: `<p>Humans experience a complex spectrum of internal states called "emotions":</p>
      <p><strong>Happiness:</strong> Corners of mouth curve upward ("smile"). Good sign.</p>
      <p><strong>Sadness:</strong> Liquid leaks from eyes ("crying"). Offer comfort or tissue.</p>
      <p><strong>Anger:</strong> Face turns red, voice volume increases. Maintain safe distance.</p>
      <p><strong>Fear:</strong> Eyes widen, skin pales, body trembles. Reassure them.</p>
      <p><strong>Love:</strong> Pupils dilate, voice softens. The most powerful human emotion. Approach with caution.</p>
      <div class="tip-box"><h4>Pro Tip</h4><p>Humans value "empathy" — the ability to understand others' emotions. Practice recognizing facial expressions to build trust.</p></div>`
    },
    social: {
      title: 'Social Structures',
      body: `<p>Human social organization is hierarchical and complex:</p>
      <p><strong>Family:</strong> The core unit—typically 2 parents and their offspring. They live together and share resources.</p>
      <p><strong>Friends:</strong> Chosen affiliates. Humans spend leisure time with friends and share personal information.</p>
      <p><strong>Personal Space:</strong> An invisible boundary (~0.5-1.5m) around each human. Do NOT enter uninvited.</p>
      <p><strong>Governments:</strong> Hierarchical leadership structures. Each nation has different rules and systems.</p>
      <div class="tip-box"><h4>Pro Tip</h4><p>Humans are tribal. They form groups based on geography, interests, beliefs, and even sports teams. Finding common ground helps build connections.</p></div>`
    },
    celebrations: {
      title: 'Celebrations & Rituals',
      body: `<p>Humans celebrate with impressive dedication:</p>
      <p><strong>Birthdays:</strong> Annual celebration of one's birth. They ignite small fires on processed sugar (cake) and extinguish them with breath. Then everyone applauds.</p>
      <p><strong>New Year:</strong> When their calendar resets. Involves explosions in the sky ("fireworks"), loud counting backwards, and optimistic promises they won't keep.</p>
      <p><strong>Weddings:</strong> Two humans declare permanent partnership in an elaborate ceremony. Very emotional. Dress formally.</p>
      <div class="tip-box"><h4>Pro Tip</h4><p>If invited to a celebration, bring a "gift" — a wrapped object. The act of wrapping is apparently important. Ask locals for appropriate gift suggestions.</p></div>`
    },
    time: {
      title: 'Time & Human Schedules',
      body: `<p>Earth rotates every 24 hours, which humans divide into:</p>
      <p><strong>Hours:</strong> 24 per rotation. Divided into 60 "minutes" each.</p>
      <p><strong>Morning</strong> (6:00-12:00): Wake, eat, begin work</p>
      <p><strong>Afternoon</strong> (12:00-18:00): Continue work, eat midday meal</p>
      <p><strong>Evening</strong> (18:00-22:00): Social time, eat dinner, leisure activities</p>
      <p><strong>Night</strong> (22:00-6:00): Sleep period. Most humans are inactive.</p>
      <p>Humans are obsessed with "punctuality." Arriving after the agreed time ("being late") can damage relationships.</p>
      <div class="tip-box"><h4>Pro Tip</h4><p>Set your chronometer to the local "time zone." Earth has 24 of them because they couldn't agree on a single standard. Typical humans.</p></div>`
    }
  };

  cultureCards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-culture');
      const data = cultureData[key];
      if (!data) return;
      modalContent.innerHTML = `<h3>${data.title}</h3>${data.body}`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();


// ---- Survival Accordion ----
function toggleSurvival(header) {
  const item = header.closest('.survival-item');
  if (item.classList.contains('active')) {
    item.classList.remove('active');
  } else {
    item.classList.add('active');
  }
}


// ---- Signal Home ----
function activateSignal() {
  const btn = document.getElementById('signal-btn');
  const anim = document.getElementById('signal-anim');
  const status = document.getElementById('signal-status');

  btn.disabled = true;
  btn.textContent = 'Transmitting...';
  anim.classList.add('active');

  const messages = [
    'Establishing subspace connection...',
    'Routing through Alpha Centauri relay...',
    'Encrypting data burst (quantum AES-4096)...',
    'Signal locked — transmitting coordinates...',
    'Transmission complete. ETA response: 4.2 light-years ✓'
  ];

  let i = 0;
  function nextMessage() {
    if (i < messages.length) {
      status.textContent = messages[i];
      i++;
      setTimeout(nextMessage, 2000);
    } else {
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Activate Beacon ↗';
        anim.classList.remove('active');
      }, 3000);
    }
  }

  nextMessage();
}


// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
