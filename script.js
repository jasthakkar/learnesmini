(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const backTop = document.querySelector('.back-top');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('.section-anchor')];

  const handleScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 24);
    backTop.classList.toggle('visible', y > 700);

    let current = 'home';
    sections.forEach(section => {
      if (y >= section.offsetTop - 180) current = section.id;
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  menuButton.addEventListener('click', () => {
    const open = header.classList.toggle('menu-active');
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    header.classList.remove('menu-active');
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }));

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.target);
      const duration = 1500;
      const start = performance.now();
      const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(target * eased).toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(counter);
    });
  }, { threshold: .65 });
  document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));

  const track = document.querySelector('.testimonial-track');
  const slides = [...document.querySelectorAll('.testimonial-slide')];
  const indicator = document.querySelector('.slider-controls span i');
  let index = 0;
  let timer;

  const showSlide = nextIndex => {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    indicator.style.transform = `translateX(${index * 100}%)`;
  };

  const startSlider = () => {
    clearInterval(timer);
    timer = setInterval(() => showSlide(index + 1), 6000);
  };

  document.querySelector('.slider-prev').addEventListener('click', () => { showSlide(index - 1); startSlider(); });
  document.querySelector('.slider-next').addEventListener('click', () => { showSlide(index + 1); startSlider(); });
  document.querySelector('.testimonial-shell').addEventListener('mouseenter', () => clearInterval(timer));
  document.querySelector('.testimonial-shell').addEventListener('mouseleave', startSlider);
  startSlider();
})();
