/* Main Application Setup & Floating Hearts Canvas */
document.addEventListener('DOMContentLoaded', () => {
  // Launch Confetti on Page Load
  setTimeout(() => {
    if (window.confettiEngine) {
      window.confettiEngine.spawn(140);
    }
  }, 400);

  // Celebrate Button Trigger
  const celebrateBtn = document.getElementById('celebrate-btn');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      if (window.confettiEngine) window.confettiEngine.spawn(180);
      if (window.fireworksEngine) window.fireworksEngine.triggerMultiple(7);
      if (window.birthdayAudio && !window.birthdayAudio.isPlaying) {
        window.birthdayAudio.play();
      }
    });
  }

  // Floating Hearts Canvas Particle Background
  const heartsCanvas = document.getElementById('canvas-hearts');
  if (heartsCanvas) {
    const ctx = heartsCanvas.getContext('2d');
    let hearts = [];

    function resizeHearts() {
      heartsCanvas.width = window.innerWidth;
      heartsCanvas.height = window.innerHeight;
    }
    resizeHearts();
    window.addEventListener('resize', resizeHearts);

    function createHeart() {
      return {
        x: Math.random() * heartsCanvas.width,
        y: heartsCanvas.height + 20,
        size: Math.random() * 14 + 10,
        vy: Math.random() * 1.5 + 0.8,
        vx: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.6 + 0.3,
        color: `hsl(${Math.random() * 30 + 330}, 100%, 75%)`
      };
    }

    for (let i = 0; i < 25; i++) {
      const h = createHeart();
      h.y = Math.random() * heartsCanvas.height;
      hearts.push(h);
    }

    function drawHeartShape(ctx, x, y, size) {
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
      ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.closePath();
      ctx.fill();
    }

    function animateHearts() {
      ctx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);

      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i];
        h.y -= h.vy;
        h.x += h.vx;

        if (h.y < -30) {
          hearts[i] = createHeart();
        }

        ctx.save();
        ctx.globalAlpha = h.opacity;
        ctx.fillStyle = h.color;
        drawHeartShape(ctx, h.x, h.y, h.size);
        ctx.restore();
      }

      requestAnimationFrame(animateHearts);
    }

    animateHearts();

    // Click anywhere to spawn floating heart
    window.addEventListener('click', (e) => {
      // Don't spawn if clicking button
      if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'INPUT') return;
      const h = createHeart();
      h.x = e.clientX;
      h.y = e.clientY;
      hearts.push(h);
      if (hearts.length > 40) hearts.shift();
    });
  }
});
