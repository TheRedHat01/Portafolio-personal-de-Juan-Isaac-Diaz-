/* ============================================================
   ISAAC DÍAZ — PORTFOLIO
   script.js
   Índice:
   1. Loader inicial
   2. Cursor personalizado
   3. Navbar (scroll state + menú móvil)
   4. Scroll indicator (barra de progreso)
   5. Reveal on scroll (IntersectionObserver)
   6. Parallax ligero de los glow orbs
   7. Rotación de roles en el Hero
   8. Botón volver arriba
   9. Smooth scroll para anclas
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. LOADER INICIAL ---------- */
  const loader = document.getElementById('loader');

  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add('is-hidden');
    document.body.classList.remove('no-scroll');
  };

  document.body.classList.add('no-scroll');
  // Da tiempo a que se aprecie la animación del loader antes de revelar la página
  window.addEventListener('load', () => {
    setTimeout(hideLoader, 900);
  });
  // Fallback por si el evento load tarda demasiado (conexiones lentas)
  setTimeout(hideLoader, 3500);


  /* ---------- 2. CURSOR PERSONALIZADO ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsFinePointer && cursorDot && cursorRing) {
    document.body.classList.add('cursor-ready');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Suaviza el movimiento del anillo con interpolación (lerp)
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    const hoverTargets = document.querySelectorAll('[data-cursor-hover]');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
    });
  }


  /* ---------- 3. NAVBAR ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const updateNavbarState = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };
  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });

  const closeMenu = () => {
    navToggle.classList.remove('is-active');
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('no-scroll', isOpen);
    });

    navMenu.querySelectorAll('.navbar__link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }


  /* ---------- 4. SCROLL INDICATOR ---------- */
  const scrollIndicator = document.getElementById('scrollIndicator');

  const updateScrollIndicator = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollIndicator.style.width = `${progress}%`;
  };
  updateScrollIndicator();
  window.addEventListener('scroll', updateScrollIndicator, { passive: true });


  /* ---------- 5. REVEAL ON SCROLL ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Pequeño escalonado para tarjetas dentro del mismo contenedor
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));

  // Revela también las tarjetas de habilidades/proyectos con pequeño delay escalonado
  const staggerGroups = [
    document.querySelectorAll('.skill-card'),
    document.querySelectorAll('.project-card'),
  ];
  staggerGroups.forEach((group) => {
    group.forEach((card, index) => {
      card.setAttribute('data-reveal', '');
      card.style.transitionDelay = `${index * 0.08}s`;
      revealObserver.observe(card);
    });
  });


  /* ---------- 6. PARALLAX LIGERO DE GLOW ORBS ---------- */
  const orb1 = document.getElementById('orb1');
  const orb2 = document.getElementById('orb2');

  if (supportsFinePointer && orb1 && orb2) {
    window.addEventListener('mousemove', (e) => {
      const xRatio = (e.clientX / window.innerWidth) - 0.5;
      const yRatio = (e.clientY / window.innerHeight) - 0.5;

      orb1.style.transform = `translate(${xRatio * 40}px, ${yRatio * 40}px)`;
      orb2.style.transform = `translate(${xRatio * -30}px, ${yRatio * -30}px)`;
    }, { passive: true });
  }


  /* ---------- 7. ROTACIÓN DE ROLES EN EL HERO ---------- */
  const roles = document.querySelectorAll('.hero__role');
  if (roles.length > 1) {
    let currentRole = 0;
    setInterval(() => {
      roles[currentRole].classList.remove('hero__role--active');
      currentRole = (currentRole + 1) % roles.length;
      roles[currentRole].classList.add('hero__role--active');
    }, 2800);
  }


  /* ---------- 8. BOTÓN VOLVER ARRIBA ---------- */
  const backToTop = document.getElementById('backToTop');

  const updateBackToTop = () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------- 9. SMOOTH SCROLL PARA ANCLAS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });

});
