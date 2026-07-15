// Swipe-deck testimonial card stack interactions
(function () {
  const container = document.getElementById('swipe-container');
  if (!container) return;
  let cards = Array.from(container.querySelectorAll('[data-card]'));
  let activeCard = cards.find(c => c.getAttribute('data-card') === '0');

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let startY = 0;
  let currentY = 0;
  let cardWidth = activeCard.offsetWidth;

  function initCard(card) {
    card.addEventListener('mousedown', handleStart);
    card.addEventListener('touchstart', handleStart, { passive: false });
  }

  initCard(activeCard);

  function handleStart(e) {
    if (e.target.closest('button') || e.target.closest('a')) return;

    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

    activeCard.style.transition = 'none';
    activeCard.style.cursor = 'grabbing';

    activeCard.style.transform = `scale(1.03) translateY(-5px)`;
    activeCard.classList.add('shadow-2xl');
    activeCard.style.zIndex = '50';

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
  }

  function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

    currentX = clientX - startX;
    currentY = clientY - startY;

    const rotate = currentX * 0.08;
    activeCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg) scale(1.03)`;

    const progress = Math.min(Math.abs(currentX) / (cardWidth / 2.5), 1);
    updateBackgroundCards(progress);
  }

  function handleEnd() {
    if (!isDragging) return;
    isDragging = false;

    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);

    const threshold = cardWidth * 0.35;

    if (Math.abs(currentX) > threshold) {
      const direction = currentX > 0 ? 1 : -1;
      const endX = (window.innerWidth / 2 + cardWidth) * direction;
      const endY = currentY + (currentY / Math.abs(currentX || 1)) * 100;
      activeCard.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      activeCard.style.transform = `translate(${endX}px, ${endY}px) rotate(${direction * 45}deg)`;

      setTimeout(() => { resetStack(); }, 400);
    } else {
      activeCard.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      activeCard.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
      activeCard.style.cursor = 'grab';
      activeCard.style.zIndex = '30';
      activeCard.classList.remove('shadow-2xl');
      updateBackgroundCards(0);
    }

    currentX = 0;
    currentY = 0;
  }

  function updateBackgroundCards(progress) {
    const nextCard = cards.find(c => c.getAttribute('data-card') === '1');
    const lastCard = cards.find(c => c.getAttribute('data-card') === '2');

    if (nextCard) {
      const scale = 0.95 + (0.05 * progress);
      const y = 16 - (16 * progress);
      const opacity = 0.7 + (0.3 * progress);
      nextCard.style.transform = `scale(${scale}) translateY(${y}px)`;
      nextCard.style.opacity = opacity;
    }

    if (lastCard) {
      const scale = 0.9 + (0.05 * progress);
      const y = 32 - (16 * progress);
      const opacity = 0.4 + (0.3 * progress);
      lastCard.style.transform = `scale(${scale}) translateY(${y}px)`;
      lastCard.style.opacity = opacity;
    }
  }

  function resetStack() {
    activeCard.style.transition = 'none';
    activeCard.style.opacity = '0';
    activeCard.style.transform = 'translate(0, 40px) scale(0.9)';

    const c0 = cards.find(c => c.getAttribute('data-card') === '0');
    const c1 = cards.find(c => c.getAttribute('data-card') === '1');
    const c2 = cards.find(c => c.getAttribute('data-card') === '2');

    c0.setAttribute('data-card', '2');
    c1.setAttribute('data-card', '0');
    c2.setAttribute('data-card', '1');

    updateCardStyles(c1, 'top');
    updateCardStyles(c2, 'middle');
    updateCardStyles(c0, 'bottom');

    c0.removeEventListener('mousedown', handleStart);
    c0.removeEventListener('touchstart', handleStart);

    activeCard = c1;
    initCard(activeCard);

    setTimeout(() => {
      c0.style.transition = 'all 0.5s ease-out';
      c0.style.opacity = '0.4';
    }, 50);
  }

  function updateCardStyles(card, role) {
    card.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    if (role === 'top') {
      card.style.zIndex = '30';
      card.style.transform = 'scale(1) translateY(0)';
      card.style.opacity = '1';
      card.style.cursor = 'grab';
      card.classList.remove('pointer-events-none');
    } else if (role === 'middle') {
      card.style.zIndex = '20';
      card.style.transform = 'scale(0.95) translateY(16px)';
      card.style.opacity = '0.7';
      card.classList.add('pointer-events-none');
    } else if (role === 'bottom') {
      card.style.zIndex = '10';
      card.style.transform = 'scale(0.9) translateY(32px)';
      card.style.opacity = '0.4';
      card.classList.add('pointer-events-none');
    }
  }
})();
