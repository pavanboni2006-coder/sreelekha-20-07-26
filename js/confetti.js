/* Confetti Particle Engine */
class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.colors = ['#ff7597', '#ffd700', '#9370db', '#ffb6c1', '#00e5ff', '#ff8c00', '#ffffff'];
    this.isActive = false;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn(count = 120) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * -this.canvas.height,
        size: Math.random() * 8 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        opacity: 1
      });
    }

    if (!this.isActive) {
      this.isActive = true;
      this.animate();
    }
  }

  animate() {
    if (!this.isActive) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;

      if (p.y > this.canvas.height + 20) {
        p.opacity -= 0.05;
        if (p.opacity <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

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

window.confettiEngine = new ConfettiEngine('canvas-confetti');
