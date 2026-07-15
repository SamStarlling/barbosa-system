(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progressBar = document.getElementById('scroll-progress');
  const reveals = document.querySelectorAll('[data-reveal]');
  const parallaxItems = document.querySelectorAll('.js-parallax');
  const magneticCards = document.querySelectorAll('[data-magnetic]');
  const sections = document.querySelectorAll('section');
  const supportsIO = 'IntersectionObserver' in window;

  if (reveals.length) {
    sections.forEach((section) => {
      let index = 0;
      section.querySelectorAll('[data-reveal]').forEach((node) => {
        node.style.setProperty('--reveal-delay', (index * 90) + 'ms');
        index += 1;
      });
    });

    if (supportsIO) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      );
      reveals.forEach((node) => observer.observe(node));
    } else {
      reveals.forEach((node) => node.classList.add('in-view'));
    }
  }

  if (!reduceMotion) {
    let ticking = false;
    const updateScrollFx = () => {
      const y = window.scrollY || 0;
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      const p = doc > 0 ? Math.min(1, Math.max(0, y / doc)) : 0;
      if (progressBar) progressBar.style.transform = 'scaleX(' + p.toFixed(4) + ')';

      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallaxSpeed || 0);
        const offset = y * speed;
        item.style.transform = 'translate3d(0,' + offset.toFixed(2) + 'px,0)';
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollFx);
        ticking = true;
      }
    };

    updateScrollFx();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    const finePointer = window.matchMedia('(pointer:fine)').matches;
    if (finePointer) {
      magneticCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
          const my = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
          card.style.setProperty('--mx', mx.toFixed(2) + 'px');
          card.style.setProperty('--my', my.toFixed(2) + 'px');
        });
        card.addEventListener('mouseleave', () => {
          card.style.setProperty('--mx', '0px');
          card.style.setProperty('--my', '0px');
        });
      });
    }
  } else if (progressBar) {
    progressBar.style.display = 'none';
  }
})();
