/* Celebration Fireworks Canvas Engine */
class FireworksEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.isActive = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  launchBurst(x, y) {
    const particleCount = 80;
    const colors = ['#ff7597', '#ffd700', '#00ffcc', '#ff00aa', '#9370db', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 / particleCount) * i + (Math.random() - 0.5);
      const speed = Math.random() * 7 + 2;
      this.particles.push({
        x: x || this.canvas.width / 2,
        y: y || this.canvas.height / 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
        decay: Math.random() * 0.015 + 0.015
      });
    }

    if (!this.isActive) {
      this.isActive = true;
      this.animate();
    }
  }

  triggerMultiple(bursts = 5) {
    for (let b = 0; b < bursts; b++) {
      setTimeout(() => {
        const rx = Math.random() * (this.canvas.width * 0.7) + (this.canvas.width * 0.15);
        const ry = Math.random() * (this.canvas.height * 0.5) + (this.canvas.height * 0.1);
        this.launchBurst(rx, ry);
      }, b * 300);
    }
  }

  animate() {
    if (!this.isActive) return;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.isActive = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

window.fireworksEngine = new FireworksEngine('canvas-fireworks');
