  // THEME SWITCHER LOGIC
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // SVG Icons for different states
  const icons = {
      light: '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>', // Sun
      dark: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>', // Moon
      system: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>' // Monitor
  };

  // Get saved theme or default to system
  let currentThemeSetting = localStorage.getItem('theme') || 'system';

  function applyTheme(setting) {
      if (setting === 'dark' || (setting === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.body.classList.add('dark-theme');
      } else {
          document.body.classList.remove('dark-theme');
      }
      themeIcon.innerHTML = icons[setting];
  }

  // Cycle through themes on click (System -> Light -> Dark -> System)
  themeBtn.addEventListener('click', () => {
      if (currentThemeSetting === 'system') currentThemeSetting = 'light';
      else if (currentThemeSetting === 'light') currentThemeSetting = 'dark';
      else currentThemeSetting = 'system';
      
      localStorage.setItem('theme', currentThemeSetting);
      applyTheme(currentThemeSetting);
  });

  // Listen for OS system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (currentThemeSetting === 'system') applyTheme('system');
  });


  // Project Filtering
  function filterProj(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const cards = document.querySelectorAll('.proj-card');
    cards.forEach(card => {
      card.style.animation = 'none';
      card.offsetHeight; /* trigger reflow */
      
      if (cat === 'all' || card.dataset.cat === cat) {
        card.style.display = 'block';
        card.style.animation = 'fadeInScale 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Number Counter Animation
  function animateNumbers() {
      const nums = document.querySelectorAll('.stat-num:not(.animated)');
      nums.forEach(num => {
          num.classList.add('animated'); 
          const target = parseInt(num.getAttribute('data-val'));
          const isPlus = num.innerHTML.includes('+');
          const duration = 2000;
          const step = target / (duration / 16); 
          let current = 0;
          
          const update = () => {
              current += step;
              if (current < target) {
                  num.innerText = Math.ceil(current) + (isPlus ? '+' : '');
                  requestAnimationFrame(update);
              } else {
                  num.innerText = target + (isPlus ? '+' : '');
              }
          };
          update();
      });
  }

  // Scroll Reveal Animation 
  function initScrollReveal() {
      const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('active');
                  obs.unobserve(entry.target); 
              }
          });
      }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observer.observe(el));
      
      const statsObserver = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
              animateNumbers();
              statsObserver.disconnect();
          }
      }, { threshold: 0.5 });
      
      const statsSection = document.querySelector('.hero-stats');
      if (statsSection) statsObserver.observe(statsSection);
  }

  // Custom Cursor Glow
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
  });
  
  function animateCursor() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
  }
  
  const interactives = document.querySelectorAll('a, button, .card, .proj-card, .exp-item, .skill-card');
  interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
          cursorGlow.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 50%)';
          cursorGlow.style.width = '200px';
          cursorGlow.style.height = '200px';
      });
      el.addEventListener('mouseleave', () => {
          cursorGlow.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 60%)';
          cursorGlow.style.width = '400px';
          cursorGlow.style.height = '400px';
      });
  });

  // Active Navigation Link Update on Scroll
  function updateNavOnScroll() {
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.nav-links a');
      
      let current = '';
      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          if (scrollY >= sectionTop - 150) {
              current = section.getAttribute('id');
          }
      });

      navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').includes(current)) {
              link.classList.add('active');
          }
      });
  }
  
  window.addEventListener('scroll', updateNavOnScroll);

  // ───────────────────────────────────────────────
  // LIGHTBOX — supports unlimited images per project
  // To add more images to a project: just add the
  // filename to that project's array below. The
  // gallery cards in the HTML show the first 4 (with
  // a "+N" badge on the 4th if there are more) and
  // clicking ANY image opens the full list here.
  // ───────────────────────────────────────────────
  const galleryImages = {
    nexora: ['uploads/Nexora Screenshot Images/Screenshot 2026-06-27 235648.png', 'uploads/Nexora Screenshot Images/Screenshot 2026-06-28 000435.png', 'uploads/Nexora Screenshot Images/Screenshot 2026-06-28 001030.png', 'uploads/Nexora Screenshot Images/Screenshot 2026-06-28 001606.png',
             'uploads/Nexora Screenshot Images/Screenshot 2026-06-28 001948.png', 'uploads/Nexora Screenshot Images/Screenshot 2026-06-28 002449.png', 'uploads/Nexora Screenshot Images/Screenshot 2026-06-28 003054.png', 'uploads/Nexora Screenshot Images/Screenshot 2026-06-28 003415.png'],
    ser: ['uploads/SER Screenshot Images/Screenshot 2026-06-27 204738.png', 'uploads/SER Screenshot Images/Screenshot 2026-06-27 204831.png'],
    'ecommerce-figma': ['uploads/E-commerce UI Screenshot Images/Screenshot 2026-06-28 005542.png', 'uploads/E-commerce UI Screenshot Images/Screenshot 2026-06-28 005936.png', 'uploads/E-commerce UI Screenshot Images/Screenshot 2026-06-28 010846.png', 'uploads/E-commerce UI Screenshot Images/Screenshot 2026-06-28 011159.png',
                        'uploads/E-commerce UI Screenshot Images/Screenshot 2026-06-28 011450.png', 'uploads/E-commerce UI Screenshot Images/Screenshot 2026-06-28 011704.png', 'uploads/E-commerce UI Screenshot Images/Screenshot 2026-06-28 011903.png', 'uploads/E-commerce UI Screenshot Images/Screenshot 2026-06-28 012105.png', 'uploads/E-commerce UI Screenshot Images/Screenshot 2026-06-28 012317.png'],
    chatmind: ['uploads/ChatMind Screenshot Images/Screenshot 2026-06-28 012613.png', 'uploads/ChatMind Screenshot Images/Screenshot 2026-06-28 013055.png', 'uploads/ChatMind Screenshot Images/Screenshot 2026-06-28 013326.png', 'uploads/ChatMind Screenshot Images/Screenshot 2026-06-28 013547.png',
               'uploads/ChatMind Screenshot Images/Screenshot 2026-06-28 013819.png']
  };

  let currentGallery = null;
  let currentIndex = 0;

  function openLightbox(galleryKey, index) {
    currentGallery = galleryKey;
    currentIndex = index;
    renderLightbox();
    document.getElementById('lightboxOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    document.getElementById('lightboxOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  function navLightbox(dir) {
    const imgs = galleryImages[currentGallery] || [];
    if (imgs.length === 0) return;
    currentIndex = (currentIndex + dir + imgs.length) % imgs.length;
    renderLightbox();
  }

  function renderLightbox() {
    const imgs = galleryImages[currentGallery] || [];
    if (imgs.length === 0) return;
    const imgEl = document.getElementById('lightboxImg');
    imgEl.src = imgs[currentIndex];
    imgEl.onerror = () => { imgEl.alt = 'Image not uploaded yet: ' + imgs[currentIndex]; };
    document.getElementById('lightboxCounter').textContent = (currentIndex + 1) + ' / ' + imgs.length;
  }

  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightboxOverlay').classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  // Auto-update "+N" badge on 4th thumbnail based on actual image count
  function updateMoreBadges() {
    Object.keys(galleryImages).forEach(key => {
      const total = galleryImages[key].length;
      const galleryEl = document.querySelector('[data-gallery="' + key + '"]');
      if (!galleryEl) return;
      const shots = galleryEl.querySelectorAll('.proj-shot');
      const extra = total - shots.length;
      if (extra > 0) {
        const lastShot = shots[shots.length - 1];
        lastShot.classList.add('proj-shot-more');
        let overlay = lastShot.querySelector('.proj-shot-more-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'proj-shot-more-overlay';
          lastShot.appendChild(overlay);
        }
        overlay.textContent = '+' + extra;
      }
    });
  }

  // Initialize all features on load
  window.addEventListener('DOMContentLoaded', () => {
      applyTheme(currentThemeSetting); // Apply theme immediately
      initScrollReveal();
      animateCursor();
      updateNavOnScroll();
      updateMoreBadges();
  });
